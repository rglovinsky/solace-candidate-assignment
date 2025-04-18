import React from "react";
import { Advocate } from "@/app/utils/types";
import { formatPhoneNumber } from "@/app/utils/formatPhoneNumber";

export type DesktopListProps = {
  advocates: Advocate[];
  sortBy: keyof Advocate;
  sortOrder: "asc" | "desc";
  onSort: (column: keyof Advocate) => void;
  sentinelRef: React.Ref<HTMLDivElement>;
};

/**
 * DesktopList returns the results list styled for screens larger than 767px
 *
 * @param advocates - the list of advocate results
 * @param sortBy
 * @param sortOrder
 * @param onSort
 * @param sentinelRef - the sentinel for infinite scroll to trigger
 * @constructor
 */
export default function DesktopList({
  advocates,
  sortBy,
  sortOrder,
  onSort,
  sentinelRef,
}: DesktopListProps) {
  const columns = [
    { key: "firstName" as const, label: "First Name" },
    { key: "lastName" as const, label: "Last Name" },
    { key: "city" as const, label: "City" },
    { key: "degree" as const, label: "Degree" },
    { key: "specialties" as const, label: "Specialties" },
    { key: "yearsOfExperience" as const, label: "Years of Experience" },
    { key: "phoneNumber" as const, label: "Phone" },
  ];

  return (
    <div className="hidden md:block overflow-y-auto overflow-x-auto mt-6">
      <table className="min-w-full text-sm text-gray-700 bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr className="divide-x divide-gray-300">
            {columns.map(({ key, label }) => (
              <th
                key={key}
                onClick={() => onSort(key)}
                className="px-4 py-3 text-left text-xs font-semibold uppercase cursor-pointer select-none whitespace-nowrap"
              >
                <span className="inline-flex items-center space-x-1">
                  <span>{label}</span>
                  {sortBy === key ? (
                    <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                  ) : null}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {advocates.map((a) => (
            <tr
              key={a.id}
              className="border-b last:border-0 even:bg-gray-50 hover:bg-gray-100 transition"
            >
              <td className="px-4 py-2">{a.firstName}</td>
              <td className="px-4 py-2">{a.lastName}</td>
              <td className="px-4 py-2">{a.city}</td>
              <td className="px-4 py-2">{a.degree}</td>
              <td className="px-4 py-2">
                <div className="flex flex-wrap gap-1">
                  {a.specialties.map((s) => (
                    <span
                      key={s}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-2 text-center">{a.yearsOfExperience}</td>
              <td className="px-4 py-2 whitespace-nowrap">
                {formatPhoneNumber(a.phoneNumber)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Sentinel for infinite scroll */}
      <div ref={sentinelRef} style={{ height: 1 }} />
    </div>
  );
}
