"use client";
import { useEffect, useState } from "react";
import { addMember, subscribeTripMembers, TripMember } from "@/lib/firestore";
import { auth } from "@/lib/firebase";

export default function MembersTab({ tripId }: { tripId: string }) {
  const [members, setMembers] = useState<TripMember[]>([]);
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const unsub = subscribeTripMembers(tripId, setMembers);
    return () => unsub();
  }, [tripId]);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input className="border p-2 rounded" placeholder="Your phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <button
          className="px-3 py-2 rounded bg-blue-600 text-white"
          onClick={() => addMember(tripId, { uid: auth.currentUser?.uid || "", phone, role: "member" })}
        >
          Save
        </button>
      </div>
      <div className="space-y-2">
        {members.map((m) => (
          <div key={m.uid} className="p-2 border rounded flex justify-between">
            <div>
              <div className="font-medium">{m.displayName || m.uid}</div>
              {m.phone && <div className="text-sm text-gray-600">{m.phone}</div>}
            </div>
            <div className="text-xs text-gray-500">{m.role}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
