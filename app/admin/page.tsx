import { getAdminStats } from "@/lib/actions/admin"
import { Wallet, Car, Users, BadgeCheck, TrendingUp } from "lucide-react"

export const dynamic = "force-dynamic" // Ensure fresh data on reload

export default async function AdminDashboardPage() {
  const stats = await getAdminStats()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Overview</h1>
        <p className="text-slate-500 font-medium">Welcome to the Seneba control center.</p>
      </div>

      {/* Financial Overview (The most important part for the owner) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Total Revenue */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-32 h-32 bg-slate-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <Wallet className="w-6 h-6" />
          </div>
          <h2 className="text-slate-500 font-bold text-sm mb-1">Total Platform Revenue</h2>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-black text-slate-900">{stats.totalRevenue.toLocaleString()} GMD</span>
          </div>
          <p className="text-xs text-slate-400 mt-2 font-medium">Total value of all completed rides</p>
        </div>

        {/* Company Commission (Seneba's Earnings) */}
        <div className="bg-slate-900 rounded-3xl p-6 shadow-md relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-32 h-32 bg-slate-800 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
          <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h2 className="text-slate-400 font-bold text-sm mb-1">Seneba Earnings (20% Commission)</h2>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-black text-white">{stats.totalCommission.toLocaleString()} GMD</span>
            <span className="text-emerald-400 font-bold text-sm bg-emerald-500/10 px-2 py-1 rounded-md mb-1">+100% Profit</span>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium">Money earned by the application owner</p>
        </div>
      </div>

      <h2 className="text-xl font-black text-slate-900 mb-4">Platform Stats</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Rides */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 block leading-tight">{stats.totalRides}</span>
            <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">Total Rides</span>
          </div>
        </div>

        {/* Clients */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 block leading-tight">{stats.totalClients}</span>
            <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">Registered Clients</span>
          </div>
        </div>

        {/* Drivers */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
            <BadgeCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 block leading-tight">{stats.totalDrivers}</span>
            <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">Approved Drivers</span>
          </div>
        </div>
      </div>
    </div>
  )
}
