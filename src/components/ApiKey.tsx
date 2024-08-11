"use client";

import { Copy, CopyCheckIcon, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "./ui/input";
import { toast } from "./ui/use-toast";

export function ApiKey() {
  //   const { data: session } = useSession();
  const [showKey, setShowKey] = useState(false);

  // Mock session data for development purposes
  const mockSession = {
    org: {
      apiKey: "mock_api_key_12345",
    },
  };

  // Use the mock session instead of the real one
  const { data: session } = { data: mockSession } as {
    data: typeof mockSession;
  };

  const copyToClipboard = () => {
    if (session?.org?.apiKey) {
      void navigator.clipboard.writeText(session.org.apiKey);
      toast({
        title: "API Key Copied",
        description: "Remember to keep it secure and never share it publicly.",
        icon: <CopyCheckIcon className="size-4" />,
      });
    }
  };

  return (
    <Card className="sm:col-span-2">
      <CardHeader className="pb-3">
        <CardTitle>API Key</CardTitle>
        <CardDescription className="max-w-2xl text-balance leading-relaxed">
          {session?.org?.apiKey
            ? "Use the API key below to authenticate your requests. Remember to keep it secure and never share it publicly."
            : "Create an API key to start tracking events on your Blinks."}{" "}
        </CardDescription>
      </CardHeader>
      {session?.org?.apiKey && (
        <div className="px-6 pb-4">
          <div className="relative">
            <Input
              type={showKey ? "text" : "password"}
              value={session.org?.apiKey}
              readOnly
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2"
              onClick={() => setShowKey(!showKey)}
            >
              {showKey ? "Hide" : "Show"}
            </Button>
          </div>
        </div>
      )}
      <CardFooter>
        <Button onClick={copyToClipboard}>
          {session?.org?.apiKey ? (
            <Copy className="mr-2 h-4 w-4" />
          ) : (
            <Plus className="mr-2 size-4" />
          )}
          {session?.org?.apiKey ? "Copy API Key" : "Create new API Key"}
        </Button>
      </CardFooter>
    </Card>
  );
}
