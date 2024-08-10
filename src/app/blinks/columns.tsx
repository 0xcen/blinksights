import { ColumnConfig } from "~/types/tableTypes";
import { Blink } from "./page";

export const columns: ColumnConfig<Blink>[] = [
  {
    header: "Name",
    accessorKey: "name",
    cell: (product) => <div>{product.name}</div>,
  },
  {
    header: "Description",
    accessorKey: "description",
    cell: (product) => <div>{product.description}</div>,
  },
  {
    header: "Created At",
    accessorKey: "createdAt",
    cell: (product) => <div>{product.createdAt.toLocaleDateString()}</div>,
  },
];
