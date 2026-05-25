import {
  ChevronDown,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import Gauge from "./Gauge";

function TogglePill({
  active,
  inactive,
}: {
  active: string;
  inactive: string;
}) {
  return (
    <div className="mt-4 flex rounded-full bg-neutral-100 p-1 text-[12px] font-medium text-neutral-500">
      <button className="flex-1 rounded-full bg-white px-3 py-1.5 text-neutral-950 shadow-sm">
        {active}
      </button>
      <button className="flex-1 rounded-full px-3 py-1.5">{inactive}</button>
    </div>
  );
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="text-[12px] font-medium text-neutral-700">{children}</label>;
}

function DropdownField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel>{label}</FieldLabel>
      <button className="flex items-center justify-between rounded-lg border border-neutral-200 px-3 py-2 text-left text-[13px] font-medium text-neutral-950">
        {value}
        <ChevronDown className="h-4 w-4 text-neutral-500" strokeWidth={2} />
      </button>
    </div>
  );
}

function InputField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel>{label}</FieldLabel>
      <div className="flex items-center rounded-lg border border-neutral-200 px-3 py-2 text-[13px] font-medium text-neutral-950">
        <span className="mr-2 text-neutral-400">#</span>
        <span>{value}</span>
      </div>
    </div>
  );
}

export default function DashboardPreview() {
  return (
    <div className="mx-auto w-full max-w-[880px] rounded-3xl bg-[#f5f2ee] p-4 sm:p-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        <article className="rounded-2xl bg-white p-5 text-left shadow-sm">
          <div className="flex items-center justify-between text-[13px] font-medium">
            <span className="text-[#ef4d23]">Clicks</span>
            <span className="text-neutral-500">This Month</span>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <strong className="text-[28px] leading-none font-semibold text-neutral-950">
              6,896
            </strong>
            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-600">
              <TrendingDown className="h-3 w-3" strokeWidth={2} />
              -3,382 (33%)
            </span>
          </div>

          <p className="mt-2 text-[12px] text-neutral-500">Compared to yesterday</p>
          <p className="mt-5 text-center text-[13px] font-medium text-neutral-700">
            Month Target achieved
          </p>
          <Gauge value={92} showLabels min="389K" max="425K" />
          <TogglePill active="Impressions" inactive="Clicks" />
        </article>

        <article className="flex flex-col gap-3 rounded-2xl bg-white p-5 text-left shadow-sm">
          <DropdownField label="Show figures for" value="This month" />
          <DropdownField label="Compare period by" value="Month-to-date (MTD)" />
          <InputField label="Ste targets (This month)" value="10" />
          <InputField label="Ste targets (This year)" value="100" />

          <div className="mt-1 flex items-center gap-4">
            <button className="rounded-lg bg-[#ef4d23] px-5 py-2 text-[13px] font-semibold text-white">
              Save
            </button>
            <button className="text-[13px] font-medium text-neutral-700 underline underline-offset-2">
              Cancel
            </button>
            <button aria-label="Close" className="ml-auto text-neutral-500">
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        </article>

        <article className="rounded-2xl bg-white p-5 text-left shadow-sm sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-[13px] font-medium">
            <span className="text-[#ef4d23]">Video Starts</span>
            <span className="text-neutral-500">today</span>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <strong className="text-[28px] leading-none font-semibold text-neutral-950">
              0
            </strong>
            <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold text-neutral-600">
              <TrendingUp className="h-3 w-3" strokeWidth={2} />0
            </span>
          </div>

          <p className="mt-2 text-[12px] text-neutral-500">Compared to yesterday</p>
          <div className="mt-5">
            <Gauge value={68} color="#9ca3af" />
          </div>
          <TogglePill active="Video Clicks" inactive="Video Starts" />
        </article>
      </div>
    </div>
  );
}
