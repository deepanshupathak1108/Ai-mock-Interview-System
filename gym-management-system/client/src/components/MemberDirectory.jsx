import { ChevronLeft, ChevronRight, Eye, Phone, RefreshCw, Search } from "lucide-react";
import { useState } from "react";
import api, { getApiError } from "../api/client.js";
import { formatDate, getDueState } from "../utils/date.js";
import MemberInfoModal from "./MemberInfoModal.jsx";
import RenewModal from "./RenewModal.jsx";

const filters = [
  { key: "all", label: "Joined Members" },
  { key: "monthly", label: "Monthly Joined" },
  { key: "exp3", label: "Expiring 3 Days" },
  { key: "exp47", label: "Expiring 4-7 Days" },
  { key: "expired", label: "Expired" },
  { key: "inactive", label: "Inactive" },
];

const badgeClass = {
  teal: "bg-teal-300/15 text-teal-100 ring-teal-300/25",
  amber: "bg-amber-300/15 text-amber-100 ring-amber-300/25",
  rose: "bg-rose-300/15 text-rose-100 ring-rose-300/25",
  slate: "bg-slate-300/15 text-slate-100 ring-slate-300/25",
};

export default function MemberDirectory({
  members,
  plans,
  filter,
  search,
  pagination,
  loading,
  onFilterChange,
  onSearchChange,
  onPageChange,
  notify,
  onMutated,
}) {
  const [selected, setSelected] = useState(null);
  const [renewing, setRenewing] = useState(null);

  const toggleStatus = async (member) => {
    try {
      const { data } = await api.put(`/members/update-status/${member._id || member.id}`);
      notify(data.message);
      setSelected(data.member);
      onMutated();
    } catch (error) {
      notify(getApiError(error), "error");
    }
  };

  const openRenew = (member) => {
    setSelected(null);
    setRenewing(member);
  };

  const handleRenewed = (message) => {
    notify(message);
    setRenewing(null);
    setSelected(null);
    onMutated();
  };

  return (
    <section className="rounded-xl border border-white/10 bg-slate-950/75 p-5">
      <div className="mb-5 grid gap-4 xl:grid-cols-[22rem_1fr]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search name or mobile"
            className="h-11 w-full rounded-lg border border-white/10 bg-white/10 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-500 transition focus:border-teal-300"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => onFilterChange(item.key)}
              className={`h-11 rounded-lg border px-3 text-sm font-medium transition ${
                filter === item.key ? "border-teal-300 bg-teal-300 text-slate-950" : "border-white/10 bg-white/10 text-slate-300 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid min-h-80 place-items-center rounded-lg border border-dashed border-white/10 text-sm text-slate-400">Loading members...</div>
      ) : members.length === 0 ? (
        <div className="grid min-h-80 place-items-center rounded-lg border border-dashed border-white/10 text-sm text-slate-400">No members found</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {members.map((member) => {
            const due = getDueState(member);
            return (
              <article key={member._id} className="grid min-h-72 rounded-xl border border-white/10 bg-slate-900/65 p-4">
                <div className="flex items-start gap-3">
                  <img
                    src={member.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=14b8a6&color=020617`}
                    alt=""
                    className="h-14 w-14 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-white">{member.name}</h3>
                        <p className="text-sm text-slate-400">{member.id}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${badgeClass[due.tone]}`}>
                        {due.label}
                      </span>
                    </div>
                    <p className="mt-3 inline-flex items-center gap-2 text-sm text-slate-300">
                      <Phone className="h-4 w-4 text-slate-500" />
                      {member.phone}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 text-sm">
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-white/10 px-3 py-2">
                    <span className="text-slate-400">Plan</span>
                    <span className="font-medium text-white">{member.plan}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-white/10 px-3 py-2">
                    <span className="text-slate-400">Next Bill</span>
                    <span className={`font-medium ${due.isExpired ? "text-rose-200" : due.isSoon ? "text-amber-200" : "text-teal-100"}`}>
                      {formatDate(member.nextBillDate)}
                    </span>
                  </div>
                </div>

                <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
                  <button
                    type="button"
                    onClick={() => setSelected(member)}
                    className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 text-sm font-semibold text-slate-100 transition hover:border-teal-300/60 hover:text-teal-100"
                  >
                    <Eye className="h-4 w-4" />
                    View Info
                  </button>
                  {due.isExpired && (
                    <button
                      type="button"
                      onClick={() => openRenew(member)}
                      className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-rose-300 px-3 text-sm font-semibold text-slate-950 transition hover:bg-rose-200"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Renew
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-sm text-slate-400">
        <span>
          Page {pagination.page} of {pagination.totalPages} / {pagination.total} total
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(pagination.page - 1, 1))}
            disabled={pagination.page <= 1}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 px-3 font-medium text-slate-200 transition hover:border-teal-300/60 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </button>
          <button
            type="button"
            onClick={() => onPageChange(Math.min(pagination.page + 1, pagination.totalPages))}
            disabled={pagination.page >= pagination.totalPages}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 px-3 font-medium text-slate-200 transition hover:border-teal-300/60 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {selected && (
        <MemberInfoModal
          member={selected}
          onClose={() => setSelected(null)}
          onToggleStatus={() => toggleStatus(selected)}
          onRenew={() => openRenew(selected)}
        />
      )}

      {renewing && <RenewModal member={renewing} plans={plans} onClose={() => setRenewing(null)} onRenewed={handleRenewed} notify={notify} />}
    </section>
  );
}
