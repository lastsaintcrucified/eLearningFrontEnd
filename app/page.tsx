import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
	return (
		<div className='flex px-2 min-h-screen flex-col'>
			<header className='sticky top-0 z-40 w-full border-b bg-background'>
				<div className='container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0'>
					<MainNav />
					<div className='flex flex-1 items-center justify-end space-x-4'>
						<nav className='flex items-center space-x-2'>
							<ThemeToggle />
							<Button
								asChild
								variant='outline'
								size='sm'
							>
								<Link href='/login'>Login</Link>
							</Button>
							<Button
								asChild
								size='sm'
							>
								<Link href='/signup'>Sign Up</Link>
							</Button>
						</nav>
					</div>
				</div>
			</header>
			<main className='flex-1'>
				<section className='space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32'>
					<div className='container flex mx-auto max-w-[64rem] flex-col items-center gap-4 text-center'>
						<h1 className='text-3xl font-bold leading-tight tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl'>
							Learn at your own pace with LearnHub
						</h1>
						<p className='max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8'>
							Discover courses taught by expert instructors. Join our community
							of learners and advance your skills today.
						</p>
						<div className='flex flex-col gap-4 sm:flex-row'>
							<Button
								asChild
								size='lg'
							>
								<Link href='/courses'>Browse Courses</Link>
							</Button>
							<Button
								asChild
								variant='outline'
								size='lg'
							>
								<Link href='/signup'>Become an Instructor</Link>
							</Button>
						</div>
					</div>
				</section>
				<section className='container space-y-6 py-8 md:py-12 lg:py-24'>
					<div className='mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center'>
						<h2 className='text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl'>
							Features
						</h2>
						<p className='max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7'>
							Our platform offers a comprehensive learning experience for
							students and instructors.
						</p>
					</div>
					<div className='mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3'>
						<div className='relative overflow-hidden rounded-lg border bg-background p-6'>
							<div className='flex h-[180px] flex-col justify-between'>
								<div className='space-y-2'>
									<h3 className='font-bold'>Interactive Courses</h3>
									<p className='text-sm text-muted-foreground'>
										Engage with interactive content designed to enhance your
										learning experience.
									</p>
								</div>
							</div>
						</div>
						<div className='relative overflow-hidden rounded-lg border bg-background p-6'>
							<div className='flex h-[180px] flex-col justify-between'>
								<div className='space-y-2'>
									<h3 className='font-bold'>Expert Instructors</h3>
									<p className='text-sm text-muted-foreground'>
										Learn from industry professionals with real-world
										experience.
									</p>
								</div>
							</div>
						</div>
						<div className='relative overflow-hidden rounded-lg border bg-background p-6'>
							<div className='flex h-[180px] flex-col justify-between'>
								<div className='space-y-2'>
									<h3 className='font-bold'>Progress Tracking</h3>
									<p className='text-sm text-muted-foreground'>
										Track your learning progress and stay motivated with visual
										indicators.
									</p>
								</div>
							</div>
						</div>
						<div className='relative overflow-hidden rounded-lg border bg-background p-6'>
							<div className='flex h-[180px] flex-col justify-between'>
								<div className='space-y-2'>
									<h3 className='font-bold'>Flexible Learning</h3>
									<p className='text-sm text-muted-foreground'>
										Learn at your own pace, anytime and anywhere.
									</p>
								</div>
							</div>
						</div>
						<div className='relative overflow-hidden rounded-lg border bg-background p-6'>
							<div className='flex h-[180px] flex-col justify-between'>
								<div className='space-y-2'>
									<h3 className='font-bold'>Course Creation</h3>
									<p className='text-sm text-muted-foreground'>
										Easily create and manage courses as an instructor.
									</p>
								</div>
							</div>
						</div>
						<div className='relative overflow-hidden rounded-lg border bg-background p-6'>
							<div className='flex h-[180px] flex-col justify-between'>
								<div className='space-y-2'>
									<h3 className='font-bold'>Community Support</h3>
									<p className='text-sm text-muted-foreground'>
										Join a community of learners and instructors to enhance your
										learning journey.
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>
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
