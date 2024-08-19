import { ColumnConfig } from "~/types/tableTypes";
import { Blink, BlinkWithOrg } from "../../types/actions";
import { Eye } from "lucide-react";
import { Button } from "../../components/ui/button";

export const columns: ColumnConfig<BlinkWithOrg>[] = [
  {
    header: "Blink Url",
    accessorKey: "url",
    cell: (product) => <div>{product.url}</div>,
  },
  // {
  //   header: "Description",
  //   accessorKey: "description",
  //   cell: (product) => <div>{product.description}</div>,
  // },
  {
    header: "Created At",
    accessorKey: "createdAt",
    cell: (product) => (
      <div>
        {new Date(product.createdAt).toLocaleDateString(
          typeof window !== "undefined" ? window.navigator.language : "en-US",
          {
            day: "numeric",
            month: "numeric",
            year: "numeric",
          },
        )}
      </div>
    ),
  },
  {
    header: "",
    accessorKey: "id",
    cell: (product) => (
      <Button variant="ghost" href={`/blinks/${product.id}`}>
        <Eye className="mr-2 size-4" />
        View
      </Button>
    ),
  },
];
