/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
	ChevronLeft,
	ChevronRight,
	Clock,
	FileText,
	Video,
	Edit,
	Loader,
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
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/icons";
import { useAuth } from "@/context/authContext";
import {
	Course,
	createLesson,
	getCourseById,
	Lesson,
	Module,
	updateLesson,
} from "@/lib/data/data";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

// Schema for lesson content form
const lessonContentFormSchema = z.object({
	title: z.string().optional(),
	completed: z.boolean().optional(),
	content: z.string().optional(),
});

export default function LessonPage({
	params,
}: {
	params: Promise<{ id: string; moduleId: string; lessonId: string }>;
}) {
	const { id, moduleId, lessonId } = use(params);
	const courseId = id;
	const router = useRouter();
	const { user } = useAuth();
	const [isEditing, setIsEditing] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [currentLesson, setCurrentLesson] = useState<Lesson | undefined>();
	const [currentModuleData, setCurrentModuleData] = useState<
		Module | undefined
	>();
	const [prevNxt, setPrevNxt] = useState<any>(undefined);

	const [loading, setLoading] = useState(false);

	// Helper function to find a lesson by moduleDataId and lessonId
	function findLesson(
		courseData: Course | undefined,
		moduleDataId: number,
		lessonId: number
	) {
		const moduleData = courseData?.modules.find((m) => +m.id === moduleDataId);
		// console.log("dfgfdg", moduleData);
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
		const allLessons: { moduleDataId: number; lesson: any }[] = [];
		courseData?.modules.forEach((moduleData) => {
			moduleData.lessons.forEach((lesson) => {
				allLessons.push({ moduleDataId: +moduleData.id, lesson });
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
			currentIndex < allLessons.length - 1
				? allLessons[currentIndex + 1]
				: undefined;

		return { previous, next };
	}
	useEffect(() => {
		setLoading(true);
		async function fetchCourse() {
			const data = await getCourseById(id);
			if (data) {
				const tempLesson = findLesson(data, +moduleId, +lessonId);
				// console.log("tempLesson", tempLesson);
				setCurrentLesson(tempLesson);
				setCurrentModuleData(data.modules.find((m) => m.id === moduleId));
				const prevNxt = getAdjacentLessons(data, +moduleId, +lessonId);
				// console.log(prevNxt);
				setPrevNxt(prevNxt);
			} else {
				console.error("Course not found");
			}
			setLoading(false);
		}
		fetchCourse();
	}, [id, user?.role]);

	// Determine if user is an instructor (in a real app this would come from auth)
	const isInstructor = true;

	// Define role-specific actions

	// Form for editing lesson content
	const form = useForm<z.infer<typeof lessonContentFormSchema>>({
		resolver: zodResolver(lessonContentFormSchema),
		defaultValues: {
			title: currentLesson?.title || "",
			content: currentLesson?.content || "",
			completed: currentLesson?.completed || false,
		},
	});

	async function onSubmit(values: z.infer<typeof lessonContentFormSchema>) {
		try {
			setIsLoading(true);
			console.log("values", values);
			// Simulate an API call to save the lesson content
			// console.log(values);

			const data = await updateLesson(
				lessonId,
				moduleId,
				values.title ? values.title : currentLesson?.title,
				values.content ? values.content : currentLesson?.content,
				values.completed ? values.completed : currentLesson?.completed,
				user?.role
			);
			setCurrentLesson(data);
			setIsLoading(false);
			setIsEditing(false);
			toast({
				title: "Success",
				description: "Lesson content saved successfully.",
				variant: "default",
			});
			form.reset();
		} catch (error: any) {
			toast({
				title: "Error",
				description: "Failed to save lesson content.",
				variant: "destructive",
			});
			setIsLoading(false);
		}
	}

	if (loading) {
		return (
			<div className='flex flex-col gap-6'>
				{/* <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
					<div>
						<h1 className='text-3xl font-bold tracking-tight'>
							Lesson Not Found
						</h1>
						<p className='text-muted-foreground'>
							The requested lesson could not be found.
						</p>
					</div>
					<Button asChild>
						<Link href={`/instructor/course/${courseId}/modules`}>
							Back to modules
						</Link>
					</Button>
				</div> */}
				<Loader className='h-8 w-8 animate-spin' />
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
							href={`/instructor/course/${courseId}/modules`}
							className='hover:underline'
						>
							modules
						</Link>
						<ChevronRight className='h-4 w-4' />
						<Link
							href={`/instructor/course/${courseId}/modules`}
							className='hover:underline'
						>
							{currentModuleData?.title}
						</Link>
					</div>
					<h1 className='text-3xl font-bold tracking-tight'>
						{currentLesson?.title}
					</h1>
					{currentLesson?.content && (
						<p className='text-muted-foreground'>{currentLesson?.content}</p>
					)}
				</div>
				<div className='flex items-center gap-2'>
					<Button
						variant='outline'
						asChild
					>
						<Link href={`/instructor/course/${courseId}/modules`}>
							Back to modules
						</Link>
					</Button>
					<Button onClick={() => setIsEditing(true)}>
						<Edit className='mr-2 h-4 w-4' />
						Edit Lesson
					</Button>
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
			</div>

			{/* Lesson content */}
			{isEditing ? (
				<Card>
					<CardHeader>
						<CardTitle>Edit Lesson</CardTitle>
						<CardDescription>
							Update the content and details of this lesson.
						</CardDescription>
					</CardHeader>
					<Form {...form}>
						<CardContent className='space-y-4'>
							<FormField
								control={form.control}
								name='title'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Lesson Title</FormLabel>
										<FormControl>
											<Input
												placeholder={`${currentLesson?.title}`}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='completed'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Completed?</FormLabel>
										<FormControl>
											<Input
												type='checkbox'
												checked={field.value}
												className=' h-4 w-4'
												onChange={(e) => field.onChange(e.target.checked)}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='content'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Content</FormLabel>
										<FormControl>
											<Textarea
												placeholder={`${currentLesson?.content}`}
												className='min-h-[300px] font-mono'
												{...field}
											/>
										</FormControl>
										<FormDescription>
											The main content of your lesson. You can use Markdown for
											formatting.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
						<CardFooter className='flex justify-between'>
							<Button
								type='button'
								variant='outline'
								onClick={() => setIsEditing(false)}
							>
								Cancel
							</Button>
							<Button
								onClick={form.handleSubmit(onSubmit)}
								disabled={isLoading}
							>
								{isLoading && (
									<Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
								)}
								Save Changes
							</Button>
						</CardFooter>
					</Form>
				</Card>
			) : (
				<Tabs
					defaultValue='content'
					className='space-y-4'
				>
					<TabsList>
						<TabsTrigger value='content'>Content</TabsTrigger>
						<TabsTrigger value='resources'>Resources</TabsTrigger>
						<TabsTrigger value='discussion'>Discussion</TabsTrigger>
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
									{prevNxt?.previous && (
										<Button
											variant='outline'
											asChild
										>
											<Link
												href={`/instructor/course/${courseId}/modules/${prevNxt?.previous.moduleDataId}/lessons/${prevNxt?.previous.lesson.id}`}
											>
												<ChevronLeft className='mr-2 h-4 w-4' />
												Previous Lesson
											</Link>
										</Button>
									)}
								</div>
								<div>
									{prevNxt?.next && (
										<Button asChild>
											<Link
												href={`/instructor/course/${courseId}/modules/${prevNxt?.next.moduleDataId}/lessons/${prevNxt?.next.lesson.id}`}
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
									{isInstructor && (
										<div className='mb-6'>
											<Button variant='outline'>
												<FileText className='mr-2 h-4 w-4' />
												Upload Resource
											</Button>
										</div>
									)}
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
				</Tabs>
			)}
		</div>
	);
}
