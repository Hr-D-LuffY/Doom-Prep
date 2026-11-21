import { useState } from "react";
import { getCinemas } from "../../api/cinemas.api";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { PageHeader } from "../../components/ui/PageHeader";
import { Spinner } from "../../components/ui/Spinner";
import { useAsync } from "../../hooks/useAsync";
import { BookingPanel } from "./BookingPanel";
import { CinemaForm } from "./CinemaForm";
import type { Cinema } from "./cinema.interface";
import { EmptyState } from "../../components/ui/EmptyState";
export const BookingPage = () => {
  const {
    data: cinemas,
    error,
    loading,
    reload,
    update,
  } = useAsync(getCinemas);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleCreated = (cinema: Cinema) => {
    update((current) => [...current, cinema]);
    setSelectedId(cinema.id);
  };

  const renderMain = () => {
    if (cinemas === null) {
      return loading ? (
        <Spinner label="Loading cinemas..." />
      ) : (
        <ErrorMessage
          message={error ?? "Could not load cinemas"}
          onRetry={reload}
        />
      );
    }

    const cinema = cinemas.find((item) => item.id === selectedId) ?? cinemas[0];
    if (!cinema) {
      return (
        <EmptyState>
          No cinemas yet. Add one with the form to get a booking quote.
        </EmptyState>
      );
    }

    return (
      <BookingPanel
        cinemas={cinemas}
        cinema={cinema}
        onSelectCinema={setSelectedId}
      />
    );
  };

  return (
    <section>
      <PageHeader
        title="Booking"
        description="Pick a cinema and a group size to see which bundles to buy for opening night."
      />
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <div className="max-w-3xl">{renderMain()}</div>
        {cinemas !== null && (
          <aside className="lg:sticky lg:top-6 lg:max-h-[calc(100dvh-3rem)] lg:overflow-y-auto">
            <CinemaForm onCreated={handleCreated} />
          </aside>
        )}
      </div>
    </section>
  );
};
