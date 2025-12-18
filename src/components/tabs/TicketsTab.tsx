"use client";
import { useEffect, useState } from "react";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";

type Ticket = { url: string; name: string };

export default function TicketsTab({ tripId }: { tripId: string }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const base = ref(storage, `trips/${tripId}/tickets/`);
    listAll(base).then(async (res) => {
      const out: Ticket[] = [];
      for (const item of res.items) {
        const url = await getDownloadURL(item);
        out.push({ url, name: item.name });
      }
      setTickets(out);
    });
  }, [tripId]);

  async function onUpload(file: File) {
    const path = ref(storage, `trips/${tripId}/tickets/${Date.now()}_${file.name}`);
    await uploadBytes(path, file);
    const url = await getDownloadURL(path);
    setTickets((t) => [{ url, name: file.name }, ...t]);
  }

  return (
    <div className="space-y-3">
      <div>
        <input type="file" accept="image/*,application/pdf" onChange={(e) => e.target.files && onUpload(e.target.files[0])} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {tickets.map((t) => (
          <a key={t.url} href={t.url} target="_blank" className="border rounded overflow-hidden">
            {t.name.toLowerCase().endsWith(".pdf") ? (
              <div className="p-4">PDF: {t.name}</div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={t.url} alt={t.name} className="w-full h-40 object-cover" />
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
