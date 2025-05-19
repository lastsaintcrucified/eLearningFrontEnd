/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Loader, LogOut, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icons } from "@/components/icons";
import { MobileNav } from "@/components/mobile-nav";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth, withAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { Course, getCourses } from "@/lib/data/data";

// Mock data for courses
// const allCourses = [
// 	{
// 		id: 1,
// 		title: "Advanced JavaScript",
// 		instructor: "Jane Smith",
// 		description:
// 			"Master advanced JavaScript concepts including closures, prototypes, async programming, and more.",
// 		price: "$49.99",
// 		image: "/placeholder.svg?height=150&width=250",
// 		category: "Programming",
// 		level: "Advanced",
// 		rating: 4.8,
// 		students: 245,
// 	},
// 	{
// 		id: 2,
// 		title: "React Hooks Masterclass",
// 		instructor: "John Johnson",
// 		description:
// 			"Learn how to use React Hooks to build powerful and reusable components.",
// 		price: "$39.99",
// 		image: "/placeholder.svg?height=150&width=250",
// 		category: "Web Development",
// 		level: "Intermediate",
// 		rating: 4.7,
// 		students: 189,
// 	},
// 	{
// 		id: 3,
// 		title: "Node.js API Development",
// 		instructor: "Sarah Williams",
// 		description:
// 			"Build robust and scalable APIs with Node.js, Express, and MongoDB.",
// 		price: "$59.99",
// 		image: "/placeholder.svg?height=150&width=250",
// 		category: "Web Development",
// 		level: "Intermediate",
// 		rating: 4.9,
// 		students: 312,
// 	},
// 	{
// 		id: 4,
// 		title: "HTML & CSS Fundamentals",
// 		instructor: "Michael Brown",
// 		description:
// 			"Learn the basics of HTML and CSS to build beautiful websites.",
// 		price: "$29.99",
// 		image: "/placeholder.svg?height=150&width=250",
// 		category: "Web Development",
// 		level: "Beginner",
// 		rating: 4.5,
// 		students: 521,
// 	},
// 	{
// 		id: 5,
// 		title: "Python for Data Science",
// 		instructor: "Emily Davis",
// 		description:
// 			"Learn how to use Python for data analysis, visualization, and machine learning.",
// 		price: "$69.99",
// 		image: "/placeholder.svg?height=150&width=250",
// 		category: "Data Science",
// 		level: "Intermediate",
// 		rating: 4.8,
// 		students: 412,
// 	},
// 	{
// 		id: 6,
// 		title: "UI/UX Design Principles",
// 		instructor: "David Wilson",
// 		description:
// 			"Master the principles of user interface and user experience design.",
// 		price: "$49.99",
// 		image: "/placeholder.svg?height=150&width=250",
// 		category: "Design",
// 		level: "Beginner",
// 		rating: 4.6,
// 		students: 287,
// 	},
// ];

function CoursesPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const { user } = useAuth();
	const { logout } = useAuth();
	const router = useRouter();
	const { toast } = useToast();
	const [courses, setCourses] = useState<Course[]>([]);
	const [loading, setLoading] = useState(false);

	// console.log("courses", courses);

	useEffect(() => {
		setLoading(true);
		async function fetchCourses() {
			try {
				const data = await getCourses();
				setCourses(data);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching courses:", error);
			}
		}
		fetchCourses();
	}, []);

	const filteredCourses = courses?.length
		? courses.filter(
				(course) =>
					course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					course.instructor.name
						.toLowerCase()
						.includes(searchQuery.toLowerCase()) ||
					course.description.toLowerCase().includes(searchQuery.toLowerCase())
		  )
		: [];
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
		<div className='flex min-h-screen flex-col px-2'>
			<header className='sticky top-0 z-40 w-full border-b bg-background'>
				<div className='flex h-16 items-center justify-between'>
					<div className='md:hidden'>
						<MobileNav />
					</div>
					<div className='flex items-center gap-2 '>
						<Link
							href='/dashboard'
							className='flex items-center space-x-2'
						>
							<Icons.logo className='h-6 w-6' />
							<span className='font-bold'>Dashboard</span>
						</Link>
					</div>
					<div className='flex flex-1 items-center justify-end  space-x-4'>
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
			<main className='flex-1 px-2'>
				<div className='container py-6 md:py-8'>
					<div className='flex flex-col gap-4'>
						<div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
							<div>
								<h1 className='text-3xl font-bold tracking-tight'>
									Browse Courses
								</h1>
								<p className='text-muted-foreground'>
									Discover courses taught by expert instructors
								</p>
							</div>
						</div>

						<div className='flex items-center gap-4'>
							<div className='relative flex-1'>
								<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
								<Input
									type='search'
									placeholder='Search courses...'
									className='pl-8'
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							</div>
						</div>

						{loading ? (
							<Loader className='h-8 w-8 animate-spin' />
						) : filteredCourses?.length === 0 ? (
							<div className='flex flex-col items-center justify-center py-8'>
								<p className='text-lg font-semibold'>No courses found</p>
								<p className='text-sm text-muted-foreground'>
									Try adjusting your search or check back later.
								</p>
							</div>
						) : (
							<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
								{filteredCourses?.map((course) => (
									<Card
										key={course.id}
										className='overflow-hidden'
									>
										<div className='aspect-video w-full overflow-hidden'>
											<Image
												src={"/placeholder.png"}
												alt={course.title}
												className='h-full w-full object-cover'
												width={250}
												height={150}
											/>
										</div>
										<CardHeader className='p-4'>
											<div className='flex justify-between items-start'>
												<CardTitle className='line-clamp-1'>
													{course.title}
												</CardTitle>
											</div>
											<CardDescription>
												Instructor: {course.instructor.name}
											</CardDescription>
										</CardHeader>
										<CardContent className='p-4 pt-0'>
											<p className='line-clamp-2 text-sm text-muted-foreground mb-4'>
												{course.description}
											</p>
											<div className='flex flex-wrap gap-2 mb-4'>
												<Badge variant='outline'>static</Badge>
												<Badge variant='outline'>static</Badge>
											</div>
											<div className='flex justify-between items-center'>
												<div className='flex items-center gap-1'>
													<svg
														xmlns='http://www.w3.org/2000/svg'
														viewBox='0 0 24 24'
														fill='currentColor'
														className='h-4 w-4 text-yellow-500'
													>
														<path
															fillRule='evenodd'
															d='M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z'
															clipRule='evenodd'
														/>
													</svg>
													<span className='text-sm font-medium'>4.8</span>
													<span className='text-sm text-muted-foreground'>
														(4.5/static)
													</span>
												</div>
												<span className='text-lg font-bold'>(245/static)</span>
											</div>
										</CardContent>
										<CardFooter className='p-4 pt-0'>
											<Button
												asChild
												className='w-full'
											>
												<Link href={`/dashboard/course/${course.id}`}>
													View Course
												</Link>
											</Button>
										</CardFooter>
									</Card>
								))}
							</div>
						)}
					</div>
				</div>
			</main>
			<footer className='border-t py-6 md:py-0'>
				<div className='container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row'>
					<p className='text-center text-sm leading-loose text-muted-foreground md:text-left'>
						&copy; {new Date().getFullYear()} LearnHub. All rights reserved.
					</p>
				</div>
			</footer>
		</div>
	);
}

export default withAuth(CoursesPage);
