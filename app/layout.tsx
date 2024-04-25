import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import SideMenu from "./components/sidemenu";
import { Label } from "@radix-ui/react-label";
import MenuHeader from "./components/menuheader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "postcss";
import { useState, useRef, useEffect } from "react";
import { TAGS_API_BASE_URL } from "./networking/apiExports";
import UDiscDisplayNameDialog from "./components/UDiscDisplayNameDialog";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tranquility Tags Standings",
  description:
    "Live standings for the Tranquility Tags League, updated bi-weekly.",
};

export interface Course {
  orgCode: string;
  courseName: string;
}

export interface KindeOrganization {
  orgCode: string;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    getAccessToken,
    getBooleanFlag,
    getFlag,
    getIdToken,
    getIntegerFlag,
    getOrganization,
    getPermission,
    getPermissions,
    getStringFlag,
    getUser,
    getUserOrganizations,
    isAuthenticated,
  } = getKindeServerSession();

  // console.log(await getAccessToken());
  // console.log(await getOrganization());
  // console.log(await getPermissions());
  // console.log(await getStringFlag("sflag", "test"));
  const user = await getUser();
  // console.log(user);
  // console.log(await getUserOrganizations());

  const organization = (await getOrganization()) as KindeOrganization;
  const orgCode =
    organization && organization.orgCode ? organization.orgCode : "";

  // #TODO
  // get current org from a central hook

  const course: Course = {
    orgCode: orgCode,
    courseName: "Test Course",
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        {" "}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          <div className="flex row-auto w-full h-full">
            <SideMenu />
            <div className="w-full">
              <MenuHeader />
              {children}
            </div>
          </div>
          <UDiscDisplayNameDialog />
        </ThemeProvider>
      </body>
    </html>
  );
}
