"use client";

import { useState } from "react";
import BlinkComponent from "./BlinkComponent";
import { ActionGetResponse } from "@solana/actions";
// Import necessary wallet connection hooks and components
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const DUMMY_ID1 = '123';
const DUMMY_ID2 = '123123';

export default function TestEnvironment() {
  const [actionData, setActionData] = useState("");
  const [url, setUrl] = useState("");
  const [actionLink, setActionLink] = useState("");
  const [memoLink, setMemoLink] = useState("");
  const [render, setRender] = useState(false);
  const { connected } = useWallet(); // Hook to check wallet connection status

  const handleSubmit = () => {
    try {
      const parsedAction = JSON.parse(
        stripJson(actionData),
      ) as ActionGetResponse;
      void saveActionDataToFile(parsedAction); // Marking the promise as intentionally ignored
    } catch (error) {
      console.error("Invalid JSON:", error);
      alert("Invalid JSON. Please check your input.");
    }
  };

  const stripJson = (json: string): string => {
    return json.replace(/[\n\r\t]/g, "").trim();
  };

  const saveActionDataToFile = async (data: ActionGetResponse) => {
    try {
      const response = await fetch("/api/save-action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      });

      if (!response.ok) {
        throw new Error("Failed to save action data");
      }

      setRender(true);
    } catch (error) {
      console.error("Error saving action data:", error);
      alert("Error saving action data. Please check the console for details.");
    }
  };

  // function replaceSearchParamsWithDummy(url: string): string {
  //   try {
  //     const urlObj = new URL(url);
  //     urlObj.searchParams.forEach((_, key) => {
  //       if (key === 'actionId') {
  //         urlObj.searchParams.set(key, DUMMY_ID1);
  //       } else {
  //         urlObj.searchParams.set(key, 'dummy');
  //       }
  //     });
  //     return urlObj.toString();
  //   } catch (error) {
  //     console.error("Invalid URL:", error);
  //     return url;
  //   }
  // }

  const testActionLink = async () => {
    try {
      console.log('Testing interaction tracking...', actionLink);
      const response = await fetch("/api/tests/track-renderV2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ actionUrl: actionLink }),
      });

      if (!response.ok) {
        throw new Error("Failed to save action data");
      }

      const result = await response.json();
      console.log("Yeeeeey!!!! There was no error tracking action data ", result);
    }catch(error){
      console.error("Error tracking action data:", error);
      alert("Error when tracking action. Please check the console for details.");
    }
  }

  const testMemoIxCreation = async () => {
    try {
      console.log('Testing memo Ix creation...', actionLink);
      const response = await fetch("/api/tests/track-conversion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ actionUrl:memoLink }),
      });

      if (!response.ok) {
        throw new Error("Failed to create memo ix");
      }

      const result = await response.json();
      console.log("Yeeeeey!!!! There was no error creating the memo transaction", result);
    }catch(error){
      console.error("Error creating memo ix:", error);
      alert("Error when tracking action. Please check the console for details.");
    }
  }

  const handlePost = async () => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: stripJson(actionData),
      });
      const result: unknown = await response.json();
      console.log("Post result:", result);
      alert("URL posted successfully");
    } catch (error) {
      console.error("Error posting URL:", error);
      alert("Error posting URL. Please check the console for details.");
    }
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="w-full md:w-1/2">
        {/* Wallet Connect Button */}
        <WalletMultiButton className="mb-4" />
        <textarea
          className="h-64 w-full rounded border p-2 text-black"
          value={actionData}
          onChange={(e) => setActionData(e.target.value)}
          placeholder="Enter JSON action data here"
        />
        <button
          className="mt-2 rounded bg-blue-500 px-4 py-2 text-white"
          onClick={handleSubmit}
        >
          Render
        </button>
        <input
          type="text"
          className="mt-4 w-full rounded border p-2 text-black"
          value={actionLink}
          onChange={(e) => setActionLink(e.target.value)}
          placeholder="Enter Action Link"
        />
        <button
          className="mt-2 rounded bg-blue-500 px-4 py-2 text-white"
          onClick={testActionLink}
        >
          Test Action Link
        </button>
        <input
          type="text"
          className="mt-4 w-full rounded border p-2 text-black"
          value={memoLink}
          onChange={(e) => setMemoLink(e.target.value)}
          placeholder="Enter URL"
        />
        <button
          className="mt-2 rounded bg-blue-500 px-4 py-2 text-white"
          onClick={testMemoIxCreation}
        >
          Create Memo Ix
        </button>
        <input
          type="text"
          className="mt-4 w-full rounded border p-2 text-black"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
        />
        <button
          className="mt-2 rounded bg-green-500 px-4 py-2 text-white"
          onClick={handlePost}
        >
          Post
        </button>
      </div>
      <div className="w-full md:w-1/2">{render && <BlinkComponent />}</div>
    </div>
  );
}
