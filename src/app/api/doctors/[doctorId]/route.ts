export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ doctorId: string }> }) {
  try {
    const { doctorId } = await params;
    const doctor = await prisma.doctorProfile.findUnique({
      where: { id: doctorId },
      include: { user: { select: { name: true, email: true } } },
    });
    if (!doctor) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(doctor);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
