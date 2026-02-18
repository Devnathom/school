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
import { GraduationCap, Plus, Search, MoreHorizontal, Pencil, Trash2, Eye, Mail, Phone } from "lucide-react";

interface Teacher {
  id: number;
  teacherId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  subjects: string[];
  position: string;
  status: string;
}

const initialTeachers: Teacher[] = [
  { id: 1, teacherId: "TCH001", firstName: "ประสิทธิ์", lastName: "สอนดี", email: "prasit@school.com", phone: "081-111-1111", department: "วิทยาศาสตร์", subjects: ["ฟิสิกส์", "เคมี"], position: "หัวหน้ากลุ่มสาระ", status: "active" },
  { id: 2, teacherId: "TCH002", firstName: "สมพร", lastName: "รักวิชา", email: "somporn@school.com", phone: "082-222-2222", department: "คณิตศาสตร์", subjects: ["คณิตศาสตร์พื้นฐาน", "คณิตศาสตร์เพิ่มเติม"], position: "ครูผู้สอน", status: "active" },
  { id: 3, teacherId: "TCH003", firstName: "วิไล", lastName: "ภาษาเด่น", email: "wilai@school.com", phone: "083-333-3333", department: "ภาษาต่างประเทศ", subjects: ["ภาษาอังกฤษ"], position: "ครูผู้สอน", status: "active" },
  { id: 4, teacherId: "TCH004", firstName: "สุชาติ", lastName: "ไทยแท้", email: "suchat@school.com", phone: "084-444-4444", department: "ภาษาไทย", subjects: ["ภาษาไทย", "วรรณคดี"], position: "ครูผู้สอน", status: "active" },
  { id: 5, teacherId: "TCH005", firstName: "อรุณ", lastName: "ศิลป์งาม", email: "arun@school.com", phone: "085-555-5555", department: "ศิลปะ", subjects: ["ทัศนศิลป์", "ดนตรี"], position: "ครูผู้สอน", status: "active" },
  { id: 6, teacherId: "TCH006", firstName: "สมศักดิ์", lastName: "กีฬาเด่น", email: "somsak@school.com", phone: "086-666-6666", department: "สุขศึกษาและพลศึกษา", subjects: ["พลศึกษา"], position: "ครูผู้สอน", status: "inactive" },
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

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    position: "",
  });

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.teacherId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === "all" || teacher.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleSubmit = () => {
    if (editingTeacher) {
      setTeachers(teachers.map((t) =>
        t.id === editingTeacher.id ? { ...t, ...formData } : t
      ));
      setEditingTeacher(null);
    } else {
      const newTeacher: Teacher = {
        id: Math.max(...teachers.map((t) => t.id)) + 1,
        teacherId: `TCH${String(teachers.length + 1).padStart(3, "0")}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        subjects: [],
        position: formData.position,
        status: "active",
      };
      setTeachers([...teachers, newTeacher]);
    }
    setIsAddDialogOpen(false);
    setFormData({ firstName: "", lastName: "", email: "", phone: "", department: "", position: "" });
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      email: teacher.email,
      phone: teacher.phone,
      department: teacher.department,
      position: teacher.position,
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setTeachers(teachers.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">จัดการครู</h1>
          <p className="text-muted-foreground">จัดการข้อมูลครูและบุคลากรทั้งหมดในระบบ</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) {
            setEditingTeacher(null);
            setFormData({ firstName: "", lastName: "", email: "", phone: "", department: "", position: "" });
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              เพิ่มครู
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingTeacher ? "แก้ไขข้อมูลครู" : "เพิ่มครูใหม่"}</DialogTitle>
              <DialogDescription>
                {editingTeacher ? "แก้ไขข้อมูลครูในระบบ" : "กรอกข้อมูลครูที่ต้องการเพิ่ม"}
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
                  <Label htmlFor="department">กลุ่มสาระ</Label>
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
                  <Label htmlFor="position">ตำแหน่ง</Label>
                  <Select value={formData.position} onValueChange={(value) => setFormData({ ...formData, position: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกตำแหน่ง" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ครูผู้สอน">ครูผู้สอน</SelectItem>
                      <SelectItem value="หัวหน้ากลุ่มสาระ">หัวหน้ากลุ่มสาระ</SelectItem>
                      <SelectItem value="รองผู้อำนวยการ">รองผู้อำนวยการ</SelectItem>
                      <SelectItem value="ผู้อำนวยการ">ผู้อำนวยการ</SelectItem>
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
                {editingTeacher ? "บันทึก" : "เพิ่มครู"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            รายชื่อครูและบุคลากร
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาครู..."
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
                  <TableHead>รหัสครู</TableHead>
                  <TableHead>ชื่อ-นามสกุล</TableHead>
                  <TableHead>กลุ่มสาระ</TableHead>
                  <TableHead>วิชาที่สอน</TableHead>
                  <TableHead>ตำแหน่ง</TableHead>
                  <TableHead>ติดต่อ</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead className="text-right">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell className="font-medium">{teacher.teacherId}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-green-600">
                            {teacher.firstName[0]}
                          </span>
                        </div>
                        <p className="font-medium">{teacher.firstName} {teacher.lastName}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{teacher.department}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {teacher.subjects.slice(0, 2).map((subject) => (
                          <Badge key={subject} variant="secondary" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                        {teacher.subjects.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{teacher.subjects.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{teacher.position}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {teacher.email}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {teacher.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={teacher.status === "active" ? "default" : "secondary"}>
                        {teacher.status === "active" ? "ปฏิบัติงาน" : "ลาออก"}
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
                          <DropdownMenuItem onClick={() => handleEdit(teacher)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            แก้ไข
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(teacher.id)}
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
              แสดง {filteredTeachers.length} จาก {teachers.length} รายการ
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
