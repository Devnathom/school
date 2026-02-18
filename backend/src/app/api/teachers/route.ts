import { NextRequest, NextResponse } from "next/server";
import { teachers } from "@/lib/data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const department = searchParams.get("department");

  let filteredTeachers = [...teachers];

  if (search) {
    const searchLower = search.toLowerCase();
    filteredTeachers = filteredTeachers.filter(
      (t) =>
        t.firstName.toLowerCase().includes(searchLower) ||
        t.lastName.toLowerCase().includes(searchLower) ||
        t.teacherId.toLowerCase().includes(searchLower)
    );
  }

  if (department) {
    filteredTeachers = filteredTeachers.filter((t) => t.department === department);
  }

  return NextResponse.json(filteredTeachers);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const newTeacher = {
    id: teachers.length + 1,
    teacherId: `TCH${String(teachers.length + 1).padStart(3, "0")}`,
    ...body,
    hireDate: new Date().toISOString().split("T")[0],
  };
  teachers.push(newTeacher);
  return NextResponse.json(newTeacher, { status: 201 });
}
