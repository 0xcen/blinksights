export type ColumnConfig<T> = {
  header: string;
  accessorKey: keyof T;
  cell: (item: T) => React.ReactNode;
  className?: string;
};
