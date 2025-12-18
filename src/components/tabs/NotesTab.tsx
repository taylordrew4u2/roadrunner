"use client";
import { useEffect, useState } from "react";
import { subscribeNotes, upsertNotes } from "@/lib/firestore";
import { auth } from "@/lib/firebase";

export default function NotesTab({ tripId }: { tripId: string }) {
  const [content, setContent] = useState("");

  useEffect(() => {
    const unsub = subscribeNotes(tripId, setContent);
    return () => unsub();
  }, [tripId]);

  return (
    <div className="space-y-2">
      <textarea className="w-full h-60 border rounded p-2" value={content} onChange={(e) => setContent(e.target.value)} />
      <div className="flex justify-end">
        <button className="px-3 py-2 rounded bg-blue-600 text-white" onClick={() => upsertNotes(tripId, content, auth.currentUser?.uid || "")}>Save</button>
      </div>
    </div>
  );
}
