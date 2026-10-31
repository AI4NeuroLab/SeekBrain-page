import { useEffect, useRef, useState } from "react";
import { reproductions } from "../content/reproduce";
import { asset } from "../asset";

/**
 * Hero: drag a divider between the BrainArena reference figure and SeekBrain's output.
 * Every image is pre-padded to one 1400×1100 canvas, so the frame stays the same size for all pairs.
 */
export default function CompareHero() {
  const [index, setIndex] = useState(0);
  const [split, setSplit] = useState(50);
  const [touched, setTouched] = useState(false);
  const frame = useRef<HTMLDivElement>(null);
  const item = reproductions[index];

  // Auto-advance until the visitor interacts.
  useEffect(() => {
    if (touched) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % reproductions.length), 7000);
    return () => window.clearInterval(id);
  }, [touched]);

  const moveTo = (clientX: number) => {
    const box = frame.current?.getBoundingClientRect();
    if (!box) return;
    setSplit(Math.min(100, Math.max(0, ((clientX - box.left) / box.width) * 100)));
  };

  return (
    <div className="compare">
      <p className="compare-hint" aria-hidden="true">
        ‹ drag to compare ›
      </p>
      <div className="compare-stage">
        <div
          className="compare-frame"
          ref={frame}
          onPointerDown={(e) => {
            setTouched(true);
            e.currentTarget.setPointerCapture(e.pointerId);
            moveTo(e.clientX);
          }}
          onPointerMove={(e) => e.buttons === 1 && moveTo(e.clientX)}
          role="slider"
          aria-label="Reference versus SeekBrain output"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(split)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setSplit((s) => Math.max(0, s - 5));
            if (e.key === "ArrowRight") setSplit((s) => Math.min(100, s + 5));
            setTouched(true);
          }}
        >
          {/* Each tag lives in its image's layer, so the reference tag is clipped away with the reference. */}
          <div className="compare-layer">
            <img src={asset(`/reproduce/${item.id}-seekbrain.webp`)} alt={`SeekBrain output: ${item.task}`} draggable={false} />
            <span className="compare-tag is-ours">SeekBrain</span>
          </div>
          <div className="compare-layer is-reference" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}>
            <img src={asset(`/reproduce/${item.id}-original.webp`)} alt={`Reference figure: ${item.venue}`} draggable={false} />
            <span className="compare-tag">Reference</span>
          </div>
          <div className="compare-handle" style={{ left: `${split}%` }} aria-hidden="true">
            <span>‹ ›</span>
          </div>
        </div>
      </div>

      <div className="compare-meta">
        <div>
          <strong>{item.task}</strong>
          <span>
            {item.organism} · {item.venue}
          </span>
        </div>
        <div className="compare-score" title="BrainArena score (0–100)">
          {item.score}
          <small>/100</small>
        </div>
      </div>

      <div className="compare-dots" role="tablist" aria-label="Choose a BrainArena task">
        {reproductions.map((r, i) => (
          <button
            key={r.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            className={i === index ? "is-active" : ""}
            onClick={() => {
              setIndex(i);
              setTouched(true);
            }}
          >
            {r.task}
          </button>
        ))}
      </div>

      <p className="compare-credit">
        Reference: {item.paper},{" "}
        <a href={`https://doi.org/${item.doi}`} target="_blank" rel="noreferrer">
          doi:{item.doi}
        </a>{" "}
        ({item.license}). SeekBrain: output on the corresponding BrainArena task, scored against the expert-annotated rubric.
      </p>
    </div>
  );
}
