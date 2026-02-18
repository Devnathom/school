"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { School, Plus, Users, MapPin, User, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ClassItem {
  id: number;
  name: string;
  level: string;
  section: string;
  year: number;
  teacherId: number;
  teacherName: string;
  room: string;
  studentCount: number;
  capacity: number;
}

const initialClasses: ClassItem[] = [
  { id: 1, name: "ม.1/1", level: "ม.1", section: "1", year: 2567, teacherId: 1, teacherName: "ประสิทธิ์ สอนดี", room: "101", studentCount: 35, capacity: 40 },
  { id: 2, name: "ม.1/2", level: "ม.1", section: "2", year: 2567, teacherId: 2, teacherName: "สมพร รักวิชา", room: "102", studentCount: 32, capacity: 40 },
  { id: 3, name: "ม.2/1", level: "ม.2", section: "1", year: 2567, teacherId: 3, teacherName: "วิไล ภาษาเด่น", room: "201", studentCount: 38, capacity: 40 },
  { id: 4, name: "ม.2/2", level: "ม.2", section: "2", year: 2567, teacherId: 4, teacherName: "สุชาติ ไทยแท้", room: "202", studentCount: 36, capacity: 40 },
  { id: 5, name: "ม.3/1", level: "ม.3", section: "1", year: 2567, teacherId: 5, teacherName: "อรุณ ศิลป์งาม", room: "301", studentCount: 34, capacity: 40 },
  { id: 6, name: "ม.3/2", level: "ม.3", section: "2", year: 2567, teacherId: 1, teacherName: "ประสิทธิ์ สอนดี", room: "302", studentCount: 33, capacity: 40 },
];

const teachers = [
  { id: 1, name: "ประสิทธิ์ สอนดี" },
  { id: 2, name: "สมพร รักวิชา" },
  { id: 3, name: "วิไล ภาษาเด่น" },
  { id: 4, name: "สุชาติ ไทยแท้" },
  { id: 5, name: "อรุณ ศิลป์งาม" },
];

const levels = ["ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6"];

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassItem[]>(initialClasses);
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [formData, setFormData] = useState({
    level: "",
    section: "",
    teacherId: "",
    room: "",
    capacity: "",
  });

  const filteredClasses = classes.filter((c) => {
    return filterLevel === "all" || c.level === filterLevel;
  });

  const handleSubmit = () => {
    const teacher = teachers.find((t) => t.id === parseInt(formData.teacherId));
    if (editingClass) {
      setClasses(classes.map((c) =>
        c.id === editingClass.id
          ? {
              ...c,
              level: formData.level,
              section: formData.section,
              name: `${formData.level}/${formData.section}`,
              teacherId: parseInt(formData.teacherId),
              teacherName: teacher?.name || "",
              room: formData.room,
              capacity: parseInt(formData.capacity),
            }
          : c
      ));
      setEditingClass(null);
    } else {
      const newClass: ClassItem = {
        id: Math.max(...classes.map((c) => c.id)) + 1,
        name: `${formData.level}/${formData.section}`,
        level: formData.level,
        section: formData.section,
        year: 2567,
        teacherId: parseInt(formData.teacherId),
        teacherName: teacher?.name || "",
        room: formData.room,
        studentCount: 0,
        capacity: parseInt(formData.capacity),
      };
      setClasses([...classes, newClass]);
    }
    setIsAddDialogOpen(false);
    setFormData({ level: "", section: "", teacherId: "", room: "", capacity: "" });
  };

  const handleEdit = (classItem: ClassItem) => {
    setEditingClass(classItem);
    setFormData({
      level: classItem.level,
      section: classItem.section,
      teacherId: classItem.teacherId.toString(),
      room: classItem.room,
      capacity: classItem.capacity.toString(),
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setClasses(classes.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">จัดการชั้นเรียน</h1>
          <p className="text-muted-foreground">จัดการข้อมูลชั้นเรียนและห้องเรียนทั้งหมด</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) {
            setEditingClass(null);
            setFormData({ level: "", section: "", teacherId: "", room: "", capacity: "" });
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              เพิ่มชั้นเรียน
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>{editingClass ? "แก้ไขชั้นเรียน" : "เพิ่มชั้นเรียนใหม่"}</DialogTitle>
              <DialogDescription>
                {editingClass ? "แก้ไขข้อมูลชั้นเรียน" : "กรอกข้อมูลชั้นเรียนที่ต้องการเพิ่ม"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ระดับชั้น</Label>
                  <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกระดับชั้น" />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>ห้อง</Label>
                  <Input
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    placeholder="เช่น 1, 2, 3"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>ครูประจำชั้น</Label>
                <Select value={formData.teacherId} onValueChange={(value) => setFormData({ ...formData, teacherId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกครูประจำชั้น" />
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ห้องเรียน</Label>
                  <Input
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    placeholder="เช่น 101, 201"
                  />
                </div>
                <div className="space-y-2">
                  <Label>จำนวนที่นั่ง</Label>
                  <Input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    placeholder="40"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                ยกเลิก
              </Button>
              <Button onClick={handleSubmit}>
                {editingClass ? "บันทึก" : "เพิ่มชั้นเรียน"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <Select value={filterLevel} onValueChange={setFilterLevel}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="กรองตามระดับชั้น" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทุกระดับชั้น</SelectItem>
            {levels.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredClasses.map((classItem) => (
          <Card key={classItem.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{classItem.name}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(classItem)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      แก้ไข
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDelete(classItem.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      ลบ
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="text-sm text-white/80">ปีการศึกษา {classItem.year}</p>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">ครูประจำชั้น:</span>
                <span className="font-medium">{classItem.teacherName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">ห้องเรียน:</span>
                <span className="font-medium">{classItem.room}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">นักเรียน:</span>
                <span className="font-medium">{classItem.studentCount}/{classItem.capacity} คน</span>
              </div>
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>ความจุ</span>
                  <span>{Math.round((classItem.studentCount / classItem.capacity) * 100)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all"
                    style={{ width: `${(classItem.studentCount / classItem.capacity) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClasses.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <School className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">ไม่พบชั้นเรียน</h3>
            <p className="text-muted-foreground">ไม่มีชั้นเรียนที่ตรงกับเงื่อนไขที่เลือก</p>
          </div>
        </Card>
      )}
    </div>
  );
}
