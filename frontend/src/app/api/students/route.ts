import { NextRequest, NextResponse } from "next/server";
import { students } from "@/lib/data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const classId = searchParams.get("classId");

  let filteredStudents = [...students];

  if (search) {
    const searchLower = search.toLowerCase();
    filteredStudents = filteredStudents.filter(
      (s) =>
        s.firstName.toLowerCase().includes(searchLower) ||
        s.lastName.toLowerCase().includes(searchLower) ||
        s.studentId.toLowerCase().includes(searchLower)
    );
  }

  if (classId) {
    filteredStudents = filteredStudents.filter(
      (s) => s.classId === parseInt(classId)
    );
  }

  return NextResponse.json(filteredStudents);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const newStudent = {
    id: students.length + 1,
    studentId: `STD${String(students.length + 1).padStart(3, "0")}`,
    ...body,
    createdAt: new Date().toISOString().split("T")[0],
  };
  students.push(newStudent);
  return NextResponse.json(newStudent, { status: 201 });
}
