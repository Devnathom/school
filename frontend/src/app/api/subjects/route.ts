import { NextRequest, NextResponse } from "next/server";
import { subjects } from "@/lib/data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const department = searchParams.get("department");

  let filteredSubjects = [...subjects];

  if (department) {
    filteredSubjects = filteredSubjects.filter((s) => s.department === department);
  }

  return NextResponse.json(filteredSubjects);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const newSubject = {
    id: subjects.length + 1,
    ...body,
  };
  subjects.push(newSubject);
  return NextResponse.json(newSubject, { status: 201 });
}
