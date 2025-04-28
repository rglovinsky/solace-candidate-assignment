import React from "react";
import { Advocate } from "@/app/utils/types";
import { formatPhoneNumber } from "@/app/utils/formatPhoneNumber";

export type MobileListProps = {
  advocates: Advocate[];
  sentinelRef: React.Ref<HTMLDivElement>;
};

/**
 * MobileList returns the results list styled for screens smaller than 768px
 *
 * @param advocates - the list of advocate results
 * @param sentinelRef - the sentinel for infinite scroll to trigger
 * @constructor
 */
export default function MobileList({
  advocates,
  sentinelRef,
}: MobileListProps) {
  return (
    <div className="md:hidden grid gap-4 mt-6">
      {advocates.map((a) => (
        <div
          key={a.id}
          className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold">
                {a.firstName} {a.lastName}
              </h2>
              <p className="text-gray-500 text-sm">
                {a.city} • {a.degree}
              </p>
            </div>
            <span className="text-sm font-medium text-gray-400">
              {a.yearsOfExperience} yrs
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {a.specialties.map((s) => (
              <span
                key={s}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
              >
                {s}
              </span>
            ))}
          </div>
          <div className="mt-3 text-blue-600 font-medium">
            {formatPhoneNumber(a.phoneNumber)}
          </div>
        </div>
      ))}

      {/* Sentinel for infinite scroll */}
      <div ref={sentinelRef} style={{ height: 1 }} />
    </div>
  );
}
