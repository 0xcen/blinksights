"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { FC } from "react";
import { Button } from "./ui/button";

const SignInButton: FC = () => {
  const { data: session } = useSession();

  if (session && session.user) {
    return (
      <>
        <pre>{JSON.stringify(session)}</pre>;
        <Button onClick={() => signOut()}>Sign Out</Button>
      </>
    );
  }
  return <Button onClick={() => signIn()}>Sign in</Button>;
};

export default SignInButton;
