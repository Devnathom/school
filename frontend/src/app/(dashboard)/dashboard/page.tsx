"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  GraduationCap,
  School,
  BookOpen,
  TrendingUp,
  Calendar,
  Bell,
  Activity,
} from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, Cell, Pie, PieChart } from "recharts";

const stats = [
  {
    title: "นักเรียนทั้งหมด",
    value: "208",
    change: "+12",
    changeText: "จากเดือนที่แล้ว",
    icon: Users,
    color: "bg-blue-500",
  },
  {
    title: "ครูทั้งหมด",
    value: "25",
    change: "+2",
    changeText: "จากเดือนที่แล้ว",
    icon: GraduationCap,
    color: "bg-green-500",
  },
  {
    title: "ชั้นเรียน",
    value: "18",
    change: "0",
    changeText: "ไม่เปลี่ยนแปลง",
    icon: School,
    color: "bg-purple-500",
  },
  {
    title: "รายวิชา",
    value: "32",
    change: "+4",
    changeText: "จากเดือนที่แล้ว",
    icon: BookOpen,
    color: "bg-orange-500",
  },
];

const attendanceData = [
  { month: "ม.ค.", present: 95, absent: 3, late: 2 },
  { month: "ก.พ.", present: 93, absent: 4, late: 3 },
  { month: "มี.ค.", present: 96, absent: 2, late: 2 },
  { month: "เม.ย.", present: 94, absent: 4, late: 2 },
  { month: "พ.ค.", present: 92, absent: 5, late: 3 },
  { month: "มิ.ย.", present: 95, absent: 3, late: 2 },
];

const gradeData = [
  { grade: "A", count: 45, fill: "#22c55e" },
  { grade: "B+", count: 38, fill: "#84cc16" },
  { grade: "B", count: 52, fill: "#eab308" },
  { grade: "C+", count: 35, fill: "#f97316" },
  { grade: "C", count: 25, fill: "#ef4444" },
  { grade: "D+", count: 10, fill: "#dc2626" },
  { grade: "D", count: 3, fill: "#b91c1c" },
];

const attendanceChartConfig = {
  present: { label: "มาเรียน", color: "#22c55e" },
  absent: { label: "ขาดเรียน", color: "#ef4444" },
  late: { label: "มาสาย", color: "#eab308" },
} satisfies ChartConfig;

const gradeChartConfig = {
  count: { label: "จำนวน" },
  A: { label: "A", color: "#22c55e" },
  "B+": { label: "B+", color: "#84cc16" },
  B: { label: "B", color: "#eab308" },
  "C+": { label: "C+", color: "#f97316" },
  C: { label: "C", color: "#ef4444" },
  "D+": { label: "D+", color: "#dc2626" },
  D: { label: "D", color: "#b91c1c" },
} satisfies ChartConfig;

const recentActivities = [
  { id: 1, type: "student", action: "เพิ่มนักเรียนใหม่", description: "สมชาย ใจดี ถูกเพิ่มเข้าระบบ", time: "10 นาทีที่แล้ว", icon: Users },
  { id: 2, type: "attendance", action: "บันทึกการเข้าเรียน", description: "บันทึกการเข้าเรียนชั้น ม.1/1", time: "30 นาทีที่แล้ว", icon: Activity },
  { id: 3, type: "grade", action: "บันทึกเกรด", description: "บันทึกเกรดวิชาคณิตศาสตร์ ม.2/1", time: "1 ชั่วโมงที่แล้ว", icon: TrendingUp },
  { id: 4, type: "teacher", action: "อัปเดตข้อมูลครู", description: "อัปเดตข้อมูลครูวิไล", time: "2 ชั่วโมงที่แล้ว", icon: GraduationCap },
];

const upcomingEvents = [
  { id: 1, title: "ประชุมผู้ปกครอง", date: "20 ม.ค.", type: "meeting" },
  { id: 2, title: "สอบกลางภาค", date: "25 ม.ค.", type: "exam" },
  { id: 3, title: "กิจกรรมกีฬาสี", date: "1 ก.พ.", type: "activity" },
  { id: 4, title: "วันหยุดตรุษจีน", date: "10 ก.พ.", type: "holiday" },
];

const announcements = [
  { id: 1, title: "แจ้งกำหนดการสอบกลางภาค", priority: "high" },
  { id: 2, title: "ประกาศรับสมัครนักเรียนใหม่", priority: "medium" },
  { id: 3, title: "กิจกรรมวันเด็ก", priority: "low" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">แดชบอร์ด</h1>
        <p className="text-muted-foreground">ภาพรวมระบบบริหารจัดการโรงเรียน</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${stat.color}`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500 font-medium">{stat.change}</span>{" "}
                {stat.changeText}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              สถิติการเข้าเรียน
            </CardTitle>
            <CardDescription>อัตราการเข้าเรียนรายเดือน (%)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={attendanceChartConfig} className="h-[300px] w-full">
              <BarChart data={attendanceData}>
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="present" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="late" fill="#eab308" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              การกระจายเกรด
            </CardTitle>
            <CardDescription>จำนวนนักเรียนแยกตามเกรด</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={gradeChartConfig} className="h-[300px] w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={gradeData}
                  dataKey="count"
                  nameKey="grade"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                >
                  {gradeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {gradeData.map((item) => (
                <div key={item.grade} className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.fill }} />
                  <span className="text-sm text-muted-foreground">
                    {item.grade}: {item.count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent Activities */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              กิจกรรมล่าสุด
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="rounded-full p-2 bg-primary/10">
                    <activity.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Upcoming Events */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-4 w-4" />
                กิจกรรมที่จะมาถึง
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{event.date}</p>
                    </div>
                    <Badge
                      variant={
                        event.type === "exam"
                          ? "destructive"
                          : event.type === "meeting"
                          ? "default"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {event.type === "exam" && "สอบ"}
                      {event.type === "meeting" && "ประชุม"}
                      {event.type === "activity" && "กิจกรรม"}
                      {event.type === "holiday" && "หยุด"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Announcements */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="h-4 w-4" />
                ประกาศ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="flex items-center gap-3">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        announcement.priority === "high"
                          ? "bg-red-500"
                          : announcement.priority === "medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    />
                    <p className="text-sm">{announcement.title}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
