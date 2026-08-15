import { RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import api, { getApiError } from "../api/client.js";
import { addMonths, formatDate, toInputDate } from "../utils/date.js";
import Modal from "./Modal.jsx";

const fieldClass =
  "h-11 w-full rounded-lg border border-white/10 bg-white/10 px-3 text-sm text-slate-100 placeholder:text-slate-500 transition focus:border-teal-300";

export default function RenewModal({ member, plans, onClose, onRenewed, notify }) {
  const [selectedPlanId, setSelectedPlanId] = useState(plans[0]?._id || "");
  const [saving, setSaving] = useState(false);
  const today = toInputDate();
  const selectedPlan = useMemo(() => plans.find((plan) => plan._id === selectedPlanId), [plans, selectedPlanId]);
  const nextBillDate = selectedPlan ? addMonths(today, selectedPlan.duration) : null;

  const submit = async (event) => {
    event.preventDefault();

    if (!selectedPlan) {
      notify("Create an active plan before renewing", "error");
      return;
    }

    setSaving(true);

    try {
      const { data } = await api.post(`/members/renew/${member._id || member.id}`, {
        planName: selectedPlan.name,
        planDuration: selectedPlan.duration,
      });
      onRenewed(data.message);
    } catch (error) {
      notify(getApiError(error), "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Renew Subscription" onClose={onClose} width="max-w-lg">
      <form onSubmit={submit} className="grid gap-4">
        <div className="rounded-lg border border-white/10 px-4 py-3">
          <p className="font-semibold text-white">{member.name}</p>
          <p className="mt-1 text-sm text-slate-400">
            Current plan: {member.plan} / Next bill: {formatDate(member.nextBillDate)}
          </p>
        </div>

        <label className="grid gap-2 text-sm text-slate-300">
          Renewal Plan
          <select className={fieldClass} value={selectedPlanId} onChange={(event) => setSelectedPlanId(event.target.value)}>
            {plans.length === 0 && <option value="">No active plans</option>}
            {plans.map((plan) => (
              <option key={plan._id} value={plan._id}>
                {plan.name} / {plan.duration} months / Rs {Number(plan.price).toLocaleString("en-IN")}
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-white/10 px-4 py-3">
            <p className="text-sm text-slate-400">System Join Date</p>
            <p className="mt-1 font-semibold text-white">{formatDate(today)}</p>
          </div>
          <div className="rounded-lg border border-white/10 px-4 py-3">
            <p className="text-sm text-slate-400">Calculated Next Bill</p>
            <p className="mt-1 font-semibold text-teal-100">{nextBillDate ? formatDate(nextBillDate) : "Select a plan"}</p>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-white/10 pt-4">
          <button type="button" onClick={onClose} className="h-11 rounded-lg border border-white/10 px-4 text-sm font-semibold text-slate-200 transition hover:bg-white/10">
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-teal-300 px-4 text-sm font-semibold text-slate-950 transition hover:bg-teal-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw className="h-4 w-4" />
            {saving ? "Renewing..." : "Renew Now"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
