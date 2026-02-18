"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ClipboardCheck, Save, Calendar, Users, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";

interface Student {
  id: number;
  studentId: string;
  firstName: string;
  lastName: string;
  status: "present" | "absent" | "late" | "leave" | null;
  note: string;
}

const classStudents: Record<string, Student[]> = {
  "1": [
    { id: 1, studentId: "STD001", firstName: "สมชาย", lastName: "ใจดี", status: null, note: "" },
    { id: 2, studentId: "STD002", firstName: "สมหญิง", lastName: "รักเรียน", status: null, note: "" },
    { id: 3, studentId: "STD003", firstName: "วิชัย", lastName: "เก่งมาก", status: null, note: "" },
    { id: 4, studentId: "STD004", firstName: "มานี", lastName: "สุขสันต์", status: null, note: "" },
    { id: 5, studentId: "STD005", firstName: "ปิติ", lastName: "ยินดี", status: null, note: "" },
  ],
  "2": [
    { id: 6, studentId: "STD006", firstName: "วารี", lastName: "น้ำใส", status: null, note: "" },
    { id: 7, studentId: "STD007", firstName: "ชูใจ", lastName: "แสนดี", status: null, note: "" },
    { id: 8, studentId: "STD008", firstName: "นราธิป", lastName: "สว่างใจ", status: null, note: "" },
  ],
};

const classes = [
  { id: "1", name: "ม.1/1" },
  { id: "2", name: "ม.1/2" },
  { id: "3", name: "ม.2/1" },
  { id: "4", name: "ม.2/2" },
  { id: "5", name: "ม.3/1" },
  { id: "6", name: "ม.3/2" },
];

export default function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  const handleClassChange = (classId: string) => {
    setSelectedClass(classId);
    setStudents(classStudents[classId] || []);
    setIsSaved(false);
  };

  const handleStatusChange = (studentId: number, status: Student["status"]) => {
    setStudents(students.map((s) =>
      s.id === studentId ? { ...s, status } : s
    ));
    setIsSaved(false);
  };

  const handleNoteChange = (studentId: number, note: string) => {
    setStudents(students.map((s) =>
      s.id === studentId ? { ...s, note } : s
    ));
    setIsSaved(false);
  };

  const handleMarkAll = (status: Student["status"]) => {
    setStudents(students.map((s) => ({ ...s, status })));
    setIsSaved(false);
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const getStatusBadge = (status: Student["status"]) => {
    switch (status) {
      case "present":
        return <Badge className="bg-green-500 hover:bg-green-600">มาเรียน</Badge>;
      case "absent":
        return <Badge variant="destructive">ขาดเรียน</Badge>;
      case "late":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">มาสาย</Badge>;
      case "leave":
        return <Badge className="bg-blue-500 hover:bg-blue-600">ลา</Badge>;
      default:
        return <Badge variant="secondary">ยังไม่เช็ค</Badge>;
    }
  };

  const summary = {
    total: students.length,
    present: students.filter((s) => s.status === "present").length,
    absent: students.filter((s) => s.status === "absent").length,
    late: students.filter((s) => s.status === "late").length,
    leave: students.filter((s) => s.status === "leave").length,
    unchecked: students.filter((s) => s.status === null).length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">เช็คชื่อนักเรียน</h1>
        <p className="text-muted-foreground">บันทึกการเข้าเรียนของนักเรียนประจำวัน</p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-[180px]"
          />
        </div>
        <Select value={selectedClass} onValueChange={handleClassChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="เลือกชั้นเรียน" />
          </SelectTrigger>
          <SelectContent>
            {classes.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedClass && students.length > 0 && (
        <>
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-5">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{summary.total}</p>
                    <p className="text-xs text-muted-foreground">นักเรียนทั้งหมด</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{summary.present}</p>
                    <p className="text-xs text-muted-foreground">มาเรียน</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-100">
                    <XCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{summary.absent}</p>
                    <p className="text-xs text-muted-foreground">ขาดเรียน</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-yellow-100">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{summary.late}</p>
                    <p className="text-xs text-muted-foreground">มาสาย</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <AlertCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{summary.leave}</p>
                    <p className="text-xs text-muted-foreground">ลา</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5" />
                รายชื่อนักเรียน {classes.find((c) => c.id === selectedClass)?.name}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleMarkAll("present")}>
                  <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                  มาทั้งหมด
                </Button>
                <Button onClick={handleSave} disabled={summary.unchecked > 0}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSaved ? "บันทึกแล้ว!" : "บันทึก"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">ลำดับ</TableHead>
                      <TableHead>รหัสนักเรียน</TableHead>
                      <TableHead>ชื่อ-นามสกุล</TableHead>
                      <TableHead className="text-center">สถานะ</TableHead>
                      <TableHead className="text-center">เช็คชื่อ</TableHead>
                      <TableHead>หมายเหตุ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student, index) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell className="font-mono">{student.studentId}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-medium text-primary">
                                {student.firstName[0]}
                              </span>
                            </div>
                            <span>{student.firstName} {student.lastName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {getStatusBadge(student.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-1">
                            <Button
                              variant={student.status === "present" ? "default" : "outline"}
                              size="sm"
                              className={student.status === "present" ? "bg-green-500 hover:bg-green-600" : ""}
                              onClick={() => handleStatusChange(student.id, "present")}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant={student.status === "absent" ? "default" : "outline"}
                              size="sm"
                              className={student.status === "absent" ? "bg-red-500 hover:bg-red-600" : ""}
                              onClick={() => handleStatusChange(student.id, "absent")}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant={student.status === "late" ? "default" : "outline"}
                              size="sm"
                              className={student.status === "late" ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                              onClick={() => handleStatusChange(student.id, "late")}
                            >
                              <Clock className="h-4 w-4" />
                            </Button>
                            <Button
                              variant={student.status === "leave" ? "default" : "outline"}
                              size="sm"
                              className={student.status === "leave" ? "bg-blue-500 hover:bg-blue-600" : ""}
                              onClick={() => handleStatusChange(student.id, "leave")}
                            >
                              <AlertCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Input
                            placeholder="หมายเหตุ..."
                            value={student.note}
                            onChange={(e) => handleNoteChange(student.id, e.target.value)}
                            className="h-8"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {!selectedClass && (
        <Card className="p-12">
          <div className="text-center">
            <ClipboardCheck className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">เลือกชั้นเรียน</h3>
            <p className="text-muted-foreground">กรุณาเลือกชั้นเรียนเพื่อเริ่มเช็คชื่อ</p>
          </div>
        </Card>
      )}
    </div>
  );
}
