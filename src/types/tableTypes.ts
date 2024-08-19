export type ColumnConfig<T> = {
  header: string;
  accessorKey: keyof T;
  cell: (item: T) => React.ReactNode;
  className?: string;
};

export type BlinkEvent = {
  id: string;
  blinkId: string;
  orgId: string;
  eventType: number;
  url: string | null;
  payerPubKey: string | null;
  actionIdentityKey: string | null;
  memo: string | null;
  timestamp: Date;
}
