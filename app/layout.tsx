import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TaskSphere - Smart Task Management App",
  description:
    "Plan and manage your daily, weekly, and yearly tasks efficiently with TaskSphere. Prioritize with drag-and-drop and stay productive.",
  keywords: [
    "task manager",
    "daily planner",
    "weekly planner",
    "yearly planner",
    "drag and drop task management",
    "productivity tool",
    "TaskSphere",
    "to-do list app",
  ],
  authors: [
    { name: "Kasam Bhusal", url: "https://tasksphere.kasambhusal.com.np" },
  ],
  creator: "TaskSphere Team",
  metadataBase: new URL("https://tasksphere.kasambhusal.com.np"),
  openGraph: {
    title: "TaskSphere - Organize Your Tasks",
    description:
      "A sleek and powerful task manager to track your daily, weekly, and yearly goals.",
    url: "https://tasksphere.kasambhusal.com.np",
    siteName: "TaskSphere",
    images: [
      {
        url: "/og-image.png", // optional: add an OG image here
        width: 1200,
        height: 630,
        alt: "TaskSphere interface preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  themeColor: "#2563eb", // Example blue, match your UI theme
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
