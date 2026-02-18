import { NextRequest, NextResponse } from "next/server";
import { classes } from "@/lib/data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get("level");

  let filteredClasses = [...classes];

  if (level) {
    filteredClasses = filteredClasses.filter((c) => c.level === level);
  }

  return NextResponse.json(filteredClasses);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const newClass = {
    id: classes.length + 1,
    ...body,
    studentCount: 0,
  };
  classes.push(newClass);
  return NextResponse.json(newClass, { status: 201 });
}
