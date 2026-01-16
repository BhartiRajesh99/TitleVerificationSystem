import { useNavigate } from "react-router";
import {
  InboxIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const mockRequests = [
  {
    id: "REQ-1023",
    name: "Raj Kumar",
    email: "raj@gov.in",
    organization: "Ministry of Education",
    message: "Requesting access for title verification testing.",
    status: "pending",
    date: "16 Jan 2026",
  },
  {
    id: "REQ-1022",
    name: "Anita Sharma",
    email: "anita@nic.in",
    organization: "NIC",
    message: "Unable to register due to restricted policy.",
    status: "approved",
    date: "15 Jan 2026",
  },
];

const statusStyles = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const AdminRequests = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Access Requests
          </h1>
          <p className="mt-1 text-slate-600">
            Requests submitted via Contact Admin form
          </p>
        </div>

        <button
          onClick={() => navigate("/admin")}
          className="rounded-xl cursor-pointer border border-slate-300
                     px-4 py-2 text-sm font-semibold
                     text-slate-700 hover:bg-slate-100">
          Back to Dashboard
        </button>
      </div>

      {/* Empty State */}
      {mockRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center
                        rounded-2xl border border-dashed border-slate-300
                        bg-white p-12 text-center">
          <InboxIcon className="h-12 w-12 text-slate-400 mb-3" />
          <p className="text-slate-600 font-medium">
            No requests received yet
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full border-collapse">
            <thead className="bg-slate-100 text-left text-sm text-slate-600">
              <tr>
                <th className="px-4 py-3">Request ID</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Organization</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 text-sm">
              {mockRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs">
                    {req.id}
                  </td>

                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-800">
                      {req.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {req.email}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-slate-700">
                    {req.organization}
                  </td>

                  <td className="px-4 py-3 max-w-xs truncate text-slate-600">
                    {req.message}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full
                                  px-3 py-1 text-xs font-semibold
                                  ${statusStyles[req.status]}`}
                    >
                      {req.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-slate-500">
                    {req.date}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        title="Approve"
                        className="rounded-lg border border-green-200
                                   p-2 text-green-600
                                   hover:bg-green-50">
                        <CheckCircleIcon className="h-5 w-5" />
                      </button>

                      <button
                        title="Reject"
                        className="rounded-lg border border-red-200
                                   p-2 text-red-600
                                   hover:bg-red-50">
                        <XCircleIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminRequests;
