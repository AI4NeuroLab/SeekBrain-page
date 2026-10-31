import { useEffect, useRef, useState } from "react";
import { INSTALL_PS1, INSTALL_SH, RELEASES_URL } from "../content/release";

type Platform = "unix" | "windows" | "npm";

const commands: Record<Platform, { label: string; note: string; lines: string[] }> = {
  unix: {
    label: "macOS / Linux",
    note: "",
    lines: [`curl -fsSL ${INSTALL_SH} | bash`],
  },
  windows: {
    label: "Windows",
    note: "",
    lines: [`irm ${INSTALL_PS1} | iex`],
  },
  npm: {
    label: "npm",
    note: "Requires Node.js 22.19 or later.",
    lines: ["npm install -g seekbrain"],
  },
};

/** Real prompts from `seekbrain setup` (src/cli/setup.mjs) and `seekbrain web`. */
const session: { kind: "cmd" | "ask" | "ok" | "out" | "gap"; text: string; answer?: string }[] = [
  { kind: "cmd", text: "seekbrain setup" },
  { kind: "out", text: "SeekBrain setup" },
  { kind: "ask", text: "Choose a model provider", answer: "Anthropic" },
  { kind: "ask", text: "Anthropic API", answer: "Official API" },
  { kind: "ask", text: "Anthropic API key", answer: "••••••••••••" },
  { kind: "ask", text: "Choose the core model", answer: "claude-opus-5-5" },
  { kind: "ask", text: "Choose a literature provider", answer: "PubMed/PMC" },
  { kind: "ok", text: "SeekBrain setup complete." },
  { kind: "out", text: "  Research Survey: enabled · Recipe Crystallization: enabled" },
  { kind: "gap", text: "" },
  { kind: "cmd", text: "seekbrain web --cwd ~/my-study" },
  { kind: "ok", text: "SeekBrain Web: http://127.0.0.1:30141/?cwd=~/my-study" },
];

export default function QuickStart() {
  const [platform, setPlatform] = useState<Platform>("unix");
  const [copied, setCopied] = useState(false);
  const cmd = commands[platform];

  const copy = async () => {
    await navigator.clipboard.writeText(cmd.lines.join("\n"));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="quick">
      <ol className="quick-steps">
        <li>
          <span className="quick-num">1</span>
          <div>
            <h3>Install</h3>
            <div className="quick-os" role="tablist" aria-label="Platform">
              {(Object.keys(commands) as Platform[]).map((p) => (
                <button key={p} type="button" role="tab" aria-selected={p === platform} className={p === platform ? "is-active" : ""} onClick={() => setPlatform(p)}>
                  {commands[p].label}
                </button>
              ))}
            </div>
            <div className="quick-cmd">
              <code>{cmd.lines.join("\n")}</code>
              <button type="button" onClick={copy} aria-label="Copy install command">
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <p>
              {cmd.note && `${cmd.note} `}Offline bundles and checksums are on the <a href={RELEASES_URL} target="_blank" rel="noreferrer">releases page</a>.
            </p>
          </div>
        </li>
        <li>
          <span className="quick-num">2</span>
          <div>
            <h3>Connect a model</h3>
            <p>
              Run <code>seekbrain setup</code> to choose a model provider and a literature source.
            </p>
          </div>
        </li>
        <li>
          <span className="quick-num">3</span>
          <div>
            <h3>Point it at your data</h3>
            <p>
              Start <code>seekbrain web</code> (or <code>seekbrain</code> in the terminal) in your dataset folder and ask a research question.
            </p>
          </div>
        </li>
      </ol>

      <SetupTerminal />
    </div>
  );
}

function SetupTerminal() {
  const [shown, setShown] = useState(0);
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setActive(true), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    const delay = shown >= session.length ? 4200 : session[shown]?.kind === "cmd" ? 1100 : 520;
    const id = window.setTimeout(() => setShown((n) => (n >= session.length ? 0 : n + 1)), delay);
    return () => window.clearTimeout(id);
  }, [active, shown]);

  return (
    <div className="term" ref={ref} aria-label="Example setup session">
      <div className="term-bar">
        <span className="replay-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span>~ — seekbrain</span>
      </div>
      <pre className="term-body">
        {session.slice(0, shown).map((line, i) => (
          <span key={i} className={`term-line is-${line.kind}`}>
            {line.kind === "cmd" && <b>$ </b>}
            {line.kind === "ask" && <b>? </b>}
            {line.kind === "ok" && <b>✓ </b>}
            {line.text}
            {line.answer && <em> › {line.answer}</em>}
            {"\n"}
          </span>
        ))}
        <span className="term-caret" aria-hidden="true" />
      </pre>
    </div>
  );
}
