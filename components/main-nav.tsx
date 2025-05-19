/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/icons";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export function MainNav() {
	const pathname = usePathname();

	return (
		<div className='mr-4 hidden md:flex'>
			<Link
				href='/'
				className='mr-6 flex items-center space-x-2'
			>
				<Icons.logo className='h-6 w-6' />
				<span className='hidden font-bold sm:inline-block'>LearnHub</span>
			</Link>
			<NavigationMenu>
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuLink
							href='/courses'
							className={navigationMenuTriggerStyle()}
						>
							Courses
						</NavigationMenuLink>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuTrigger>Resources</NavigationMenuTrigger>
						<NavigationMenuContent>
							<ul className='grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
								<li className='row-span-3'>
									<NavigationMenuLink asChild>
										<Link
											className='flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md'
											href='/'
										>
											<Icons.logo className='h-6 w-6' />
											<div className='mb-2 mt-4 text-lg font-medium'>
												LearnHub
											</div>
											<p className='text-sm leading-tight text-muted-foreground'>
												Modern E-Learning platform for students and instructors
											</p>
										</Link>
									</NavigationMenuLink>
								</li>
								<li>
									<NavigationMenuLink asChild>
										<a
											href='/blog'
											className='block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'
										>
											<div className='text-sm font-medium leading-none'>
												Blog
											</div>
											<p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
												Read the latest articles from our instructors
											</p>
										</a>
									</NavigationMenuLink>
								</li>
								<li>
									<NavigationMenuLink asChild>
										<a
											href='/faq'
											className='block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'
										>
											<div className='text-sm font-medium leading-none'>
												FAQ
											</div>
											<p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
												Frequently asked questions about our platform
											</p>
										</a>
									</NavigationMenuLink>
								</li>
								<li>
									<NavigationMenuLink asChild>
										<a
											href='/support'
											className='block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'
										>
											<div className='text-sm font-medium leading-none'>
												Support
											</div>
											<p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
												Get help with your account or courses
											</p>
										</a>
									</NavigationMenuLink>
								</li>
							</ul>
						</NavigationMenuContent>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuLink
							href='/about'
							className={navigationMenuTriggerStyle()}
						>
							About
						</NavigationMenuLink>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
		</div>
	);
}
