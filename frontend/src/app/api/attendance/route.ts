import { NextRequest, NextResponse } from "next/server";
import { attendance } from "@/lib/data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const classId = searchParams.get("classId");
  const date = searchParams.get("date");

  let filteredAttendance = [...attendance];

  if (classId) {
    filteredAttendance = filteredAttendance.filter(
      (a) => a.classId === parseInt(classId)
    );
  }

  if (date) {
    filteredAttendance = filteredAttendance.filter((a) => a.date === date);
  }

  return NextResponse.json(filteredAttendance);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const newAttendance = {
    id: attendance.length + 1,
    ...body,
  };
  attendance.push(newAttendance);
  return NextResponse.json(newAttendance, { status: 201 });
}
