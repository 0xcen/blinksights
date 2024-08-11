import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
}

const BreadcrumbNav = ({ items }: BreadcrumbNavProps) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <BreadcrumbItem key={index}>
            {index > 0 && <BreadcrumbSeparator />}
            {item.path ? (
              <BreadcrumbLink href={item.path}>
                {item.label || (
                  <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
                )}
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage>
                {item.label || (
                  <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
                )}
              </BreadcrumbPage>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbNav;
