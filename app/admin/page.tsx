import type { Metadata } from "next";
import { AdminApp } from "@/components/admin-app";
import { isAdminAuthenticated } from "@/lib/security";

export const metadata: Metadata = {
  title: "관리자 콘솔 | AI Model Index",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  return <AdminApp initialAuthenticated={await isAdminAuthenticated()} />;
}
