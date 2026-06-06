export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ doctorId: string }> }) {
  try {
    const { doctorId } = await params;
    const slots = await prisma.timeSlot.findMany({
      where: {
        doctorId,
        date: { gte: new Date() },
      },
      orderBy: { date: "asc" },
    });
    return NextResponse.json(slots);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ doctorId: string }> }) {
  try {
    const { doctorId } = await params;
    const { date, startTime, endTime } = await req.json();
    const slot = await prisma.timeSlot.create({
      data: { doctorId, date: new Date(date), startTime, endTime },
    });
    return NextResponse.json(slot, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
