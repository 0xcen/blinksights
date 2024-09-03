"use client";

import { useState } from "react";
import TestEnvironment from "~/components/TestEnvironment";

export default function TestPage() {
  return (
    <div className="dark container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Test Environment</h1>
      <TestEnvironment />
    </div>
  );
}
