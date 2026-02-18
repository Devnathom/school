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
import { Users, Plus, Search, MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";

interface Student {
  id: number;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  classId: number;
  className: string;
  gender: string;
  status: string;
}

const initialStudents: Student[] = [
  { id: 1, studentId: "STD001", firstName: "สมชาย", lastName: "ใจดี", email: "somchai@school.com", phone: "081-234-5678", classId: 1, className: "ม.1/1", gender: "male", status: "active" },
  { id: 2, studentId: "STD002", firstName: "สมหญิง", lastName: "รักเรียน", email: "somying@school.com", phone: "082-345-6789", classId: 1, className: "ม.1/1", gender: "female", status: "active" },
  { id: 3, studentId: "STD003", firstName: "วิชัย", lastName: "เก่งมาก", email: "wichai@school.com", phone: "083-456-7890", classId: 2, className: "ม.1/2", gender: "male", status: "active" },
  { id: 4, studentId: "STD004", firstName: "มานี", lastName: "สุขสันต์", email: "manee@school.com", phone: "084-567-8901", classId: 2, className: "ม.1/2", gender: "female", status: "active" },
  { id: 5, studentId: "STD005", firstName: "ปิติ", lastName: "ยินดี", email: "piti@school.com", phone: "085-678-9012", classId: 3, className: "ม.2/1", gender: "male", status: "active" },
  { id: 6, studentId: "STD006", firstName: "วารี", lastName: "น้ำใส", email: "waree@school.com", phone: "086-789-0123", classId: 3, className: "ม.2/1", gender: "female", status: "inactive" },
  { id: 7, studentId: "STD007", firstName: "ชูใจ", lastName: "แสนดี", email: "choojai@school.com", phone: "087-890-1234", classId: 4, className: "ม.2/2", gender: "female", status: "active" },
  { id: 8, studentId: "STD008", firstName: "นราธิป", lastName: "สว่างใจ", email: "narathip@school.com", phone: "088-901-2345", classId: 4, className: "ม.2/2", gender: "male", status: "active" },
];

const classes = [
  { id: 1, name: "ม.1/1" },
  { id: 2, name: "ม.1/2" },
  { id: 3, name: "ม.2/1" },
  { id: 4, name: "ม.2/2" },
  { id: 5, name: "ม.3/1" },
  { id: 6, name: "ม.3/2" },
];

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    classId: "",
    gender: "",
  });

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === "all" || student.classId.toString() === filterClass;
    return matchesSearch && matchesClass;
  });

  const handleSubmit = () => {
    if (editingStudent) {
      setStudents(students.map((s) =>
        s.id === editingStudent.id
          ? {
              ...s,
              ...formData,
              classId: parseInt(formData.classId),
              className: classes.find((c) => c.id === parseInt(formData.classId))?.name || "",
            }
          : s
      ));
      setEditingStudent(null);
    } else {
      const newStudent: Student = {
        id: Math.max(...students.map((s) => s.id)) + 1,
        studentId: `STD${String(students.length + 1).padStart(3, "0")}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        classId: parseInt(formData.classId),
        className: classes.find((c) => c.id === parseInt(formData.classId))?.name || "",
        gender: formData.gender,
        status: "active",
      };
      setStudents([...students, newStudent]);
    }
    setIsAddDialogOpen(false);
    setFormData({ firstName: "", lastName: "", email: "", phone: "", classId: "", gender: "" });
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phone: student.phone,
      classId: student.classId.toString(),
      gender: student.gender,
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setStudents(students.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">จัดการนักเรียน</h1>
          <p className="text-muted-foreground">จัดการข้อมูลนักเรียนทั้งหมดในระบบ</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) {
            setEditingStudent(null);
            setFormData({ firstName: "", lastName: "", email: "", phone: "", classId: "", gender: "" });
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              เพิ่มนักเรียน
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingStudent ? "แก้ไขข้อมูลนักเรียน" : "เพิ่มนักเรียนใหม่"}</DialogTitle>
              <DialogDescription>
                {editingStudent ? "แก้ไขข้อมูลนักเรียนในระบบ" : "กรอกข้อมูลนักเรียนที่ต้องการเพิ่ม"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">ชื่อ</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="ชื่อ"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">นามสกุล</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="นามสกุล"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">อีเมล</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@school.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0XX-XXX-XXXX"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="classId">ชั้นเรียน</Label>
                  <Select value={formData.classId} onValueChange={(value) => setFormData({ ...formData, classId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกชั้นเรียน" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((c) => (
                        <SelectItem key={c.id} value={c.id.toString()}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">เพศ</Label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกเพศ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">ชาย</SelectItem>
                      <SelectItem value="female">หญิง</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                ยกเลิก
              </Button>
              <Button onClick={handleSubmit}>
                {editingStudent ? "บันทึก" : "เพิ่มนักเรียน"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            รายชื่อนักเรียน
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
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
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="กรองตามชั้นเรียน" />
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
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>รหัสนักเรียน</TableHead>
                  <TableHead>ชื่อ-นามสกุล</TableHead>
                  <TableHead>ชั้นเรียน</TableHead>
                  <TableHead>อีเมล</TableHead>
                  <TableHead>เบอร์โทร</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead className="text-right">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.studentId}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {student.firstName[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{student.firstName} {student.lastName}</p>
                          <p className="text-xs text-muted-foreground">
                            {student.gender === "male" ? "ชาย" : "หญิง"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{student.className}</Badge>
                    </TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.phone}</TableCell>
                    <TableCell>
                      <Badge variant={student.status === "active" ? "default" : "secondary"}>
                        {student.status === "active" ? "กำลังศึกษา" : "พ้นสภาพ"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            ดูรายละเอียด
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(student)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            แก้ไข
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(student.id)}
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
              แสดง {filteredStudents.length} จาก {students.length} รายการ
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
