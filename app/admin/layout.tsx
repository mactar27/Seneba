import Link from "next/link"
import { BarChart3, Users, Car } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="p-6">
          <h1 className="text-2xl font-black text-white tracking-tight">Seneba Admin</h1>
          <p className="text-slate-400 text-xs mt-1">Owner Dashboard</p>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            Dashboard
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors">
            <Users className="w-5 h-5 text-emerald-400" />
            Users
          </Link>
          <Link href="/admin/rides" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors">
            <Car className="w-5 h-5 text-orange-400" />
            Rides
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="text-xs text-slate-500 font-medium">Logged in as Seneba Owner</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile Header */}
        <header className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between">
          <h1 className="text-lg font-black">Seneba Admin</h1>
          <div className="flex gap-4 text-xs font-semibold">
            <Link href="/admin">Home</Link>
            <Link href="/admin/users">Users</Link>
            <Link href="/admin/rides">Rides</Link>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
