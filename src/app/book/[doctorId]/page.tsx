"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { Calendar, Clock, IndianRupee, Loader2, PawPrint } from "lucide-react";
import toast from "react-hot-toast";

interface Slot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

interface Doctor {
  id: string;
  specialization: string;
  consultationFee: number;
  bio: string;
  user: { name: string; email: string };
}

declare global {
  interface Window { Razorpay: any; }
}

export default function BookPage() {
  const { doctorId } = useParams<{ doctorId: string }>();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  const [petForm, setPetForm] = useState({
    petName: "",
    petType: "Dog",
    petAge: "",
    symptoms: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docRes, slotRes] = await Promise.all([
          fetch(`/api/doctors/${doctorId}`),
          fetch(`/api/doctors/${doctorId}/slots`),
        ]);
        const docData = await docRes.json();
        const slotData = await slotRes.json();
        setDoctor(docData);
        setSlots(slotData);
      } catch {
        toast.error("Failed to load doctor info");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [doctorId]);

  const handlePayAndBook = async () => {
    if (!selectedSlot) return toast.error("Please select a time slot");
    if (!petForm.petName || !petForm.petAge) return toast.error("Please fill pet details");

    setPaying(true);
    try {
      // Create Razorpay order
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId,
          slotId: selectedSlot,
          ...petForm,
        }),
      });
      const { orderId, amount, appointmentId } = await orderRes.json();

      // Load Razorpay script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);
      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount,
          currency: "INR",
          name: "VetCare",
          description: `Consultation with Dr. ${doctor?.user.name}`,
          order_id: orderId,
          handler: async (response: any) => {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                appointmentId,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              toast.success("Appointment booked successfully!");
              router.push("/dashboard/patient");
            } else {
              toast.error("Payment verification failed");
            }
          },
          prefill: {
            name: session?.user?.name,
            email: session?.user?.email,
          },
          theme: { color: "#16a34a" },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      };
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!doctor) return <div className="text-center py-20">Doctor not found</div>;

  const availableSlots = slots.filter((s) => !s.isBooked);
  const groupedSlots = availableSlots.reduce((acc: Record<string, Slot[]>, slot) => {
    const date = format(new Date(slot.date), "yyyy-MM-dd");
    if (!acc[date]) acc[date] = [];
    acc[date].push(slot);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Doctor Header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 flex items-center gap-5">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-2xl">
          {doctor.user.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dr. {doctor.user.name}</h1>
          <p className="text-green-600 font-medium">{doctor.specialization}</p>
          <p className="flex items-center gap-1 text-gray-700 font-semibold mt-1">
            <IndianRupee className="w-4 h-4" /> {doctor.consultationFee} / consultation
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Slot Selection */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" /> Select Time Slot
          </h2>
          {Object.keys(groupedSlots).length === 0 ? (
            <p className="text-gray-500 text-sm">No available slots. Please check back later.</p>
          ) : (
            Object.entries(groupedSlots).map(([date, daySlots]) => (
              <div key={date} className="mb-4">
                <p className="text-sm font-semibold text-gray-600 mb-2">
                  {format(new Date(date), "EEEE, MMM d")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {daySlots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot.id)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                        selectedSlot === slot.id
                          ? "bg-green-600 text-white border-green-600"
                          : "border-gray-200 text-gray-700 hover:border-green-400"
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      {slot.startTime}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pet Details */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
            <PawPrint className="w-5 h-5 text-green-600" /> Pet Details
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pet Name</label>
              <input
                type="text"
                value={petForm.petName}
                onChange={(e) => setPetForm({ ...petForm, petName: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                placeholder="e.g. Max"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pet Type</label>
              <select
                value={petForm.petType}
                onChange={(e) => setPetForm({ ...petForm, petType: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              >
                {["Dog", "Cat", "Bird", "Rabbit", "Fish", "Reptile", "Other"].map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pet Age</label>
              <input
                type="text"
                value={petForm.petAge}
                onChange={(e) => setPetForm({ ...petForm, petAge: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                placeholder="e.g. 2 years"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms (optional)</label>
              <textarea
                value={petForm.symptoms}
                onChange={(e) => setPetForm({ ...petForm, symptoms: e.target.value })}
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                placeholder="Describe your pet's symptoms..."
              />
            </div>
          </div>

          <button
            onClick={handlePayAndBook}
            disabled={paying || !selectedSlot}
            className="mt-6 w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {paying && <Loader2 className="w-4 h-4 animate-spin" />}
            {paying ? "Processing..." : `Pay ₹${doctor.consultationFee} & Book`}
          </button>
          <p className="text-xs text-gray-400 text-center mt-2">Secured by Razorpay</p>
        </div>
      </div>
    </div>
  );
}
