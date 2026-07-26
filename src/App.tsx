import { useMemo, useState } from "react";

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
    accent: "#E7684D",
  },
  {
    mode: "Unimodal",
    modality: "Structure",
    title: "Anatomical structure",
    description: "Connectome analysis, neuron morphology, atlas registration, and anatomical quantification.",
    accent: "#BD8BFF",
  },
  {
    mode: "Unimodal",
    modality: "Neural dynamics",
    title: "Neural activity",
    description: "Activity profiling, population dynamics, functional connectivity, and network analysis.",
    accent: "#36C6B3",
  },
  {
    mode: "Unimodal",
    modality: "Behavior",
    title: "Behavioral computation",
    description: "Behavioral motif discovery, latent-state inference, and strategy modeling.",
    accent: "#F1B24A",
  },
  {
    mode: "Multimodal",
    modality: "Molecule × Structure",
    title: "Molecular–anatomical mapping",
    description: "Cell localization in atlases, molecular-to-atlas mapping, and cross-modal interpretation.",
    accent: "#E7684D",
  },
  {
    mode: "Multimodal",
    modality: "Structure × Function",
    title: "Structure–function coupling",
    description: "SC–FC association tests, network-based comparisons, and gradient alignment.",
    accent: "#BD8BFF",
  },
  {
    mode: "Multimodal",
    modality: "Stimulus × Dynamics",
    title: "Sensorimotor coupling",
    description: "Sensory classification, stimulus decoding, and sensorimotor activity coupling.",
    accent: "#36C6B3",
  },
  {
    mode: "Multimodal",
    modality: "Dynamics × Behavior",
    title: "Neural–behavioral decoding",
    description: "Head-direction coupling, continuous behavior decoding, and decision-variable decoding.",
    accent: "#F1B24A",
  },
];

const studies = {
  zebrafish: {
    index: "01",
    label: "Researcher-led",
    kicker: "Tri-modal zebrafish exploration",
    title: "From tail kinematics to a shared neural manifold",
    body: "SeekBrain connected free-moving behavior, whole-brain calcium activity, and anatomy. It clustered 1,546 swimming bouts, compressed 64k+ neural ROIs into region-aware supervoxels, and uncovered a cross-animal latent geometry of behavior.",
    facts: [
      ["94.9%", "3NN decoding accuracy"],
      ["3,000", "supervoxels per larva"],
      ["81", "anatomical regions tested"],
    ],
    image: asset("/figure-zebrafish.webp"),
    imageAlt: "Paper figure showing structured neural representations of zebrafish behavior",
  },
  mouse: {
    index: "02",
    label: "Agent-led",
    kicker: "Mouse decision-making rediscovery",
    title: "A shared decoding-strength axis across the brain",
    body: "On the IBL decision-making dataset, SeekBrain proposed a region-level hypothesis, tested it across five decoder maps, and separated shared movement-linked geometry from task-specific residual anatomy.",
    facts: [
      ["63.2%", "variance explained by PC1"],
      ["201", "brain regions analyzed"],
      ["0.96", "rank/value PC1 correlation"],
    ],
    image: asset("/figure-mouse.webp"),
    imageAlt: "Paper figure showing brain-wide decoder maps in a mouse decision-making task",
  },
};

const citation = `@article{seekbrain2026,
  title   = {SeekBrain: An Autonomous Multi-Agent Framework
             for Accelerating Neuroscience Discovery},
  year    = {2026},
  note    = {Manuscript}
}`;

export default function App() {
  const [recipeMode, setRecipeMode] = useState<"All" | "Unimodal" | "Multimodal">("All");
  const [study, setStudy] = useState<keyof typeof studies>("zebrafish");
  const [copied, setCopied] = useState(false);

  const visibleRecipes = useMemo(
    () => repertoire.filter((item) => recipeMode === "All" || item.mode === recipeMode),
    [recipeMode],
  );

  const activeStudy = studies[study];

  const copyCitation = async () => {
    await navigator.clipboard.writeText(citation);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <main>
      <nav className="nav-shell" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="SeekBrain home">
          <span className="brand-mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>SEEK<span>BRAIN</span></span>
        </a>
        <div className="nav-links">
          <a href="#system">System</a>
          <a href="#repertoire">Repertoire</a>
          <a href="#benchmark">BrainArena</a>
          <a href="#discoveries">Discoveries</a>
        </div>
        <a className="nav-paper" href={asset("/paper.pdf")} target="_blank" rel="noreferrer">
          Read paper <span>↗</span>
        </a>
      </nav>

      <section className="hero" id="top">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
        <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
        <div className="hero-content page-width">
          <div className="eyebrow reveal">DOMAIN-SPECIALIZED MULTI-AGENT SCIENCE</div>
          <h1 className="reveal delay-1">
            Seek<span>Brain</span>
          </h1>
          <p className="hero-title reveal delay-2">
            An Autonomous Multi-Agent Framework
            <br />
            for Accelerating Neuroscience Discovery
          </p>
          <p className="hero-summary reveal delay-3">
            SeekBrain turns fragmented neuroscience methods into reusable analysis recipes, then combines
            hierarchical research planning with validated code execution to navigate multimodal data—from
            molecules and structure to neural dynamics and behavior.
          </p>
          <div className="hero-actions reveal delay-3">
            <a className="button button-primary" href={asset("/paper.pdf")} target="_blank" rel="noreferrer">
              Read the manuscript <span>↗</span>
            </a>
            <a className="button button-ghost" href="#system">
              Explore the system <span>↓</span>
            </a>
          </div>
          <div className="hero-meta reveal delay-3">
            <span>Shanghai Artificial Intelligence Laboratory</span>
            <span>Research preview · 2026</span>
          </div>
        </div>
        <div className="hero-signal" aria-hidden="true">
          {Array.from({ length: 24 }).map((_, index) => (
            <i key={index} style={{ height: `${18 + ((index * 29) % 78)}%` }} />
          ))}
        </div>
      </section>

      <section className="stats-ribbon" aria-label="Project highlights">
        <div className="page-width stats-grid">
          {[
            ["68", "analysis recipes", "A growing repertoire"],
            ["32", "benchmark tasks", "Expert annotated"],
            ["5", "model organisms", "Cross-species coverage"],
            ["75.5", "mean score", "Best on BrainArena"],
          ].map(([value, label, detail]) => (
            <article className="stat" key={label}>
              <strong>{value}</strong>
              <div>
                <span>{label}</span>
                <small>{detail}</small>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section page-width intro" id="system">
        <div className="section-label">
          <span>01</span>
          <p>THE SYSTEM</p>
        </div>
        <div className="intro-copy">
          <h2>From a research question to analytical evidence.</h2>
          <p>
            General-purpose agents can write code, but neuroscience demands something harder: knowing which
            analysis is valid, how modalities align, and what the result means biologically. SeekBrain anchors
            every step in executable domain expertise.
          </p>
        </div>
        <div className="workflow" aria-label="SeekBrain workflow">
          <div className="workflow-node input-node">
            <span>INPUT</span>
            <strong>Research question</strong>
            <p>Multimodal datasets + scientific intent</p>
          </div>
          <div className="workflow-arrow" aria-hidden="true">→</div>
          <div className="workflow-engine planning">
            <span>ENGINE 01</span>
            <strong>Research planning</strong>
            <div className="mini-flow">
              <i>Survey</i><b>→</b><i>Orchestrate</i><b>↔</b><i>Review</i>
            </div>
          </div>
          <div className="workflow-arrow" aria-hidden="true">→</div>
          <div className="workflow-engine execution">
            <span>ENGINE 02</span>
            <strong>Analysis execution</strong>
            <div className="mini-flow">
              <i>Formulate</i><b>→</b><i>Code</i><b>↔</b><i>Validate</i>
            </div>
          </div>
          <div className="workflow-arrow" aria-hidden="true">→</div>
          <div className="workflow-node output-node">
            <span>OUTPUT</span>
            <strong>Scientific report</strong>
            <p>Figures + statistics + conclusions</p>
          </div>
          <div className="repertoire-rail">
            <span>NEUROSCIENCE ANALYSIS REPERTOIRE</span>
            <p>Literature-validated recipes ground both engines in field-specific methodology.</p>
          </div>
        </div>
        <div className="figure-card">
          <div className="figure-caption">
            <span>FIGURE 01</span>
            <div>
              <h3>Architecture & workflow</h3>
              <p>The complete SeekBrain system as presented in the manuscript.</p>
            </div>
            <a href={asset("/figure-architecture.png")} target="_blank" rel="noreferrer">Open source figure ↗</a>
          </div>
          <div className="source-figure architecture-figure">
            <a href={asset("/figure-architecture.png")} target="_blank" rel="noreferrer" aria-label="Open architecture figure">
              <img src={asset("/figure-architecture.png")} alt="SeekBrain architecture and workflow from the paper source" />
            </a>
          </div>
        </div>
      </section>

      <section className="section repertoire-section" id="repertoire">
        <div className="page-width">
          <div className="section-heading">
            <div className="section-label">
              <span>02</span>
              <p>ANALYSIS REPERTOIRE</p>
            </div>
            <div>
              <h2>Expert methods, crystallized into action.</h2>
              <p>
                A crystallization agent aligns papers with open-source code and distills them into standardized,
                adaptable recipes. Validated researcher traces can be folded back into the repertoire over time.
              </p>
            </div>
          </div>
          <div className="filter-row" role="tablist" aria-label="Filter analysis recipes">
            {(["All", "Unimodal", "Multimodal"] as const).map((mode) => (
              <button
                key={mode}
                className={recipeMode === mode ? "active" : ""}
                onClick={() => setRecipeMode(mode)}
                role="tab"
                aria-selected={recipeMode === mode}
              >
                {mode}
                <span>{mode === "All" ? "08" : "04"}</span>
              </button>
            ))}
          </div>
          <div className="recipe-grid">
            {visibleRecipes.map((item, index) => (
              <article className="recipe-card" key={item.modality}>
                <div className="recipe-card-top">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <i style={{ backgroundColor: item.accent }} />
                </div>
                <small>{item.mode} · {item.modality}</small>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="recipe-line" style={{ backgroundColor: item.accent }} />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section benchmark-section page-width" id="benchmark">
        <div className="benchmark-heading">
          <div className="section-label">
            <span>03</span>
            <p>BRAINARENA</p>
          </div>
          <h2>Does the agent get the science right?</h2>
          <p>
            BrainArena evaluates complete neuroscience analyses—not just whether the code runs, but whether
            the method, result, and biological interpretation are correct.
          </p>
        </div>
        <div className="benchmark-copy">
          <span className="subsection-kicker">WHAT COUNTS AS CORRECT</span>
          <div className="benchmark-dimensions">
            {[
              ["01", "Figure fidelity", "Does the reproduced result match the expected pattern?"],
              ["02", "Method correctness", "Are the analysis choices technically and scientifically valid?"],
              ["03", "Interpretive validity", "Are conclusions supported by statistics and biology?"],
            ].map(([number, title, body]) => (
              <div key={title}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="score-panel">
          <div className="score-header">
            <span>MEAN SCORE / 100</span>
            <span>32 TASKS</span>
          </div>
          {[
            ["SeekBrain", 75.5, "seek"],
            ["Claude Code", 64.1, "baseline"],
            ["Codex", 58.1, "baseline"],
          ].map(([name, score, type]) => (
            <div className="score-row" key={String(name)}>
              <div>
                <span>{name}</span>
                <strong>{score}</strong>
              </div>
              <div className="score-track">
                <i className={String(type)} style={{ width: `${score}%` }} />
              </div>
            </div>
          ))}
          <div className="score-note">
            <strong>+11.4</strong>
            <span>points over the strongest baseline</span>
          </div>
        </div>
        <div className="benchmark-figure figure-card">
          <div className="figure-caption">
            <span>FIGURE 02</span>
            <div>
              <h3>BrainArena evaluation</h3>
              <p>Task composition, score distributions, domain performance, and rubric breakdown.</p>
            </div>
            <a href={asset("/figure-brainarena.png")} target="_blank" rel="noreferrer">Open source figure ↗</a>
          </div>
          <div className="source-figure benchmark-figure-image">
            <a href={asset("/figure-brainarena.png")} target="_blank" rel="noreferrer" aria-label="Open BrainArena figure">
              <img src={asset("/figure-brainarena.png")} alt="BrainArena evaluation figure from the paper source" />
            </a>
          </div>
        </div>
      </section>

      <section className="section discoveries" id="discoveries">
        <div className="page-width">
          <div className="section-heading discovery-heading">
            <div className="section-label">
              <span>04</span>
              <p>DISCOVERIES</p>
            </div>
            <div>
              <h2>Two modes of scientific collaboration.</h2>
              <p>
                SeekBrain can execute a researcher’s progressive logic chain or lead a supervised
                hypothesis–analysis loop on an existing dataset.
              </p>
            </div>
          </div>
          <div className="study-tabs" role="tablist" aria-label="Select case study">
            <button
              className={study === "zebrafish" ? "active" : ""}
              onClick={() => setStudy("zebrafish")}
              role="tab"
              aria-selected={study === "zebrafish"}
            >
              <span>01</span>
              Zebrafish manifold
            </button>
            <button
              className={study === "mouse" ? "active" : ""}
              onClick={() => setStudy("mouse")}
              role="tab"
              aria-selected={study === "mouse"}
            >
              <span>02</span>
              Mouse decoding axis
            </button>
          </div>
          <article className="study-card">
            <div className="study-copy">
              <div className="study-kicker">
                <span>{activeStudy.index}</span>
                <p>{activeStudy.label} · {activeStudy.kicker}</p>
              </div>
              <h3>{activeStudy.title}</h3>
              <p>{activeStudy.body}</p>
              <div className="study-facts">
                {activeStudy.facts.map(([value, label]) => (
                  <div key={label}>
                    <strong>{value}</strong>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={`study-figure ${study}`}>
              <a href={activeStudy.image} target="_blank" rel="noreferrer" aria-label={`Open ${activeStudy.kicker} figure`}>
                <img src={activeStudy.image} alt={activeStudy.imageAlt} />
              </a>
            </div>
          </article>
        </div>
      </section>

      <section className="section page-width future">
        <div className="future-card">
          <div>
            <span className="future-kicker">THE CO-EVOLVING LOOP</span>
            <h2>Every validated analysis can make the next one better.</h2>
          </div>
          <div className="loop-visual" aria-label="Co-evolving researcher in the loop process">
            {[
              ["01", "Researcher steers"],
              ["02", "SeekBrain executes"],
              ["03", "Experts validate"],
              ["04", "Recipes evolve"],
            ].map(([number, text], index) => (
              <div key={text}>
                <span>{number}</span>
                <strong>{text}</strong>
                {index < 3 && <i aria-hidden="true">→</i>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section citation-section page-width" id="citation">
        <div className="citation-copy">
          <div className="section-label">
            <span>05</span>
            <p>CITATION</p>
          </div>
          <h2>Build on the work.</h2>
          <p>Citation details will be updated with the public release of the manuscript.</p>
        </div>
        <div className="citation-box">
          <pre>{citation}</pre>
          <button onClick={copyCitation}>{copied ? "Copied" : "Copy BibTeX"}</button>
        </div>
      </section>

      <footer>
        <div className="page-width footer-grid">
          <div className="footer-brand">
            <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
            <strong>SEEK<span>BRAIN</span></strong>
          </div>
          <p>Turning neuroscience methods into a reusable engine for discovery.</p>
          <div className="footer-links">
            <a href={asset("/paper.pdf")} target="_blank" rel="noreferrer">Paper ↗</a>
            <a href="#benchmark">BrainArena</a>
            <a href="#repertoire">Repertoire</a>
          </div>
          <small>© 2026 Shanghai Artificial Intelligence Laboratory</small>
        </div>
      </footer>
    </main>
  );
}
