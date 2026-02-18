import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "School Management System API",
    version: "1.0.0",
    endpoints: {
      students: "/api/students",
      teachers: "/api/teachers",
      classes: "/api/classes",
      subjects: "/api/subjects",
      attendance: "/api/attendance",
      grades: "/api/grades",
      dashboard: "/api/dashboard",
    },
  });
}
