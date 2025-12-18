"use client";
import { useEffect, useState } from "react";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { Upload } from "lucide-react";
import Image from "next/image";

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
      <div className="card p-3 flex items-center justify-between">
        <label htmlFor="ticketUpload" className="btn btn-outline cursor-pointer">
          <Upload size={16} />
          Upload Ticket
        </label>
        <input id="ticketUpload" className="sr-only" type="file" accept="image/*,application/pdf" onChange={(e) => e.target.files && onUpload(e.target.files[0])} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {tickets.map((t) => (
          <a key={t.url} href={t.url} target="_blank" className="card overflow-hidden">
            {t.name.toLowerCase().endsWith(".pdf") ? (
              <div className="p-4">PDF: {t.name}</div>
            ) : (
              <div className="relative w-full h-40">
                <Image src={t.url} alt={t.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
              </div>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
