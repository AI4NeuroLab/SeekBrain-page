import { useEffect, useState } from "react";
import { asset } from "./asset";
import CompareHero from "./components/CompareHero";
import CliDemo from "./components/CliDemo";
import QuickStart from "./components/QuickStart";
import WebUIShowcase from "./components/WebUIShowcase";
import { REPO_URL } from "./content/release";

const navLinks = [
  ["#demo", "Demo"],
  ["#quickstart", "Quick start"],
  ["#webui", "WebUI"],
  ["#framework", "Framework"],
  ["#benchmark", "BrainArena"],
  ["#cases", "Case studies"],
  ["#citation", "Cite"],
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

const citation = `@article{wu2026seekbrain,
  title         = {SeekBrain: An Autonomous Multi-Agent System for Accelerating Neuroscience Discovery},
  author        = {Wu, Jiamin and Xiang, Peishan and Chen, Jingyang and Zhu, Yuqing and Li, Yuxi and Luo, Ling and Zheng, Qihao and Zu, Jialiang and Wu, Yongchao and Liu, Mindong and Wu, Haitao and Hu, Chaofan and Sun, Yijie and Hang, Yuqi and Zhu, Yu and Li, Shuo and Fan, Yue and Feng, Shiyang and Xu, Wanghan and Zhang, Tianlei and Zhang, Jie and Zhang, Wenlong and Zhang, Bo and Wang, Kai and Bai, Lei and Liu, Mianxin and Ouyang, Wanli and Du, Jiulin and Song, Chunfeng},
  journal       = {arXiv preprint arXiv:2607.29347},
  year          = {2026},
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
    body: "On the IBL decision-making dataset, SeekBrain proposed a region-level hypothesis, tested it across five decoder maps, and separated shared movement-linked geometry from task-specific residual anatomy. Notably, the residual network of Choice/Stimulation/Feedback, with its shared axes removed, still exhibits brain-region-specific characteristics.",
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

  useEffect(() => {
    const sections = document.querySelectorAll("section");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.08 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const copyCitation = async () => {
    await navigator.clipboard.writeText(citation);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <>
      <nav className="topnav">
        <div className="topnav-inner">
          <a className="topnav-brand" href="#top" aria-label="SeekBrain home">
            <img src={asset("/seekbrain-logo.png")} alt="SeekBrain" />
          </a>
          <div className="topnav-links">
            {navLinks.map(([href, label]) => (
              <a key={href} href={href}>
                {label}
              </a>
            ))}
          </div>
          <a className="topnav-cta" href={REPO_URL} target="_blank" rel="noreferrer">
            <CodeIcon /> GitHub
          </a>
        </div>
      </nav>

      <header className="landing" id="top">
        <div className="landing-copy">
          <p className="eyebrow">Shanghai Artificial Intelligence Laboratory</p>
          <h1>SeekBrain</h1>
          <p className="landing-title">
            An autonomous multi-agent framework for <span>accelerating neuroscience discovery</span>
          </p>
          <p className="landing-lede">
            SeekBrain couples a Neuroscience Analysis Repertoire, crystallized from published studies and their
            codebases, with a Research Planning Engine and an Analysis Execution Engine to generate hypotheses and
            analytical pipelines on demand. On the expert-annotated BrainArena benchmark, SeekBrain achieved the
            highest mean score (<strong>75.8</strong>), compared with 64.1 for Claude Code and 58.1 for Codex.
          </p>
          <div className="links">
            <a className="link-btn" href="#quickstart">
              Get started
            </a>
            <a className="link-btn ghost" href="#demo">
              View demo
            </a>
            <a className="link-btn ghost" href="https://arxiv.org/abs/2607.29347" target="_blank" rel="noreferrer">
              <DocIcon />
              Paper
            </a>
          </div>
        </div>
        <CompareHero />
      </header>

      <div className="shell">
        <section id="demo" className="wide">
          <p className="section-kicker">Demo</p>
          <h2>SeekBrain at work</h2>
          <p>
            Recorded SeekBrain sessions, replayed in the command-line interface. Researchers interact with
            SeekBrain through a natural-language interface; the panel on the right shows the files each run
            produced, from a single figure to a research plan and a full scientific report.
          </p>
          <CliDemo />
        </section>

        <section id="quickstart" className="wide">
          <p className="section-kicker">Quick start</p>
          <h2>Running in three steps</h2>
          <QuickStart />
        </section>

        <section id="webui" className="wide">
          <p className="section-kicker">WebUI</p>
          <h2>A research workspace in your browser</h2>
          <p>
            Twelve recorded sessions from a researcher-in-the-loop case study, structural and transcriptomic
            correlates of individual FC fingerprinting in larval zebrafish, one session per figure panel.
            Pick a session to read its full transcript: recipe retrieval, then the Analysis Execution
            Engine's formulation, coding, validation and interpretation.
          </p>
          <WebUIShowcase />
        </section>

        <section id="about">
          <p className="section-kicker">The research</p>
          <h2>Abstract</h2>
            <p>
            Modern neuroscience relies on integrating multi-scale, multimodal datasets to uncover the neural
            principles underlying intelligence. However, analytical challenges posed by highly heterogeneous data
            and fragmented workflows increasingly constrain discoveries. Here, we introduce SeekBrain, an
            autonomous multi-agent framework designed to accelerate neuroscience discovery through domain-grounded
            hierarchical planning and cross-modal data analysis. SeekBrain dynamically constructs a repertoire of
            analysis recipes extracted from code-paper pairs. By coupling this codified expertise with agentic
            planning and execution engines, the framework scalably generates hypotheses and analytical pipelines
            on demand. Systematic evaluation on the expert-annotated BrainArena benchmark demonstrates that
            SeekBrain substantially outperforms state-of-the-art agent baselines across various analysis tasks.
            Crucially, across real-world case studies spanning zebrafish, mice, and humans, SeekBrain facilitated
            scientific investigations across diverse paradigms, including brain-wide neural dynamics underlying
            natural behavior, neural signatures of individuality, neural decoding in decision-making, and
            disorder-associated functional connectivity. These results establish SeekBrain as a scalable and
            practical tool for accelerating data-driven discoveries in neuroscience.
          </p>
          <figure className="figure-block">
            <a className="figure-link" href={asset("/figure-architecture.png")} target="_blank" rel="noreferrer">
              <img src={asset("/figure-architecture.png")} alt="SeekBrain architecture and workflow" />
            </a>
            <figcaption>
              <strong>Figure 1.</strong> SeekBrain overview. End-to-end workflow from multimodal
              research inputs to reports and figures.
            </figcaption>
          </figure>
        </section>

        <section className="framework-section" id="framework">
          <h2>Framework</h2>
          <p>
            SeekBrain pairs a <strong>Research Planning Engine</strong> with an{" "}
            <strong>Analysis Execution Engine</strong>, both grounded in a reusable repertoire of
            analysis recipes distilled from open access neuroscience studies. A{" "}
            <strong>Researcher-in-the-Loop</strong> paradigm enables expert feedback at every stage,
            with validated traces continuously enriching the analysis repertoire.
          </p>

          <div className="framework-cards">
            <div className="framework-card">
              <div className="framework-card-header">
                <span className="framework-card-number">01</span>
                <h3>Research Planning Engine</h3>
              </div>
              <ul>
                <li>Hierarchical decomposition: query → hypotheses → atomic tasks via Orchestrator-Reviewer debate</li>
                <li>Tree-structured plans with transparent reasoning paths traceable to the original question</li>
              </ul>
              <a className="framework-card-img" href={asset("/research_planning_engine.png")} target="_blank" rel="noreferrer">
                <img src={asset("/research_planning_engine.png")} alt="Research Planning Engine" />
              </a>
            </div>

            <div className="framework-card">
              <div className="framework-card-header">
                <span className="framework-card-number">02</span>
                <h3>Analysis Execution Engine</h3>
              </div>
              <ul>
                <li>Four-phase workflow: formulation → coding → validation → interpretation</li>
                <li>Recipe-grounded methodology that adapts established domain knowledge to new data</li>
                <li>Validation Agent prevents methodological hallucinations before final interpretation</li>
              </ul>
              <a className="framework-card-img" href={asset("/analysis_execution_engine.png")} target="_blank" rel="noreferrer">
                <img src={asset("/analysis_execution_engine.png")} alt="Analysis Execution Engine" />
              </a>
            </div>

            <div className="framework-card">
              <div className="framework-card-header">
                <span className="framework-card-number">03</span>
                <h3>Researcher in the Loop</h3>
              </div>
              <ul>
                <li>Scientists inject feedback at every stage: planning, methodology, and analysis</li>
                <li>User traces are automatically distilled into new analysis recipes after each session</li>
                <li>The repertoire continuously evolves with the broader research community</li>
              </ul>
              <a className="framework-card-img" href={asset("/researcher_in_the_loop.png")} target="_blank" rel="noreferrer">
                <img src={asset("/researcher_in_the_loop.png")} alt="Researcher in the Loop" />
              </a>
            </div>
          </div>
        </section>

        <section>
          <h2>Neuroscience Analysis Repertoire</h2>
          <p>
            SeekBrain constructs a self-evolving <strong>Neuroscience Analysis Repertoire</strong> with{" "}
            <strong>68 foundational recipes from data preprocessing to visualization</strong>. A
            dual-agent framework expands the library: a <em>crystallization agent</em> synthesizes
            workflows from papers and code, while a <em>distillation agent</em> captures human
            expertise from validated traces.
          </p>

          <div className="dual-agent">
            <div className="dual-agent-card">
              <div className="dual-agent-icon">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2l4.5 7.5L12 17 7.5 9.5Z" strokeLinejoin="round" />
                  <path d="M7.5 9.5h9" strokeLinecap="round" />
                  <path d="M12 17v5" strokeLinecap="round" />
                  <path d="M9 22h6" strokeLinecap="round" />
                </svg>
              </div>
              <h4>Crystallization Agent</h4>
              <p className="dual-agent-desc">Synthesizes new recipes from research papers and code repositories</p>
              <div className="dual-agent-flow">
                <span className="dual-agent-input">Papers + Code</span>
                <span className="dual-agent-arrow">→</span>
                <span className="dual-agent-output">New Recipes</span>
              </div>
            </div>
            <div className="dual-agent-center">
              <div className="dual-agent-repo">
                <span>Self-evolving</span>
                <strong>Neuroscience Analysis Repertoire</strong>
              </div>
            </div>
            <div className="dual-agent-card">
              <div className="dual-agent-icon">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 3h6v5.172a2 2 0 0 0 .586 1.414l3.121 3.121A2 2 0 0 1 19.293 14H4.707a2 2 0 0 1 .586-1.293l3.12-3.121A2 2 0 0 0 9 8.172V3z" strokeLinejoin="round" />
                  <path d="M5 14l2 7h10l2-7" strokeLinejoin="round" />
                  <path d="M9 3h6" strokeLinecap="round" />
                  <circle cx="10" cy="17" r="1" fill="currentColor" stroke="none" />
                  <circle cx="14" cy="18.5" r="0.75" fill="currentColor" stroke="none" />
                </svg>
              </div>
              <h4>Distillation Agent</h4>
              <p className="dual-agent-desc">Captures dynamic human expertise from validated user traces</p>
              <div className="dual-agent-flow">
                <span className="dual-agent-input">User Traces</span>
                <span className="dual-agent-arrow">→</span>
                <span className="dual-agent-output">Updated Recipes</span>
              </div>
            </div>
          </div>

          <div className="repertoire">
            <div className="repertoire-hero">
              <strong>68</strong>
              <div>
                <span>Foundational Analysis Recipes</span>
                <p>Covering 4 data modalities across 8 analysis families, from preprocessing to visualization</p>
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

        <section id="benchmark">
          <h2>Benchmarking on BrainArena</h2>
          <p>
            We introduce <strong>BrainArena</strong>, the first domain-specific benchmark for
            evaluating LLM agents on end-to-end neuroscience data analysis. Each of the 32
            expert-curated tasks includes an analysis query and a scoring rubric that evaluates{" "}
            <em>method correctness</em>, <em>figure fidelity</em>, and <em>interpretive
            validity</em>, with over 700 deduction subitems that map observable errors to point
            losses.
          </p>

          <div className="arena-highlights">
            {[
              { value: "32", label: "expert-curated tasks" },
              { value: "5", label: "model organisms" },
              { value: "700+", label: "rubric deduction subitems" },
              { value: "7", label: "analysis categories" },
            ].map(({ value, label }) => (
              <div className="arena-highlight" key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>

          <div className="arena-coverage">
            <div className="arena-coverage-group">
              <h4>Model Organisms</h4>
              <div className="arena-tags">
                {[
                  ["Rodents", "34%"],
                  ["Zebrafish", "31%"],
                  ["C. elegans", "16%"],
                  ["Non-human Primates", "12%"],
                  ["Drosophila", "6%"],
                ].map(([name, pct]) => (
                  <span className="arena-tag" key={name}>{name} <em>{pct}</em></span>
                ))}
              </div>
            </div>
            <div className="arena-coverage-group">
              <h4>Analysis Types</h4>
              <div className="arena-tags">
                {[
                  "Neural Response Characterization",
                  "Neural Decoding",
                  "Population Representation",
                  "Computational Modeling",
                  "Statistical Analysis",
                  "Brain Network & Anatomical Mapping",
                  "Molecular & Developmental",
                ].map((t) => (
                  <span className="arena-tag" key={t}>{t}</span>
                ))}
              </div>
            </div>
          </div>

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
                  <strong>Figure 2 | BrainArena evaluation.</strong> a, Overview of BrainArena
                  construction and evaluation process. Expert-curated tasks are generated from
                  neuroscience publications and evaluated with ground-truth annotations and scoring
                  rubrics. b, A task example, including the task query and evaluation scoring rubrics
                  annotated by domain experts. c, Tasks in BrainArena span diverse model organisms in
                  neuroscience. d, BrainArena includes single- and multi-modality analysis tasks across
                  molecule, behavior, neural activity, and structure modalities.
                </figcaption>
              </figure>
            </div>

            <div className="arena-block">
              <h3>Quantitative results</h3>
              <figure className="figure-block arena-figure">
                <a className="figure-link" href={asset("/benchmark_results.png")} target="_blank" rel="noreferrer">
                  <img
                    src={asset("/benchmark_results.png")}
                    alt="BrainArena quantitative results"
                  />
                </a>
                <figcaption>
                  <strong>Figure 3 | BrainArena results.</strong>{" "}
                  a, Overall performance: SeekBrain significantly outperforms Claude Code and Codex
                  (P&lt;0.0001).{" "}
                  b, Mean scores across seven analytical domains.{" "}
                  c, Performance by difficulty tier (12 easy vs. 20 hard tasks).{" "}
                  d, Component-level normalized scores across three rubric dimensions: figure fidelity,
                  method correctness, and interpretive validity.{" "}
                  e, Ablation study: performance with vs. without recipes from the neuroscience
                  analysis repertoire (Wilcoxon signed-rank test, P&lt;0.0001).
                </figcaption>
              </figure>
            </div>

            <div className="arena-block">
              <h3>Leaderboard</h3>
              <div className="leaderboard">
                <div className="leaderboard-header">
                  <span className="lb-col-rank">Rank</span>
                  <span className="lb-col-agent">Agent</span>
                  <span className="lb-col-model">Backend</span>
                  <span className="lb-col-score">Mean Score</span>
                </div>
                {[
                  { rank: 1, name: "SeekBrain", model: "claude-opus-4-7", score: 75.8 },
                  { rank: 2, name: "Claude Code", model: "claude-opus-4-7", score: 64.1 },
                  { rank: 3, name: "Codex", model: "gpt-5.5", score: 58.1 },
                ].map((entry) => (
                  <div className={`leaderboard-row${entry.rank === 1 ? " is-champion" : ""}`} key={entry.name}>
                    <span className="lb-col-rank">
                      <span className={`lb-rank lb-rank-${entry.rank}`}>{entry.rank}</span>
                    </span>
                    <span className="lb-col-agent">{entry.name}</span>
                    <span className="lb-col-model">{entry.model}</span>
                    <span className="lb-col-score">
                      <span className="lb-bar-wrap">
                        <span className="lb-bar" style={{ width: `${entry.score}%` }} />
                      </span>
                      <strong>{entry.score}</strong>
                    </span>
                  </div>
                ))}
                <div className="leaderboard-footer">
                  <span className="lb-footer-note">Mean score / 100 · evaluated across easy and hard tasks</span>
                </div>
              </div>
            </div>

            <div className="arena-block">
              <h3>Example analysis outputs</h3>
              <p className="arena-gallery-intro">
                Representative outputs generated by SeekBrain across diverse analysis tasks,
                demonstrating the system's versatile analytical capabilities.
              </p>
              <div className="arena-gallery">
                {[
                  "Brain-wide modulation mapping",
                  "Functional connectivity estimation",
                  "Neural spiking dynamics analysis",
                  "Hierarchical clustering of neuronal tuning to behavior",
                  "Neural prior decoding",
                  "Temporal offset decoding",
                  "Ring attractor phase mapping",
                  "Head direction measure",
                ].map((task) => (
                  <figure className="arena-gallery-item" key={task}>
                    <a
                      className="figure-link"
                      href={asset(`/example_analysis_outputs/${task}.png`)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src={asset(`/example_analysis_outputs/${task}.png`)}
                        alt={`Analysis output: ${task}`}
                      />
                    </a>
                    <figcaption>{task}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="cases">
          <h2>Case Studies</h2>
          <p>
            Beyond the quantitative benchmark, <strong>two real-world case studies</strong> demonstrate SeekBrain's
            capability to drive scientific exploration under both researcher-guided and fully
            autonomous modes, revealing novel neural structures, testing cross-region hypotheses, and
            enabling researchers to maintain control over key scientific decisions while delegating
            routine analysis.
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

        <section id="citation">
          <h2>BibTeX</h2>
          <div className="bibtex">
            <pre>{citation}</pre>
            <button type="button" onClick={copyCitation}>
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </section>

        <footer>
          <p>
            © 2026 Shanghai Artificial Intelligence Laboratory · <a href={REPO_URL}>GitHub</a> ·{" "}
            <a href="https://arxiv.org/abs/2607.29347">arXiv</a>
          </p>
          <p className="footer-note">
            Published figure panels are reproduced under their CC BY / CC BY-NC licenses for non-commercial
            comparison; all rights remain with the original authors.
          </p>
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
