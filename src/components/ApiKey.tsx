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
import useApiKey from "../hooks/useApiKey";

export function ApiKey() {
  const [showKey, setShowKey] = useState(false);
  const { org, createApiKeyMutation } = useApiKey();

  const copyToClipboard = () => {
    if (org.data?.apiKey) {
      void navigator.clipboard.writeText(org.data?.apiKey);
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
          {org.data?.apiKey
            ? "Use the API key below to authenticate your requests. Remember to keep it secure and never share it publicly."
            : "Create an API key to start tracking events on your Blinks."}{" "}
        </CardDescription>
      </CardHeader>
      {org.data?.apiKey && (
        <div className="px-6 pb-4">
          <div className="relative">
            <Input
              type={showKey ? "text" : "password"}
              value={org?.data.apiKey}
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
        <Button
          loading={createApiKeyMutation.isPending}
          onClick={() => {
            if (!org.data?.apiKey) {
              createApiKeyMutation.mutate();
            } else {
              copyToClipboard();
            }
          }}
        >
          {org.data?.apiKey ? (
            <Copy className="mr-2 h-4 w-4" />
          ) : (
            <Plus className="mr-2 size-4" />
          )}
          {org.data?.apiKey ? "Copy API Key" : "Create new API Key"}
        </Button>
      </CardFooter>
    </Card>
  );
}
