"use client";

import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  School,
  ClipboardCheck,
  FileSpreadsheet,
  Settings,
  LogOut,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const menuItems = [
  {
    title: "แดชบอร์ด",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "จัดการนักเรียน",
    url: "/students",
    icon: Users,
  },
  {
    title: "จัดการครู",
    url: "/teachers",
    icon: GraduationCap,
  },
  {
    title: "ชั้นเรียน",
    url: "/classes",
    icon: School,
  },
  {
    title: "รายวิชา",
    url: "/subjects",
    icon: BookOpen,
  },
  {
    title: "เช็คชื่อ",
    url: "/attendance",
    icon: ClipboardCheck,
  },
  {
    title: "จัดการเกรด",
    url: "/grades",
    icon: FileSpreadsheet,
  },
  {
    title: "ประกาศ",
    url: "/announcements",
    icon: Bell,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-border/40">
      <SidebarHeader className="border-b border-border/40 px-6 py-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <School className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">SchoolMS</h1>
            <p className="text-xs text-muted-foreground">ระบบบริหารโรงเรียน</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            เมนูหลัก
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url || pathname.startsWith(item.url + "/")}
                    className="h-11 px-3"
                  >
                    <Link href={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            ตั้งค่า
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-11 px-3">
                  <Link href="/settings">
                    <Settings className="h-5 w-5" />
                    <span className="font-medium">ตั้งค่าระบบ</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              AD
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">ผู้ดูแลระบบ</p>
            <p className="text-xs text-muted-foreground truncate">admin@school.com</p>
          </div>
          <button className="p-2 rounded-lg hover:bg-muted transition-colors">
            <LogOut className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
