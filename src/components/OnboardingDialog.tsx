"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "~/components/ui/alert-dialog";

interface Props {
  open: boolean;
}

const OnboardingDialog = ({ open }: Props) => {
  const [storeName, setStoreName] = useState("");
  const 

  const handleSave = () => {
    console.log("Store name saved:", storeName);
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
          <form onSubmit={(e) => e.preventDefault()}>
            <Input
              placeholder="Organization Name"
              required
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
            />
          </form>
        </div>
        <AlertDialogFooter className="flex flex-col gap-4">
          <Button onClick={() => handleSave()} className="w-full">
            Create
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OnboardingDialog;
