export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Razorpay from "razorpay";
import { v4 as uuidv4 } from "uuid";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { doctorId, slotId, petName, petType, petAge, symptoms } = await req.json();
    const patientId = (session.user as any).id;

    const doctor = await prisma.doctorProfile.findUnique({ where: { id: doctorId } });
    if (!doctor) return NextResponse.json({ error: "Doctor not found" }, { status: 404 });

    // Generate unique Jitsi room
    const meetingLink = `https://meet.jit.si/vetcare-${uuidv4().slice(0, 8)}`;

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        slotId,
        petName,
        petType,
        petAge,
        symptoms,
        meetingLink,
        status: "PENDING",
      },
    });

    // Create Razorpay order
    const amount = Math.round(doctor.consultationFee * 100); // in paise
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: appointment.id,
    });

    // Save payment record
    await prisma.payment.create({
      data: {
        appointmentId: appointment.id,
        razorpayOrderId: order.id,
        amount: doctor.consultationFee,
      },
    });

    // Mark slot as booked
    await prisma.timeSlot.update({
      where: { id: slotId },
      data: { isBooked: true },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      appointmentId: appointment.id,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
