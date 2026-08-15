import {
  CalendarClock,
  CircleDollarSign,
  Clock3,
  LogOut,
  Plus,
  RefreshCw,
  Timer,
  UserPlus,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import api, { getApiError } from "../api/client.js";
import DoughnutChart from "./DoughnutChart.jsx";
import MemberDirectory from "./MemberDirectory.jsx";
import MemberFormModal from "./MemberFormModal.jsx";
import PlanModal from "./PlanModal.jsx";

const metricMeta = [
  { key: "all", label: "Joined Members", icon: Users, accent: "text-teal-200", border: "border-teal-300/30" },
  { key: "monthly", label: "Monthly Joined", icon: CalendarClock, accent: "text-cyan-200", border: "border-cyan-300/30" },
  { key: "exp3", label: "Expiring in 3 Days", icon: Timer, accent: "text-amber-200", border: "border-amber-300/30" },
  { key: "exp47", label: "Expiring in 4-7 Days", icon: Clock3, accent: "text-lime-200", border: "border-lime-300/30" },
  { key: "expired", label: "Expired Tiers", icon: RefreshCw, accent: "text-rose-200", border: "border-rose-300/30" },
  { key: "inactive", label: "Inactive", icon: UserPlus, accent: "text-slate-200", border: "border-slate-400/30" },
];

const emptyMetrics = {
  cards: { all: 0, monthly: 0, exp3: 0, exp47: 0, expired: 0, inactive: 0 },
  composition: { activeMembership: 0, expiringSoon: 0, expired: 0, inactive: 0 },
};

export default function Dashboard({ owner, onLogout, notify }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [members, setMembers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 9, total: 0, totalPages: 1 });
  const [metrics, setMetrics] = useState(emptyMetrics);
  const [plans, setPlans] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [showPlanForm, setShowPlanForm] = useState(false);

  const activePlans = useMemo(() => plans.filter((plan) => plan.isActive), [plans]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  const loadPlans = useCallback(async () => {
    try {
      const { data } = await api.get("/plans");
      setPlans(data.plans || []);
    } catch (error) {
      notify(getApiError(error), "error");
    }
  }, [notify]);

  const loadMetrics = useCallback(async () => {
    try {
      const { data } = await api.get("/members/metrics");
      setMetrics(data);
    } catch (error) {
      notify(getApiError(error), "error");
    }
  }, [notify]);

  const loadMembers = useCallback(async () => {
    setLoadingMembers(true);

    try {
      const { data } = await api.get("/members/list", {
        params: { page, search, filter: activeFilter },
      });
      setMembers(data.members || []);
      setPagination(data.pagination || { page: 1, pageSize: 9, total: 0, totalPages: 1 });
    } catch (error) {
      notify(getApiError(error), "error");
    } finally {
      setLoadingMembers(false);
    }
  }, [activeFilter, page, search, notify]);

  const refreshWorkspace = useCallback(() => {
    setRefreshKey((value) => value + 1);
  }, []);

  useEffect(() => {
    loadPlans();
    loadMetrics();
  }, [loadPlans, loadMetrics, refreshKey]);

  useEffect(() => {
    const timer = window.setTimeout(loadMembers, 250);
    return () => window.clearTimeout(timer);
  }, [loadMembers, refreshKey]);

  const updateFilter = (filter) => {
    setActiveFilter(filter);
    setPage(1);
  };

  const togglePlan = async (plan) => {
    try {
      const { data } = await api.patch(`/plans/${plan._id}/toggle`);
      notify(data.message);
      refreshWorkspace();
    } catch (error) {
      notify(getApiError(error), "error");
    }
  };

  const afterMutation = (message) => {
    notify(message);
    refreshWorkspace();
  };

  return (
    <main className="min-h-screen px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 shadow-2xl backdrop-blur md:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={owner.logoUrl || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=160&q=80"}
              alt=""
              className="h-12 w-12 shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0">
              <p className="text-sm text-teal-200">{greeting}</p>
              <h1 className="truncate text-xl font-semibold text-white md:text-2xl">{owner.gymName}</h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowMemberForm(true)}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-teal-300 px-4 text-sm font-semibold text-slate-950 transition hover:bg-teal-200"
            >
              <UserPlus className="h-4 w-4" />
              Add New Member
            </button>
            <button
              type="button"
              onClick={() => setShowPlanForm(true)}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-4 text-sm font-semibold text-slate-100 transition hover:border-teal-300/60 hover:text-teal-100"
            >
              <Plus className="h-4 w-4" />
              Create Plan
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-slate-300 transition hover:border-rose-300/60 hover:text-rose-200"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          {metricMeta.map((metric) => {
            const Icon = metric.icon;
            const selected = activeFilter === metric.key;

            return (
              <button
                key={metric.key}
                type="button"
                onClick={() => updateFilter(metric.key)}
                className={`min-h-32 rounded-xl border bg-slate-950/75 p-4 text-left transition hover:-translate-y-0.5 hover:bg-slate-900/90 ${
                  selected ? `${metric.border} shadow-glow` : "border-white/10"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className={`grid h-10 w-10 place-items-center rounded-lg bg-white/10 ${metric.accent}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-3xl font-semibold text-white">{metrics.cards?.[metric.key] ?? 0}</span>
                </div>
                <p className="mt-4 text-sm leading-5 text-slate-300">{metric.label}</p>
              </button>
            );
          })}
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
          <div className="rounded-xl border border-white/10 bg-slate-950/75 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-teal-200">Composition</p>
                <h2 className="text-lg font-semibold text-white">Member Breakdown</h2>
              </div>
              <CircleDollarSign className="h-5 w-5 text-teal-200" />
            </div>
            <DoughnutChart composition={metrics.composition} />
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-950/75 p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-teal-200">Operational</p>
                <h2 className="text-lg font-semibold text-white">Membership Plans</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowPlanForm(true)}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-4 text-sm font-semibold text-slate-100 transition hover:border-teal-300/60 hover:text-teal-100"
              >
                <Plus className="h-4 w-4" />
                Add Plan
              </button>
            </div>
            <div className="grid gap-3">
              {plans.length === 0 ? (
                <div className="rounded-lg border border-dashed border-white/15 px-4 py-8 text-center text-sm text-slate-400">No plans yet</div>
              ) : (
                plans.map((plan) => (
                  <div key={plan._id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 px-4 py-3">
                    <div className="min-w-0">
                      <p className="font-medium text-white">{plan.name}</p>
                      <p className="text-sm text-slate-400">
                        {plan.duration} month{plan.duration > 1 ? "s" : ""} / Rs {Number(plan.price).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => togglePlan(plan)}
                      className={`h-9 rounded-lg px-3 text-sm font-semibold transition ${
                        plan.isActive ? "bg-teal-300 text-slate-950 hover:bg-teal-200" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {plan.isActive ? "Active" : "Paused"}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <MemberDirectory
          members={members}
          plans={activePlans}
          filter={activeFilter}
          search={search}
          pagination={pagination}
          loading={loadingMembers}
          onFilterChange={updateFilter}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          onPageChange={setPage}
          notify={notify}
          onMutated={refreshWorkspace}
        />
      </div>

      {showMemberForm && (
        <MemberFormModal
          plans={activePlans}
          onClose={() => setShowMemberForm(false)}
          onCreated={(message) => {
            setShowMemberForm(false);
            afterMutation(message);
          }}
          notify={notify}
        />
      )}

      {showPlanForm && (
        <PlanModal
          onClose={() => setShowPlanForm(false)}
          onCreated={(message) => {
            setShowPlanForm(false);
            afterMutation(message);
          }}
          notify={notify}
        />
      )}
    </main>
  );
}
