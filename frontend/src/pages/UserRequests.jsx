import { useEffect, useState } from "react";
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import toast from "react-hot-toast";
import UserRequestsSkeleton from "../components/UserRequestSkeleton";

const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-amber-100 text-amber-700",
    icon: ClockIcon,
  },
  approved: {
    label: "Approved",
    color: "bg-green-100 text-green-700",
    icon: CheckCircleIcon,
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-100 text-red-700",
    icon: XCircleIcon,
  },
};

const UserRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);


  const apiurl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(`${apiurl}/requests/my-requests`, {
            withCredentials: true,
        });
        const data = res.data.requests
        console.log(data);
        setRequests(data);
      } catch (err) {
        console.error(err);
        toast.error(
          err.response?.data?.message || "Failed to fetch your requests"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-8">
      <h1 className="text-3xl font-extrabold text-slate-900">
        My Requests
      </h1>
      <p className="mt-1 mb-8 text-sm text-slate-600">
          Track the status of your access and registration requests
      </p>
      <UserRequestsSkeleton />
    </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-extrabold text-slate-900">
                My Requests
            </h1>
            <p className="mt-1 text-sm text-slate-600">
                Track the status of your access and registration requests
            </p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="rounded-xl cursor-pointer border border-slate-300
                     px-4 py-2 text-sm font-semibold
                     text-slate-700 hover:bg-slate-100">
          Back to Home
        </button>
      </div>

      {/* Empty State */}
      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center
                        rounded-2xl border border-dashed border-slate-300
                        bg-white p-12 text-center">
          <InboxIcon className="h-12 w-12 text-slate-400 mb-3" />
          <p className="text-slate-600 font-medium">
            You haven’t submitted any requests yet
          </p>
        </div>
      ) : (
        <div className="space-y-4 ">
          {requests.map((req) => {
            const StatusIcon = statusConfig[req.status].icon;

            return (
              <div
                key={req._id}
                className="flex flex-col sm:flex-row sm:items-center
                           justify-between gap-4
                           rounded-2xl border border-slate-200
                           bg-white px-6 py-4 shadow-sm"
              >
                {/* Left */}
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Request ID
                  </p>
                  <p className="text-xs font-mono text-slate-500">
                    {req._id}
                  </p>

                  <p className="mt-2 text-sm text-slate-600">
                    {req.message}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Submitted on{" "}
                    {new Date(req.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2">
                  <StatusIcon className="h-5 w-5 text-slate-600" />
                  <span
                    className={`rounded-full px-3 py-1
                                text-xs font-semibold
                                ${statusConfig[req.status].color}`}
                  >
                    {statusConfig[req.status].label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserRequests;
