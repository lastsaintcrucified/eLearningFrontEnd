/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/icons";
import { MobileNav } from "@/components/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
	SidebarProvider,
} from "@/components/ui/sidebar";
import { useAuth, withAuth } from "@/context/authContext";
import { useToast } from "@/components/ui/use-toast";

function DashboardLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const { user } = useAuth();
	const { logout } = useAuth();
	const router = useRouter();
	const { toast } = useToast();
	// console.log("user", user ? user : null);
	const isInstructor = user?.role === "instructor";
	const handleLogout = async () => {
		try {
			await logout();
			router.push("/login");
			// Redirect to login page or show a success message
		} catch (error: any) {
			toast({
				title: "Signup failed",
				description: error.message || "Failed to create your account.",
				variant: "destructive",
			});
		}
	};

	return (
		<SidebarProvider>
			<div className='flex min-h-screen flex-col w-full'>
				<header className='sticky top-0 z-40 border-b bg-background'>
					<div className='container flex h-16 items-center'>
						<div className='md:hidden'>
							<MobileNav />
						</div>
						<div className='flex items-center gap-2 md:hidden'>
							<Link
								href='/dashboard'
								className='flex items-center space-x-2'
							>
								<Icons.logo className='h-6 w-6' />
								<span className='font-bold'>Dashboard</span>
							</Link>
						</div>
						<div className='flex flex-1 items-center justify-end space-x-4'>
							<nav className='flex items-center space-x-2'>
								<Button
									variant='ghost'
									size='icon'
								>
									<Bell className='h-5 w-5' />
									<span className='sr-only'>Notifications</span>
								</Button>
								<ThemeToggle />
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant='ghost'
											className='relative h-8 w-8 rounded-full'
										>
											<Avatar className='h-8 w-8'>
												<AvatarImage
													src={"/placeholder.svg"}
													alt={user?.name}
												/>
												<AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
											</Avatar>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align='end'>
										<DropdownMenuLabel className='font-normal'>
											<div className='flex flex-col space-y-1'>
												<p className='text-sm font-medium leading-none'>
													{user?.name}
												</p>
												<p className='text-xs leading-none text-muted-foreground'>
													{user?.email}
												</p>
											</div>
										</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuItem asChild>
											<Link href='/dashboard/profile'>
												<Icons.user className='mr-2 h-4 w-4' />
												<span>Profile</span>
											</Link>
										</DropdownMenuItem>
										<DropdownMenuItem asChild>
											<Link href='/dashboard/settings'>
												<Icons.settings className='mr-2 h-4 w-4' />
												<span>Settings</span>
											</Link>
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem asChild>
											<Button onClick={handleLogout}>
												<LogOut className='mr-2 h-4 w-4' />
												<span>Log out</span>
											</Button>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</nav>
						</div>
					</div>
				</header>
				<div className='flex flex-1'>
					<Sidebar className='my-2'>
						<SidebarHeader className='flex items-center px-4 py-2'>
							<Link
								href='/'
								className='flex items-center gap-2'
							>
								<Icons.logo className='h-6 w-6' />
								<span className='font-bold'>LearnHub</span>
							</Link>
						</SidebarHeader>
						<SidebarContent>
							<SidebarGroup>
								<SidebarGroupLabel>Dashboard</SidebarGroupLabel>
								<SidebarGroupContent>
									<SidebarMenu>
										<SidebarMenuItem>
											<SidebarMenuButton
												asChild
												isActive={pathname === "/dashboard"}
											>
												<Link href='/dashboard'>
													<Icons.bookOpen className='mr-2 h-4 w-4' />
													<span>Overview</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
										{!isInstructor && (
											<SidebarMenuItem>
												<SidebarMenuButton
													asChild
													isActive={pathname === "/dashboard/enrollments"}
												>
													<Link href='/dashboard/enrollments'>
														<Icons.fileText className='mr-2 h-4 w-4' />
														<span>My Enrollments</span>
													</Link>
												</SidebarMenuButton>
											</SidebarMenuItem>
										)}
										{isInstructor && (
											<>
												<SidebarMenuItem>
													<SidebarMenuButton
														asChild
														isActive={pathname === "/instructor/courses"}
													>
														<Link href='/instructor/courses'>
															<Icons.bookOpen className='mr-2 h-4 w-4' />
															<span>My Courses</span>
														</Link>
													</SidebarMenuButton>
												</SidebarMenuItem>
												<SidebarMenuItem>
													<SidebarMenuButton
														asChild
														isActive={pathname === "/instructor/create"}
													>
														<Link href='/instructor/create'>
															<Icons.add className='mr-2 h-4 w-4' />
															<span>Create Course</span>
														</Link>
													</SidebarMenuButton>
												</SidebarMenuItem>
											</>
										)}
									</SidebarMenu>
								</SidebarGroupContent>
							</SidebarGroup>
							<SidebarGroup>
								<SidebarGroupLabel>Browse</SidebarGroupLabel>
								<SidebarGroupContent>
									<SidebarMenu>
										<SidebarMenuItem>
											<SidebarMenuButton
												asChild
												isActive={pathname === "/courses"}
											>
												<Link href='/courses'>
													<Icons.bookOpen className='mr-2 h-4 w-4' />
													<span>All Courses</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									</SidebarMenu>
								</SidebarGroupContent>
							</SidebarGroup>
							<SidebarGroup>
								<SidebarGroupLabel>Account</SidebarGroupLabel>
								<SidebarGroupContent>
									<SidebarMenu>
										<SidebarMenuItem>
											<SidebarMenuButton
												asChild
												isActive={pathname === "/dashboard/profile"}
											>
												<Link href='/dashboard/profile'>
													<Icons.user className='mr-2 h-4 w-4' />
													<span>Profile</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
										<SidebarMenuItem>
											<SidebarMenuButton
												asChild
												isActive={pathname === "/dashboard/settings"}
											>
												<Link href='/dashboard/settings'>
													<Icons.settings className='mr-2 h-4 w-4' />
													<span>Settings</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									</SidebarMenu>
								</SidebarGroupContent>
							</SidebarGroup>
						</SidebarContent>
						<SidebarFooter className='border-t p-4'>
							<div className='flex items-center gap-2'>
								<Avatar className='h-8 w-8'>
									<AvatarImage
										src={"/placeholder.svg"}
										alt={user?.name}
									/>
									<AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
								</Avatar>
								<div className='flex flex-col'>
									<p className='text-sm font-medium'>{user?.name}</p>
									<p className='text-xs text-muted-foreground capitalize'>
										{user?.role}
									</p>
								</div>
							</div>
						</SidebarFooter>
					</Sidebar>
					<main className='flex-1 p-6'>{children}</main>
				</div>
			</div>
		</SidebarProvider>
	);
}

export default withAuth(DashboardLayout);
