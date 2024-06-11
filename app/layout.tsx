import type { Metadata, Viewport } from "next";
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
import { ScrollArea } from "@/components/ui/scroll-area";

const inter = Inter({ subsets: ["latin"] });

const APP_NAME = "Tge Tags App";
const APP_DEFAULT_TITLE = "The Tags App";
const APP_TITLE_TEMPLATE = "%s - The Tags App";
const APP_DESCRIPTION =
  "Live Disc Golf standings for various Tags Leagues in South Jersey.";

export const metadata: Metadata = {
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/515x515.jpg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
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
              <main className="p-0 main-overflow">{children}</main>
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
