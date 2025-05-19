/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icons } from "@/components/icons";
import { Course, getCourseById, updateCourse } from "@/lib/data/data";
import { useToast } from "@/components/ui/use-toast";
const formSchema = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	category: z.string({}).optional(),
	level: z.string({}).optional(),
	price: z.string().optional(),
});

export default function UpdateCoursePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [activeTab, setActiveTab] = useState("basic");
	const { toast } = useToast();
	const [course, setCourse] = useState<Course | undefined>();

	useEffect(() => {
		async function fetchCourse() {
			const data = await getCourseById(id);
			setCourse(data);
		}
		fetchCourse();
	}, [id]);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: course?.title || "",
			description: course?.description || "",
		},
	});

	if (!course) {
		return <div>Loading...</div>;
	}

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);

		try {
			await updateCourse(
				id,
				values.title ? values.title : course?.title,
				values.description ? values.description : course?.description
			);
			setIsLoading(false);
			toast({
				title: "Update successful",
				description: "Successfully updated your course.",
				variant: "default",
			});
			router.push("/instructor/courses");
		} catch (error: any) {
			setIsLoading(false);
			toast({
				title: "Update failed",
				description: error.message || "Failed to update your course.",
				variant: "destructive",
			});
		}

		// Simulate API call
		// setTimeout(() => {
		//   console.log(values)
		//   setIsLoading(false)
		//   router.push("/instructor/courses")
		// }, 1000)
	}

	return (
		<div className='flex flex-col gap-6'>
			<div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>
						Create New Course
					</h1>
					<p className='text-muted-foreground'>
						Fill in the details to create your new course
					</p>
				</div>
				<div className='flex items-center gap-2'>
					<Button
						variant='outline'
						asChild
					>
						<Link href='/instructor/courses'>Cancel</Link>
					</Button>
					<Button
						onClick={form.handleSubmit(onSubmit)}
						disabled={isLoading}
					>
						{isLoading && (
							<Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
						)}
						Save Course
					</Button>
				</div>
			</div>

			<Tabs
				defaultValue='basic'
				value={activeTab}
				onValueChange={setActiveTab}
				className='space-y-4'
			>
				<TabsList className='grid w-full grid-cols-4'>
					<TabsTrigger value='basic'>Basic Info</TabsTrigger>
					<TabsTrigger value='curriculum'>Curriculum</TabsTrigger>
					<TabsTrigger value='pricing'>Pricing</TabsTrigger>
					<TabsTrigger value='settings'>Settings</TabsTrigger>
				</TabsList>

				<Form {...form}>
					<TabsContent value='basic'>
						<Card>
							<CardHeader>
								<CardTitle>Basic Information</CardTitle>
								<CardDescription>
									Enter the basic details about your course
								</CardDescription>
							</CardHeader>
							<CardContent className='space-y-6'>
								<FormField
									control={form.control}
									name='title'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Course Title</FormLabel>
											<FormControl>
												<Input
													placeholder={course.title}
													{...field}
												/>
											</FormControl>
											<FormDescription>
												A clear and concise title that describes your course
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name='description'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Course Description</FormLabel>
											<FormControl>
												<Textarea
													placeholder={course.description}
													className='min-h-[120px]'
													{...field}
												/>
											</FormControl>
											<FormDescription>
												Provide a detailed description of your course content
												and learning outcomes
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className='grid gap-6 md:grid-cols-2'>
									<FormField
										control={form.control}
										name='category'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Category</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder='Select a category' />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value='programming'>
															Programming
														</SelectItem>
														<SelectItem value='web-development'>
															Web Development
														</SelectItem>
														<SelectItem value='mobile-development'>
															Mobile Development
														</SelectItem>
														<SelectItem value='data-science'>
															Data Science
														</SelectItem>
														<SelectItem value='design'>Design</SelectItem>
														<SelectItem value='business'>Business</SelectItem>
													</SelectContent>
												</Select>
												<FormDescription>
													Choose the category that best fits your course
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name='level'
										// this field is not required for submission
										render={({ field }) => (
											<FormItem>
												<FormLabel>Difficulty Level</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder='Select a level' />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value='beginner'>Beginner</SelectItem>
														<SelectItem value='intermediate'>
															Intermediate
														</SelectItem>
														<SelectItem value='advanced'>Advanced</SelectItem>
														<SelectItem value='all-levels'>
															All Levels
														</SelectItem>
													</SelectContent>
												</Select>
												<FormDescription>
													Indicate the difficulty level of your course
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div>
									<FormLabel>Course Thumbnail</FormLabel>
									<div className='mt-2 flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-md p-6'>
										<div className='text-center'>
											<Icons.fileText className='mx-auto h-12 w-12 text-muted-foreground' />
											<div className='mt-4 flex text-sm leading-6 text-muted-foreground'>
												<label
													htmlFor='file-upload'
													className='relative cursor-pointer rounded-md bg-background font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary'
												>
													<span>Upload a file</span>
													<input
														id='file-upload'
														name='file-upload'
														type='file'
														className='sr-only'
													/>
												</label>
												<p className='pl-1'>or drag and drop</p>
											</div>
											<p className='text-xs leading-5 text-muted-foreground'>
												PNG, JPG, GIF up to 10MB
											</p>
										</div>
									</div>
								</div>
							</CardContent>
							<CardFooter className='flex justify-between'>
								<Button
									variant='outline'
									onClick={() => router.push("/instructor/courses")}
								>
									Cancel
								</Button>
								<Button onClick={() => setActiveTab("curriculum")}>
									Continue to Curriculum
								</Button>
							</CardFooter>
						</Card>
					</TabsContent>

					<TabsContent value='curriculum'>
						<Card>
							<CardHeader>
								<CardTitle>Course Curriculum</CardTitle>
								<CardDescription>
									Organize your course content into modules and lessons
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className='flex items-center justify-center h-[400px]'>
									<div className='text-center'>
										<Icons.fileText className='mx-auto h-12 w-12 text-muted-foreground' />
										<h3 className='mt-4 text-lg font-medium'>No modules yet</h3>
										<p className='mt-2 text-sm text-muted-foreground'>
											Get started by creating your first module
										</p>
										<Button className='mt-4'>
											<Icons.add className='mr-2 h-4 w-4' />
											Add Module
										</Button>
									</div>
								</div>
							</CardContent>
							<CardFooter className='flex justify-between'>
								<Button
									variant='outline'
									onClick={() => setActiveTab("basic")}
								>
									Back
								</Button>
								<Button onClick={() => setActiveTab("pricing")}>
									Continue to Pricing
								</Button>
							</CardFooter>
						</Card>
					</TabsContent>

					<TabsContent value='pricing'>
						<Card>
							<CardHeader>
								<CardTitle>Course Pricing</CardTitle>
								<CardDescription>Set the price for your course</CardDescription>
							</CardHeader>
							<CardContent className='space-y-6'>
								<FormField
									control={form.control}
									name='price'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Price ($)</FormLabel>
											<FormControl>
												<Input
													type='number'
													min='0'
													step='0.01'
													placeholder='e.g. 49.99'
													{...field}
												/>
											</FormControl>
											<FormDescription>
												Set a competitive price for your course (USD)
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</CardContent>
							<CardFooter className='flex justify-between'>
								<Button
									variant='outline'
									onClick={() => setActiveTab("curriculum")}
								>
									Back
								</Button>
								<Button onClick={() => setActiveTab("settings")}>
									Continue to Settings
								</Button>
							</CardFooter>
						</Card>
					</TabsContent>

					<TabsContent value='settings'>
						<Card>
							<CardHeader>
								<CardTitle>Course Settings</CardTitle>
								<CardDescription>
									Configure additional settings for your course
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className='space-y-6'>
									<div>
										<h3 className='text-lg font-medium'>Course Status</h3>
										<p className='text-sm text-muted-foreground'>
											Control the visibility of your course
										</p>
										<div className='mt-4 space-y-4'>
											<div className='flex items-center space-x-2'>
												<input
													type='radio'
													id='draft'
													name='status'
													value='draft'
													defaultChecked
													className='h-4 w-4 border-muted-foreground text-primary focus:ring-primary'
												/>
												<label
													htmlFor='draft'
													className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
												>
													Draft (only visible to you)
												</label>
											</div>
											<div className='flex items-center space-x-2'>
												<input
													type='radio'
													id='published'
													name='status'
													value='published'
													className='h-4 w-4 border-muted-foreground text-primary focus:ring-primary'
												/>
												<label
													htmlFor='published'
													className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
												>
													Published (visible to all users)
												</label>
											</div>
										</div>
									</div>
								</div>
							</CardContent>
							<CardFooter className='flex justify-between'>
								<Button
									variant='outline'
									onClick={() => setActiveTab("pricing")}
								>
									Back
								</Button>
								<Button
									onClick={form.handleSubmit(onSubmit)}
									disabled={isLoading}
								>
									{isLoading && (
										<Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
									)}
									Update Course
								</Button>
							</CardFooter>
						</Card>
					</TabsContent>
				</Form>
			</Tabs>
		</div>
	);
}
