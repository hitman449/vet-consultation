export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Stethoscope, Star, Clock, IndianRupee } from "lucide-react";

export default async function DoctorsPage() {
  const doctors = await prisma.doctorProfile.findMany({
    where: { available: true },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  type Doctor = (typeof doctors)[number];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Veterinary Doctors</h1>
        <p className="text-gray-600">Choose from our certified veterinary specialists</p>
      </div>

      {doctors.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <Stethoscope className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg">No doctors available yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc: Doctor) => (
            <div key={doc.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6">
              {/* Avatar */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-xl">
                  {doc.user.name.charAt(0)}
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Dr. {doc.user.name}</h2>
                  <p className="text-green-600 text-sm font-medium">{doc.specialization}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-4 mb-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {doc.experience} yrs exp
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  4.8
                </span>
              </div>

              {/* Bio */}
              {doc.bio && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{doc.bio}</p>
              )}

              {/* Fee + Book */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="flex items-center gap-1 font-bold text-gray-900">
                  <IndianRupee className="w-4 h-4" />
                  {doc.consultationFee}
                  <span className="text-gray-500 font-normal text-sm">/session</span>
                </span>
                <Link
                  href={`/book/${doc.id}`}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
