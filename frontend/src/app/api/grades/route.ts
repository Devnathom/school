import { NextRequest, NextResponse } from "next/server";
import { grades } from "@/lib/data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const classId = searchParams.get("classId");
  const subjectId = searchParams.get("subjectId");

  let filteredGrades = [...grades];

  if (classId) {
    filteredGrades = filteredGrades.filter((g) => g.classId === parseInt(classId));
  }

  if (subjectId) {
    filteredGrades = filteredGrades.filter((g) => g.subjectId === parseInt(subjectId));
  }

  return NextResponse.json(filteredGrades);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { midterm = 0, final = 0, assignment = 0 } = body;
  const total = midterm + final + assignment;
  
  let grade = "F";
  if (total >= 80) grade = "A";
  else if (total >= 75) grade = "B+";
  else if (total >= 70) grade = "B";
  else if (total >= 65) grade = "C+";
  else if (total >= 60) grade = "C";
  else if (total >= 55) grade = "D+";
  else if (total >= 50) grade = "D";

  const newGrade = {
    id: grades.length + 1,
    ...body,
    total,
    grade,
  };
  grades.push(newGrade);
  return NextResponse.json(newGrade, { status: 201 });
}
