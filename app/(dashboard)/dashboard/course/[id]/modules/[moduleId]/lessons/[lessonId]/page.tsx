/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import {
	ChevronLeft,
	ChevronRight,
	Clock,
	FileText,
	Video,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";

// Mock course data
const course = {
	id: 1,
	title: "Advanced JavaScript",
	moduleDatas: [
		{
			id: 1,
			title: "JavaScript Fundamentals Review",
			lessons: [
				{
					id: 1,
					title: "Variables and Data Types",
					description: "Learn about JavaScript variables and data types",
					type: "video",
					duration: "15:30",
					videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
					content:
						"JavaScript has the following data types:\n\n- String\n- Number\n- Boolean\n- Object\n- Null\n- Undefined\n- Symbol\n- BigInt",
					completed: true,
				},
				{
					id: 2,
					title: "Functions and Scope",
					description: "Understanding functions and variable scope",
					type: "video",
					duration: "20:45",
					completed: true,
				},
				{
					id: 3,
					title: "Objects and Arrays",
					description: "Working with objects and arrays",
					type: "video",
					duration: "25:10",
					completed: true,
				},
			],
		},
		{
			id: 2,
			title: "Advanced Concepts",
			lessons: [
				{
					id: 4,
					title: "Closures",
					description: "Understanding closures in JavaScript",
					type: "video",
					duration: "30:15",
					completed: true,
				},
				{
					id: 5,
					title: "Prototypes and Inheritance",
					description: "Learn about JavaScript's prototype-based inheritance",
					type: "text",
					content:
						"JavaScript is a prototype-based language, which means that objects inherit directly from other objects. Every object in JavaScript has a prototype, from which it inherits properties and methods.\n\nWhen you access a property or method on an object, JavaScript first looks at the object itself. If it can't find the property or method there, it looks at the object's prototype. This chain of lookups continues until it either finds the property or reaches the end of the prototype chain.",
					completed: true,
				},
				{
					id: 6,
					title: "This Keyword",
					description: "Understanding the 'this' keyword in different contexts",
					type: "video",
					duration: "25:00",
					completed: true,
				},
			],
		},
	],
};

// Helper function to find a lesson by ID
function findLesson(
	courseData: typeof course,
	moduleDataId: number,
	lessonId: number
) {
	const moduleData = courseData.moduleDatas.find((m) => m.id === moduleDataId);
	if (!moduleData) return null;

	const lesson = moduleData.lessons.find((l) => l.id === lessonId);
	return lesson || null;
}

// Helper function to get next and previous lessons
function getAdjacentLessons(
	courseData: typeof course,
	currentmoduleDataId: number,
	currentLessonId: number
) {
	const allLessons: { moduleDataId: number; lesson: any }[] = [];
	courseData.moduleDatas.forEach((moduleData) => {
		moduleData.lessons.forEach((lesson) => {
			allLessons.push({ moduleDataId: moduleData.id, lesson });
		});
	});

	allLessons.sort((a, b) => {
		if (a.moduleDataId !== b.moduleDataId)
			return a.moduleDataId - b.moduleDataId;
		return a.lesson.id - b.lesson.id;
	});

	const currentIndex = allLessons.findIndex(
		(item) =>
			item.moduleDataId === currentmoduleDataId &&
			item.lesson.id === currentLessonId
	);

	const previous = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
	const next =
		currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

	return { previous, next };
}

export default function StudentLessonPage({
	params,
}: {
	params: { id: string; moduleDataId: string; lessonId: string };
}) {
	const courseId = Number.parseInt(params.id);
	const moduleDataId = Number.parseInt(params.moduleDataId);
	const lessonId = Number.parseInt(params.lessonId);

	const [isCompleted, setIsCompleted] = useState(false);

	// Find the current lesson
	const currentLesson = findLesson(course, moduleDataId, lessonId);
	const currentmoduleData = course.moduleDatas.find(
		(m) => m.id === moduleDataId
	);

	// Get next and previous lessons
	const { previous, next } = getAdjacentLessons(course, moduleDataId, lessonId);

	// Mark lesson as completed
	function markAsCompleted() {
		setIsCompleted(true);
		// In a real app, this would send an API request to update the completed status
	}

	if (!currentLesson || !currentmoduleData) {
		return (
			<div className='flex flex-col gap-6'>
				<div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
					<div>
						<h1 className='text-3xl font-bold tracking-tight'>
							Lesson Not Found
						</h1>
						<p className='text-muted-foreground'>
							The requested lesson could not be found.
						</p>
					</div>
					<Button asChild>
						<Link href={`/dashboard/course/${courseId}/modules`}>
							Back to moduleDatas
						</Link>
					</Button>
				</div>
			</div>
		);
	}

	// Helper function to get lesson type icon
	function getLessonTypeIcon(type: string) {
		switch (type) {
			case "video":
				return <Video className='h-4 w-4' />;
			case "text":
				return <FileText className='h-4 w-4' />;
			case "quiz":
				return <Icons.fileText className='h-4 w-4' />;
			default:
				return <FileText className='h-4 w-4' />;
		}
	}

	return (
		<div className='flex flex-col gap-6'>
			<div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
				<div>
					<div className='flex items-center gap-2 text-sm text-muted-foreground mb-1'>
						<Link
							href={`/dashboard/course/${courseId}/modules`}
							className='hover:underline'
						>
							moduleDatas
						</Link>
						<ChevronRight className='h-4 w-4' />
						<Link
							href={`/dashboard/course/${courseId}/modules`}
							className='hover:underline'
						>
							{currentmoduleData.title}
						</Link>
					</div>
					<h1 className='text-3xl font-bold tracking-tight'>
						{currentLesson.title}
					</h1>
					{currentLesson.description && (
						<p className='text-muted-foreground'>{currentLesson.description}</p>
					)}
				</div>
				<div className='flex items-center gap-2'>
					<Button
						variant='outline'
						asChild
					>
						<Link href={`/dashboard/course/${courseId}/modules`}>
							Back to moduleDatas
						</Link>
					</Button>
					{!currentLesson.completed && !isCompleted && (
						<Button onClick={markAsCompleted}>
							<Icons.check className='mr-2 h-4 w-4' />
							Mark as Completed
						</Button>
					)}
				</div>
			</div>

			{/* Display lesson metadata */}
			<div className='flex flex-wrap items-center gap-4'>
				<div className='flex items-center gap-1'>
					<Badge
						variant='outline'
						className='flex gap-1.5 items-center'
					>
						{getLessonTypeIcon(currentLesson.type)}
						<span className='capitalize'>{currentLesson.type}</span>
					</Badge>
				</div>
				{currentLesson.duration && (
					<div className='flex items-center gap-1.5 text-muted-foreground text-sm'>
						<Clock className='h-4 w-4' />
						<span>{currentLesson.duration}</span>
					</div>
				)}
				{(currentLesson.completed || isCompleted) && (
					<Badge className='bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'>
						Completed
					</Badge>
				)}
			</div>

			{/* Lesson content */}
			<Tabs
				defaultValue='content'
				className='space-y-4'
			>
				<TabsList>
					<TabsTrigger value='content'>Content</TabsTrigger>
					<TabsTrigger value='resources'>Resources</TabsTrigger>
					<TabsTrigger value='discussion'>Discussion</TabsTrigger>
					<TabsTrigger value='notes'>My Notes</TabsTrigger>
				</TabsList>
				<TabsContent
					value='content'
					className='space-y-4'
				>
					<Card>
						<CardContent className='pt-6'>
							{currentLesson.type === "video" ? (
								<div className='aspect-video w-full overflow-hidden rounded-md mb-6'>
									<iframe
										width='100%'
										height='100%'
										src={"dfgfdgfdg"}
										title={currentLesson.title}
										frameBorder='0'
										allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
										allowFullScreen
										className='aspect-video'
									></iframe>
								</div>
							) : null}

							<div className='prose max-w-none dark:prose-invert'>
								{currentLesson.content ? (
									<div className='whitespace-pre-line'>
										{currentLesson.content}
									</div>
								) : (
									<p className='text-muted-foreground'>
										This lesson has no content yet.
									</p>
								)}
							</div>
						</CardContent>
						<CardFooter className='flex justify-between border-t pt-6'>
							<div>
								{previous && (
									<Button
										variant='outline'
										asChild
									>
										<Link
											href={`/dashboard/course/${courseId}/modules/${previous.moduleDataId}/lessons/${previous.lesson.id}`}
										>
											<ChevronLeft className='mr-2 h-4 w-4' />
											Previous Lesson
										</Link>
									</Button>
								)}
							</div>
							<div className='flex items-center gap-2'>
								{!currentLesson.completed && !isCompleted && (
									<Button onClick={markAsCompleted}>
										<Icons.check className='mr-2 h-4 w-4' />
										Mark as Completed
									</Button>
								)}
								{next && (
									<Button asChild>
										<Link
											href={`/dashboard/course/${courseId}/modules/${next.moduleDataId}/lessons/${next.lesson.id}`}
										>
											Next Lesson
											<ChevronRight className='ml-2 h-4 w-4' />
										</Link>
									</Button>
								)}
							</div>
						</CardFooter>
					</Card>
				</TabsContent>
				<TabsContent value='resources'>
					<Card>
						<CardHeader>
							<CardTitle>Lesson Resources</CardTitle>
							<CardDescription>
								Download supplementary materials for this lesson.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='space-y-4'>
								<div className='rounded-md border'>
									<div className='p-4'>
										<p className='text-center text-muted-foreground'>
											No resources available for this lesson.
										</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value='discussion'>
					<Card>
						<CardHeader>
							<CardTitle>Lesson Discussion</CardTitle>
							<CardDescription>
								Ask questions and discuss this lesson with other students and
								instructors.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='h-[300px] flex items-center justify-center'>
								<p className='text-muted-foreground'>
									Discussion feature coming soon.
								</p>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value='notes'>
					<Card>
						<CardHeader>
							<CardTitle>My Notes</CardTitle>
							<CardDescription>
								Take personal notes for this lesson.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='space-y-4'>
								<textarea
									className='min-h-[300px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
									placeholder='Type your notes here...'
								/>
								<Button>Save Notes</Button>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
