import { useEffect, useMemo, useRef, useState } from "react";
import { asset } from "../asset";

/**
 * Homepage demo rendered in SeekBrain's own CLI style (Pi dark theme + SeekBrain TUI header),
 * with a workspace panel showing what each run produced. Sessions come from scripts/build_cli_demos.py.
 */

type ToolEvent = {
  t: number | null;
  kind: "tool";
  tool: string;
  call: string;
  lines?: string[];
  detail?: string;
  error?: boolean;
  done?: number | null;
  produces?: string[];
  /** Number of following "progress" events streamed while this call runs (execution_run). */
  until?: number;
};
type TextEvent = { t: number | null; kind: "think" | "say"; text: string };
/** Live task-progress line shown under a running execution card, as the TUI does. */
type ProgressEvent = { t: number | null; kind: "progress"; task: string; text: string; produces?: string[] };
/** `calls`: cumulative tool calls (main agent + sub-agents) once this event has played. */
type CliEvent = (ToolEvent | TextEvent | ProgressEvent) & { calls?: number };

type Panel = { id: string; src: string; name: string };
type Caption = { title: string; items: [string, string][] };

type WorkspaceFile = {
  id: string;
  name: string;
  kind: "figure" | "markdown" | "report" | "board";
  src?: string;
  html?: string;
  pdf?: string;
  panels?: Panel[];
  caption?: Caption;
  groups?: { task: string; ids: string[] }[];
};

type Session = {
  id: string;
  model: string;
  query: string;
  usage: { input: number; output: number; cost: number };
  study_cost?: number;
  duration: number;
  events: CliEvent[];
  files: WorkspaceFile[];
  result?: { summary: string; conclusions: string[] };
  primary: string;
};

type DemoDef = {
  id: string;
  label: string;
  title: string;
  blurb: string;
  workspace: string;
  credit: React.ReactNode;
  pending?: boolean;
};

const DEMOS: DemoDef[] = [
  {
    id: "study",
    label: "01 · Single analysis task",
    title: "Spatial response mapping of motor and light/dark responses in zebrafish larvae",
    blurb: "Research mode: a scientific plan, formulated tasks, validated execution and a written report.",
    workspace: "Study",
    credit: (
      <>
        Data from Légaré et al., <em>Science Advances</em> 2025 (
        <a href="https://doi.org/10.1126/sciadv.adv7576" target="_blank" rel="noreferrer">
          doi
        </a>
        , CC BY-NC 4.0). SeekBrain 0.1.4, Research mode.
      </>
    ),
  },
  {
    id: "long",
    label: "02 · Long-horizon research",
    title: "A low-rank shared axis of brain-wide decoding strength during mouse decision-making",
    blurb: "Multiple analysis tasks, ten figure panels and a final report from the IBL brain-wide mouse decision-making dataset.",
    workspace: "Study",
    credit: (
      <>
        Regional decoder maps from the International Brain Laboratory (IBL) brain-wide dataset (<em>Nature</em> 2025,{" "}
        <a href="https://doi.org/10.1038/s41586-025-09235-0" target="_blank" rel="noreferrer">
          doi
        </a>
        , CC BY 4.0). Condensed replay of a SeekBrain 0.1.4 study: timings follow the recorded session, panels A–J come from the completed run.
      </>
    ),
  },
];

const SPEEDS = [1, 2, 4];

// Replay pacing (ms at 1×): a base per event kind plus a log-compressed share of the real gap,
// so longer studies replay longer while hours still fit in about a minute.
function stepDelay(events: CliEvent[], i: number) {
  const ev = events[i];
  if (!ev) return 600;
  const base = ev.kind === "tool" ? ((ev as ToolEvent).tool.startsWith("seekbrain_") ? 1300 : 700) : ev.kind === "progress" ? 1100 : ev.kind === "say" ? 1000 : 600;
  return base + 450 * Math.log10(1 + Math.max(0, gapBefore(events, i)));
}

export default function CliDemo() {
  const [demoId, setDemoId] = useState(DEMOS[0].id);
  const demo = DEMOS.find((d) => d.id === demoId)!;
  const [session, setSession] = useState<Session | null>(null);
  const [shown, setShown] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(2);
  const [started, setStarted] = useState(false);
  const [openFile, setOpenFile] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const root = useRef<HTMLDivElement>(null);
  const log = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let live = true;
    setSession(null);
    setShown(0);
    setOpenFile(null);
    setExpanded(new Set());
    if (demo.pending) return;
    fetch(asset(`/cli-demos/${demoId}/session.json`))
      .then((r) => r.json())
      .then((s: Session) => live && setSession(s));
    return () => {
      live = false;
    };
  }, [demoId, demo.pending]);

  // Auto-play the first time the demo scrolls into view.
  useEffect(() => {
    const el = root.current;
    if (!el || started) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setStarted(true);
        setPlaying(true);
      }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [started]);

  const total = session?.events.length ?? 0;
  const done = total > 0 && shown >= total;

  useEffect(() => {
    if (!session || !playing || done) return;
    const id = window.setTimeout(() => setShown((n) => n + 1), stepDelay(session.events, shown) / speed);
    return () => window.clearTimeout(id);
  }, [session, playing, shown, speed, done]);

  useEffect(() => {
    const el = log.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [shown]);

  const visible = useMemo(() => session?.events.slice(0, shown) ?? [], [session, shown]);

  // Files appear in the workspace once the event that produced them has been replayed.
  const available = useMemo(() => {
    if (!session) return [];
    if (done) return session.files;
    const ids = producedIds(visible, done);
    // A figure board appears with its first panel.
    return session.files.filter((f) => ids.has(f.id) || (f.kind === "board" && f.panels?.some((p) => ids.has(p.id))));
  }, [session, visible, done]);
  const produced = useMemo(() => producedIds(visible, done), [visible, done]);

  // Follow the newest file while playing; open the primary deliverable at the end.
  useEffect(() => {
    if (!session) return;
    if (done) setOpenFile(session.primary);
    else if (available.length) setOpenFile(available[available.length - 1].id);
  }, [available.length, done, session]);

  const elapsed = visible.length ? visible[visible.length - 1].t ?? 0 : 0;
  const usage = useMemo(() => {
    if (!session) return null;
    const frac = total ? shown / total : 0;
    return {
      input: Math.round(session.usage.input * frac),
      output: Math.round(session.usage.output * frac),
      cost: (session.study_cost ?? session.usage.cost) * frac,
    };
  }, [session, shown, total]);

  const pick = (id: string) => {
    if (id === demoId) return;
    setDemoId(id);
    setStarted(true);
    setPlaying(true);
  };

  return (
    <div className="cli-demo" ref={root}>
      <div className="replay-picker" role="tablist" aria-label="Choose a demo">
        {DEMOS.map((d) => (
          <button key={d.id} type="button" role="tab" aria-selected={d.id === demoId} className={d.id === demoId ? "is-active" : ""} onClick={() => pick(d.id)}>
            <span className="replay-pick-org">{d.label}</span>
            <strong>{d.title}</strong>
            <span className="replay-pick-hook">{d.blurb}</span>
          </button>
        ))}
      </div>

      <div className="cli-window">
        <div className="cli-pane">
          <div className="cli-scroll" ref={log}>
            <CliHeader />
            {demo.pending ? (
              <div className="cli-pending">This study is still running. The replay will be added when it finishes.</div>
            ) : (
              session && (
                <>
                  <div className="cli-user">{session.query}</div>
                  {visible.map((ev, i) => (
                    <CliLine
                      key={i}
                      ev={ev}
                      running={!done && isRunning(session.events, i, visible.length)}
                      gap={gapBefore(session.events, i)}
                      expanded={expanded.has(i)}
                      onToggle={() =>
                        setExpanded((s) => {
                          const n = new Set(s);
                          n.has(i) ? n.delete(i) : n.add(i);
                          return n;
                        })
                      }
                    />
                  ))}
                  {!done && playing && <div className="cli-working">⠋ Working…</div>}
                </>
              )
            )}
          </div>
          <div className="cli-editor" aria-hidden="true">
            <span className="cli-caret" />
          </div>
          <div className="cli-footer">
            <span className="c-accent"> Research </span>
            <span className="c-dim">| {session?.model ?? "claude-opus-4-7"}  </span>
            <span className="c-success">{fmtTokens(usage?.input ?? 0)} in</span>
            <span className="c-dim"> / </span>
            <span className="c-accent">{fmtTokens(usage?.output ?? 0)} out</span>
            <span className="c-dim">  |  </span>
            <span className="c-warning">${(usage?.cost ?? 0).toFixed(4)}</span>
            <span className="c-dim">  |  {fmtClock(elapsed)}</span>
          </div>
        </div>

        <Workspace demo={demo} session={session} files={available} produced={produced} openFile={openFile} setOpenFile={setOpenFile} done={done} calls={visible[visible.length - 1]?.calls ?? 0} />
      </div>

      <div className="cli-controls">
        <button type="button" disabled={!session} onClick={() => (done ? (setShown(0), setPlaying(true)) : setPlaying((p) => !p))}>
          {done ? "↺ Replay" : playing ? "❚❚ Pause" : "▶ Play"}
        </button>
        <input
          type="range"
          min={0}
          max={total}
          value={shown}
          disabled={!session}
          onChange={(e) => {
            setShown(Number(e.target.value));
            setPlaying(false);
          }}
          aria-label="Seek through the session"
        />
        <div className="replay-speed" role="group" aria-label="Playback speed">
          {SPEEDS.map((s) => (
            <button key={s} type="button" className={s === speed ? "is-active" : ""} onClick={() => setSpeed(s)}>
              {s}×
            </button>
          ))}
        </div>
        <button type="button" disabled={!session} onClick={() => (setShown(total), setPlaying(false))}>
          Skip to result
        </button>
      </div>
      <p className="replay-credit">
        Recorded SeekBrain session, replayed with idle time compressed{session ? ` (real duration ${fmtClock(session.duration)})` : ""}. {demo.credit}{" "}
        Local paths are shortened.
      </p>
    </div>
  );
}

function CliHeader() {
  return (
    <div className="cli-header">
      <div className="cli-header-title">
        <b className="c-accent">Seek</b>
        <b>Brain</b>
        <span className="c-dim"> v0.1.4</span>
      </div>
      <div className="cli-header-top">
        <pre className="cli-logo">
          <span className="c-accent">█▀▀ █▀▀ █▀▀ █▄▀</span>  <span>█▄▄ █▀█ ▄▀█ █ █▄ █</span>
          {"\n"}
          <span className="c-accent">▄▄█ ██▄ ██▄ █ █</span>  <span>█▄█ █▀▄ █▀█ █ █ ▀█</span>
        </pre>
        <div className="cli-status">
          <span className="c-success">● READY</span>
          <b>SCIENTIFIC RESEARCH AGENT</b>
        </div>
      </div>
      <div className="cli-header-body">
        <div>Ask a research question. Add data when it helps. SeekBrain handles the workflow.</div>
        <div className="c-muted">
          Ask<span className="c-accent">  ·  </span>Plan<span className="c-accent">  ·  </span>Research<span className="c-accent">  ·  </span>Deep
          Research
        </div>
        <div>
          <b>Type below to begin</b>
          <span className="c-dim">  ·  </span>
          <span className="c-warning">ctrl+o</span>
          <span className="c-dim"> guide  ·  </span>
          <span className="c-warning">/seekbrain-setup</span>
          <span className="c-dim"> models</span>
        </div>
      </div>
    </div>
  );
}

function CliLine({ ev, gap, running, expanded, onToggle }: { ev: CliEvent; gap: number; running: boolean; expanded: boolean; onToggle: () => void }) {
  if (ev.kind === "progress") {
    return (
      <div className="cli-progress">
        {gap >= 60 && <span className="cli-progress-gap">+{fmtDuration(gap)}</span>}
        <span className="c-accent">{ev.task}</span> · {ev.text}
      </div>
    );
  }
  const marker = gap >= 60 ? <div className="cli-gap">··· {fmtDuration(gap)} later</div> : null;
  if (ev.kind === "think") {
    return (
      <>
        {marker}
        <div className="cli-think">{ev.text}</div>
      </>
    );
  }
  if (ev.kind === "say") {
    return (
      <>
        {marker}
        <div className="cli-say">{renderInline(ev.text)}</div>
      </>
    );
  }
  return <ToolCard ev={ev as ToolEvent} marker={marker} running={running} expanded={expanded} onToggle={onToggle} />;
}

function ToolCard({ ev, marker, running, expanded, onToggle }: { ev: ToolEvent; marker: React.ReactNode; running: boolean; expanded: boolean; onToggle: () => void }) {
  // The newest card is shown as still running while playback waits on it.
  const status = running ? "is-pending" : ev.error ? "is-error" : ev.lines ? "is-success" : "is-pending";
  const took = ev.done != null && ev.t != null ? ev.done - ev.t : 0;
  const isSeekBrain = ev.tool.startsWith("seekbrain_");
  const [name, ...rest] = ev.call.split(" ");
  return (
    <>
      {marker}
      <button type="button" className={`cli-tool ${status}`} onClick={onToggle} aria-expanded={expanded}>
        <div className="cli-tool-call">
          {ev.tool === "bash" ? <b>{ev.call}</b> : (
            <>
              <b>{name}</b> <span className="c-muted">{rest.join(" ")}</span>
            </>
          )}
        </div>
        {running ? null : expanded && ev.detail ? (
          <pre className="cli-tool-out">{ev.detail}</pre>
        ) : (
          ev.lines && (
            <pre className={`cli-tool-out${isSeekBrain ? " is-summary" : ""}`}>{ev.lines.join("\n")}</pre>
          )
        )}
        {!running && took >= 30 && <div className="cli-took">took {fmtDuration(took)}</div>}
      </button>
    </>
  );
}

function Workspace({
  demo,
  session,
  files,
  produced,
  openFile,
  setOpenFile,
  done,
  calls,
}: {
  demo: DemoDef;
  session: Session | null;
  files: WorkspaceFile[];
  produced: Set<string>;
  openFile: string | null;
  setOpenFile: (id: string) => void;
  done: boolean;
  calls: number;
}) {
  const file = files.find((f) => f.id === openFile) ?? null;
  const figures = files.filter((f) => f.kind === "figure");

  return (
    <aside className="ws">
      <div className="ws-head">
        <span>{demo.workspace}</span>
        {session && (
          <span className="ws-count">{calls} tool calls</span>
        )}
      </div>

      {files.length > 0 && (
        <div className="ws-files" role="tablist" aria-label="Study files">
          {files.map((f) => (
            <button key={f.id} type="button" role="tab" aria-selected={f.id === openFile} className={f.id === openFile ? "is-active" : ""} onClick={() => setOpenFile(f.id)}>
              <span className={`ws-icon is-${f.kind}`} aria-hidden="true" />
              {f.name.split("/").pop()}
            </button>
          ))}
        </div>
      )}

      <div className="ws-body">
        {demo.pending ? (
          <div className="ws-empty">
            <div className="ws-grid-ph">
              {Array.from({ length: 10 }, (_, i) => (
                <span key={i} />
              ))}
            </div>
            Figures and the final report will appear here.
          </div>
        ) : !session ? (
          <div className="ws-empty">Loading…</div>
        ) : !file ? (
          <Waiting text="Generating the scientific plan…" />
        ) : file.kind === "board" ? (
          <FigureBoard session={session} file={file} produced={produced} done={done} />
        ) : file.kind === "figure" ? (
          <div className="ws-figure">
            <img src={asset(`/cli-demos/${session.id}/${file.src}`)} alt={file.name} />
            <span>{file.name}</span>
            {figures.length > 1 && (
              <div className="ws-thumbs">
                {figures.map((f) => (
                  <button key={f.id} type="button" className={f.id === file.id ? "is-active" : ""} onClick={() => setOpenFile(f.id)}>
                    <img src={asset(`/cli-demos/${session.id}/${f.src}`)} alt={f.name} />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <article className={`ws-doc${file.kind === "report" ? " is-report" : ""}`}>
            {file.kind === "report" && file.pdf && (
              <a className="ws-pdf" href={asset(`/cli-demos/${session.id}/${file.pdf}`)} target="_blank" rel="noreferrer">
                report.pdf ↗
              </a>
            )}
            <div dangerouslySetInnerHTML={{ __html: rewriteAssets(file.html ?? "", session.id) }} />
          </article>
        )}
      </div>
    </aside>
  );
}

/**
 * Panels A–J laid out as the paper figure: statistics row (A–E) above the atlas row (F–J).
 * Panels light up in the order the run produced them; the paper caption sits underneath.
 */
/** Panel ids a caption label covers: "f" -> ["F"], "h–j" -> ["H", "I", "J"]. */
function panelsOf(label: string): string[] {
  const [a, b = a] = label.toUpperCase().split(/[–-]/);
  const ids: string[] = [];
  for (let c = a.charCodeAt(0); c <= b.charCodeAt(0); c++) ids.push(String.fromCharCode(c));
  return ids;
}

function FigureBoard({ session, file, produced, done }: { session: Session; file: WorkspaceFile; produced: Set<string>; done: boolean }) {
  const [zoom, setZoom] = useState<Panel | null>(null);
  const panels = file.panels ?? [];
  const rows = (file.groups ?? []).map((g) => ({ ...g, panels: panels.filter((p) => g.ids.includes(p.id)) }));
  const ready = (p: Panel) => done || produced.has(p.id);
  return (
    <div className="ws-board">
      {rows.map((row) => (
        <div key={row.task} className="ws-board-row">
          <header>
            <span className="c-task">{row.task}</span>
            <span>
              {row.panels.filter(ready).length}/{row.panels.length}
            </span>
          </header>
          <div className={`ws-board-grid${row.task.includes("atlas") ? " is-atlas" : ""}`}>
            {row.panels.map((p) => (
              <button key={p.id} type="button" className={`ws-panel${ready(p) ? " is-ready" : ""}`} disabled={!ready(p)} onClick={() => setZoom(p)} aria-label={`Panel ${p.id}`}>
                <span className="ws-panel-label">{p.id.toLowerCase()}</span>
                {ready(p) ? <img src={asset(`/cli-demos/${session.id}/${p.src}`)} alt={p.name} loading="lazy" /> : <span className="ws-panel-ph" />}
              </button>
            ))}
          </div>
        </div>
      ))}
      {file.caption && (
        <figcaption className="ws-caption">
          <strong>{file.caption.title}.</strong>{" "}
          {/* Each caption item appears with its panels ("h–j" waits for all three). */}
          {file.caption.items
            .filter(([k]) => panelsOf(k).every((id) => panels.some((p) => p.id === id && ready(p))))
            .map(([k, v]) => (
              <span key={k}>
                <b>{k},</b> {v}{" "}
              </span>
            ))}
        </figcaption>
      )}
      {zoom && (
        <div className="ws-zoom" role="dialog" aria-label={`Panel ${zoom.id}`} onClick={() => setZoom(null)}>
          <img src={asset(`/cli-demos/${session.id}/${zoom.src}`)} alt={zoom.name} />
          <span>Panel {zoom.id.toLowerCase()} · click to close</span>
        </div>
      )}
    </div>
  );
}

function producedIds(events: CliEvent[], done: boolean) {
  // A running tool's outputs only count once the next event is shown; progress events count immediately.
  const ids = new Set<string>();
  events.forEach((e, i) => {
    const out = (e as ToolEvent | ProgressEvent).produces;
    if (!out) return;
    if (e.kind === "progress" || done || i < events.length - 1) out.forEach((id) => ids.add(id));
  });
  return ids;
}

/** The newest event is running; an execution card also stays running while its progress lines stream. */
function isRunning(events: CliEvent[], i: number, shown: number) {
  if (i === shown - 1) return events[i].kind !== "progress";
  const ev = events[i];
  return ev.kind === "tool" && !!(ev as ToolEvent).until && shown - 1 <= i + (ev as ToolEvent).until!;
}

function Waiting({ text }: { text: string }) {
  return (
    <div className="ws-empty">
      <span className="replay-spinner" aria-hidden="true" />
      {text}
    </div>
  );
}

function renderInline(text: string) {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) =>
    part.startsWith("**") ? (
      <b key={i}>{part.slice(2, -2)}</b>
    ) : part.startsWith("`") ? (
      <span key={i} className="c-accent">
        {part.slice(1, -1)}
      </span>
    ) : (
      part
    ),
  );
}

function rewriteAssets(html: string, id: string) {
  return html.replace(/src='([^']+)'/g, (_, src) => `src='${asset(`/cli-demos/${id}/${src}`)}' loading='lazy'`);
}

function gapBefore(events: CliEvent[], i: number) {
  if (i === 0) return 0;
  const prev = events[i - 1];
  // Progress lines stream inside a running call, so measure from the call's start, not its end.
  const prevEnd = prev.kind === "tool" && !(prev as ToolEvent).until ? (prev as ToolEvent).done ?? prev.t : prev.t;
  const cur = events[i].t;
  return prevEnd != null && cur != null ? cur - prevEnd : 0;
}

function fmtTokens(v: number) {
  if (v < 1000) return String(v);
  if (v < 1_000_000) return `${(v / 1000).toFixed(1)}k`;
  return `${(v / 1_000_000).toFixed(1)}m`;
}

function fmtClock(seconds: number) {
  const s = Math.round(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return h ? `${h}:${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}` : `${m}:${String(s % 60).padStart(2, "0")}`;
}

function fmtDuration(seconds: number) {
  const s = Math.round(seconds);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m ${s % 60}s`;
}
