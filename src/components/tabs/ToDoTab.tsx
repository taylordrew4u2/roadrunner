"use client";
import { useEffect, useState } from "react";
import { addTask, subscribeTasks, subscribeTaskChecks, toggleTaskCheck, Task } from "@/lib/firestore";
import { auth } from "@/lib/firebase";
import { Plus } from "lucide-react";

export default function ToDoTab({ tripId, members }: { tripId: string; members: { uid: string; displayName?: string }[] }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [checks, setChecks] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const unsub = subscribeTasks(tripId, setTasks);
    return () => unsub();
  }, [tripId]);

  useEffect(() => {
    const unsubs = tasks.map((t) => subscribeTaskChecks(tripId, t.id!, (uids) => setChecks((c) => ({ ...c, [t.id!]: uids }))));
    return () => unsubs.forEach((u) => u());
  }, [tasks, tripId]);

  const allMembers = members.map((m) => m.uid);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input className="input flex-1" placeholder="Add to-do" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
        <button
          className="btn btn-primary"
          onClick={() => {
            if (!newTitle) return;
            addTask(tripId, { title: newTitle, createdBy: auth.currentUser?.uid || "" });
            setNewTitle("");
          }}
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      <div className="space-y-2">
        {tasks.map((t) => {
          const checked = checks[t.id!] || [];
          const outstanding = allMembers.filter((uid) => !checked.includes(uid));
          const myChecked = checked.includes(auth.currentUser?.uid || "");
          return (
            <div key={t.id} className="card p-3">
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={myChecked} onChange={(e) => toggleTaskCheck(tripId, t.id!, auth.currentUser?.uid || "", e.target.checked)} />
                <div className="font-medium flex-1">{t.title}</div>
                <div className="text-sm text-gray-600">{checked.length}/{allMembers.length} checked</div>
              </div>
              {outstanding.length > 0 && (
                <div className="text-xs text-gray-600 mt-1">Waiting on {outstanding.length} users</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
