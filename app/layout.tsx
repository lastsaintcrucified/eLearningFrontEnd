import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthProvider } from "@/context/authContext";
import { DataProvider } from "@/context/dataContext";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "LearnHub - E-Learning Platform",
	description: "Modern E-Learning Platform for Students and Instructors",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<AuthProvider>
					<DataProvider>
						<ThemeProvider>
							<ThemeToggle />
							{children}
							<Toaster />
						</ThemeProvider>
					</DataProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
