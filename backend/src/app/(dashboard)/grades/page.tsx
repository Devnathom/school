"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FileSpreadsheet, Search, Pencil, TrendingUp, Award } from "lucide-react";

interface Grade {
  id: number;
  studentId: number;
  studentName: string;
  subjectId: number;
  subjectName: string;
  classId: number;
  className: string;
  semester: number;
  year: number;
  midterm: number;
  final: number;
  assignment: number;
  total: number;
  grade: string;
}

const initialGrades: Grade[] = [
  { id: 1, studentId: 1, studentName: "สมชาย ใจดี", subjectId: 1, subjectName: "วิทยาศาสตร์พื้นฐาน", classId: 1, className: "ม.1/1", semester: 1, year: 2567, midterm: 35, final: 40, assignment: 18, total: 93, grade: "A" },
  { id: 2, studentId: 1, studentName: "สมชาย ใจดี", subjectId: 2, subjectName: "คณิตศาสตร์พื้นฐาน", classId: 1, className: "ม.1/1", semester: 1, year: 2567, midterm: 30, final: 35, assignment: 15, total: 80, grade: "A" },
  { id: 3, studentId: 2, studentName: "สมหญิง รักเรียน", subjectId: 1, subjectName: "วิทยาศาสตร์พื้นฐาน", classId: 1, className: "ม.1/1", semester: 1, year: 2567, midterm: 38, final: 42, assignment: 20, total: 100, grade: "A" },
  { id: 4, studentId: 2, studentName: "สมหญิง รักเรียน", subjectId: 2, subjectName: "คณิตศาสตร์พื้นฐาน", classId: 1, className: "ม.1/1", semester: 1, year: 2567, midterm: 25, final: 30, assignment: 12, total: 67, grade: "B" },
  { id: 5, studentId: 3, studentName: "วิชัย เก่งมาก", subjectId: 1, subjectName: "วิทยาศาสตร์พื้นฐาน", classId: 2, className: "ม.1/2", semester: 1, year: 2567, midterm: 28, final: 32, assignment: 14, total: 74, grade: "B+" },
  { id: 6, studentId: 4, studentName: "มานี สุขสันต์", subjectId: 1, subjectName: "วิทยาศาสตร์พื้นฐาน", classId: 2, className: "ม.1/2", semester: 1, year: 2567, midterm: 22, final: 25, assignment: 10, total: 57, grade: "C+" },
  { id: 7, studentId: 5, studentName: "ปิติ ยินดี", subjectId: 1, subjectName: "วิทยาศาสตร์พื้นฐาน", classId: 3, className: "ม.2/1", semester: 1, year: 2567, midterm: 40, final: 45, assignment: 20, total: 105, grade: "A" },
];

const classes = [
  { id: 1, name: "ม.1/1" },
  { id: 2, name: "ม.1/2" },
  { id: 3, name: "ม.2/1" },
  { id: 4, name: "ม.2/2" },
];

const subjects = [
  { id: 1, name: "วิทยาศาสตร์พื้นฐาน" },
  { id: 2, name: "คณิตศาสตร์พื้นฐาน" },
  { id: 3, name: "ภาษาอังกฤษพื้นฐาน" },
  { id: 4, name: "ภาษาไทย" },
];

export default function GradesPage() {
  const [grades, setGrades] = useState<Grade[]>(initialGrades);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState<string>("all");
  const [filterSubject, setFilterSubject] = useState<string>("all");
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    midterm: "",
    final: "",
    assignment: "",
  });

  const filteredGrades = grades.filter((grade) => {
    const matchesSearch = grade.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === "all" || grade.classId.toString() === filterClass;
    const matchesSubject = filterSubject === "all" || grade.subjectId.toString() === filterSubject;
    return matchesSearch && matchesClass && matchesSubject;
  });

  const calculateGrade = (total: number): string => {
    if (total >= 80) return "A";
    if (total >= 75) return "B+";
    if (total >= 70) return "B";
    if (total >= 65) return "C+";
    if (total >= 60) return "C";
    if (total >= 55) return "D+";
    if (total >= 50) return "D";
    return "F";
  };

  const handleEdit = (grade: Grade) => {
    setEditingGrade(grade);
    setFormData({
      midterm: grade.midterm.toString(),
      final: grade.final.toString(),
      assignment: grade.assignment.toString(),
    });
    setIsEditDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!editingGrade) return;

    const midterm = parseInt(formData.midterm) || 0;
    const final = parseInt(formData.final) || 0;
    const assignment = parseInt(formData.assignment) || 0;
    const total = midterm + final + assignment;
    const grade = calculateGrade(total);

    setGrades(grades.map((g) =>
      g.id === editingGrade.id
        ? { ...g, midterm, final, assignment, total, grade }
        : g
    ));
    setIsEditDialogOpen(false);
    setEditingGrade(null);
  };

  const getGradeBadgeColor = (grade: string) => {
    switch (grade) {
      case "A": return "bg-green-500 hover:bg-green-600";
      case "B+": return "bg-lime-500 hover:bg-lime-600";
      case "B": return "bg-yellow-500 hover:bg-yellow-600";
      case "C+": return "bg-orange-500 hover:bg-orange-600";
      case "C": return "bg-orange-600 hover:bg-orange-700";
      case "D+": return "bg-red-400 hover:bg-red-500";
      case "D": return "bg-red-500 hover:bg-red-600";
      case "F": return "bg-red-700 hover:bg-red-800";
      default: return "";
    }
  };

  // Statistics
  const stats = {
    totalRecords: filteredGrades.length,
    averageScore: filteredGrades.length > 0
      ? (filteredGrades.reduce((sum, g) => sum + g.total, 0) / filteredGrades.length).toFixed(1)
      : 0,
    gradeA: filteredGrades.filter((g) => g.grade === "A").length,
    passRate: filteredGrades.length > 0
      ? ((filteredGrades.filter((g) => g.total >= 50).length / filteredGrades.length) * 100).toFixed(1)
      : 0,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">จัดการเกรด</h1>
        <p className="text-muted-foreground">บันทึกและจัดการผลการเรียนของนักเรียน</p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <FileSpreadsheet className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalRecords}</p>
                <p className="text-xs text-muted-foreground">รายการทั้งหมด</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.averageScore}</p>
                <p className="text-xs text-muted-foreground">คะแนนเฉลี่ย</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <Award className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.gradeA}</p>
                <p className="text-xs text-muted-foreground">เกรด A</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.passRate}%</p>
                <p className="text-xs text-muted-foreground">อัตราผ่าน</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            ผลการเรียน
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหานักเรียน..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterClass} onValueChange={setFilterClass}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="ชั้นเรียน" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกชั้นเรียน</SelectItem>
                {classes.map((c) => (
                  <SelectItem key={c.id} value={c.id.toString()}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterSubject} onValueChange={setFilterSubject}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="วิชา" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกวิชา</SelectItem>
                {subjects.map((s) => (
                  <SelectItem key={s.id} value={s.id.toString()}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>นักเรียน</TableHead>
                  <TableHead>ชั้น</TableHead>
                  <TableHead>วิชา</TableHead>
                  <TableHead className="text-center">กลางภาค (40)</TableHead>
                  <TableHead className="text-center">ปลายภาค (40)</TableHead>
                  <TableHead className="text-center">งาน (20)</TableHead>
                  <TableHead className="text-center">รวม</TableHead>
                  <TableHead className="text-center">เกรด</TableHead>
                  <TableHead className="text-right">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGrades.map((grade) => (
                  <TableRow key={grade.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {grade.studentName[0]}
                          </span>
                        </div>
                        <span className="font-medium">{grade.studentName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{grade.className}</Badge>
                    </TableCell>
                    <TableCell>{grade.subjectName}</TableCell>
                    <TableCell className="text-center font-mono">{grade.midterm}</TableCell>
                    <TableCell className="text-center font-mono">{grade.final}</TableCell>
                    <TableCell className="text-center font-mono">{grade.assignment}</TableCell>
                    <TableCell className="text-center font-bold font-mono">{grade.total}</TableCell>
                    <TableCell className="text-center">
                      <Badge className={getGradeBadgeColor(grade.grade)}>
                        {grade.grade}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(grade)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              แสดง {filteredGrades.length} จาก {grades.length} รายการ
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>แก้ไขคะแนน</DialogTitle>
            <DialogDescription>
              {editingGrade && `${editingGrade.studentName} - ${editingGrade.subjectName}`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>คะแนนกลางภาค (เต็ม 40)</Label>
              <Input
                type="number"
                min="0"
                max="40"
                value={formData.midterm}
                onChange={(e) => setFormData({ ...formData, midterm: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>คะแนนปลายภาค (เต็ม 40)</Label>
              <Input
                type="number"
                min="0"
                max="40"
                value={formData.final}
                onChange={(e) => setFormData({ ...formData, final: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>คะแนนงาน (เต็ม 20)</Label>
              <Input
                type="number"
                min="0"
                max="20"
                value={formData.assignment}
                onChange={(e) => setFormData({ ...formData, assignment: e.target.value })}
              />
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex justify-between">
                <span>คะแนนรวม:</span>
                <span className="font-bold">
                  {(parseInt(formData.midterm) || 0) + (parseInt(formData.final) || 0) + (parseInt(formData.assignment) || 0)}
                </span>
              </div>
              <div className="flex justify-between mt-1">
                <span>เกรด:</span>
                <Badge className={getGradeBadgeColor(calculateGrade(
                  (parseInt(formData.midterm) || 0) + (parseInt(formData.final) || 0) + (parseInt(formData.assignment) || 0)
                ))}>
                  {calculateGrade(
                    (parseInt(formData.midterm) || 0) + (parseInt(formData.final) || 0) + (parseInt(formData.assignment) || 0)
                  )}
                </Badge>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              ยกเลิก
            </Button>
            <Button onClick={handleSubmit}>บันทึก</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
