"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, FileText, ChevronRight } from "lucide-react"; // Optional: lucide-react for icons

export default function Home() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/document")
      .then((res) => res.json())
      .then((data) => {
        setDocs(data);
        setLoading(false);
      });
  }, []);

  const createDoc = async () => {
    const res = await fetch("/api/document", {
      method: "POST",
      body: JSON.stringify({ title: "Untitled Document" }),
    });
    const doc = await res.json();
    router.push(`/editor/${doc.id}`);
  };

  const deleteDoc = async (id: string) => {
    // Optimistic UI update for a "snappy" feel
    const previousDocs = [...docs];
    setDocs((prev) => prev.filter((doc: any) => doc.id !== id));

    try {
      const res = await fetch(`/api/document/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
    } catch (err) {
      setDocs(previousDocs); // Rollback on error
      alert("Failed to delete document.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-slate-200 selection:bg-slate-800 selection:text-white">
      <main className="max-w-3xl mx-auto px-6 py-16">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-900 pb-8">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-white mb-2">
              My Documents
            </h1>
            <p className="text-slate-500 text-sm">
              Manage and organize your private workspace.
            </p>
          </div>

          <button
            onClick={createDoc}
            className=" cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-medium rounded-full hover:bg-slate-200 transition-all active:scale-95"
          >
            <Plus size={18} />
            New Document
          </button>
        </header>

        {/* Document List */}
        <div className="space-y-4">
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-slate-900/50 rounded-2xl" />
              ))}
            </div>
          ) : docs.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-slate-900 rounded-3xl">
              <p className="text-slate-500">No documents found. Start by creating one.</p>
            </div>
          ) : (
            docs.map((doc: any) => (
              <div
                key={doc.id}
                className="group relative flex items-center justify-between p-5 bg-slate-900/30 border border-slate-900 rounded-2xl hover:bg-slate-900/60 hover:border-slate-800 transition-all duration-300"
              >
                <div
                  className="flex items-center gap-4 cursor-pointer flex-1"
                  onClick={() => router.push(`/editor/${doc.id}`)}
                >
                  <div className="p-3 bg-slate-900 rounded-xl text-slate-400 group-hover:text-white transition-colors">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="text-slate-200 font-medium group-hover:text-white transition-colors">
                      {doc.title || "Untitled"}
                    </h3>
                    <p className="text-xs text-slate-600 uppercase tracking-widest mt-0.5">
                      ID: {doc.id.slice(0, 8)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => deleteDoc(doc.id)}
                    className="p-2.5 cursor-pointer text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label="Delete document"
                  >
                    <Trash2 size={18} />
                  </button>
                  <ChevronRight className="text-slate-700 cursor-pointer" size={18}

                    onClick={() => router.push(`/document/${doc.id}`)} />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Ethical Note */}
        <footer className="mt-20 pt-8 border-t border-slate-900 text-center">
          <p className="text-[10px] text-slate-700 uppercase tracking-[0.2em]">
            &copy; Mehtaab Aalam &bull; 2026 Studio
          </p>
        </footer>
      </main>
    </div>
  );
}