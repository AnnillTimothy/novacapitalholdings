import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { FileText, Shield, Tag, Clock, User, Search, Plus } from "lucide-react";

const categoryColors: Record<string, string> = {
  Legal: "bg-red-500/10 text-red-400 border-red-500/20",
  "M&A": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Investor Relations": "bg-sky-500/10 text-sky-400 border-sky-500/20",
  HR: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  Compliance: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Finance: "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

export default async function DocumentsPage() {
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";
  const isAnalystOrAbove =
    session?.user?.role === "ADMIN" ||
    session?.user?.role === "EXECUTIVE" ||
    session?.user?.role === "ANALYST";

  const documents = await prisma.document.findMany({
    where: isAdmin
      ? {}
      : isAnalystOrAbove
      ? {}
      : { isConfidential: false },
    orderBy: { createdAt: "desc" },
    include: {
      uploader: { select: { name: true, role: true } },
    },
  });

  const categories = [...new Set(documents.map((d) => d.category))];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-1">Documents</h1>
          <p className="text-slate-400">
            {documents.length} document{documents.length !== 1 ? "s" : ""} in
            your library
          </p>
        </div>
        {isAdmin && (
          <button className="btn-primary px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2">
            <Plus size={16} />
            Upload Document
          </button>
        )}
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          All ({documents.length})
        </div>
        {categories.map((cat) => (
          <div
            key={cat}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
              categoryColors[cat] ||
              "bg-slate-800 border-slate-700 text-slate-400"
            }`}
          >
            {cat} ({documents.filter((d) => d.category === cat).length})
          </div>
        ))}
      </div>

      {/* Documents Grid */}
      {documents.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <FileText size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-semibold">No documents found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className={`bg-slate-900/50 rounded-2xl p-5 border transition-all hover:border-slate-600/50 ${
                doc.isConfidential
                  ? "border-amber-500/20"
                  : "border-slate-800"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                  <FileText size={18} className="text-amber-400" />
                </div>
                <div className="flex items-center gap-2">
                  {doc.isConfidential && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <Shield size={11} className="text-amber-400" />
                      <span className="text-amber-400 text-xs font-semibold">
                        Confidential
                      </span>
                    </div>
                  )}
                  <span
                    className={`text-xs px-2 py-1 rounded-lg border ${
                      categoryColors[doc.category] ||
                      "bg-slate-800 border-slate-700 text-slate-400"
                    }`}
                  >
                    {doc.category}
                  </span>
                </div>
              </div>

              <h3 className="text-white font-bold mb-2 line-clamp-2">
                {doc.title}
              </h3>
              {doc.description && (
                <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                  {doc.description}
                </p>
              )}

              {doc.tags && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {doc.tags.split(",").slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 text-xs text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded"
                    >
                      <Tag size={9} />
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-600 pt-3 border-t border-slate-800">
                <div className="flex items-center gap-1">
                  <User size={11} />
                  <span>{doc.uploader.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={11} />
                  <span>{formatDate(doc.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
