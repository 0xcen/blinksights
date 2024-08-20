import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table as UITable,
} from "~/components/ui/table";
import { ColumnConfig } from "~/types/tableTypes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import NoDataAvailable from "~/components/NoDataAvailable";
import { useRouter } from "next/navigation"

interface TableProps<T> {
  data: T[];
  columns: ColumnConfig<T>[];
  actions?: (item: T) => React.ReactNode;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
  };
}

export function Table<T extends { id: string | number, url: string | null }>({
  data,
  columns,
  actions,
  pagination,
}: TableProps<T>) {
  const router = useRouter();
  const { page, pageSize, total, onPageChange, onPageSizeChange } = pagination;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      <div>
        <UITable>
          <TableHeader>
              {columns.map((column) => (
                <TableHead
                  key={column.accessorKey as string}
                  className={column.className}
                >
                  {column.header}
                </TableHead>
              ))}
              {actions && (
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              )}
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id} onClick={() => {
                console.log("clicked");
                router.push(`/blinks/${item.id}`);
              }}>
                {columns.map((column) => (
                  <TableCell
                    key={column.accessorKey as string}
                    className={column.className}
                  >
                    {column.cell(item)}
                  </TableCell>
                 ))}
                {actions && <TableCell>{actions(item)}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </UITable>
        {data.length === 0 && <NoDataAvailable />}
      </div>
      <div className="flex flex-col items-center justify-between space-y-2 py-4 sm:flex-row sm:space-x-2 sm:space-y-0">
        <div className="text-sm text-muted-foreground">
          Showing {(page - 1) * pageSize + 1} to{" "}
          {Math.min(page * pageSize, total)} of {total} entries
        </div>
        <div className="flex items-center space-x-2">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange(page - 1)}
                  isDisabled={page === 1}
                />
              </PaginationItem>
              {Array.from({ length: Math.min(5, totalPages) }).map(
                (_, index) => (
                  <PaginationItem
                    className="hidden sm:inline-block"
                    key={index + 1}
                  >
                    <PaginationLink
                      onClick={() => onPageChange(index + 1)}
                      isActive={page === index + 1}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}
              {totalPages > 5 && <PaginationEllipsis />}
              <PaginationItem>
                <PaginationNext
                  isDisabled={page === totalPages}
                  onClick={() => onPageChange(page + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
