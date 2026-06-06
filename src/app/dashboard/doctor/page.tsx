export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import AddSlotForm from "@/components/AddSlotForm";
import { Video, Calendar, Clock, PawPrint, IndianRupee, Users } from "lucide-react";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-green-100 text-green-700",
  COMPLETED: "bg-blue-100 text-blue-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default async function DoctorDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  const userId = (session.user as any).id;
  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { userId },
    include: {
      appointments: {
        include: { patient: true, slot: true, payment: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!doctorProfile) redirect("/");

  type Appt = (typeof doctorProfile.appointments)[number];
  const confirmed = doctorProfile.appointments.filter((a: Appt) => a.status === "CONFIRMED").length;
  const revenue = doctorProfile.appointments
    .filter((a: Appt) => a.payment?.status === "paid")
    .reduce((sum: number, a: Appt) => sum + (a.payment?.amount || 0), 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
        <p className="text-gray-500">Welcome, Dr. {session.user?.name}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Appointments", value: doctorProfile.appointments.length, icon: <Calendar className="w-5 h-5 text-green-600" /> },
          { label: "Confirmed", value: confirmed, icon: <Users className="w-5 h-5 text-blue-600" /> },
          { label: "Revenue", value: `₹${revenue}`, icon: <IndianRupee className="w-5 h-5 text-purple-600" /> },
          { label: "Consultation Fee", value: `₹${doctorProfile.consultationFee}`, icon: <IndianRupee className="w-5 h-5 text-orange-600" /> },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-2">{stat.icon}<span className="text-sm text-gray-500">{stat.label}</span></div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Add Slots */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-600" /> Add Time Slots
          </h2>
          <AddSlotForm doctorId={doctorProfile.id} />
        </div>

        {/* Appointments */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" /> Appointments
          </h2>
          {doctorProfile.appointments.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <PawPrint className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No appointments yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {doctorProfile.appointments.map((appt: Appt) => (
                <div key={appt.id} className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{appt.patient.name}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {format(new Date(appt.slot.date), "MMM d")} at {appt.slot.startTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <PawPrint className="w-3.5 h-3.5" />
                          {appt.petName} ({appt.petType}, {appt.petAge})
                        </span>
                      </div>
                      {appt.symptoms && (
                        <p className="text-xs text-gray-400 mt-1">Symptoms: {appt.symptoms}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[appt.status]}`}>
                        {appt.status}
                      </span>
                      {appt.meetingLink && appt.status === "CONFIRMED" && (
                        <a
                          href={appt.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-700"
                        >
                          <Video className="w-3.5 h-3.5" />
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
      </div>
    </div>
  );
}
