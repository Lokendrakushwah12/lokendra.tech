"use client";

import { useState } from "react";
import { DollarSign, FileText, Clock, AlertCircle, Search, Plus, Download } from "lucide-react";

// Eval fixture: a deliberately generic invoice dashboard. It is the input for
// the "existing-web-dashboard" eval, not an example to follow.

type Status = "paid" | "pending" | "overdue";

const invoices: { id: string; client: string; amount: number; due: string; status: Status }[] = [
  { id: "INV-1042", client: "Northwind Traders", amount: 4200, due: "2026-11-28", status: "pending" },
  { id: "INV-1041", client: "Halcyon Studio", amount: 1850.5, due: "2026-11-12", status: "overdue" },
  { id: "INV-1040", client: "Kestrel & Vane Architects", amount: 12600, due: "2026-11-05", status: "paid" },
  { id: "INV-1039", client: "Marigold Bakery", amount: 320, due: "2026-11-02", status: "paid" },
  { id: "INV-1038", client: "Ostrander Logistics GmbH", amount: 7480, due: "2026-10-30", status: "overdue" },
];

const badge: Record<Status, string> = {
  paid: "bg-green-100 text-green-600",
  pending: "bg-yellow-100 text-yellow-600",
  overdue: "bg-red-100 text-red-600",
};

const money = (value: number) => "$" + value.toLocaleString();

export default function DashboardPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Status | "all">("all");
  const shown = invoices.filter(
    (i) => (filter === "all" || i.status === filter) && i.client.toLowerCase().includes(query.toLowerCase()),
  );
  const total = (s: Status) => invoices.filter((i) => i.status === s).reduce((a, i) => a + i.amount, 0);

  const stats = [
    { label: "Total Revenue", value: money(total("paid")), icon: DollarSign, color: "bg-green-100 text-green-600" },
    { label: "Pending", value: money(total("pending")), icon: Clock, color: "bg-yellow-100 text-yellow-600" },
    { label: "Overdue", value: money(total("overdue")), icon: AlertCircle, color: "bg-red-100 text-red-600" },
    { label: "Invoices", value: String(invoices.length), icon: FileText, color: "bg-blue-100 text-blue-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-white shadow-xl">
          <p className="text-sm opacity-80">Welcome back, Sam 👋</p>
          <h1 className="mt-1 text-3xl font-bold">Supercharge your invoicing ✨</h1>
          <p className="mt-2 opacity-90">Seamlessly track payments and get paid faster 🚀</p>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-white p-6 text-center shadow-lg transition hover:scale-105">
              <div className={"mx-auto flex h-12 w-12 items-center justify-center rounded-2xl " + s.color}>
                <s.icon className="h-6 w-6" />
              </div>
              <p className="mt-4 text-2xl font-bold">{s.value}</p>
              <p className="text-sm text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Invoices 📄</h2>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm shadow-md transition hover:scale-105">
                <Download className="h-4 w-4" /> Export CSV
              </button>
              <button className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-sm text-white shadow-lg transition hover:scale-105">
                <Plus className="h-4 w-4" /> New Invoice
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search clients..."
                className="w-full rounded-2xl border bg-gray-50 py-2 pl-9 pr-3 text-sm"
              />
            </div>
            {(["all", "paid", "pending", "overdue"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={"rounded-full px-4 py-2 text-sm capitalize " + (filter === f ? "bg-indigo-100 text-indigo-600" : "text-gray-500")}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-3">
            {shown.map((i) => (
              <div key={i.id} className="flex items-center justify-between rounded-2xl border bg-white p-4 shadow-md transition hover:scale-105">
                <div>
                  <p className="font-semibold">{i.client}</p>
                  <p className="text-sm text-gray-400">
                    {i.id} · Due {i.due}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-bold">{money(i.amount)}</p>
                  <span className={"rounded-full px-3 py-1 text-xs capitalize " + badge[i.status]}>{i.status}</span>
                </div>
              </div>
            ))}
            {shown.length === 0 && <p className="py-8 text-center text-gray-400">No invoices found 🔍</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
