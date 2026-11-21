import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "../utils/getErrorMessage";

interface Settled<T> {
  load: () => Promise<T>;
  reloadKey: number;
  data: T | null;
  error: string | null;
}

interface AsyncResult<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  reload: () => void;
  update: (updater: (current: T) => T) => void;
}

export const useAsync = <T>(load: () => Promise<T>): AsyncResult<T> => {
  const [settled, setSettled] = useState<Settled<T> | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    load().then(
      (data) => {
        if (!cancelled) setSettled({ load, reloadKey, data, error: null });
      },
      (error: unknown) => {
        if (!cancelled) {
          setSettled((previous) => ({
            load,
            reloadKey,
            data: previous?.data ?? null,
            error: getErrorMessage(error),
          }));
        }
      },
    );

    return () => {
      cancelled = true;
    };
  }, [load, reloadKey]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  const update = useCallback((updater: (current: T) => T) => {
    setSettled((previous) =>
      previous && previous.data !== null
        ? { ...previous, data: updater(previous.data) }
        : previous,
    );
  }, []);

  const loading =
    settled === null ||
    settled.load !== load ||
    settled.reloadKey !== reloadKey;

  return {
    data: settled?.data ?? null,
    error: loading ? null : (settled?.error ?? null),
    loading,
    reload,
    update,
  };
};
