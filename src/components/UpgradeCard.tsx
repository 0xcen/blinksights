import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { supportEmail } from "~/lib/constants";
import Link from "next/link";

export default function UpgradeCard() {
  return (
    <Card>
      <CardHeader className="p-3 md:p-4">
        <CardTitle>Blinksights is free for now!</CardTitle>
        <CardDescription>
        All we ask is that you give us your feedback and help us improve Blinksights.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
        <Link href={`mailto:${supportEmail}`}>
          <Button size="sm" className="w-full">
            Give Feedback
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
