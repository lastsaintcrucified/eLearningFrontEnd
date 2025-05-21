/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
	ChevronLeft,
	ChevronRight,
	Clock,
	FileText,
	Loader,
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
import { Course, getCourseById, Lesson, Module } from "@/lib/data/data";
import { useAuth } from "@/context/authContext";

export default function StudentLessonPage({
	params,
}: {
	params: Promise<{ id: string; moduleId: string; lessonId: string }>;
}) {
	const { id: courseId, moduleId: moduleDataId, lessonId } = use(params);
	const [isCompleted, setIsCompleted] = useState(false);
	const { user } = useAuth();
	const [loading, setLoading] = useState(false);
	const [currentLesson, setCurrentLesson] = useState<Lesson | undefined>();
	const [currentModuleData, setCurrentModuleData] = useState<
		Module | undefined
	>();
	const [prevNxt, setPrevNxt] = useState<any>(undefined);

	// Helper function to find a lesson by ID
	function findLesson(
		courseData: Course | undefined,
		moduleDataId: number,
		lessonId: number
	) {
		console.log(moduleDataId, lessonId);
		const moduleData = courseData?.modules.find((m) => +m.id === moduleDataId);
		console.log(moduleData, " moduleData");
		if (!moduleData) return undefined;

		const lesson = moduleData.lessons.find((l) => +l.id === lessonId);
		return lesson || undefined;
	}

	// Helper function to get next and previous lessons
	function getAdjacentLessons(
		courseData: Course | undefined,
		currentmoduleDataId: number,
		currentLessonId: number
	) {
		const allLessons: { moduleDataId: string; lesson: any }[] = [];
		courseData?.modules.forEach((moduleData) => {
			moduleData.lessons.forEach((lesson) => {
				allLessons.push({ moduleDataId: moduleData.id, lesson });
			});
		});

		allLessons.sort((a, b) => {
			if (+a.moduleDataId !== +b.moduleDataId)
				return +a.moduleDataId - +b.moduleDataId;
			return +a.lesson.id - +b.lesson.id;
		});

		const currentIndex = allLessons.findIndex(
			(item) =>
				+item.moduleDataId === currentmoduleDataId &&
				item.lesson.id === currentLessonId
		);

		const previous = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
		const next =
			currentIndex < allLessons.length - 1
				? allLessons[currentIndex + 1]
				: null;

		return { previous, next };
	}

	useEffect(() => {
		setLoading(true);
		async function fetchCourse() {
			const data = await getCourseById(courseId);
			console.log("data", data);
			if (data) {
				const tempLesson = findLesson(data, +moduleDataId, +lessonId);
				console.log("tempLesson", tempLesson);
				setCurrentLesson(tempLesson);
				setCurrentModuleData(data.modules.find((m) => m.id === moduleDataId));
				const prevNxt = getAdjacentLessons(data, +moduleDataId, +lessonId);
				// console.log(prevNxt);
				setPrevNxt(prevNxt);
			} else {
				console.error("Course not found");
			}
			setLoading(false);
		}
		fetchCourse();
	}, [courseId, user?.role]);

	// Mark lesson as completed
	function markAsCompleted() {
		setIsCompleted(true);
		// In a real app, this would send an API request to update the completed status
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
	if (loading) {
		return (
			<div className='flex flex-col gap-6'>
				<Loader className='h-8 w-8 animate-spin' />
			</div>
		);
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
							Modules
						</Link>
						<ChevronRight className='h-4 w-4' />
						<Link
							href={`/dashboard/course/${courseId}/modules`}
							className='hover:underline'
						>
							{currentModuleData?.title}
						</Link>
					</div>
					<h1 className='text-3xl font-bold tracking-tight'>
						{currentLesson?.title}
					</h1>
					{currentLesson?.content && (
						<p className='text-muted-foreground'>{currentLesson.content}</p>
					)}
				</div>
				<div className='flex items-center gap-2'>
					<Button
						variant='outline'
						asChild
					>
						<Link href={`/dashboard/course/${courseId}/modules`}>
							Back to modules
						</Link>
					</Button>
					{!currentLesson?.completed && !isCompleted && (
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
						{getLessonTypeIcon("text")}
						<span className='capitalize'>Text</span>
					</Badge>
				</div>
				{currentLesson?.duration && (
					<div className='flex items-center gap-1.5 text-muted-foreground text-sm'>
						<Clock className='h-4 w-4' />
						<span>{currentLesson?.duration}</span>
					</div>
				)}
				{(currentLesson?.completed || isCompleted) && (
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
							<div className='prose max-w-none dark:prose-invert'>
								{currentLesson?.content ? (
									<div className='whitespace-pre-line'>
										{currentLesson?.content}
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
								{prevNxt?.previous && (
									<Button
										variant='outline'
										asChild
									>
										<Link
											href={`/dashboard/course/${courseId}/modules/${prevNxt?.previous.moduleDataId}/lessons/${prevNxt?.previous.lesson.id}`}
										>
											<ChevronLeft className='mr-2 h-4 w-4' />
											Previous Lesson
										</Link>
									</Button>
								)}
							</div>
							<div className='flex items-center gap-2'>
								{!currentLesson?.completed && !isCompleted && (
									<Button onClick={markAsCompleted}>
										<Icons.check className='mr-2 h-4 w-4' />
										Mark as Completed
									</Button>
								)}
								{prevNxt?.next && (
									<Button asChild>
										<Link
											href={`/dashboard/course/${courseId}/modules/${prevNxt?.next.moduleDataId}/lessons/${prevNxt?.next.lesson.id}`}
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
