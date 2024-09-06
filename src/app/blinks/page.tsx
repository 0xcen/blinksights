"use client";

import { useState } from "react";
import { Table } from "~/components/Table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import useBlinks from "~/hooks/useBlinks";
import { columns } from "./columns";
import { sortBlinksByDevAndProd } from "~/lib/utils";
import { useDevModeStore } from "~/store/devModeStore";
import { filterEventsByDevAndProd } from "~/lib/utils";

export default function Page() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const { blinks } = useBlinks({ page, pageSize });
  const devMode = useDevModeStore((state) => state.devMode);
  const blinksToDisplay = devMode ? blinks.data?.blinks.filter((blink) => blink.url.includes("localhost")) : blinks.data?.blinks.filter((blink) => !blink.url.includes("localhost"));

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when changing page size
  };

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Your Blinks</CardTitle>
        <CardDescription>
          View the performance of any of your blinks.
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table
          data={blinksToDisplay ?? []}
          columns={columns}
          pagination={{
            page,
            pageSize,
            total: blinksToDisplay?.length ?? 0,
            onPageChange: handlePageChange,
            onPageSizeChange: handlePageSizeChange,
          }}
        />
      </CardContent>
    </Card>
  );
}
