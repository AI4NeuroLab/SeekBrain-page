import { useEffect, useState } from "react";

const asset = (path: string) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${base}${path}`;
};

const executionPhases = [
  {
    number: "01",
    title: "Formulate",
    body: "Turn an atomic task and its available data into a recipe-grounded methodological schema.",
  },
  {
    number: "02",
    title: "Code",
    body: "Translate the schema into Python, then explore data, tune parameters, and resolve errors in a sandbox.",
  },
  {
    number: "03",
    title: "Validate",
    body: "Review the outputs and return targeted feedback until the analysis is scientifically sound.",
  },
  {
    number: "04",
    title: "Interpret",
    body: "Synthesize validated figures and statistics while documenting limitations and uncertainty.",
  },
] as const;

/** Exact labels from the Neuroscience Analysis Repertoire figure. */
const repertoireFamilies = [
  {
    mode: "Unimodal Analysis Recipes",
    tone: "uni",
    families: [
      {
        name: "Molecule",
        recipes: ["Gene-expression profiling", "Cell-type profiling", "Developmental trajectory"],
      },
      {
        name: "Structure",
        recipes: ["Connectome analysis", "Neuron morphology", "Anatomical quantification"],
      },
      {
        name: "Neural Dynamics",
        recipes: ["Neural activity profiling", "Population dynamics", "FC & network dynamics"],
      },
      {
        name: "Behavior",
        recipes: ["Behavioral motif discovery", "Latent state inference", "Behavioral strategy modeling"],
      },
    ],
  },
  {
    mode: "Multimodal Analysis Recipes",
    tone: "multi",
    families: [
      {
        name: "Molecule-Structure Coupling",
        recipes: ["Cell localization in atlas", "Molecular-to-atlas mapping", "Cross-modal interpretation"],
      },
      {
        name: "Structure-Function Coupling",
        recipes: ["SC-FC association testing", "Network-based S-F coupling", "Gradient-based S-F comparison"],
      },
      {
        name: "Stimuli-Dynamics Coupling",
        recipes: ["Sensory classification", "Stimulus decoding", "Sensorimotor activity coupling"],
      },
      {
        name: "Dynamics-Behavior Coupling",
        recipes: ["HD dynamics-behavior coupling", "Continuous behavioral decoding", "Decision-variable decoding"],
      },
    ],
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
    label: "Zebrafish Behavior and Brain-Wide Dynamics",
    title: "Zebrafish Behavior and Brain-Wide Dynamics",
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
    label: "Mouse Decision-Making",
    title: "Mouse Decision-Making",
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
          <h1>SeekBrain (In progress)</h1>
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
            <strong>Figure 1.</strong> SeekBrain overview. (a) End-to-end workflow from multimodal
            research inputs to reports and figures. (b) Research planning engine. (c) Analysis
            execution engine.
          </figcaption>
        </figure>

        <section>
          <h2>Abstract</h2>
            <p>
              Modern neuroscience relies on integrating multi-scale, multimodal datasets to uncover
              the neural principles underlying intelligence, yet highly heterogeneous data and
              fragmented workflows increasingly constrain discovery. Here we introduce SeekBrain, an
              autonomous multi-agent framework for domain-grounded hierarchical planning and
              cross-modal analysis. SeekBrain builds a repertoire of analysis recipes from
              code–paper pairs and couples this expertise with planning and execution engines to
              generate hypotheses and pipelines on demand. On the expert-annotated BrainArena
              benchmark, SeekBrain substantially outperforms state-of-the-art agent baselines.
              In real-world use, it integrated behavioral, neural, and anatomical data to reveal
              structured neural representations of larval zebrafish behavior and a shared axis of
              regional decoding strength in a mouse decision-making task. These results establish
              SeekBrain as a scalable tool for accelerating data-driven neuroscience discovery.
            </p>
        </section>

        <section className="framework-section">
          <h2>Framework</h2>
          <p>
            SeekBrain combines a Neuroscience Analysis Repertoire with research planning and
            analysis execution engines, while keeping researchers in the loop throughout the
            workflow.
          </p>

          <div className="framework-map">
            <article className="knowledge-layer">
              <header className="knowledge-heading">
                <span className="engine-number">Knowledge foundation</span>
                <h3>Neuroscience Analysis Repertoire</h3>
              </header>
              <p>
                SeekBrain is anchored by reusable analysis recipes derived from published studies
                and refined through expert input. The repertoire provides domain-grounded
                procedures that the system can retrieve and adapt when formulating each analysis
                task.
              </p>
            </article>

            <div className="engine-grid">
              <article className="engine-card planning-engine">
                <header>
                  <span className="engine-number">Engine 01</span>
                  <h3>Research Planning Engine</h3>
                </header>
                <p>
                  A <strong>Survey Agent</strong> supplies scientific background. The
                  <strong> Orchestrator</strong> then decomposes the question, while a
                  <strong> Reviewer</strong> challenges and refines the plan until both agents
                  agree that it is concrete and feasible.
                </p>
                <ol className="plan-tree">
                  <li>
                    <span>Root</span>
                    <strong>General research query</strong>
                  </li>
                  <li>
                    <span>Branches</span>
                    <strong>Sub-questions &amp; biological hypotheses</strong>
                  </li>
                  <li>
                    <span>Leaves</span>
                    <strong>Atomic analysis tasks</strong>
                  </li>
                </ol>
                <div className="engine-checks">
                  <strong>Reviewer checks</strong>
                  <span>Relevance</span>
                  <span>Logical completeness</span>
                  <span>Data feasibility</span>
                  <span>Overlap</span>
                </div>
              </article>

              <article className="engine-card execution-engine">
                <header>
                  <span className="engine-number">Engine 02</span>
                  <h3>Analysis Execution Engine</h3>
                </header>
                <p>
                  Each terminal task enters a four-agent workflow that repeatedly generates and
                  examines empirical results before they are accepted for interpretation.
                </p>
                <ol className="execution-phases">
                  {executionPhases.map((phase) => (
                    <li key={phase.title}>
                      <span>{phase.number}</span>
                      <div>
                        <strong>{phase.title}</strong>
                        <p>{phase.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <div className="engine-checks">
                  <strong>Validation criteria</strong>
                  <span>Inquiry alignment</span>
                  <span>Methodological fidelity</span>
                  <span>Quantitative integrity</span>
                  <span>Visual quality</span>
                </div>
              </article>
            </div>

            <aside className="researcher-loop">
              <div>
                <span>Researcher-in-the-loop</span>
                <strong>Expert guidance remains available at every stage.</strong>
              </div>
              <p>
                Researchers can refine the plan, assess feasibility, and tune analytical pipelines.
                Reviewed interaction traces then update existing recipes or create new variants, so
                practical expertise becomes reusable knowledge.
              </p>
              <div className="learning-cycle" aria-label="Continuous learning cycle">
                <span>Feedback</span>
                <i aria-hidden="true">→</i>
                <span>Validated trace</span>
                <i aria-hidden="true">→</i>
                <span>Updated recipe</span>
              </div>
            </aside>
          </div>
        </section>

        <section>
          <h2>Analysis Repertoire</h2>
          <p>
            A crystallization agent aligns papers with open-source code and distills them into
            standardized, adaptable recipes across unimodal and multimodal families.
          </p>

          <div className="repertoire">
            <div className="repertoire-hero">
              <strong>68</strong>
              <div>
                <span>analysis recipes</span>
                <p>From data preprocessing to visualization</p>
              </div>
            </div>

            <div className="repertoire-columns">
              {repertoireFamilies.map((column) => (
                <div className={`repertoire-column tone-${column.tone}`} key={column.mode}>
                  <h3>{column.mode}</h3>
                  <ul>
                    {column.families.map((family) => (
                      <li key={family.name}>
                        <span>{family.name}</span>
                        <p>
                          {family.recipes.map((recipe) => (
                            <em key={recipe}>{recipe}</em>
                          ))}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2>BrainArena</h2>
          <p>
            BrainArena evaluates complete neuroscience analyses—not only whether code runs, but
            whether the method, result, and biological interpretation are correct—across 32
            expert-annotated tasks spanning five model organisms.
          </p>

          <div className="arena">
            <div className="arena-block">
              <h3>Benchmark process</h3>
              <figure className="figure-block arena-figure">
                <div className="figure-link">
                  <img
                    src={asset("/figure-brainarena-process.png")}
                    alt="BrainArena workflow from task curation to evaluation"
                  />
                </div>
                <figcaption>
                  <strong>Figure 2.</strong> BrainArena workflow: expert-curated tasks and datasets
                  are analyzed by SeekBrain, then scored by an LLM evaluator against ground truth and
                  rubrics.
                </figcaption>
              </figure>
            </div>

            <div className="arena-block">
              <h3>Example analysis outputs</h3>
              <figure className="figure-block arena-figure arena-cases">
                <div className="figure-link arena-cases-scroll">
                  <img
                    src={asset("/figure-brainarena-cases.png")}
                    alt="Gallery of representative BrainArena analysis output figures"
                  />
                </div>
                <figcaption>
                  <strong>Figure 3.</strong> Representative BrainArena analysis outputs across
                  spatial mapping, manifold analysis, network structure, and decoding.
                </figcaption>
              </figure>
            </div>

            <div className="arena-block">
              <h3>Quantitative results</h3>
              <div className="arena-quant">
                <div className="arena-scores" aria-label="Mean scores">
                  {[
                    ["SeekBrain", "75.8", "claude-opus-4-7", true],
                    ["Claude Code", "64.1", "claude-opus-4-7", false],
                    ["Codex", "58.1", "gpt-5.5", false],
                  ].map(([name, score, backend, lead]) => (
                    <div className={`arena-score${lead ? " is-lead" : ""}`} key={name}>
                      <div className="arena-score-top">
                        <span>
                          {name}
                          <em>{backend}</em>
                        </span>
                        <strong>{score}</strong>
                      </div>
                      <div className="arena-track" aria-hidden="true">
                        <i style={{ width: `${Number(score)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="arena-scope" aria-label="Benchmark scope">
                  {[
                    ["32", "expert tasks"],
                    ["5", "model organisms"],
                    ["7", "analysis categories"],
                  ].map(([value, label]) => (
                    <div key={label}>
                      <strong>{value}</strong>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="arena-delta">+11.7 over the strongest baseline · mean score / 100</p>
            </div>
          </div>
        </section>

        <section>
          <h2>Case Studies</h2>
          <p>
            SeekBrain analyzes a tri-modal zebrafish dataset through a sequence of researcher-led
            questions and reanalyzes a mouse decision-making dataset through agent-led hypothesis
            testing.
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
                <strong>Figure {activeIndex + 4}.</strong> {activeStudy.figureNote}
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
