import { useEffect, useState } from "react";
import { asset } from "../asset";

/**
 * Static SeekBrain WebUI mock in the WebUI's light theme (layout from jpg/智算脑webUI*.png):
 * project tree + file explorer on the left, the selected session's full transcript on the right.
 * Built by scripts/build_webui_sessions.py into public/webui-sessions/.
 */

type SubCall = { tool: string; label: string; output: string };
type Step = { tool: string; label: string; t: number; dur: number; status: "ok" | "error"; summary: string; calls: SubCall[] };
type Session = {
  id: string;
  title: string;
  direction: string;
  steps: Step[];
  note: string;
  plan_html: string;
  validation: { pass: boolean; confidence: number; caveats: string[] };
  summary: string;
  figure: string;
  tool_calls: number;
  usage: { input: number; output: number; cacheWrite: number; cost: number; seconds: number };
  clock: [string, string];
  files: string[];
};
type Index = {
  project: string;
  model: string;
  caption: { title: string; items: [string, string][] };
  sessions: Session[];
};

const BASE = "/webui-sessions";
const OTHER_PROJECTS = ["seekbrain-014", "BrainAtlas", "ibl-shared-axis"];

/** Lucide-style outline icons used by the WebUI chrome. */
const ICONS = {
  plus: "M12 5v14M5 12h14",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-4.3-4.3",
  sidebar: "M4 4h16v16H4zM9 4v16",
  panel: "M4 4h16v16H4zM15 4v16",
  history: "M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l3 2",
  wand: "M15 4V2M15 10V8M11 6h2M17 6h2M3 21l12-12M14 7l3 3",
  file: "M14 3H6v18h12V7zM14 3v4h4M9 13h6M9 17h6",
  wrench: "M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z",
  chevron: "M9 6l6 6-6 6",
  folder: "M3 6h6l2 2h10v11H3z",
  terminal: "M4 17l6-5-6-5M12 19h8",
  upload: "M12 16V4M7 9l5-5 5 5M4 20h16",
  refresh: "M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  commit: "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM3 12h6M15 12h6",
  cpu: "M7 7h10v10H7zM10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4",
  layers: "M12 3l9 5-9 5-9-5zM3 13l9 5 9-5",
  sliders: "M4 7h10M18 7h2M4 17h4M12 17h8M14 5v4M8 15v4",
  image: "M4 4h16v16H4zM4 16l5-5 4 4 3-3 4 4M9 8.5a1 1 0 1 0 0 .01",
  bulb: "M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z",
  compress: "M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7",
  speaker: "M11 5L6 9H3v6h3l5 4zM16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12",
  arrow: "M5 12h14M13 6l6 6-6 6",
  down: "M6 9l6 6 6-6",
};

function Icon({ name, size = 14 }: { name: keyof typeof ICONS; size?: number }) {
  return (
    <svg className="wu-icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

function duration(sec: number) {
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  return m < 60 ? `${m}m ${sec % 60}s` : `${Math.floor(m / 60)}h ${m % 60}m`;
}

const num = (n: number) => n.toLocaleString("en-US");

function Chevron({ open }: { open: boolean }) {
  return (
    <span className={`wu-chev${open ? " is-open" : ""}`}>
      <Icon name="down" size={11} />
    </span>
  );
}

function ToolCard({ step, plan }: { step: Step; plan: string }) {
  const [open, setOpen] = useState(false);
  const [openCall, setOpenCall] = useState<number | null>(null);
  const hasBody = step.calls.length > 0 || step.tool === "seekbrain_formulation_generate";
  return (
    <div className={`wu-tool${step.status === "error" ? " is-error" : ""}`}>
      <button type="button" className="wu-tool-head" onClick={() => hasBody && setOpen(!open)} disabled={!hasBody} aria-expanded={open}>
        <span className="wu-tool-name">{step.tool}</span>
        <span className="wu-tool-preview">
          {step.label} · {step.summary}
        </span>
        {step.calls.length > 0 && <span className="wu-tool-meta">{step.calls.length === 1 ? "1 call" : `${step.calls.length} calls`}</span>}
        <span className="wu-tool-meta">{duration(step.dur)}</span>
        {hasBody && <Chevron open={open} />}
      </button>
      {open && step.tool === "seekbrain_formulation_generate" && <div className="wu-plan ws-doc" dangerouslySetInnerHTML={{ __html: plan }} />}
      {open && step.calls.length > 0 && (
        <ol className="wu-subcalls">
          {step.calls.map((c, i) => (
            <li key={i}>
              <button type="button" onClick={() => setOpenCall(openCall === i ? null : i)} aria-expanded={openCall === i} disabled={!c.output}>
                <span className="wu-sub-tool">{c.tool}</span>
                <span className="wu-sub-label">{c.label}</span>
                {c.output && <Chevron open={openCall === i} />}
              </button>
              {openCall === i && <pre>{c.output}</pre>}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function Transcript({ s, model }: { s: Session; model: string }) {
  const [full, setFull] = useState(false);
  const lines = s.direction.split("\n");
  const u = s.usage;
  return (
    <div className="wu-chat-inner">
      <div className="wu-user-row">
        <div className="wu-user">
          <pre>{full ? s.direction : lines.slice(0, 5).join("\n")}</pre>
          {lines.length > 5 && (
            <button type="button" className="wu-more" onClick={() => setFull(!full)}>
              {full ? "Show less" : `Show all ${lines.length} lines`}
            </button>
          )}
        </div>
        <time>{s.clock[0]}</time>
      </div>

      <div className="wu-model">{model}</div>
      <div className="wu-tools">
        {s.steps.map((st, i) => (
          <ToolCard key={i} step={st} plan={s.plan_html} />
        ))}
      </div>
      <div className="wu-answer">
        <p>{s.note}</p>
        <figure className="wu-figure">
          <img src={asset(`${BASE}/${s.id}/${s.figure}`)} alt={`Panel ${s.id} produced by SeekBrain`} loading="lazy" />
        </figure>
        <p>{s.summary}</p>
        <ul>
          <li>
            Validation <code>{s.validation.pass ? "pass" : "fail"}</code>, confidence {s.validation.confidence}
          </li>
          {s.validation.caveats.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>
      <div className="wu-usage">
        <span>
          {num(u.input)} in · {num(u.output)} out · {num(u.cacheWrite)} cache W · ${u.cost.toFixed(4)} · took {duration(u.seconds)} · {s.tool_calls} tool calls
        </span>
        <time>{s.clock[1]}</time>
      </div>
    </div>
  );
}

export default function WebUIShowcase() {
  const [index, setIndex] = useState<Index | null>(null);
  const [active, setActive] = useState("A1");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch(asset(`${BASE}/sessions.json`))
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(setIndex)
      .catch(() => setFailed(true));
  }, []);

  if (failed) return <p className="wu-error">The WebUI sessions could not be loaded.</p>;
  const session = index?.sessions.find((s) => s.id === active);

  return (
    <div className="wu">
      <div className="wu-window" aria-label="SeekBrain WebUI">
        <div className="wu-top">
          <span className="wu-cell wu-brand">SeekBrain</span>
          <span className="wu-cell">
            <Icon name="plus" /> New
          </span>
          <span className="wu-cell">
            <Icon name="search" />
          </span>
          <span className="wu-cell">
            <Icon name="sidebar" />
          </span>
          <span className="wu-cell">
            <Icon name="history" /> Full history
          </span>
          <span className="wu-cell is-dim">
            <Icon name="wand" /> Generate title
          </span>
          <span className="wu-cell">
            <Icon name="file" /> System
          </span>
          <span className="wu-cell">
            <Icon name="wrench" /> Tools
          </span>
          <span className="wu-cell wu-cell-end">
            <Icon name="panel" />
          </span>
        </div>

        <aside className="wu-side">
          <div className="wu-tree">
            <div className="wu-proj is-open">
              <Icon name="chevron" size={12} /> {index?.project ?? "project"}
            </div>
            <nav className="wu-sessions" aria-label="Sessions">
              {index?.sessions.map((s) => (
                <button key={s.id} type="button" className={s.id === active ? "is-active" : ""} aria-current={s.id === active} onClick={() => setActive(s.id)}>
                  <span className="wu-s-title">{s.title}</span>
                  <span className="wu-s-meta">
                    {s.clock[0]} · {s.tool_calls} tool calls
                  </span>
                </button>
              ))}
            </nav>
            {OTHER_PROJECTS.map((p) => (
              <div key={p} className="wu-proj">
                <Icon name="chevron" size={12} /> {p}
              </div>
            ))}
            <div className="wu-open">
              <Icon name="folder" size={12} /> Open another project…
            </div>
          </div>

          <div className="wu-files">
            <div className="wu-files-head">
              <span className="wu-files-title">
                <Icon name="down" size={12} /> FILES
              </span>
              <span className="wu-files-tools">
                <Icon name="terminal" size={13} />
                <Icon name="folder" size={13} />
                <Icon name="upload" size={13} />
                <Icon name="refresh" size={13} />
                <Icon name="eye" size={13} />
                <Icon name="commit" size={13} />
                <Icon name="search" size={13} />
              </span>
            </div>
            <div className="wu-path">~/zebrafish-individuality/Fig.{active}</div>
            <ul className="wu-file-list">
              {session?.files.map((f) => (
                <li key={f}>
                  <Icon name="file" size={13} /> {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="wu-side-foot">
            <span>
              <Icon name="cpu" /> Models
            </span>
            <span>
              <Icon name="layers" /> Skills
            </span>
            <span>
              <Icon name="sliders" /> Settings
            </span>
          </div>
        </aside>

        <div className="wu-main">
          <div className="wu-chat" key={active}>
            {session && index ? <Transcript s={session} model={index.model} /> : <div className="wu-loading">Loading…</div>}
          </div>
          <div className="wu-input">
            <div className="wu-input-box">
              <span>Message… Type / for commands, @ for files</span>
              <span className="wu-send">
                <Icon name="arrow" /> Send
              </span>
            </div>
            <div className="wu-input-bar">
              <span>
                <Icon name="image" size={15} />
              </span>
              <span>
                <Icon name="cpu" /> {index?.model}
              </span>
              <span className="wu-bar-gap" />
              <span>
                <Icon name="bulb" /> medium
              </span>
              <span>
                <Icon name="wrench" /> configured
              </span>
              <span>
                <Icon name="compress" /> Compact
              </span>
              <span>
                <Icon name="speaker" />
              </span>
            </div>
          </div>
          <div className="wu-modes">
            <span>Ask</span>
            <span>Plan</span>
            <span className="is-active">Research</span>
            <span>Deep Research</span>
            <span>SeekBrain settings</span>
          </div>
        </div>
      </div>

      {index && (
        <figure className="wu-board">
          <div className="wu-board-grid">
            {index.sessions.map((s, i) => (
              <button key={s.id} type="button" className={s.id === active ? "is-active" : ""} onClick={() => setActive(s.id)} aria-label={`Open session for panel ${s.id}`}>
                <span className="wu-board-label">{index.caption.items[i][0]}</span>
                <img src={asset(`${BASE}/${s.id}/${s.figure}`)} alt={s.title} loading="lazy" />
              </button>
            ))}
          </div>
          <figcaption>
            <strong>{index.caption.title}.</strong>{" "}
            {index.caption.items.map(([k, v]) => (
              <span key={k}>
                <b>{k},</b> {v}{" "}
              </span>
            ))}
          </figcaption>
        </figure>
      )}
    </div>
  );
}
