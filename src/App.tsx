import { useEffect, useState } from "react";

const asset = (path: string) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${base}${path}`;
};

const repertoire = [
  {
    mode: "Unimodal",
    modality: "Molecule",
    title: "Molecular profiling",
    description: "Gene-expression profiling, cell-type discovery, and developmental trajectory analysis.",
  },
  {
    mode: "Unimodal",
    modality: "Structure",
    title: "Anatomical structure",
    description: "Connectome analysis, neuron morphology, atlas registration, and anatomical quantification.",
  },
  {
    mode: "Unimodal",
    modality: "Neural dynamics",
    title: "Neural activity",
    description: "Activity profiling, population dynamics, functional connectivity, and network analysis.",
  },
  {
    mode: "Unimodal",
    modality: "Behavior",
    title: "Behavioral computation",
    description: "Behavioral motif discovery, latent-state inference, and strategy modeling.",
  },
  {
    mode: "Multimodal",
    modality: "Molecule × Structure",
    title: "Molecular–anatomical mapping",
    description: "Cell localization in atlases, molecular-to-atlas mapping, and cross-modal interpretation.",
  },
  {
    mode: "Multimodal",
    modality: "Structure × Function",
    title: "Structure–function coupling",
    description: "SC–FC association tests, network-based comparisons, and gradient alignment.",
  },
  {
    mode: "Multimodal",
    modality: "Stimulus × Dynamics",
    title: "Sensorimotor coupling",
    description: "Sensory classification, stimulus decoding, and sensorimotor activity coupling.",
  },
  {
    mode: "Multimodal",
    modality: "Dynamics × Behavior",
    title: "Neural–behavioral decoding",
    description: "Head-direction coupling, continuous behavior decoding, and decision-variable decoding.",
  },
] as const;

const framework = [
  {
    title: "Research planning",
    points: ["Survey candidate methods", "Orchestrate analytical paths", "Review scientific soundness"],
  },
  {
    title: "Analysis execution",
    points: ["Formulate concrete methods", "Write and run analysis code", "Validate intermediate results"],
  },
  {
    title: "Analysis repertoire",
    points: ["Literature-aligned recipes", "Code-backed procedures", "Reuse across organisms"],
  },
  {
    title: "Co-evolving loop",
    points: ["Researcher steers intent", "Experts validate evidence", "Recipes improve over time"],
  },
] as const;

const citation = `@article{seekbrain2026,
  title   = {SeekBrain: An Autonomous Multi-Agent Framework
             for Accelerating Neuroscience Discovery},
  year    = {2026},
  note    = {Manuscript}
}`;

const cases = [
  {
    id: "zebrafish",
    label: "Researcher-led",
    title: "From tail kinematics to a shared neural manifold",
    body: "SeekBrain connected free-moving behavior, whole-brain calcium activity, and anatomy. It clustered 1,546 swimming bouts, compressed 64k+ neural ROIs into region-aware supervoxels, and uncovered a cross-animal latent geometry of behavior.",
    facts: [
      ["94.9%", "3NN decoding accuracy"],
      ["3,000", "supervoxels per larva"],
      ["81", "anatomical regions tested"],
    ],
    image: "/figure-zebrafish.webp",
    imageAlt: "Paper figure showing structured neural representations of zebrafish behavior",
    figureNote: "Structured neural representations of zebrafish behavior.",
  },
  {
    id: "mouse",
    label: "Agent-led",
    title: "A shared decoding-strength axis across the brain",
    body: "On the IBL decision-making dataset, SeekBrain proposed a region-level hypothesis, tested it across five decoder maps, and separated shared movement-linked geometry from task-specific residual anatomy.",
    facts: [
      ["63.2%", "variance explained by PC1"],
      ["201", "brain regions analyzed"],
      ["0.96", "rank/value PC1 correlation"],
    ],
    image: "/figure-mouse.webp",
    imageAlt: "Paper figure showing brain-wide decoder maps in a mouse decision-making task",
    figureNote: "Brain-wide decoder maps in a mouse decision-making task.",
  },
] as const;

export default function App() {
  const [copied, setCopied] = useState(false);
  const [activeCase, setActiveCase] = useState<(typeof cases)[number]["id"]>("zebrafish");
  const [showTop, setShowTop] = useState(false);

  const activeStudy = cases.find((item) => item.id === activeCase) ?? cases[0];
  const activeIndex = cases.findIndex((item) => item.id === activeCase);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const copyCitation = async () => {
    await navigator.clipboard.writeText(citation);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <>
      <div className="shell">
        <header className="hero">
          <p className="eyebrow">Neuroscience · Multi-agent systems</p>
          <h1>SeekBrain</h1>
          <p className="subtitle">
            An Autonomous Multi-Agent Framework for Accelerating Neuroscience Discovery
          </p>
          <p className="affiliation">Shanghai Artificial Intelligence Laboratory</p>
          <div className="links">
            <a className="link-btn" href={asset("/paper.pdf")} target="_blank" rel="noreferrer">
              <DocIcon />
              Paper
            </a>
            <a
              className="link-btn ghost"
              href="https://github.com/AI4NeuroLab/SeekBrain"
              target="_blank"
              rel="noreferrer"
            >
              <CodeIcon />
              Code
            </a>
          </div>
        </header>

        <figure className="figure-block">
          <a className="figure-link" href={asset("/figure-architecture.png")} target="_blank" rel="noreferrer">
            <img src={asset("/figure-architecture.png")} alt="SeekBrain architecture and workflow" />
          </a>
          <figcaption>
            <strong>Figure 1.</strong> SeekBrain turns fragmented neuroscience methods into reusable
            analysis recipes, then combines hierarchical research planning with validated code
            execution to navigate multimodal data—from molecules and structure to neural dynamics
            and behavior.
          </figcaption>
        </figure>

        <section>
          <h2>Abstract</h2>
          <p>
            General-purpose agents can write code, but neuroscience demands something harder:
            knowing which analysis is valid, how modalities align, and what the result means
            biologically. SeekBrain is a domain-specialized multi-agent framework that anchors every
            step in executable expertise. A crystallization process aligns literature with
            open-source code into standardized analysis recipes; two collaborating engines then plan
            research and execute analyses under validation. On BrainArena, SeekBrain achieves a mean
            score of 75.5 across 32 expert-annotated tasks (+11.4 over the strongest baseline) and
            supports both researcher-led and agent-led discovery on multimodal datasets.
          </p>
        </section>

        <section>
          <h2>Framework</h2>
          <p>
            SeekBrain couples a growing neuroscience analysis repertoire with planning and execution
            engines, then folds validated traces back into reusable methodology.
          </p>
          <div className="module-grid">
            {framework.map((item, index) => (
              <article className="module-card" key={item.title}>
                <span className="module-index">{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <ul>
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2>Analysis Repertoire</h2>
          <p>
            A crystallization agent aligns papers with open-source code and distills them into
            standardized, adaptable recipes. Representative unimodal and multimodal families are
            summarized below.
          </p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Mode</th>
                  <th>Modality</th>
                  <th>Recipe</th>
                  <th>Scope</th>
                </tr>
              </thead>
              <tbody>
                {repertoire.map((item) => (
                  <tr key={item.modality}>
                    <td>{item.mode}</td>
                    <td>{item.modality}</td>
                    <td>{item.title}</td>
                    <td>{item.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2>BrainArena</h2>
          <p>
            BrainArena evaluates complete neuroscience analyses—not only whether code runs, but
            whether the method, result, and biological interpretation are correct. Scoring emphasizes
            figure fidelity, method correctness, and interpretive validity across 32 expert-annotated
            tasks.
          </p>
          <div className="score-board">
            {[
              ["SeekBrain", "75.5"],
              ["Claude Code", "64.1"],
              ["Codex", "58.1"],
            ].map(([name, score]) => (
              <div className="score-item" key={name}>
                <span>{name}</span>
                <strong>{score}</strong>
              </div>
            ))}
          </div>
          <figure className="figure-block">
            <a className="figure-link" href={asset("/figure-brainarena.png")} target="_blank" rel="noreferrer">
              <img src={asset("/figure-brainarena.png")} alt="BrainArena evaluation figure" />
            </a>
            <figcaption>
              <strong>Figure 2.</strong> BrainArena task composition, score distributions, domain
              performance, and rubric breakdown.
            </figcaption>
          </figure>
        </section>

        <section>
          <h2>Case Studies</h2>
          <p>
            SeekBrain can follow a researcher’s progressive logic chain or lead a supervised
            hypothesis–analysis loop on an existing dataset.
          </p>
          <div className="case-tabs" role="tablist" aria-label="Case studies">
            {cases.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                className={activeCase === item.id ? "is-active" : undefined}
                aria-selected={activeCase === item.id}
                onClick={() => setActiveCase(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <article className="case-panel" key={activeStudy.id}>
            <h3>
              {activeIndex + 1}. {activeStudy.title}
            </h3>
            <p className="case-label">{activeStudy.label}</p>
            <p>{activeStudy.body}</p>
            <ul className="facts">
              {activeStudy.facts.map(([value, label]) => (
                <li key={label}>
                  <strong>{value}</strong> {label}
                </li>
              ))}
            </ul>
            <figure className="figure-block">
              <a className="figure-link" href={asset(activeStudy.image)} target="_blank" rel="noreferrer">
                <img src={asset(activeStudy.image)} alt={activeStudy.imageAlt} />
              </a>
              <figcaption>
                <strong>Figure {activeIndex + 3}.</strong> {activeStudy.figureNote}
              </figcaption>
            </figure>
          </article>
        </section>

        <section>
          <h2>BibTeX</h2>
          <div className="bibtex">
            <pre>{citation}</pre>
            <button type="button" onClick={copyCitation}>
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </section>

        <footer>
          <p>© 2026 Shanghai Artificial Intelligence Laboratory</p>
        </footer>
      </div>

      <button
        type="button"
        className={`scroll-top${showTop ? " is-visible" : ""}`}
        aria-label="Scroll to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        ↑
      </button>
    </>
  );
}

function DocIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path
        fill="currentColor"
        d="M4 1.5A1.5 1.5 0 0 0 2.5 3v10A1.5 1.5 0 0 0 4 14.5h8a1.5 1.5 0 0 0 1.5-1.5V5.207L10.793 1.5H4zm6.5.707L12.793 5H10.5a1 1 0 0 1-1-1V2.207zM5 7.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 5 7.75zm.75 2.25a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5z"
      />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path
        fill="currentColor"
        d="M4.78 3.22a.75.75 0 0 1 0 1.06L2.56 6.5l2.22 2.22a.75.75 0 0 1-1.06 1.06l-2.75-2.75a.75.75 0 0 1 0-1.06l2.75-2.75a.75.75 0 0 1 1.06 0zm6.44 0a.75.75 0 0 1 1.06 0l2.75 2.75a.75.75 0 0 1 0 1.06l-2.75 2.75a.75.75 0 1 1-1.06-1.06L13.44 6.5l-2.22-2.22a.75.75 0 0 1 0-1.06z"
      />
    </svg>
  );
}
