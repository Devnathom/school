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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Plus, MoreHorizontal, Pencil, Trash2, Calendar, User } from "lucide-react";

interface Announcement {
  id: number;
  title: string;
  content: string;
  priority: "high" | "medium" | "low";
  author: string;
  createdAt: string;
  category: string;
}

const initialAnnouncements: Announcement[] = [
  {
    id: 1,
    title: "แจ้งกำหนดการสอบกลางภาค",
    content: "กำหนดสอบกลางภาควันที่ 25-29 มกราคม 2567 นักเรียนทุกคนต้องมาถึงก่อนเวลาสอบ 30 นาที พร้อมบัตรประจำตัวนักเรียน",
    priority: "high",
    author: "ฝ่ายวิชาการ",
    createdAt: "2024-01-16",
    category: "วิชาการ",
  },
  {
    id: 2,
    title: "ประกาศรับสมัครนักเรียนใหม่",
    content: "เปิดรับสมัครนักเรียนใหม่ปีการศึกษา 2568 ตั้งแต่วันที่ 1-28 กุมภาพันธ์ 2567 ณ ห้องทะเบียน",
    priority: "medium",
    author: "ฝ่ายทะเบียน",
    createdAt: "2024-01-15",
    category: "ทะเบียน",
  },
  {
    id: 3,
    title: "กิจกรรมวันเด็กแห่งชาติ",
    content: "ขอเชิญร่วมกิจกรรมวันเด็กแห่งชาติ วันเสาร์ที่ 13 มกราคม 2567 เวลา 08.00-16.00 น. ณ สนามกีฬา มีของรางวัลและกิจกรรมมากมาย",
    priority: "low",
    author: "ฝ่ายกิจการนักเรียน",
    createdAt: "2024-01-10",
    category: "กิจกรรม",
  },
  {
    id: 4,
    title: "แจ้งวันหยุดตรุษจีน",
    content: "โรงเรียนหยุดเรียนเนื่องในเทศกาลตรุษจีน วันที่ 10-12 กุมภาพันธ์ 2567 และเปิดเรียนตามปกติวันที่ 13 กุมภาพันธ์ 2567",
    priority: "medium",
    author: "ฝ่ายบริหาร",
    createdAt: "2024-01-08",
    category: "ทั่วไป",
  },
  {
    id: 5,
    title: "การประชุมผู้ปกครอง",
    content: "ขอเชิญผู้ปกครองทุกท่านเข้าร่วมประชุมผู้ปกครองประจำภาคเรียนที่ 2 วันอาทิตย์ที่ 20 มกราคม 2567 เวลา 09.00 น. ณ หอประชุม",
    priority: "high",
    author: "ฝ่ายบริหาร",
    createdAt: "2024-01-05",
    category: "ทั่วไป",
  },
];

const categories = ["ทั่วไป", "วิชาการ", "กิจกรรม", "ทะเบียน", "สุขภาพ"];

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "medium" as "high" | "medium" | "low",
    category: "",
    author: "",
  });

  const filteredAnnouncements = announcements.filter((a) => {
    return filterPriority === "all" || a.priority === filterPriority;
  });

  const handleSubmit = () => {
    if (editingAnnouncement) {
      setAnnouncements(announcements.map((a) =>
        a.id === editingAnnouncement.id
          ? { ...a, ...formData }
          : a
      ));
      setEditingAnnouncement(null);
    } else {
      const newAnnouncement: Announcement = {
        id: Math.max(...announcements.map((a) => a.id)) + 1,
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setAnnouncements([newAnnouncement, ...announcements]);
    }
    setIsAddDialogOpen(false);
    setFormData({ title: "", content: "", priority: "medium", category: "", author: "" });
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
      category: announcement.category,
      author: announcement.author,
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">สำคัญมาก</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">สำคัญ</Badge>;
      case "low":
        return <Badge variant="secondary">ทั่วไป</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ประกาศ</h1>
          <p className="text-muted-foreground">จัดการประกาศและข่าวสารของโรงเรียน</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) {
            setEditingAnnouncement(null);
            setFormData({ title: "", content: "", priority: "medium", category: "", author: "" });
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              เพิ่มประกาศ
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>{editingAnnouncement ? "แก้ไขประกาศ" : "เพิ่มประกาศใหม่"}</DialogTitle>
              <DialogDescription>
                {editingAnnouncement ? "แก้ไขข้อมูลประกาศ" : "กรอกข้อมูลประกาศที่ต้องการเผยแพร่"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>หัวข้อ</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="หัวข้อประกาศ"
                />
              </div>
              <div className="space-y-2">
                <Label>เนื้อหา</Label>
                <textarea
                  className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="รายละเอียดประกาศ"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ความสำคัญ</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: "high" | "medium" | "low") => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกความสำคัญ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">สำคัญมาก</SelectItem>
                      <SelectItem value="medium">สำคัญ</SelectItem>
                      <SelectItem value="low">ทั่วไป</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>หมวดหมู่</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกหมวดหมู่" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>ผู้ประกาศ</Label>
                <Input
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="ชื่อผู้ประกาศหรือฝ่ายที่รับผิดชอบ"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                ยกเลิก
              </Button>
              <Button onClick={handleSubmit}>
                {editingAnnouncement ? "บันทึก" : "เผยแพร่"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="กรองตามความสำคัญ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทั้งหมด</SelectItem>
            <SelectItem value="high">สำคัญมาก</SelectItem>
            <SelectItem value="medium">สำคัญ</SelectItem>
            <SelectItem value="low">ทั่วไป</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredAnnouncements.map((announcement) => (
          <Card key={announcement.id} className={`overflow-hidden ${announcement.priority === "high" ? "border-l-4 border-l-red-500" : announcement.priority === "medium" ? "border-l-4 border-l-yellow-500" : ""}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {getPriorityBadge(announcement.priority)}
                    <Badge variant="outline">{announcement.category}</Badge>
                  </div>
                  <CardTitle className="text-xl">{announcement.title}</CardTitle>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(announcement)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      แก้ไข
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDelete(announcement.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      ลบ
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{announcement.content}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{announcement.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{announcement.createdAt}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAnnouncements.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">ไม่พบประกาศ</h3>
            <p className="text-muted-foreground">ไม่มีประกาศที่ตรงกับเงื่อนไขที่เลือก</p>
          </div>
        </Card>
      )}
    </div>
  );
}
