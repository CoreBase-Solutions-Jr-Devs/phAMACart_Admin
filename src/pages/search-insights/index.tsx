import { useState } from "react";
import { SearchX, TrendingUp } from "lucide-react";

import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetNoResultSearchesQuery,
  useGetTopSearchesQuery,
  type SearchTermCount,
} from "@/features/searchInsights/searchInsightsAPI";
import { formatNumber } from "@/lib/format-display";

const PAGE_SIZE = 20;

/** Ranked list with a bar scaled to the most frequent term. */
const TermBars = ({
  items,
  tone,
  offset = 0,
}: {
  items: SearchTermCount[];
  tone: "primary" | "amber";
  offset?: number;
}) => {
  const max = Math.max(1, ...items.map((i) => i.count));

  return (
    <ol className="space-y-2.5">
      {items.map((item, index) => (
        <li key={`${item.searchTerm}-${index}`} className="grid grid-cols-[1.5rem_1fr_auto] items-center gap-3">
          <span className="text-right text-xs tabular-nums text-muted-foreground">{offset + index + 1}</span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{item.searchTerm}</p>
            <div className="mt-1 h-1.5 rounded-full bg-muted">
              <div
                className={tone === "primary" ? "h-full rounded-full bg-primary" : "h-full rounded-full bg-amber-500"}
                style={{ width: `${(item.count / max) * 100}%` }}
              />
            </div>
          </div>
          <span className="text-sm font-semibold tabular-nums">{formatNumber(item.count)}</span>
        </li>
      ))}
    </ol>
  );
};

const ListSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 8 }, (_, i) => (
      <Skeleton key={i} className="h-8 w-full" />
    ))}
  </div>
);

const SearchInsights = () => {
  const [top, setTop] = useState("20");
  const [page, setPage] = useState(0);

  const topQuery = useGetTopSearchesQuery(Number(top));
  const noResults = useGetNoResultSearchesQuery({ pageIndex: page, pageSize: PAGE_SIZE });

  const noResultTotal = Number(noResults.data?.count ?? 0);
  const pageCount = Math.max(1, Math.ceil(noResultTotal / PAGE_SIZE));

  return (
    <PageLayout
      title="Search Insights"
      subtitle="What customers search for on the storefront, and what they can't find."
    >
      <div className="mx-auto mt-4 grid w-full max-w-[1600px] gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="size-4 text-primary" /> Top searches
              </CardTitle>
              <CardDescription>Most frequent search terms, all time.</CardDescription>
            </div>
            <Select value={top} onValueChange={setTop}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["10", "20", "50"].map((n) => (
                  <SelectItem key={n} value={n}>
                    Top {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {topQuery.isFetching && !topQuery.data ? (
              <ListSkeleton />
            ) : (topQuery.data?.data.length ?? 0) === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">No searches logged yet.</p>
            ) : (
              <TermBars items={topQuery.data!.data} tone="primary" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <SearchX className="size-4 text-amber-500" /> Searches with no results
            </CardTitle>
            <CardDescription>
              Demand you aren't meeting — candidates for new stock, synonyms or better product names.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {noResults.isFetching && !noResults.data ? (
              <ListSkeleton />
            ) : (noResults.data?.data.length ?? 0) === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                Every search found something. Nice.
              </p>
            ) : (
              <TermBars items={noResults.data!.data} tone="amber" offset={page * PAGE_SIZE} />
            )}

            {noResultTotal > PAGE_SIZE && (
              <div className="flex items-center justify-between border-t pt-3 text-sm text-muted-foreground">
                <span>
                  Page {page + 1} of {pageCount}
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= pageCount - 1}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default SearchInsights;
