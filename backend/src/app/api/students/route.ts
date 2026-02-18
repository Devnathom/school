import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const classId = searchParams.get("classId");

    const students = await prisma.student.findMany({
      where: {
        AND: [
          search ? {
            OR: [
              { firstName: { contains: search } },
              { lastName: { contains: search } },
              { studentId: { contains: search } },
            ],
          } : {},
          classId ? { classId: parseInt(classId) } : {},
        ],
      },
      orderBy: { id: "asc" },
    });

    return NextResponse.json(students);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const count = await prisma.student.count();
    const student = await prisma.student.create({
      data: {
        studentId: `STD${String(count + 1).padStart(3, "0")}`,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        classId: body.classId ? parseInt(body.classId) : null,
        className: body.className,
        gender: body.gender,
        status: "active",
      },
    });
    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create student" }, { status: 500 });
  }
}
