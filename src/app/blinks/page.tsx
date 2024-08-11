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

export default function Page() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { blinks } = useBlinks({ page, pageSize });
  console.log("🚀 ~ Page ~ blinks:", blinks.data);

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
          data={blinks?.data?.blinks ?? []}
          columns={columns}
          pagination={{
            page,
            pageSize,
            total: blinks.data?.total ?? 0,
            onPageChange: handlePageChange,
            onPageSizeChange: handlePageSizeChange,
          }}
        />
      </CardContent>
    </Card>
  );
}
