export interface RewatchItem {
  id: number;
  title: string;
  runtime: number;
  watched: boolean;
}

export interface RewatchPlan {
  target: { id: number; title: string };
  order: RewatchItem[];
  totalCount: number;
  watchedCount: number;
  remainingMinutes: number;
}
