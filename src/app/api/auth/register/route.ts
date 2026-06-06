export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, phone, role, specialization, experience, consultationFee, bio } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        phone,
        role: role || "PATIENT",
        ...(role === "DOCTOR" && {
          doctorProfile: {
            create: {
              specialization,
              experience: parseInt(experience),
              consultationFee: parseFloat(consultationFee),
              bio,
            },
          },
        }),
      },
    });

    return NextResponse.json({ success: true, userId: user.id }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
