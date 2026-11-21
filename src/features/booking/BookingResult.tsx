import { formatList } from "../../utils/formatList";
import { pluralize } from "../../utils/pluralize";
import { BundleStub } from "./BundleStub";
import type { BookingQuote, Cinema } from "./cinema.interface";

interface BookingResultProps {
  quote: BookingQuote;
  cinema: Cinema;
}

export const BookingResult = ({ quote, cinema }: BookingResultProps) => {
  if (!quote.possible) {
    return (
      <div className="rounded-lg border border-edge bg-surface px-5 py-4">
        <p className="font-display text-2xl font-semibold leading-tight">
          No exact combination for{" "}
          {pluralize(quote.groupSize, "person", "people")}
        </p>
        <p className="mt-2 text-sm text-ink-soft">
          {cinema.name} sells bundles of {formatList(cinema.bundleSizes)} seats,
          and no mix of them adds up to exactly {quote.groupSize}. Try a
          different group size or another cinema.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h4 className="font-display text-2xl font-semibold leading-tight">
        Buy {pluralize(quote.totalBundles, "bundle")} for{" "}
        {pluralize(quote.groupSize, "person", "people")}
      </h4>
      <p className="mt-1 text-sm text-ink-soft">
        Together they add up to exactly {pluralize(quote.groupSize, "seat")}, so
        no seat goes empty.
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {quote.breakdown.map((item) => (
          <BundleStub key={item.size} item={item} />
        ))}
      </ul>
    </div>
  );
};
