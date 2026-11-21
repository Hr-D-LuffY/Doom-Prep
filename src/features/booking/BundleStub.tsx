import { pluralize } from "../../utils/pluralize";
import type { BookingItem } from "./cinema.interface";

interface BundleStubProps {
  item: BookingItem;
}

export const BundleStub = ({ item }: BundleStubProps) => (
  <li className="relative flex overflow-hidden rounded-lg bg-reel text-pale">
    <div className="flex-1 px-5 py-4">
      <p className="font-display text-4xl font-semibold leading-none tabular-nums">
        {item.size}
      </p>
      <p className="mt-1 text-sm text-reel-soft">
        {pluralize(item.size, "seat").replace(/^\d+ /, "")} per bundle
      </p>
    </div>
    <div className="relative border-l-2 border-dashed border-reel-soft/50 px-5 py-4 text-right">
      <p className="font-display text-4xl font-semibold leading-none tabular-nums">
        {item.count}
      </p>
      <p className="mt-1 text-sm text-reel-soft">
        {item.count === 1 ? "bundle" : "bundles"} to buy
      </p>
      <span
        aria-hidden="true"
        className="absolute -left-2.5 -top-2.5 h-5 w-5 rounded-full bg-paper"
      />
      <span
        aria-hidden="true"
        className="absolute -bottom-2.5 -left-2.5 h-5 w-5 rounded-full bg-paper"
      />
    </div>
  </li>
);
