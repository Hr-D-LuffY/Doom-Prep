import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { getBookingQuote } from "../../api/cinemas.api";
import { Button } from "../../components/ui/Button";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { inputClass } from "../../components/ui/fieldStyles";
import { FormField } from "../../components/ui/FormField";
import { Spinner } from "../../components/ui/Spinner";
import { formatList } from "../../utils/formatList";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { BookingResult } from "./BookingResult";
import type { BookingQuote, Cinema } from "./cinema.interface";
import { validateGroupSize } from "./cinema.validation";

interface BookingPanelProps {
  cinemas: Cinema[];
  cinema: Cinema;
  onSelectCinema: (id: number) => void;
}

type QuoteState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "done"; quote: BookingQuote; cinema: Cinema }
  | { status: "error"; message: string };

export const BookingPanel = ({
  cinemas,
  cinema,
  onSelectCinema,
}: BookingPanelProps) => {
  const [groupSize, setGroupSize] = useState("");
  const [groupSizeError, setGroupSizeError] = useState<string | undefined>(
    undefined,
  );
  const [state, setState] = useState<QuoteState>({ status: "idle" });

  const loading = state.status === "loading";
  // a result belongs to the cinema it was requested for, so hide it if another cinema is selected
  const showResult = state.status === "done" && state.cinema.id === cinema.id;

  const handleGroupSizeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setGroupSize(event.target.value);
    setGroupSizeError(undefined);
    setState({ status: "idle" });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = validateGroupSize(groupSize);
    setGroupSizeError(result.error);
    if (result.value === null) return;

    setState({ status: "loading" });
    try {
      const quote = await getBookingQuote(cinema.id, result.value);
      setState({ status: "done", quote, cinema });
    } catch (error) {
      setState({ status: "error", message: getErrorMessage(error) });
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-lg border border-line bg-surface p-5"
      >
        <h3 className="font-display text-2xl font-semibold leading-none">
          Get a booking quote
        </h3>
        <p className="mt-2 text-sm text-ink-soft">
          We find the fewest bundles that fill every seat exactly.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-[minmax(0,1fr)_11rem]">
          <FormField
            id="booking-cinema"
            label="Cinema"
            hint={`Sells bundles of ${formatList(cinema.bundleSizes)} seats.`}
          >
            <select
              id="booking-cinema"
              value={cinema.id}
              onChange={(event) => onSelectCinema(Number(event.target.value))}
              disabled={loading}
              aria-describedby="booking-cinema-hint"
              className={inputClass(false)}
            >
              {cinemas.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            id="booking-group-size"
            label="Group size"
            error={groupSizeError}
          >
            <input
              id="booking-group-size"
              type="text"
              inputMode="numeric"
              value={groupSize}
              onChange={handleGroupSizeChange}
              disabled={loading}
              placeholder="6"
              autoComplete="off"
              aria-invalid={Boolean(groupSizeError)}
              aria-describedby={
                groupSizeError ? "booking-group-size-error" : undefined
              }
              className={inputClass(Boolean(groupSizeError))}
            />
          </FormField>
        </div>

        <div className="mt-5">
          <Button type="submit" disabled={loading}>
            {loading ? "Checking..." : "Get quote"}
          </Button>
        </div>
      </form>

      <div aria-live="polite" className="mt-6">
        {state.status === "loading" && (
          <Spinner label="Working out the best bundles..." />
        )}
        {state.status === "error" && <ErrorMessage message={state.message} />}
        {showResult && (
          <BookingResult quote={state.quote} cinema={state.cinema} />
        )}
      </div>
    </div>
  );
};
