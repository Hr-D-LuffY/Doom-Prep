import type { RewatchPlan } from "./rewatch.interface";

export const updatePlanWatched = (
  plan: RewatchPlan,
  id: number,
  watched: boolean,
): RewatchPlan => {
  const order = plan.order.map((item) =>
    item.id === id ? { ...item, watched } : item,
  );
  const unwatched = order.filter((item) => !item.watched);

  return {
    ...plan,
    order,
    watchedCount: order.length - unwatched.length,
    remainingMinutes: unwatched.reduce((sum, item) => sum + item.runtime, 0),
  };
};
