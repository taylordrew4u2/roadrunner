"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth, onAuthReady } from "@/lib/firebase";
import { addMember, subscribeInvite } from "@/lib/firestore";

export default function InviteJoinPage() {
  const params = useParams<{ token: string }>();
  const token = params.token;
  const router = useRouter();
  const [status, setStatus] = useState("Loading invite…");

  useEffect(() => {
    let unsub: () => void | undefined;
    onAuthReady().then(async () => {
      unsub = subscribeInvite(token, async (invite) => {
        if (!invite) {
          setStatus("Invite not found or expired.");
          return;
        }
        try {
          await addMember(invite.tripId, { uid: auth.currentUser?.uid || "", role: "member" });
          setStatus("Joined! Redirecting to trip…");
          setTimeout(() => router.replace(`/trip/${invite.tripId}`), 1000);
        } catch (e) {
          setStatus("Failed to join. Please try again.");
        }
      });
    });
    return () => { unsub && unsub(); };
  }, [token, router]);

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-white border rounded p-4 w-96 text-center">
        <h1 className="text-lg font-semibold">Trip Invite</h1>
        <div className="mt-2">{status}</div>
      </div>
    </div>
  );
}
