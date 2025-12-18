"use client";
import { useEffect, useState } from "react";
import { addMember, subscribeTripMembers, TripMember } from "@/lib/firestore";
import { auth } from "@/lib/firebase";
import { UserPlus } from "lucide-react";

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
        <input className="input" placeholder="Your phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <button className="btn btn-primary" onClick={() => addMember(tripId, { uid: auth.currentUser?.uid || "", phone, role: "member" })}>
          <UserPlus size={16} />
          Save
        </button>
      </div>
      <div className="space-y-2">
        {members.map((m) => (
          <div key={m.uid} className="card p-3 flex justify-between">
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
