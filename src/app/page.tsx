"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import useSWRInfinite from "swr/infinite";
import debounce from "lodash.debounce";
import { FiSearch, FiLoader } from "react-icons/fi";

import DesktopList from "@/app/components/desktopList";
import MobileList from "@/app/components/mobileList";
import { Advocate, ApiResponse } from "@/app/utils/types";
import { useIsDesktop } from "@/app/utils/useIsDesktop";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<keyof Advocate>("firstName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const take = 5;

  const getKey = useCallback<
    (pageIndex: number, prev: ApiResponse | null) => string | null
  >(
    (pageIndex, previous) => {
      if (previous && previous.data.length === 0) return null;
      const skip = pageIndex * take;
      const params = new URLSearchParams({
        search: searchTerm,
        skip: skip.toString(),
        take: take.toString(),
        sortBy,
        sortOrder,
      });
      return `/api/advocates?${params.toString()}`;
    },
    [searchTerm, sortBy, sortOrder],
  );

  const { data, error, size, setSize } = useSWRInfinite<ApiResponse>(
    getKey,
    (url) => fetch(url).then((r) => r.json()),
  );

  const advocates = (data ?? []).flatMap((p) => p.data);
  const total = data?.[0]?.total ?? 0;

  const isLoadingInitial = !data && !error;
  const isLoadingMore =
    isLoadingInitial || (!!data && typeof data[size - 1] === "undefined");
  const isReachingEnd = advocates.length >= total;

  const loadMore = useCallback(() => {
    if (isLoadingMore || isReachingEnd) return;
    setSize((s) => s + 1);
  }, [isLoadingMore, isReachingEnd, setSize]);

  // Debounce search input so that we don't query for every character typed
  const debounced = useMemo(
    () =>
      debounce((val: string) => {
        setSearchTerm(val);
        setSize(1);
      }, 300),
    [setSize],
  );
  useEffect(() => () => debounced.cancel(), [debounced]);

  // Enable column sorting
  const handleSort = (col: keyof Advocate) => {
    if (sortBy === col) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setSortOrder("asc");
    }
    setSize(1);
  };

  // Check if we're using desktop or mobile to do infinite scrolling
  const isDesktop = useIsDesktop();
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoadingMore || isReachingEnd) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: "200px",
      },
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }
    return () => observer.disconnect();
  }, [loadMore, isLoadingMore, isReachingEnd]);

  return (
    <main className="w-full mx-auto px-4 py-6">
      <header className="sticky top-0 bg-gray-50 py-4 z-10 border-b border-gray-200">
        <h1 className="text-2xl font-bold mb-4 text-center md:text-left">
          Solace Advocates
        </h1>
        <div className="flex items-center space-x-2">
          <FiSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, city, specialty…"
            onChange={(e) => debounced(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <span className="text-gray-600 whitespace-nowrap">
            Showing{" "}
            <strong className="text-blue-600">{advocates.length}</strong> /{" "}
            {total}
          </span>
        </div>
      </header>

      {error && (
        <div className="mt-6 text-red-600">Failed to load advocates.</div>
      )}
      {isLoadingInitial && (
        <div className="mt-6 flex items-center text-gray-500">
          <FiLoader className="animate-spin mr-2" /> Loading…
        </div>
      )}

      {isDesktop ? (
        <DesktopList
          advocates={advocates}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          sentinelRef={sentinelRef}
        />
      ) : (
        <MobileList advocates={advocates} sentinelRef={sentinelRef} />
      )}

      {isLoadingMore && !isLoadingInitial && (
        <div className="mt-6 flex items-center justify-center text-gray-500">
          <FiLoader className="animate-spin mr-2" /> Loading more…
        </div>
      )}
    </main>
  );
}
