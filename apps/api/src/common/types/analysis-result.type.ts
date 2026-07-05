export type AnalysisPhaseScore = {
  name: string;
  score: number;
};

export type AnalysisResult = {
  summary: string;
  overallScore: number;
  symmetryScore: number;
  depthScore: number;
  barPathScore: number;
  phases: AnalysisPhaseScore[];
  recommendations: string[];
  processedAt: string;
};