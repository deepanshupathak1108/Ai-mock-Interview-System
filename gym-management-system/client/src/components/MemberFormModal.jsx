import { Save } from "lucide-react";
import { useMemo, useState } from "react";
import api, { getApiError } from "../api/client.js";
import { toInputDate } from "../utils/date.js";
import Modal from "./Modal.jsx";

const fieldClass =
  "h-11 w-full rounded-lg border border-white/10 bg-white/10 px-3 text-sm text-slate-100 placeholder:text-slate-500 transition focus:border-teal-300";

export default function MemberFormModal({ plans, onClose, onCreated, notify }) {
  const firstPlan = plans[0];
  const [selectedPlanId, setSelectedPlanId] = useState(firstPlan?._id || "");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    joinDate: toInputDate(),
    photo: "",
    status: "Active",
  });
  const [saving, setSaving] = useState(false);

  const selectedPlan = useMemo(() => plans.find((plan) => plan._id === selectedPlanId), [plans, selectedPlanId]);

  const submit = async (event) => {
    event.preventDefault();

    if (!selectedPlan) {
      notify("Create an active plan before adding a member", "error");
      return;
    }

    setSaving(true);

    try {
      const { data } = await api.post("/members/register", {
        ...form,
        planName: selectedPlan.name,
        planDuration: selectedPlan.duration,
      });
      onCreated(data.message);
    } catch (error) {
      notify(getApiError(error), "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Register Member" onClose={onClose}>
      <form onSubmit={submit} className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Full Name">
            <input className={fieldClass} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </Field>
          <Field label="Mobile Number">
            <input className={fieldClass} value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
          </Field>
          <Field label="Join Date">
            <input
              className={fieldClass}
              type="date"
              value={form.joinDate}
              onChange={(event) => setForm({ ...form, joinDate: event.target.value })}
            />
          </Field>
          <Field label="Status">
            <select className={fieldClass} value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
            </select>
          </Field>
          <Field label="Plan">
            <select className={fieldClass} value={selectedPlanId} onChange={(event) => setSelectedPlanId(event.target.value)}>
              {plans.length === 0 && <option value="">No active plans</option>}
              {plans.map((plan) => (
                <option key={plan._id} value={plan._id}>
                  {plan.name} / {plan.duration} months
                </option>
              ))}
            </select>
          </Field>
          <Field label="Photo URL">
            <input className={fieldClass} value={form.photo} onChange={(event) => setForm({ ...form, photo: event.target.value })} />
          </Field>
        </div>

        <Field label="Address">
          <textarea
            className="min-h-24 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-3 text-sm text-slate-100 placeholder:text-slate-500 transition focus:border-teal-300"
            value={form.address}
            onChange={(event) => setForm({ ...form, address: event.target.value })}
          />
        </Field>

        <div className="flex justify-end gap-2 border-t border-white/10 pt-4">
          <button type="button" onClick={onClose} className="h-11 rounded-lg border border-white/10 px-4 text-sm font-semibold text-slate-200 transition hover:bg-white/10">
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-teal-300 px-4 text-sm font-semibold text-slate-950 transition hover:bg-teal-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Member"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function Field({ label, children }) {
  return (
    <label className="grid gap-2 text-sm text-slate-300">
      {label}
      {children}
    </label>
  );
}
