import { Save } from "lucide-react";
import { useState } from "react";
import api, { getApiError } from "../api/client.js";
import Modal from "./Modal.jsx";

const fieldClass =
  "h-11 w-full rounded-lg border border-white/10 bg-white/10 px-3 text-sm text-slate-100 placeholder:text-slate-500 transition focus:border-teal-300";

export default function PlanModal({ onClose, onCreated, notify }) {
  const [form, setForm] = useState({ name: "", duration: 3, price: 3999 });
  const [saving, setSaving] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const { data } = await api.post("/plans", form);
      onCreated(data.message);
    } catch (error) {
      notify(getApiError(error), "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Create Plan" onClose={onClose} width="max-w-lg">
      <form onSubmit={submit} className="grid gap-4">
        <label className="grid gap-2 text-sm text-slate-300">
          Plan Name
          <input className={fieldClass} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="3 Months" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm text-slate-300">
            Duration Months
            <input
              className={fieldClass}
              type="number"
              min="1"
              value={form.duration}
              onChange={(event) => setForm({ ...form, duration: event.target.value })}
            />
          </label>
          <label className="grid gap-2 text-sm text-slate-300">
            Price
            <input
              className={fieldClass}
              type="number"
              min="0"
              value={form.price}
              onChange={(event) => setForm({ ...form, price: event.target.value })}
            />
          </label>
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
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Plan"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
