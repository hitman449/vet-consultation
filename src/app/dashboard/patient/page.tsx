export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";
import { Video, Calendar, PawPrint, Clock, IndianRupee } from "lucide-react";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-green-100 text-green-700",
  COMPLETED: "bg-blue-100 text-blue-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default async function PatientDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  const patientId = (session.user as any).id;
  const appointments = await prisma.appointment.findMany({
    where: { patientId },
    include: {
      doctor: { include: { user: true } },
      slot: true,
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });

  type Appt = (typeof appointments)[number];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-500">Welcome back, {session.user?.name}</p>
        </div>
        <Link
          href="/doctors"
          className="bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          + New Appointment
        </Link>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <PawPrint className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 text-lg mb-4">No appointments yet</p>
          <Link href="/doctors" className="text-green-600 font-medium hover:underline">
            Book your first consultation →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt: Appt) => (
            <div key={appt.id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-lg">
                    {appt.doctor.user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Dr. {appt.doctor.user.name}</p>
                    <p className="text-green-600 text-sm">{appt.doctor.specialization}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {format(new Date(appt.slot.date), "MMM d, yyyy")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {appt.slot.startTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <PawPrint className="w-3.5 h-3.5" />
                        {appt.petName} ({appt.petType})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[appt.status]}`}>
                    {appt.status}
                  </span>
                  <span className="flex items-center gap-1 text-sm font-medium text-gray-700">
                    <IndianRupee className="w-3.5 h-3.5" />
                    {appt.payment?.amount || appt.doctor.consultationFee}
                    {appt.payment?.status === "paid" && (
                      <span className="text-green-600 text-xs ml-1">✓ Paid</span>
                    )}
                  </span>
                  {appt.meetingLink && appt.status === "CONFIRMED" && (
                    <a
                      href={appt.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      <Video className="w-4 h-4" />
                      Join Call
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
