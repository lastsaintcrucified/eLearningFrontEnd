"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Pencil, Upload } from "lucide-react";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/icons";
import { useAuth } from "@/context/authContext";

const profileFormSchema = z.object({
	name: z.string().min(2, {
		message: "Name must be at least 2 characters.",
	}),
	email: z.string().email({
		message: "Please enter a valid email address.",
	}),
	bio: z
		.string()
		.max(500, {
			message: "Bio must not be longer than 500 characters.",
		})
		.optional(),
	title: z
		.string()
		.max(100, {
			message: "Title must not be longer than 100 characters.",
		})
		.optional(),
	website: z
		.string()
		.url({ message: "Please enter a valid URL." })
		.optional()
		.or(z.literal("")),
	twitter: z.string().max(100).optional().or(z.literal("")),
	linkedin: z.string().max(100).optional().or(z.literal("")),
	github: z.string().max(100).optional().or(z.literal("")),
});

const passwordFormSchema = z
	.object({
		currentPassword: z.string().min(8, {
			message: "Password must be at least 8 characters.",
		}),
		newPassword: z.string().min(8, {
			message: "Password must be at least 8 characters.",
		}),
		confirmPassword: z.string().min(8, {
			message: "Password must be at least 8 characters.",
		}),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export default function ProfilePage() {
	const [isLoading, setIsLoading] = useState(false);
	const { user } = useAuth();

	// Mock mockUser data
	const mockUser = {
		image: "/placeholder.svg?height=150&width=150",
		bio: "Frontend developer with a passion for learning new technologies. Currently focused on React and Next.js.",
		title: "Frontend Developer",
		website: "https://johndoe.com",
		twitter: "johndoe",
		linkedin: "johndoe",
		github: "johndoe",
	};

	const profileForm = useForm<z.infer<typeof profileFormSchema>>({
		resolver: zodResolver(profileFormSchema),
		defaultValues: {
			bio: mockUser.bio,
			title: mockUser.title,
			website: mockUser.website,
			twitter: mockUser.twitter,
			linkedin: mockUser.linkedin,
			github: mockUser.github,
		},
	});

	const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
		resolver: zodResolver(passwordFormSchema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		},
	});

	function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
		setIsLoading(true);

		// Simulate API call
		setTimeout(() => {
			console.log(values);
			setIsLoading(false);
		}, 1000);
	}

	function onPasswordSubmit(values: z.infer<typeof passwordFormSchema>) {
		setIsLoading(true);

		// Simulate API call
		setTimeout(() => {
			console.log(values);
			setIsLoading(false);
			passwordForm.reset({
				currentPassword: "",
				newPassword: "",
				confirmPassword: "",
			});
		}, 1000);
	}

	return (
		<div className='flex flex-col gap-6'>
			<div>
				<h1 className='text-3xl font-bold tracking-tight'>Profile</h1>
				<p className='text-muted-foreground'>
					Manage your account settings and preferences.
				</p>
			</div>

			<Tabs
				defaultValue='general'
				className='space-y-6'
			>
				<TabsList className='grid w-full grid-cols-3 lg:w-[400px]'>
					<TabsTrigger value='general'>General</TabsTrigger>
					<TabsTrigger value='security'>Security</TabsTrigger>
					<TabsTrigger value='notifications'>Notifications</TabsTrigger>
				</TabsList>

				<TabsContent
					value='general'
					className='space-y-6'
				>
					<Card>
						<CardHeader>
							<CardTitle>Profile Picture</CardTitle>
							<CardDescription>
								Update your profile picture. This will be displayed on your
								profile and in your courses.
							</CardDescription>
						</CardHeader>
						<CardContent className='flex flex-col items-center sm:flex-row sm:items-start gap-6'>
							<div className='relative'>
								<Avatar className='h-32 w-32'>
									<AvatarImage
										src={mockUser.image || "/placeholder.svg"}
										alt={user?.name}
									/>
									<AvatarFallback className='text-4xl'>
										{user?.name.charAt(0)}
									</AvatarFallback>
								</Avatar>
								<Button
									size='icon'
									variant='outline'
									className='absolute bottom-0 right-0 h-8 w-8 rounded-full'
								>
									<Pencil className='h-4 w-4' />
									<span className='sr-only'>Change profile picture</span>
								</Button>
							</div>
							<div className='flex flex-col gap-4 text-center sm:text-left'>
								<div>
									<h3 className='text-lg font-medium'>{user?.name}</h3>
									<p className='text-sm text-muted-foreground'>{user?.email}</p>
									<p className='text-sm text-muted-foreground capitalize'>
										{user?.role}
									</p>
								</div>
								<div className='flex flex-col sm:flex-row gap-2'>
									<Button
										variant='outline'
										size='sm'
									>
										<Upload className='mr-2 h-4 w-4' />
										Upload New Picture
									</Button>
									<Button
										variant='outline'
										size='sm'
										className='text-destructive hover:text-destructive'
									>
										Remove
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>

					<Form {...profileForm}>
						<form
							onSubmit={profileForm.handleSubmit(onProfileSubmit)}
							className='space-y-6'
						>
							<Card>
								<CardHeader>
									<CardTitle>Personal Information</CardTitle>
									<CardDescription>
										Update your personal information. This information will be
										displayed publicly.
									</CardDescription>
								</CardHeader>
								<CardContent className='space-y-6'>
									<div className='grid gap-6 sm:grid-cols-2'>
										<FormField
											control={profileForm.control}
											name='name'
											render={({ field }) => (
												<FormItem>
													<FormLabel>Name</FormLabel>
													<FormControl>
														<Input
															placeholder='Your name'
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={profileForm.control}
											name='email'
											render={({ field }) => (
												<FormItem>
													<FormLabel>Email</FormLabel>
													<FormControl>
														<Input
															placeholder='Your email'
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<FormField
										control={profileForm.control}
										name='title'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Title</FormLabel>
												<FormControl>
													<Input
														placeholder='e.g. Frontend Developer'
														{...field}
													/>
												</FormControl>
												<FormDescription>
													Your title or role. This will be displayed on your
													profile.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={profileForm.control}
										name='bio'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Bio</FormLabel>
												<FormControl>
													<Textarea
														placeholder='Tell us a little bit about yourself'
														className='min-h-[120px]'
														{...field}
													/>
												</FormControl>
												<FormDescription>
													Brief description for your profile. This will be
													displayed on your profile.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Social Links</CardTitle>
									<CardDescription>
										Add links to your social profiles. These will be displayed
										on your public profile.
									</CardDescription>
								</CardHeader>
								<CardContent className='space-y-6'>
									<FormField
										control={profileForm.control}
										name='website'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Website</FormLabel>
												<FormControl>
													<Input
														placeholder='https://example.com'
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<div className='grid gap-6 sm:grid-cols-2'>
										<FormField
											control={profileForm.control}
											name='twitter'
											render={({ field }) => (
												<FormItem>
													<FormLabel>Twitter</FormLabel>
													<FormControl>
														<Input
															placeholder='@mockUsername'
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={profileForm.control}
											name='linkedin'
											render={({ field }) => (
												<FormItem>
													<FormLabel>LinkedIn</FormLabel>
													<FormControl>
														<Input
															placeholder='mockUsername'
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<FormField
										control={profileForm.control}
										name='github'
										render={({ field }) => (
											<FormItem>
												<FormLabel>GitHub</FormLabel>
												<FormControl>
													<Input
														placeholder='mockUsername'
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
								<CardFooter>
									<Button
										type='submit'
										disabled={isLoading}
									>
										{isLoading && (
											<Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
										)}
										Save Changes
									</Button>
								</CardFooter>
							</Card>
						</form>
					</Form>
				</TabsContent>

				<TabsContent
					value='security'
					className='space-y-6'
				>
					<Card>
						<CardHeader>
							<CardTitle>Change Password</CardTitle>
							<CardDescription>
								Update your password. You will be logged out of all devices
								except this one.
							</CardDescription>
						</CardHeader>
						<Form {...passwordForm}>
							<form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
								<CardContent className='space-y-6'>
									<FormField
										control={passwordForm.control}
										name='currentPassword'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Current Password</FormLabel>
												<FormControl>
													<Input
														type='password'
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={passwordForm.control}
										name='newPassword'
										render={({ field }) => (
											<FormItem>
												<FormLabel>New Password</FormLabel>
												<FormControl>
													<Input
														type='password'
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={passwordForm.control}
										name='confirmPassword'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Confirm New Password</FormLabel>
												<FormControl>
													<Input
														type='password'
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
								<CardFooter>
									<Button
										type='submit'
										disabled={isLoading}
									>
										{isLoading && (
											<Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
										)}
										Change Password
									</Button>
								</CardFooter>
							</form>
						</Form>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Two-Factor Authentication</CardTitle>
							<CardDescription>
								Add an extra layer of security to your account by enabling
								two-factor authentication.
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='flex items-center justify-between'>
								<div>
									<h3 className='font-medium'>Authenticator App</h3>
									<p className='text-sm text-muted-foreground'>
										Use an authenticator app to generate one-time codes.
									</p>
								</div>
								<Button variant='outline'>Setup</Button>
							</div>
							<Separator />
							<div className='flex items-center justify-between'>
								<div>
									<h3 className='font-medium'>Text Message</h3>
									<p className='text-sm text-muted-foreground'>
										Use your phone number to receive verification codes.
									</p>
								</div>
								<Button variant='outline'>Setup</Button>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Account Management</CardTitle>
							<CardDescription>
								Manage your account settings and preferences.
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='flex items-center justify-between'>
								<div>
									<h3 className='font-medium'>Delete Account</h3>
									<p className='text-sm text-muted-foreground'>
										Permanently delete your account and all of your content.
									</p>
								</div>
								<Button variant='destructive'>Delete Account</Button>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent
					value='notifications'
					className='space-y-6'
				>
					<Card>
						<CardHeader>
							<CardTitle>Email Notifications</CardTitle>
							<CardDescription>
								Choose what types of emails you want to receive.
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='flex items-center justify-between'>
								<div>
									<h3 className='font-medium'>Course Updates</h3>
									<p className='text-sm text-muted-foreground'>
										Receive emails when courses you are enrolled in are updated.
									</p>
								</div>
								<Switch defaultChecked />
							</div>
							<Separator />
							<div className='flex items-center justify-between'>
								<div>
									<h3 className='font-medium'>New Lessons</h3>
									<p className='text-sm text-muted-foreground'>
										Receive emails when new lessons are added to courses you are
										enrolled in.
									</p>
								</div>
								<Switch defaultChecked />
							</div>
							<Separator />
							<div className='flex items-center justify-between'>
								<div>
									<h3 className='font-medium'>Comments</h3>
									<p className='text-sm text-muted-foreground'>
										Receive emails when someone comments on your courses or
										replies to your comments.
									</p>
								</div>
								<Switch defaultChecked />
							</div>
							<Separator />
							<div className='flex items-center justify-between'>
								<div>
									<h3 className='font-medium'>Promotions</h3>
									<p className='text-sm text-muted-foreground'>
										Receive emails about promotions, discounts, and new courses.
									</p>
								</div>
								<Switch />
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Platform Notifications</CardTitle>
							<CardDescription>
								Choose what types of in-app notifications you want to receive.
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='flex items-center justify-between'>
								<div>
									<h3 className='font-medium'>Course Reminders</h3>
									<p className='text-sm text-muted-foreground'>
										Receive reminders to continue your courses.
									</p>
								</div>
								<Switch defaultChecked />
							</div>
							<Separator />
							<div className='flex items-center justify-between'>
								<div>
									<h3 className='font-medium'>New Features</h3>
									<p className='text-sm text-muted-foreground'>
										Receive notifications about new platform features.
									</p>
								</div>
								<Switch defaultChecked />
							</div>
							<Separator />
							<div className='flex items-center justify-between'>
								<div>
									<h3 className='font-medium'>Achievement Notifications</h3>
									<p className='text-sm text-muted-foreground'>
										Receive notifications when you earn achievements.
									</p>
								</div>
								<Switch defaultChecked />
							</div>
						</CardContent>
						<CardFooter>
							<Button>Save Notification Preferences</Button>
						</CardFooter>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
