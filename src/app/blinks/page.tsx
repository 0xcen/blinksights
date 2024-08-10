"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Table } from "../../components/Table";
import { columns } from "./columns";
import useBlinks from "../../hooks/useBlinks";

export interface Blink {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
}

export default function Page() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState<Blink[]>([]);
  const [total, setTotal] = useState(0);

  const { blinks } = useBlinks({ page, pageSize });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when changing page size
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Products</CardTitle>
        <CardDescription>
          Manage your products and view their sales performance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table
          data={blinks.data?.blinks ?? []}
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
