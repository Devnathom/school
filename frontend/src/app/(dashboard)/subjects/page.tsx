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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookOpen, Plus, Search, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

interface Subject {
  id: number;
  code: string;
  name: string;
  department: string;
  credits: number;
  teacherId: number;
  teacherName: string;
  description: string;
}

const initialSubjects: Subject[] = [
  { id: 1, code: "SCI101", name: "วิทยาศาสตร์พื้นฐาน", department: "วิทยาศาสตร์", credits: 2, teacherId: 1, teacherName: "ประสิทธิ์ สอนดี", description: "วิชาวิทยาศาสตร์พื้นฐานสำหรับ ม.ต้น" },
  { id: 2, code: "MAT101", name: "คณิตศาสตร์พื้นฐาน", department: "คณิตศาสตร์", credits: 2, teacherId: 2, teacherName: "สมพร รักวิชา", description: "วิชาคณิตศาสตร์พื้นฐานสำหรับ ม.ต้น" },
  { id: 3, code: "ENG101", name: "ภาษาอังกฤษพื้นฐาน", department: "ภาษาต่างประเทศ", credits: 2, teacherId: 3, teacherName: "วิไล ภาษาเด่น", description: "วิชาภาษาอังกฤษพื้นฐาน" },
  { id: 4, code: "THA101", name: "ภาษาไทย", department: "ภาษาไทย", credits: 2, teacherId: 4, teacherName: "สุชาติ ไทยแท้", description: "วิชาภาษาไทยพื้นฐาน" },
  { id: 5, code: "ART101", name: "ศิลปะ", department: "ศิลปะ", credits: 1, teacherId: 5, teacherName: "อรุณ ศิลป์งาม", description: "วิชาศิลปะพื้นฐาน" },
  { id: 6, code: "PHY201", name: "ฟิสิกส์", department: "วิทยาศาสตร์", credits: 3, teacherId: 1, teacherName: "ประสิทธิ์ สอนดี", description: "วิชาฟิสิกส์เพิ่มเติม" },
  { id: 7, code: "CHE201", name: "เคมี", department: "วิทยาศาสตร์", credits: 3, teacherId: 1, teacherName: "ประสิทธิ์ สอนดี", description: "วิชาเคมีเพิ่มเติม" },
  { id: 8, code: "MAT201", name: "คณิตศาสตร์เพิ่มเติม", department: "คณิตศาสตร์", credits: 3, teacherId: 2, teacherName: "สมพร รักวิชา", description: "วิชาคณิตศาสตร์เพิ่มเติม" },
];

const departments = [
  "วิทยาศาสตร์",
  "คณิตศาสตร์",
  "ภาษาต่างประเทศ",
  "ภาษาไทย",
  "สังคมศึกษา",
  "ศิลปะ",
  "สุขศึกษาและพลศึกษา",
  "การงานอาชีพ",
];

const teachers = [
  { id: 1, name: "ประสิทธิ์ สอนดี" },
  { id: 2, name: "สมพร รักวิชา" },
  { id: 3, name: "วิไล ภาษาเด่น" },
  { id: 4, name: "สุชาติ ไทยแท้" },
  { id: 5, name: "อรุณ ศิลป์งาม" },
];

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    department: "",
    credits: "",
    teacherId: "",
    description: "",
  });

  const filteredSubjects = subjects.filter((subject) => {
    const matchesSearch =
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === "all" || subject.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleSubmit = () => {
    const teacher = teachers.find((t) => t.id === parseInt(formData.teacherId));
    if (editingSubject) {
      setSubjects(subjects.map((s) =>
        s.id === editingSubject.id
          ? {
              ...s,
              ...formData,
              credits: parseInt(formData.credits),
              teacherId: parseInt(formData.teacherId),
              teacherName: teacher?.name || "",
            }
          : s
      ));
      setEditingSubject(null);
    } else {
      const newSubject: Subject = {
        id: Math.max(...subjects.map((s) => s.id)) + 1,
        code: formData.code,
        name: formData.name,
        department: formData.department,
        credits: parseInt(formData.credits),
        teacherId: parseInt(formData.teacherId),
        teacherName: teacher?.name || "",
        description: formData.description,
      };
      setSubjects([...subjects, newSubject]);
    }
    setIsAddDialogOpen(false);
    setFormData({ code: "", name: "", department: "", credits: "", teacherId: "", description: "" });
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setFormData({
      code: subject.code,
      name: subject.name,
      department: subject.department,
      credits: subject.credits.toString(),
      teacherId: subject.teacherId.toString(),
      description: subject.description,
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setSubjects(subjects.filter((s) => s.id !== id));
  };

  const getDepartmentColor = (department: string) => {
    const colors: Record<string, string> = {
      "วิทยาศาสตร์": "bg-blue-100 text-blue-800",
      "คณิตศาสตร์": "bg-purple-100 text-purple-800",
      "ภาษาต่างประเทศ": "bg-green-100 text-green-800",
      "ภาษาไทย": "bg-orange-100 text-orange-800",
      "สังคมศึกษา": "bg-yellow-100 text-yellow-800",
      "ศิลปะ": "bg-pink-100 text-pink-800",
      "สุขศึกษาและพลศึกษา": "bg-red-100 text-red-800",
      "การงานอาชีพ": "bg-teal-100 text-teal-800",
    };
    return colors[department] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">จัดการรายวิชา</h1>
          <p className="text-muted-foreground">จัดการข้อมูลรายวิชาทั้งหมดในระบบ</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) {
            setEditingSubject(null);
            setFormData({ code: "", name: "", department: "", credits: "", teacherId: "", description: "" });
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              เพิ่มรายวิชา
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingSubject ? "แก้ไขรายวิชา" : "เพิ่มรายวิชาใหม่"}</DialogTitle>
              <DialogDescription>
                {editingSubject ? "แก้ไขข้อมูลรายวิชา" : "กรอกข้อมูลรายวิชาที่ต้องการเพิ่ม"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>รหัสวิชา</Label>
                  <Input
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="เช่น SCI101"
                  />
                </div>
                <div className="space-y-2">
                  <Label>หน่วยกิต</Label>
                  <Input
                    type="number"
                    value={formData.credits}
                    onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                    placeholder="1-4"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>ชื่อวิชา</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="ชื่อวิชา"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>กลุ่มสาระ</Label>
                  <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกกลุ่มสาระ" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>ผู้สอน</Label>
                  <Select value={formData.teacherId} onValueChange={(value) => setFormData({ ...formData, teacherId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกผู้สอน" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id.toString()}>
                          {teacher.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>คำอธิบายรายวิชา</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="คำอธิบายรายวิชา"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                ยกเลิก
              </Button>
              <Button onClick={handleSubmit}>
                {editingSubject ? "บันทึก" : "เพิ่มรายวิชา"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            รายวิชาทั้งหมด
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหารายวิชา..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="กรองตามกลุ่มสาระ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกกลุ่มสาระ</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>รหัสวิชา</TableHead>
                  <TableHead>ชื่อวิชา</TableHead>
                  <TableHead>กลุ่มสาระ</TableHead>
                  <TableHead>หน่วยกิต</TableHead>
                  <TableHead>ผู้สอน</TableHead>
                  <TableHead className="text-right">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubjects.map((subject) => (
                  <TableRow key={subject.id}>
                    <TableCell className="font-medium font-mono">{subject.code}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{subject.name}</p>
                        <p className="text-xs text-muted-foreground">{subject.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getDepartmentColor(subject.department)} variant="secondary">
                        {subject.department}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{subject.credits} หน่วยกิต</Badge>
                    </TableCell>
                    <TableCell>{subject.teacherName}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(subject)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            แก้ไข
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(subject.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            ลบ
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              แสดง {filteredSubjects.length} จาก {subjects.length} รายการ
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
