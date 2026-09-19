import { getAdminUsers } from "@/lib/actions/admin"
import { Shield, User, Car } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminUsersPage() {
  const { clients, drivers } = await getAdminUsers()
  
  const allUsers = [...clients, ...drivers].sort((a: any, b: any) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Users Management</h1>
        <p className="text-slate-500 font-medium">View all registered clients and drivers.</p>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allUsers.map((user: any) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${user.role === 'driver' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                      {user.role === 'driver' ? <Car className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    {user.full_name}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-600">
                    +220 {user.phone}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      user.role === 'driver' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.role === 'driver' ? (
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold ${
                        user.status === 'online' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {user.status === 'online' ? 'Online' : 'Offline'}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs font-semibold">Active</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-400 font-medium text-xs">
                    {new Date(user.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              ))}
              
              {allUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400 font-medium">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
