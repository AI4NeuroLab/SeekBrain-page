/**
 * BrainArena reference panels vs. SeekBrain outputs used in the hero.
 * Score is the BrainArena rubric score (0-100) from scores_corrected.csv.
 */
export type Reproduction = {
  id: string;
  task: string;
  score: number;
  organism: string;
  paper: string;
  venue: string;
  doi: string;
  license: string;
};

export const reproductions: Reproduction[] = [
  {
    id: "findling-2a",
    task: "Neural prior decoding",
    score: 92,
    organism: "Mouse",
    paper: "Findling et al., Brain-wide representations of prior information in mouse decision-making",
    venue: "Nature 2025 · Fig. 2a",
    doi: "10.1038/s41586-025-09226-1",
    license: "CC BY 4.0",
  },
  {
    id: "koninck-2b",
    task: "Structural network visualization",
    score: 89,
    organism: "Zebrafish",
    paper: "Légaré et al., Structural and genetic determinants of zebrafish functional brain networks",
    venue: "Science Advances 2025 · Fig. 2B",
    doi: "10.1126/sciadv.adv7576",
    license: "CC BY-NC 4.0",
  },
  {
    id: "koninck-1e",
    task: "Functional connectivity estimation",
    score: 92,
    organism: "Zebrafish",
    paper: "Légaré et al., Structural and genetic determinants of zebrafish functional brain networks",
    venue: "Science Advances 2025 · Fig. 1E",
    doi: "10.1126/sciadv.adv7576",
    license: "CC BY-NC 4.0",
  },
  {
    id: "adam-3b",
    task: "Neural manifold embedding",
    score: 89,
    organism: "C. elegans",
    paper: "Atanas et al., Brain-wide representations of behavior spanning multiple timescales and states in C. elegans",
    venue: "Cell 2023 · Fig. 3B",
    doi: "10.1016/j.cell.2023.07.035",
    license: "CC BY-NC 4.0",
  },
];
