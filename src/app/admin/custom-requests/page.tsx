import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { CustomRequestManager } from "@/components/admin/CustomRequestManager";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { authOptions } from "@/lib/auth";
import {
  BUDGET_RANGES,
  PIECE_TYPES,
  labelFor,
} from "@/lib/custom-requests";
import { isDemoMode } from "@/lib/demo-data";
import { listDemoCustomRequests } from "@/lib/demo-custom-requests";
import { prisma } from "@/lib/prisma";

export default async function AdminCustomRequestsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const requests = isDemoMode()
    ? listDemoCustomRequests()
    : await prisma.customRequest.findMany({
        orderBy: { createdAt: "desc" },
      });

  return (
    <div className="container-content py-12">
      <SectionHeading
        title="Custom requests"
        description="Inbox for made-to-order inquiries — quote, then convert to an order when ready."
      />

      {requests.length === 0 ? (
        <p className="mt-10 text-sm text-aubergine/60">No custom requests yet.</p>
      ) : (
        <div className="mt-10 space-y-8">
          <div className="overflow-x-auto border border-stone">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-stone text-nav text-aubergine/45">
                <tr>
                  <th className="p-4 font-normal">When</th>
                  <th className="p-4 font-normal">Customer</th>
                  <th className="p-4 font-normal">Piece</th>
                  <th className="p-4 font-normal">Budget</th>
                  <th className="p-4 font-normal">Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id} className="border-b border-stone/70">
                    <td className="p-4 text-xs text-aubergine/55">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div>{req.name}</div>
                      <div className="text-xs text-aubergine/50">{req.email}</div>
                    </td>
                    <td className="p-4">
                      {labelFor(PIECE_TYPES, req.pieceType)}
                    </td>
                    <td className="p-4">
                      {labelFor(BUDGET_RANGES, req.budget)}
                    </td>
                    <td className="p-4">{req.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-6">
            {requests.map((req) => (
              <CustomRequestManager
                key={req.id}
                request={{
                  ...req,
                  neededBy: req.neededBy,
                  createdAt: req.createdAt,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
