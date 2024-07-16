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
import { Course } from "./types/Course";

const inter = Inter({ subsets: ["latin"] });

const APP_NAME = "The Tags App";
const APP_DEFAULT_TITLE =
  "Digitize Your Tournaments with Tags App by Disc Rescue Network";
const APP_TITLE_TEMPLATE = "%s - The Tags App";
const APP_DESCRIPTION =
  "Let's be honest, manually tracking your tags tournaments is getting old. We've fixed all that with our Udisc integration and fully digitally tracked Tags App. Digitize your tags with the Tags App.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
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
    url: "https://tags.discrescuenetwork.com",
    images: [
      {
        url: "/opengraph_tagsapp.jpg", // Update with the correct path to your image
        width: 1200,
        height: 630,
        alt: "The Tags App OpenGraph Image - by Disc Rescue Network",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    images: [
      {
        url: "/opengraph_tagsapp.jpg", // Update with the correct path to your image
        width: 1200,
        height: 630,
        alt: "The Tags App OpenGraph Image - by Disc Rescue Network",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

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
