/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/authContext";

const formSchema = z.object({
	email: z.string().email({
		message: "Please enter a valid email address.",
	}),
	password: z.string().min(8, {
		message: "Password must be at least 8 characters.",
	}),
});

export default function LoginPage() {
	const { toast } = useToast();
	const { login } = useAuth();
	const router = useRouter();
	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		// console.log(values);
		setIsLoading(true);
		try {
			await login(values.email, values.password);
			setIsLoading(false);
			router.push("/dashboard");
		} catch (error: any) {
			toast({
				title: "Login failed",
				description: error.message || "Failed to clog in.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
		// Simulate API call
		// setTimeout(() => {
		//   console.log(values)
		//   setIsLoading(false)
		//   router.push("/dashboard")
		// }, 1000)
	}

	return (
		<div className='container flex h-screen w-screen flex-col items-center justify-center'>
			<Link
				href='/'
				className='absolute left-4 top-4 md:left-8 md:top-8'
			>
				<Button variant='ghost'>
					<Icons.chevronLeft className='mr-2 h-4 w-4' />
					Back
				</Button>
			</Link>
			<div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
				<div className='flex flex-col space-y-2 text-center'>
					<Icons.logo className='mx-auto h-6 w-6' />
					<h1 className='text-2xl font-semibold tracking-tight'>
						Welcome back
					</h1>
					<p className='text-sm text-muted-foreground'>
						Enter your email and password to sign in to your account
					</p>
				</div>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-4'
					>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											placeholder='name@example.com'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
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
						<Button
							type='submit'
							className='w-full'
							disabled={isLoading}
						>
							{isLoading && (
								<Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
							)}
							Sign In
						</Button>
					</form>
				</Form>
				{/* <div className='relative'>
					<div className='absolute inset-0 flex items-center'>
						<span className='w-full border-t' />
					</div>
					<div className='relative flex justify-center text-xs uppercase'>
						<span className='bg-background px-2 text-muted-foreground'>
							Or continue with
						</span>
					</div>
				</div>
				<Button
					variant='outline'
					type='button'
					disabled={isLoading}
				>
					{isLoading ? (
						<Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
					) : (
						<svg
							className='mr-2 h-4 w-4'
							aria-hidden='true'
							focusable='false'
							data-prefix='fab'
							data-icon='google'
							role='img'
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 488 512'
						>
							<path
								fill='currentColor'
								d='M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z'
							></path>
						</svg>
					)}
					Google
				</Button> */}
				<p className='px-8 text-center text-sm text-muted-foreground'>
					<Link
						href='/signup'
						className='hover:text-brand underline underline-offset-4'
					>
						Don&apos;t have an account? Sign Up
					</Link>
				</p>
			</div>
		</div>
	);
}
