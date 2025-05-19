import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

// Mock data for enrolled courses
const enrolledCourses = [
	{
		id: 1,
		title: "Advanced JavaScript",
		instructor: "Jane Smith",
		progress: 45,
		totalLessons: 24,
		completedLessons: 11,
		image: "/placeholder.svg?height=100&width=250",
		lastAccessed: "2 days ago",
	},
	{
		id: 2,
		title: "React Fundamentals",
		instructor: "John Johnson",
		progress: 20,
		totalLessons: 18,
		completedLessons: 4,
		image: "/placeholder.svg?height=100&width=250",
		lastAccessed: "1 week ago",
	},
	{
		id: 3,
		title: "Node.js Basics",
		instructor: "Sarah Williams",
		progress: 10,
		totalLessons: 15,
		completedLessons: 2,
		image: "/placeholder.svg?height=100&width=250",
		lastAccessed: "2 weeks ago",
	},
	{
		id: 4,
		title: "HTML & CSS Fundamentals",
		instructor: "Michael Brown",
		progress: 100,
		totalLessons: 12,
		completedLessons: 12,
		image: "/placeholder.svg?height=100&width=250",
		lastAccessed: "1 month ago",
		completed: true,
	},
];

export default function EnrollmentsPage() {
	return (
		<div className='flex flex-col gap-4'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>My Enrollments</h1>
					<p className='text-muted-foreground'>
						Manage and track your enrolled courses
					</p>
				</div>
				<Button asChild>
					<Link href='/courses'>Browse More Courses</Link>
				</Button>
			</div>

			<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
				{enrolledCourses.map((course) => (
					<Card
						key={course.id}
						className='overflow-hidden'
					>
						<div className='aspect-video w-full overflow-hidden'>
							<Image
								src={course.image || "/placeholder.svg"}
								alt={course.title}
								className='h-full w-full object-cover'
								height={100}
								width={250}
							/>
						</div>
						<CardHeader className='p-4'>
							<div className='flex justify-between items-start'>
								<CardTitle className='line-clamp-1'>{course.title}</CardTitle>
								{course.completed && (
									<Badge
										variant='outline'
										className='bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
									>
										Completed
									</Badge>
								)}
							</div>
							<CardDescription>Instructor: {course.instructor}</CardDescription>
						</CardHeader>
						<CardContent className='p-4 pt-0'>
							<div className='space-y-2'>
								<div className='flex items-center justify-between text-sm'>
									<span>Progress</span>
									<span>{course.progress}%</span>
								</div>
								<div className='h-2 w-full rounded-full bg-secondary'>
									<div
										className='h-full rounded-full bg-primary'
										style={{ width: `${course.progress}%` }}
									></div>
								</div>
								<div className='flex justify-between text-sm text-muted-foreground'>
									<span>
										{course.completedLessons} / {course.totalLessons} lessons
									</span>
									<span>Last accessed: {course.lastAccessed}</span>
								</div>
							</div>
						</CardContent>
						<CardFooter className='p-4 pt-0'>
							<Button
								asChild
								className='w-full'
							>
								<Link href={`/dashboard/course/${course.id}`}>
									{course.completed ? "Review Course" : "Continue Learning"}
								</Link>
							</Button>
						</CardFooter>
					</Card>
				))}
			</div>
		</div>
	);
}
