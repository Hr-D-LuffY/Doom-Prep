import { useCallback, useState } from "react";
import { getRewatchPlan, updateMovie } from "../../api/movies.api";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { FilmStrip } from "../../components/ui/FilmStrip";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { Spinner } from "../../components/ui/Spinner";
import { useAsync } from "../../hooks/useAsync";
import { formatDuration } from "../../utils/formatDuration";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { RewatchFrame } from "./RewatchFrame";
import type { RewatchItem } from "./rewatch.interface";
import { updatePlanWatched } from "./updatePlanWatched";
import { EmptyState } from "../../components/ui/EmptyState";

interface RewatchPlanViewProps {
  targetId: number;
}

// Render this with key={targetId} so a new target starts fresh
export const RewatchPlanView = ({ targetId }: RewatchPlanViewProps) => {
  const load = useCallback(() => getRewatchPlan(targetId), [targetId]);
  const { data: plan, error, loading, reload, update } = useAsync(load);
  const [pendingIds, setPendingIds] = useState<number[]>([]);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleToggleWatched = async (item: RewatchItem) => {
    setActionError(null);
    setPendingIds((ids) => [...ids, item.id]);
    try {
      const updated = await updateMovie(item.id, { watched: !item.watched });
      update((current) =>
        updatePlanWatched(current, updated.id, updated.watched),
      );
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setPendingIds((ids) => ids.filter((id) => id !== item.id));
    }
  };

  if (plan === null) {
    return loading ? (
      <Spinner label="Building your rewatch plan..." />
    ) : (
      <ErrorMessage
        message={error ?? "Could not load the rewatch plan"}
        onRetry={reload}
      />
    );
  }

  if (plan.totalCount === 0) {
    return (
      <EmptyState>
        {plan.target.title} has no prerequisites, so there is nothing to watch
        first.
      </EmptyState>
    );
  }

  const remainingCount = plan.totalCount - plan.watchedCount;
  const isDone = remainingCount === 0;

  return (
    <div>
      <div className="mb-5">
        <h3 className="font-display text-2xl font-semibold leading-tight">
          Before {plan.target.title}
        </h3>

        <div className="mt-4 flex items-end justify-between gap-4">
          <p className="font-display text-3xl font-semibold leading-none">
            {plan.watchedCount} of {plan.totalCount} watched
          </p>
          <div className="text-right">
            <p className="font-display text-3xl font-semibold leading-none tabular-nums">
              {isDone ? "Done" : formatDuration(plan.remainingMinutes)}
            </p>
            <p className="mt-1 text-sm text-ink-soft">
              {isDone ? "Nothing left to watch" : "left to watch"}
            </p>
          </div>
        </div>

        <div className="mt-3">
          <ProgressBar
            value={plan.watchedCount}
            max={plan.totalCount}
            label="Movies watched before the target"
          />
        </div>

        {isDone && (
          <p className="mt-3 text-sm text-ink-soft">
            You have watched everything that comes before {plan.target.title}.
          </p>
        )}
      </div>

      {actionError && (
        <div className="mb-4">
          <ErrorMessage message={actionError} />
        </div>
      )}

      <FilmStrip ordered>
        {plan.order.map((item, index) => (
          <RewatchFrame
            key={item.id}
            position={index + 1}
            item={item}
            pending={pendingIds.includes(item.id)}
            onToggleWatched={handleToggleWatched}
          />
        ))}
      </FilmStrip>
    </div>
  );
};
