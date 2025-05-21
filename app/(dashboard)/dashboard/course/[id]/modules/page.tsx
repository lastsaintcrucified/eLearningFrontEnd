"use client";

import Link from "next/link";
import { CheckCircle, Clock, FileText, PlayCircle, Video } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Icons } from "@/components/icons";
import { use, useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import { Course, getCourseById } from "@/lib/data/data";

export default function StudentmoduleDatasPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const courseId = id;
	const { user } = useAuth();
	const [course, setCourse] = useState<Course | undefined>();
	useEffect(() => {
		async function fetchCourse() {
			const data = await getCourseById(id);
			setCourse(data);
		}
		fetchCourse();
	}, [courseId, user?.role]);
	// Function to find the next incomplete lesson
	const findNextLesson = () => {
		for (const moduleData of course?.modules ?? []) {
			for (const lesson of moduleData.lessons) {
				if (!lesson.completed) {
					return {
						moduleDataId: moduleData.id,
						lessonId: lesson.id,
						title: lesson.title,
					};
				}
			}
		}
		return null;
	};

	const nextLesson = findNextLesson();

	function getLessonIcon(type: string, completed: boolean) {
		if (completed) {
			return <CheckCircle className='h-4 w-4 text-green-500' />;
		}

		switch (type) {
			case "video":
				return <Video className='h-4 w-4 text-muted-foreground' />;
			case "text":
				return <FileText className='h-4 w-4 text-muted-foreground' />;
			case "quiz":
				return <Icons.fileText className='h-4 w-4 text-muted-foreground' />;
			default:
				return <FileText className='h-4 w-4 text-muted-foreground' />;
		}
	}

	return (
		<div className='flex flex-col gap-6'>
			<div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
				<div>
					<Link
						href='/dashboard/enrollments'
						className='text-sm text-muted-foreground hover:underline'
					>
						← Back to My Enrollments
					</Link>
					<h1 className='text-3xl font-bold tracking-tight'>{course?.title}</h1>
					<p className='text-muted-foreground'>
						Instructor: {course?.instructor.name}
					</p>
				</div>
				{nextLesson && (
					<Button
						asChild
						size='lg'
					>
						<Link
							href={`/dashboard/course/${courseId}/modules/${nextLesson.moduleDataId}/lessons/${nextLesson.lessonId}`}
						>
							<PlayCircle className='mr-2 h-4 w-4' />
							Continue Learning
						</Link>
					</Button>
				)}
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Course Progress</CardTitle>
					<CardDescription>
						Track your learning progress through this course
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='space-y-4'>
						<div className='space-y-2'>
							<div className='flex items-center justify-between text-sm'>
								<span>Overall Progress</span>
								<span>60%</span>
							</div>
							<Progress
								value={60}
								className='h-2'
							/>
							<div className='flex justify-between text-sm text-muted-foreground'>
								<span>1 / 2 lessons completed</span>
								<span>Last accessed: yesterday</span>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className='space-y-6'>
				<h2 className='text-2xl font-bold tracking-tight'>Course Content</h2>
				{course?.modules.map((moduleData) => (
					<Card key={moduleData.id}>
						<CardHeader>
							<div className='flex items-center justify-between'>
								<div>
									<CardTitle>{moduleData.title}</CardTitle>
									{moduleData.description && (
										<CardDescription>{moduleData.description}</CardDescription>
									)}
								</div>
								<div className='flex items-center gap-4'>
									<div className='flex items-center gap-2'>
										<Progress
											value={40}
											className='h-2 w-24'
										/>
										<span className='text-sm font-medium'>{40}%</span>
									</div>
									<Badge variant={"default"}>{"In Progress"}</Badge>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<Accordion
								type='single'
								collapsible
								defaultValue='item-0'
							>
								<AccordionItem value='item-0'>
									<AccordionTrigger className='text-sm font-medium'>
										Lessons ({moduleData.lessons.length})
									</AccordionTrigger>
									<AccordionContent>
										<div className='space-y-2'>
											{moduleData.lessons.map((lesson) => (
												<Link
													key={lesson.id}
													href={`/dashboard/course/${courseId}/modules/${moduleData.id}/lessons/${lesson.id}`}
												>
													<div
														className={`flex items-center justify-between p-3 rounded-md hover:bg-muted/50 ${
															lesson.completed ? "bg-muted/50" : ""
														}`}
													>
														<div className='flex items-center gap-3'>
															{getLessonIcon("text", lesson.completed)}
															<span
																className={
																	lesson.completed
																		? "line-through text-muted-foreground"
																		: ""
																}
															>
																{lesson.title}
															</span>
														</div>
														{lesson.duration && (
															<div className='flex items-center gap-2'>
																<Clock className='h-4 w-4 text-muted-foreground' />
																<span className='text-sm text-muted-foreground'>
																	{lesson.duration}
																</span>
															</div>
														)}
													</div>
												</Link>
											))}
										</div>
									</AccordionContent>
								</AccordionItem>
							</Accordion>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
