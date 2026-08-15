import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { useEffect } from "react";

const icons = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
};

const tones = {
  success: "border-teal-300/40 bg-teal-950/95 text-teal-50",
  error: "border-rose-300/40 bg-rose-950/95 text-rose-50",
  info: "border-sky-300/40 bg-sky-950/95 text-sky-50",
};

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timer = window.setTimeout(onClose, 4200);
    return () => window.clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) {
    return null;
  }

  const Icon = icons[toast.type] || Info;

  return (
    <div className="fixed right-4 top-4 z-50 w-[min(92vw,24rem)]">
      <div className={`flex items-start gap-3 rounded-lg border p-4 shadow-2xl backdrop-blur ${tones[toast.type] || tones.info}`}>
        <Icon className="mt-0.5 h-5 w-5 shrink-0" />
        <p className="min-w-0 flex-1 text-sm leading-6">{toast.message}</p>
        <button
          type="button"
          onClick={onClose}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-white/70 transition hover:bg-white/10 hover:text-white"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
