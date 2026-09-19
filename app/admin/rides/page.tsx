import { getAdminRides } from "@/lib/actions/admin"
import { MapPin, Car } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminRidesPage() {
  const rides = await getAdminRides()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Global Rides</h1>
        <p className="text-slate-500 font-medium">View the history of all rides on the platform.</p>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Driver</th>
                <th className="px-6 py-4">Route</th>
                <th className="px-6 py-4">Fare</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rides.map((ride: any) => (
                <tr key={ride.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {ride.client_name || "Unknown"}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-700">
                    {ride.driver_name || <span className="text-slate-400 font-medium text-xs">Waiting...</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 max-w-[200px]">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium truncate">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                        <span className="truncate">{ride.pickup_address}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-900 font-bold truncate">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                        <span className="truncate">{ride.destination_address}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-black text-slate-900">{ride.total_fare} GMD</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                      ride.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 
                      ride.status === 'requested' ? 'bg-amber-50 text-amber-600' :
                      ride.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                      'bg-blue-50 text-blue-600'
                    }`}>
                      {ride.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 font-medium text-xs">
                    {new Date(ride.requested_at).toLocaleString('en-US', { 
                      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
                    })}
                  </td>
                </tr>
              ))}
              
              {rides.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400 font-medium">
                    No rides found.
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
