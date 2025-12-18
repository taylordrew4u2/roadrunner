"use client";
import { useEffect, useState } from "react";
import { subscribeNotes, upsertNotes } from "@/lib/firestore";
import { auth } from "@/lib/firebase";
import { Save } from "lucide-react";

export default function NotesTab({ tripId }: { tripId: string }) {
  const [content, setContent] = useState("");

  useEffect(() => {
    const unsub = subscribeNotes(tripId, setContent);
    return () => unsub();
  }, [tripId]);

  return (
    <div className="space-y-2">
      <div className="card p-3">
        <textarea className="w-full h-60 input" value={content} onChange={(e) => setContent(e.target.value)} />
      </div>
      <div className="flex justify-end">
        <button className="btn btn-primary" onClick={() => upsertNotes(tripId, content, auth.currentUser?.uid || "")}>
          <Save size={16} />
          Save
        </button>
      </div>
    </div>
  );
}
