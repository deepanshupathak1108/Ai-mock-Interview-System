import { CalendarDays, MapPin, Phone, RefreshCw, ShieldCheck } from "lucide-react";
import { formatDate, getDueState } from "../utils/date.js";
import Modal from "./Modal.jsx";

export default function MemberInfoModal({ member, onClose, onToggleStatus, onRenew }) {
  const due = getDueState(member);

  return (
    <Modal title="Member Info" onClose={onClose} width="max-w-xl">
      <div className="grid gap-5">
        <div className="flex items-start gap-4">
          <img
            src={member.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=14b8a6&color=020617`}
            alt=""
            className="h-20 w-20 rounded-xl object-cover"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-2xl font-semibold text-white">{member.name}</h3>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-slate-200">{member.id}</span>
            </div>
            <p className="mt-1 text-sm text-slate-400">{member.plan}</p>
            <span
              className={`mt-3 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                due.isExpired ? "bg-rose-300/15 text-rose-100" : due.isSoon ? "bg-amber-300/15 text-amber-100" : "bg-teal-300/15 text-teal-100"
              }`}
            >
              {due.label}
            </span>
          </div>
        </div>

        <div className="grid gap-3 text-sm">
          <InfoRow icon={Phone} label="Mobile" value={member.phone} />
          <InfoRow icon={MapPin} label="Address" value={member.address || "Not provided"} />
          <InfoRow icon={CalendarDays} label="Joined" value={formatDate(member.joinDate)} />
          <InfoRow icon={CalendarDays} label="Next Bill" value={formatDate(member.nextBillDate)} />
          <InfoRow icon={ShieldCheck} label="Account Status" value={member.status} />
        </div>

        <div className="flex flex-wrap gap-2 border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={onToggleStatus}
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/10 px-4 text-sm font-semibold text-slate-100 transition hover:border-teal-300/60 hover:text-teal-100"
          >
            <ShieldCheck className="h-4 w-4" />
            Toggle Status
          </button>
          <button
            type="button"
            onClick={onRenew}
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-teal-300 px-4 text-sm font-semibold text-slate-950 transition hover:bg-teal-200"
          >
            <RefreshCw className="h-4 w-4" />
            Renew Subscription
          </button>
        </div>
      </div>
    </Modal>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-white/10 px-3 py-2">
      <span className="inline-flex items-center gap-2 text-slate-400">
        <Icon className="h-4 w-4" />
        {label}
      </span>
      <span className="text-right font-medium text-slate-100">{value}</span>
    </div>
  );
}
