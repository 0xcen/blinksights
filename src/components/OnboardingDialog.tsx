"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";

import { Label } from "@radix-ui/react-label";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import useOrganizationMutations from "../hooks/useOrganizationMutations";

interface Props {
  open: boolean;
}

const OnboardingDialog = ({ open }: Props) => {
  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const { update } = useSession();

  const { createOrg } = useOrganizationMutations();

  const handleSave = async () => {
    await createOrg.mutateAsync({
      name: orgName,
      email,
    });
    await update();
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Welcome to BlinkSights</AlertDialogTitle>
          <AlertDialogDescription>
            Let&apos;s setup your organization.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="orgName">Organization Name</Label>
              <Input
                id="orgName"
                placeholder="Acme Corp"
                required
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Contact Email</Label>
              <Input
                id="email"
                placeholder="john@acme.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </form>
        </div>
        <AlertDialogFooter className="flex flex-col gap-4">
          <Button
            loading={createOrg.isPending}
            onClick={() => handleSave()}
            className="w-full"
          >
            Create
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OnboardingDialog;
