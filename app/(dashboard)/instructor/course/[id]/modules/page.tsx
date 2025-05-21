"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
	Edit,
	Grip,
	MoreHorizontal,
	Plus,
	Trash,
	FileText,
	Video,
	Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Icons } from "@/components/icons";
import {
	Course,
	createLesson,
	createModule,
	deleteLesson,
	deleteModule,
	getCourseById,
	getModulesByCourseId,
	Module,
} from "@/lib/data/data";
import { useAuth } from "@/context/authContext";

// Schema for module form
const moduleFormSchema = z.object({
	title: z.string().min(1, {
		message: "Module title is required.",
	}),
	description: z.string().optional(),
});

// Schema for lesson form
const lessonFormSchema = z.object({
	title: z.string().min(1, {
		message: "Lesson title is required.",
	}),
	content: z.string().optional(),
	completed: z.boolean(),
	duration: z.string().optional(),
});

// Mock course data
// const course = {
// 	id: 1,
// 	title: "Advanced JavaScript",
// 	modules: [
// 		{
// 			id: 1,
// 			title: "JavaScript Fundamentals Review",
// 			description: "Review of basic JavaScript concepts",
// 			lessons: [
// 				{
// 					id: 1,
// 					title: "Variables and Data Types",
// 					description: "Learn about JavaScript variables and data types",
// 					type: "video",
// 					duration: "15:30",
// 					completed: true,
// 				},
// 				{
// 					id: 2,
// 					title: "Functions and Scope",
// 					description: "Understanding functions and variable scope",
// 					type: "video",
// 					duration: "20:45",
// 					completed: true,
// 				},
// 				{
// 					id: 3,
// 					title: "Objects and Arrays",
// 					description: "Working with objects and arrays",
// 					type: "video",
// 					duration: "25:10",
// 					completed: true,
// 				},
// 			],
// 		},
// 		{
// 			id: 2,
// 			title: "Advanced Concepts",
// 			description: "Dive into more advanced JavaScript topics",
// 			lessons: [
// 				{
// 					id: 4,
// 					title: "Closures",
// 					description: "Understanding closures in JavaScript",
// 					type: "video",
// 					duration: "30:15",
// 					completed: true,
// 				},
// 				{
// 					id: 5,
// 					title: "Prototypes and Inheritance",
// 					description: "Learn about JavaScript's prototype-based inheritance",
// 					type: "text",
// 					completed: true,
// 				},
// 				{
// 					id: 6,
// 					title: "This Keyword",
// 					description: "Understanding the 'this' keyword in different contexts",
// 					type: "video",
// 					duration: "25:00",
// 					completed: true,
// 				},
// 				{
// 					id: 7,
// 					title: "Call, Apply, and Bind",
// 					description: "Learn about function methods: call, apply, and bind",
// 					type: "quiz",
// 					completed: true,
// 				},
// 			],
// 		},
// 	],
// };

export default function ModulesPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const courseId = id;
	const { user } = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const [moduleDialogOpen, setModuleDialogOpen] = useState(false);
	const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
	const [selectedModuleId, setSelectedModuleId] = useState<string>("");
	const [modules, setModules] = useState<Module[] | undefined>([]);
	const [course, setCourse] = useState<Course | undefined>();

	useEffect(() => {
		async function fetchCourse() {
			const data = await getCourseById(id);
			setCourse(data);
		}
		fetchCourse();
		async function fetchModules() {
			if (user?.role) {
				const data = await getModulesByCourseId(courseId, user?.role);
				setModules(data);
				// console.log("Role: ", user.role);
			}
		}
		fetchCourse();
		fetchModules();
	}, [courseId, user?.role]);

	// Form for adding/editing a module
	const moduleForm = useForm<z.infer<typeof moduleFormSchema>>({
		resolver: zodResolver(moduleFormSchema),
		defaultValues: {
			title: "",
			description: "",
		},
	});

	// Form for adding/editing a lesson
	const lessonForm = useForm<z.infer<typeof lessonFormSchema>>({
		resolver: zodResolver(lessonFormSchema),
		defaultValues: {
			title: "",
			content: "",
			completed: false,
			duration: "",
		},
	});

	//add module
	async function onModuleSubmit(values: z.infer<typeof moduleFormSchema>) {
		setIsLoading(true);
		const data = await createModule(
			courseId,
			values.title,
			values.description,
			user?.role
		);
		const tempModules = [...(modules ?? [])];
		if (data !== undefined) {
			tempModules.push(data);
			setModules(tempModules);
		}

		setIsLoading(false);
		setModuleDialogOpen(false);
		moduleForm.reset();
	}

	//add lesson
	async function onLessonSubmit(values: z.infer<typeof lessonFormSchema>) {
		setIsLoading(true);

		const data = await createLesson(
			selectedModuleId,
			values.title,
			values.content,
			values.completed,
			user?.role
		);
		// console.log("Creating/Updating Lesson:", data);
		const tmpModules = [...(modules ?? [])];
		const moduleIndex = tmpModules.findIndex(
			(module) => module.id === selectedModuleId
		);
		if (moduleIndex !== -1 && data !== undefined) {
			tmpModules[moduleIndex].lessons.push(data);
			setModules(tmpModules);
		}

		setIsLoading(false);
		setLessonDialogOpen(false);
		lessonForm.reset();
	}

	//Delete lesson
	async function handleDeleteLesson(lessonId: string, moduleId: string) {
		setIsLoading(true);
		await deleteLesson(moduleId, lessonId);
		const tmpModules = [...(modules ?? [])];
		const moduleIndex = tmpModules.findIndex(
			(module) => module.id === moduleId
		);
		if (moduleIndex !== -1) {
			const lessonIndex = tmpModules[moduleIndex].lessons.findIndex(
				(lesson) => lesson.id === lessonId
			);
			if (lessonIndex !== -1) {
				tmpModules[moduleIndex].lessons.splice(lessonIndex, 1);
				setModules(tmpModules);
			}
		}
		setIsLoading(false);
	}

	//Delete module
	async function handleDeleteModule(moduleId: string) {
		setIsLoading(true);
		const data = await deleteModule(courseId, moduleId);
		setIsLoading(false);
		if (data) {
			const tmpModules = [...(modules ?? [])];
			const moduleIndex = tmpModules.findIndex(
				(module) => module.id === moduleId
			);
			if (moduleIndex !== -1) {
				tmpModules.splice(moduleIndex, 1);
				setModules(tmpModules);
			}
		}
	}
	function openAddLessonDialog(moduleId: string) {
		setSelectedModuleId(moduleId);
		lessonForm.reset({
			title: "",
			content: "",
			completed: false,
			duration: "",
		});
		setLessonDialogOpen(true);
	}

	function getLessonIcon(type: string) {
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
					<h1 className='text-3xl font-bold tracking-tight'>{course?.title}</h1>
					<p className='text-muted-foreground'>
						Manage course modules and lessons
					</p>
				</div>
				<div className='flex items-center gap-2'>
					<Button
						variant='outline'
						asChild
					>
						<Link href={`/instructor/courses`}>Back to Courses</Link>
					</Button>
					<Button
						onClick={() => {
							moduleForm.reset({
								title: "",
								description: "",
							});
							setModuleDialogOpen(true);
						}}
					>
						<Plus className='mr-2 h-4 w-4' />
						Add Module
					</Button>
				</div>
			</div>

			{modules?.length === 0 ? (
				<Card>
					<CardContent className='flex flex-col items-center justify-center py-12'>
						<div className='flex flex-col items-center justify-center text-center'>
							<Icons.fileText className='h-10 w-10 text-muted-foreground/60' />
							<h3 className='mt-4 text-lg font-semibold'>No modules yet</h3>
							<p className='mb-4 mt-2 text-sm text-muted-foreground'>
								Get started by creating your first module for this course.
							</p>
							<Button
								onClick={() => {
									moduleForm.reset({
										title: "",
										description: "",
									});
									setModuleDialogOpen(true);
								}}
							>
								<Plus className='mr-2 h-4 w-4' />
								Add Module
							</Button>
						</div>
					</CardContent>
				</Card>
			) : (
				<div className='space-y-6'>
					{modules?.map((module, moduleIndex) => (
						<Card
							key={module.id}
							className='relative'
						>
							<CardHeader className='pb-3'>
								<div className='flex items-center justify-between'>
									<div className='flex items-center gap-2'>
										<div className='flex h-8 w-8 items-center justify-center rounded-md border bg-muted'>
											{moduleIndex + 1}
										</div>
										<div>
											<CardTitle>{module.title}</CardTitle>
											{module.description && (
												<CardDescription>{module.description}</CardDescription>
											)}
										</div>
									</div>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant='ghost'
												size='icon'
											>
												<MoreHorizontal className='h-4 w-4' />
												<span className='sr-only'>More options</span>
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align='end'>
											<DropdownMenuItem
												onClick={() => {
													moduleForm.reset({
														title: module.title,
														description: module.description,
													});
													setModuleDialogOpen(true);
												}}
											>
												<Edit className='mr-2 h-4 w-4' />
												Edit Module
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => openAddLessonDialog(module.id)}
											>
												<Plus className='mr-2 h-4 w-4' />
												Add Lesson
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => handleDeleteModule(module.id)}
												className='text-destructive'
											>
												<Trash className='mr-2 h-4 w-4' />
												Delete Module
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</CardHeader>
							<CardContent>
								<div className='space-y-2'>
									{module.lessons && module.lessons.length === 0 ? (
										<Alert variant='default'>
											<AlertDescription>
												This module has no lessons yet. Add your first lesson to
												get started.
											</AlertDescription>
										</Alert>
									) : (
										<Accordion
											type='single'
											collapsible
											defaultValue='item-0'
										>
											<AccordionItem value='item-0'>
												<AccordionTrigger className='text-sm font-medium hover:no-underline'>
													Lessons ({module.lessons ? module.lessons.length : 0})
												</AccordionTrigger>
												<AccordionContent>
													<div className='space-y-2'>
														{module.lessons &&
															module.lessons.map((lesson, lessonIndex) => (
																<div
																	key={lesson.id}
																	className='flex items-center justify-between rounded-md border p-3 text-sm'
																>
																	<div className='flex items-center gap-3'>
																		<div className='flex h-6 w-6 items-center justify-center rounded-md border bg-muted text-xs'>
																			{lessonIndex + 1}
																		</div>
																		<div className='flex items-center gap-2'>
																			{getLessonIcon("default")}
																			<Link
																				href={`/instructor/course/${courseId}/modules/${module.id}/lessons/${lesson.id}`}
																				className='font-medium hover:underline'
																			>
																				{lesson.title}
																			</Link>
																		</div>
																	</div>
																	<div className='flex items-center gap-3'>
																		{lesson.duration && (
																			<div className='flex items-center gap-1 text-muted-foreground'>
																				<Clock className='h-3.5 w-3.5' />
																				<span className='text-xs'>
																					{lesson.duration}
																				</span>
																			</div>
																		)}
																		<DropdownMenu>
																			<DropdownMenuTrigger asChild>
																				<Button
																					variant='ghost'
																					size='icon'
																					className='h-8 w-8'
																				>
																					<MoreHorizontal className='h-4 w-4' />
																					<span className='sr-only'>
																						More options
																					</span>
																				</Button>
																			</DropdownMenuTrigger>
																			<DropdownMenuContent align='end'>
																				<DropdownMenuItem asChild>
																					<Link
																						href={`/instructor/course/${courseId}/modules/${module.id}/lessons/${lesson.id}/edit`}
																					>
																						<Edit className='mr-2 h-4 w-4' />
																						Edit Lesson
																					</Link>
																				</DropdownMenuItem>
																				<DropdownMenuItem
																					onClick={() =>
																						handleDeleteLesson(
																							lesson.id,
																							module.id
																						)
																					}
																					className='text-destructive'
																				>
																					<Trash className='mr-2 h-4 w-4' />
																					Delete Lesson
																				</DropdownMenuItem>
																			</DropdownMenuContent>
																		</DropdownMenu>
																	</div>
																</div>
															))}
													</div>
													<Button
														variant='outline'
														size='sm'
														className='mt-4'
														onClick={() => openAddLessonDialog(module.id)}
													>
														<Plus className='mr-2 h-4 w-4' />
														Add Lesson
													</Button>
												</AccordionContent>
											</AccordionItem>
										</Accordion>
									)}
								</div>
							</CardContent>
							<div className='absolute left-0 top-0 h-full w-1 cursor-ns-resize bg-transparent hover:bg-muted-foreground/20'>
								<Grip className='absolute -left-1 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-muted-foreground' />
							</div>
						</Card>
					))}
				</div>
			)}

			{/* Module Dialog */}
			<Dialog
				open={moduleDialogOpen}
				onOpenChange={setModuleDialogOpen}
			>
				<DialogContent className='sm:max-w-[525px]'>
					<DialogHeader>
						<DialogTitle>Add Module</DialogTitle>
						<DialogDescription>
							Create a new module for your course. You can add lessons to this
							module later.
						</DialogDescription>
					</DialogHeader>
					<Form {...moduleForm}>
						<form
							onSubmit={moduleForm.handleSubmit(onModuleSubmit)}
							className='space-y-4'
						>
							<FormField
								control={moduleForm.control}
								name='title'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Module Title</FormLabel>
										<FormControl>
											<Input
												placeholder='Enter module title'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={moduleForm.control}
								name='description'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description (Optional)</FormLabel>
										<FormControl>
											<Textarea
												placeholder='Enter module description'
												className='min-h-[100px]'
												{...field}
											/>
										</FormControl>
										<FormDescription>
											Briefly describe what this module covers
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<DialogFooter>
								<Button
									type='button'
									variant='outline'
									onClick={() => setModuleDialogOpen(false)}
								>
									Cancel
								</Button>
								<Button
									type='submit'
									disabled={isLoading}
								>
									{isLoading && (
										<Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
									)}
									Save Module
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>

			{/* Lesson Dialog */}
			<Dialog
				open={lessonDialogOpen}
				onOpenChange={setLessonDialogOpen}
			>
				<DialogContent className='sm:max-w-[525px]'>
					<DialogHeader>
						<DialogTitle>Add Lesson</DialogTitle>
						<DialogDescription>
							Create a new lesson for this module. You can edit the content
							later.
						</DialogDescription>
					</DialogHeader>
					<Form {...lessonForm}>
						<form
							onSubmit={lessonForm.handleSubmit(onLessonSubmit)}
							className='space-y-4'
						>
							<FormField
								control={lessonForm.control}
								name='title'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Lesson Title</FormLabel>
										<FormControl>
											<Input
												placeholder='Enter lesson title'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={lessonForm.control}
								name='content'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description (Optional)</FormLabel>
										<FormControl>
											<Textarea
												placeholder='Enter lesson description'
												className='min-h-[100px]'
												{...field}
											/>
										</FormControl>
										<FormDescription>
											Briefly describe what this lesson covers
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className='grid grid-cols-2 gap-4'>
								<FormField
									control={lessonForm.control}
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
									control={lessonForm.control}
									name='duration'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Duration (Optional)</FormLabel>
											<FormControl>
												<Input
													placeholder='e.g. 15:30'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<DialogFooter>
								<Button
									type='button'
									variant='outline'
									onClick={() => setLessonDialogOpen(false)}
								>
									Cancel
								</Button>
								<Button
									type='submit'
									disabled={isLoading}
								>
									{isLoading && (
										<Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
									)}
									Save Lesson
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
