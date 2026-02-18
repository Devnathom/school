"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Settings, User, Bell, Shield, Database } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">ตั้งค่าระบบ</h1>
        <p className="text-muted-foreground">จัดการการตั้งค่าและการกำหนดค่าระบบ</p>
      </div>

      <div className="grid gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              ข้อมูลส่วนตัว
            </CardTitle>
            <CardDescription>จัดการข้อมูลโปรไฟล์ของคุณ</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>ชื่อ</Label>
                <Input defaultValue="ผู้ดูแลระบบ" />
              </div>
              <div className="space-y-2">
                <Label>อีเมล</Label>
                <Input defaultValue="admin@school.com" type="email" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>เบอร์โทรศัพท์</Label>
              <Input defaultValue="081-234-5678" />
            </div>
            <Button>บันทึกการเปลี่ยนแปลง</Button>
          </CardContent>
        </Card>

        {/* School Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              ข้อมูลโรงเรียน
            </CardTitle>
            <CardDescription>จัดการข้อมูลพื้นฐานของโรงเรียน</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>ชื่อโรงเรียน</Label>
              <Input defaultValue="โรงเรียนตัวอย่าง" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>ปีการศึกษาปัจจุบัน</Label>
                <Input defaultValue="2567" />
              </div>
              <div className="space-y-2">
                <Label>ภาคเรียนปัจจุบัน</Label>
                <Input defaultValue="2" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>ที่อยู่</Label>
              <Input defaultValue="123 ถ.การศึกษา อ.เมือง จ.กรุงเทพฯ 10100" />
            </div>
            <Button>บันทึกการเปลี่ยนแปลง</Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              การแจ้งเตือน
            </CardTitle>
            <CardDescription>จัดการการแจ้งเตือนและการส่งข้อความ</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">แจ้งเตือนทางอีเมล</p>
                <p className="text-sm text-muted-foreground">รับการแจ้งเตือนผ่านอีเมล</p>
              </div>
              <Button variant="outline" size="sm">เปิด</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">แจ้งเตือนการขาดเรียน</p>
                <p className="text-sm text-muted-foreground">แจ้งเตือนเมื่อนักเรียนขาดเรียนเกิน 3 วัน</p>
              </div>
              <Button variant="outline" size="sm">เปิด</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">รายงานประจำสัปดาห์</p>
                <p className="text-sm text-muted-foreground">รับรายงานสรุปทุกวันจันทร์</p>
              </div>
              <Button variant="outline" size="sm">ปิด</Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              ความปลอดภัย
            </CardTitle>
            <CardDescription>จัดการรหัสผ่านและการเข้าถึง</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>รหัสผ่านปัจจุบัน</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>รหัสผ่านใหม่</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label>ยืนยันรหัสผ่านใหม่</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
            </div>
            <Button>เปลี่ยนรหัสผ่าน</Button>
          </CardContent>
        </Card>

        {/* Database Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              ข้อมูลระบบ
            </CardTitle>
            <CardDescription>สำรองข้อมูลและจัดการฐานข้อมูล</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium">สำรองข้อมูลล่าสุด</p>
                <p className="text-sm text-muted-foreground">16 มกราคม 2567 เวลา 23:00 น.</p>
              </div>
              <Button variant="outline">สำรองข้อมูล</Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium">นำเข้าข้อมูล</p>
                <p className="text-sm text-muted-foreground">นำเข้าข้อมูลจากไฟล์ CSV หรือ Excel</p>
              </div>
              <Button variant="outline">นำเข้า</Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium">ส่งออกข้อมูล</p>
                <p className="text-sm text-muted-foreground">ส่งออกข้อมูลเป็นไฟล์ CSV หรือ Excel</p>
              </div>
              <Button variant="outline">ส่งออก</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
