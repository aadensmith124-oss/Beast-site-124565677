import { useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import {
  CARD_ATTRIBUTE_KEYS,
  type CardAttributeFilters,
  type CardAttributeKey,
} from "@/lib/card-filters";

export type CardsFilterValues = {
  country: string;
  state: string;
  zip: string;
  bin: string;
  brand: string;
  bank: string;
  refundable: "all" | "yes" | "no" | "unknown";
  priceMin: string;
  priceMax: string;
};

type FilterOption = { value: string; label: string };

type CardsFilterSheetProps = {
  filters: CardsFilterValues;
  attributeFilters: CardAttributeFilters;
  countries: FilterOption[];
  states: string[];
  brands: string[];
  banks: string[];
  resultCount: number;
  activeFilterCount: number;
  onChangeFilter: (key: keyof CardsFilterValues, value: string) => void;
  onChangeAttribute: (key: CardAttributeKey, value: CardAttributeFilters[CardAttributeKey]) => void;
  onClear: () => void;
  onClose: () => void;
};

const ATTRIBUTE_LABELS: Record<CardAttributeKey, string> = {
  email: "Email",
  phone: "Phone",
  name: "Name",
  fullAddress: "Full address",
  dob: "DOB",
  ssn: "SSN",
  ipAddress: "IP address",
  userAgent: "User agent",
};

function SelectField({
  label,
  value,
  options,
  onChange,
  testId,
}: {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
  testId: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="block text-base font-medium text-white/90">{label}</span>
      <span className="relative block">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-[54px] w-full appearance-none rounded-xl border border-white/20 bg-[#171717] px-4 pr-11 text-base text-white outline-none transition-colors focus:border-white/45"
          data-testid={testId}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
      </span>
    </label>
  );
}

function TextField({
  label,
  value,
  placeholder,
  onChange,
  testId,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  testId: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="block text-base font-medium text-white/90">{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-[54px] w-full rounded-xl border border-white/20 bg-[#171717] px-4 text-base text-white outline-none transition-colors placeholder:text-white/35 focus:border-white/45"
        data-testid={testId}
      />
    </label>
  );
}

function PriceFields({
  filters,
  onChange,
}: {
  filters: CardsFilterValues;
  onChange: CardsFilterSheetProps["onChangeFilter"];
}) {
  return (
    <div className="space-y-2">
      <p className="text-base font-medium text-white/90">Price</p>
      <div className="grid grid-cols-2 gap-3">
        <input
          type="number"
          min="0"
          step="0.01"
          value={filters.priceMin}
          onChange={(event) => onChange("priceMin", event.target.value)}
          placeholder="Minimum"
          aria-label="Minimum price"
          className="h-[54px] min-w-0 rounded-xl border border-white/20 bg-[#171717] px-4 text-base text-white outline-none placeholder:text-white/35 focus:border-white/45"
          data-testid="input-filter-price-min"
        />
        <input
          type="number"
          min="0"
          step="0.01"
          value={filters.priceMax}
          onChange={(event) => onChange("priceMax", event.target.value)}
          placeholder="Maximum"
          aria-label="Maximum price"
          className="h-[54px] min-w-0 rounded-xl border border-white/20 bg-[#171717] px-4 text-base text-white outline-none placeholder:text-white/35 focus:border-white/45"
          data-testid="input-filter-price-max"
        />
      </div>
    </div>
  );
}

export default function CardsFilterSheet({
  filters,
  attributeFilters,
  countries,
  states,
  brands,
  banks,
  resultCount,
  activeFilterCount,
  onChangeFilter,
  onChangeAttribute,
  onClear,
  onClose,
}: CardsFilterSheetProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const countryOptions = [
    { value: "", label: "All countries" },
    ...countries,
  ];
  const stateOptions = [
    { value: "", label: "All states" },
    ...states.map((state) => ({ value: state, label: state })),
  ];
  const brandOptions = [
    { value: "", label: "All brands" },
    ...brands.map((brand) => ({ value: brand, label: brand })),
  ];
  const bankOptions = [
    { value: "", label: "All banks" },
    ...banks.map((bank) => ({ value: bank, label: bank })),
  ];

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/75 sm:flex sm:items-center sm:justify-center sm:p-6"
      onClick={onClose}
      data-testid="cards-filter-backdrop"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="cards-filter-title"
        className="absolute inset-0 flex scale-[0.85] origin-center flex-col bg-[#090909] text-white shadow-2xl sm:relative sm:max-h-[calc(100vh-3rem)] sm:w-full sm:max-w-xl sm:rounded-2xl sm:border sm:border-white/15"
        onClick={(event) => event.stopPropagation()}
        data-testid="cards-filter-sheet"
      >
        <header className="flex h-[70px] shrink-0 items-center justify-between border-b border-white/10 px-6">
          <h2 id="cards-filter-title" className="text-xl font-semibold">Filters</h2>
          <div className="flex items-center gap-5">
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={onClear}
                className="text-sm text-white/55 transition-colors hover:text-white"
                data-testid="btn-clear-card-filters"
              >
                Clear all
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close filters"
              className="rounded-full p-1 text-white/65 transition-colors hover:bg-white/10 hover:text-white"
              data-testid="btn-close-card-filters"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 space-y-8 overflow-y-auto px-6 py-6 sm:px-8">
          <section aria-labelledby="filter-location-title" className="space-y-5">
            <h3 id="filter-location-title" className="border-t border-white/15 pt-4 text-base font-semibold">
              Location &amp; identifiers
            </h3>
            <SelectField
              label="Country"
              value={filters.country}
              options={countryOptions}
              onChange={(value) => onChangeFilter("country", value)}
              testId="filter-country"
            />
            <SelectField
              label="State"
              value={filters.state}
              options={stateOptions}
              onChange={(value) => onChangeFilter("state", value)}
              testId="filter-state"
            />
            <TextField
              label="ZIP"
              value={filters.zip}
              placeholder="ZIP code"
              onChange={(value) => onChangeFilter("zip", value)}
              testId="filter-zip"
            />
            <TextField
              label="BIN"
              value={filters.bin}
              placeholder="BIN or comma-separated"
              onChange={(value) => onChangeFilter("bin", value)}
              testId="filter-bin"
            />
          </section>

          <section aria-labelledby="filter-card-title" className="space-y-5">
            <h3 id="filter-card-title" className="border-t border-white/15 pt-4 text-base font-semibold">
              Card attributes
            </h3>
            <SelectField
              label="Brand"
              value={filters.brand}
              options={brandOptions}
              onChange={(value) => onChangeFilter("brand", value)}
              testId="filter-brand"
            />
            <SelectField
              label="Bank"
              value={filters.bank}
              options={bankOptions}
              onChange={(value) => onChangeFilter("bank", value)}
              testId="filter-bank"
            />
            <SelectField
              label="Refundable"
              value={filters.refundable}
              options={[
                { value: "all", label: "All" },
                { value: "yes", label: "Refundable" },
                { value: "no", label: "Not refundable" },
                { value: "unknown", label: "Not specified" },
              ]}
              onChange={(value) => onChangeFilter("refundable", value)}
              testId="filter-refundable"
            />
            <PriceFields filters={filters} onChange={onChangeFilter} />
          </section>

          <section aria-labelledby="filter-data-title" className="space-y-5">
            <h3 id="filter-data-title" className="border-t border-white/15 pt-4 text-base font-semibold">
              Data attributes
            </h3>
            {CARD_ATTRIBUTE_KEYS.map((key) => (
              <SelectField
                key={key}
                label={ATTRIBUTE_LABELS[key]}
                value={attributeFilters[key]}
                options={[
                  { value: "all", label: "All" },
                  { value: "present", label: "Present" },
                  { value: "missing", label: "Missing" },
                ]}
                onChange={(value) => onChangeAttribute(key, value as CardAttributeFilters[CardAttributeKey])}
                testId={`filter-attribute-${key}`}
              />
            ))}
          </section>
        </div>

        <footer className="shrink-0 border-t border-white/10 bg-[#090909] px-6 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="h-14 w-full rounded-xl bg-[#e8e8e8] text-lg font-semibold text-[#151515] transition-colors hover:bg-white"
            data-testid="btn-show-filtered-cards"
          >
            Show {resultCount} results
          </button>
        </footer>
      </section>
    </div>
  );
}
