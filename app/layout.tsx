import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import SideMenu from "./components/sidemenu";
import MenuHeader from "./components/menuheader";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import UDiscDisplayNameDialog from "./components/UDiscDisplayNameDialog";

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
  const { getOrganization, getUser } = getKindeServerSession();

  const user = await getUser();

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
              <main className="p-2">{children}</main>
            </div>
          </div>
          <UDiscDisplayNameDialog />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
