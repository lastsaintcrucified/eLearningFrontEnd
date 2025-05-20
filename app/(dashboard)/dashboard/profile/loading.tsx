import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ProfileLoading() {
	return (
		<div className='flex flex-col gap-6'>
			<div>
				<Skeleton className='h-10 w-[200px]' />
				<Skeleton className='h-4 w-[300px] mt-2' />
			</div>

			<div className='space-y-6'>
				<Card>
					<CardHeader>
						<Skeleton className='h-6 w-[150px]' />
						<Skeleton className='h-4 w-[250px] mt-2' />
					</CardHeader>
					<CardContent className='flex flex-col sm:flex-row items-center sm:items-start gap-6'>
						<Skeleton className='h-32 w-32 rounded-full' />
						<div className='flex flex-col gap-4 w-full'>
							<div>
								<Skeleton className='h-6 w-[150px]' />
								<Skeleton className='h-4 w-[200px] mt-2' />
								<Skeleton className='h-4 w-[100px] mt-1' />
							</div>
							<div className='flex flex-col sm:flex-row gap-2'>
								<Skeleton className='h-9 w-[150px]' />
								<Skeleton className='h-9 w-[100px]' />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<Skeleton className='h-6 w-[180px]' />
						<Skeleton className='h-4 w-[300px] mt-2' />
					</CardHeader>
					<CardContent className='space-y-6'>
						<div className='grid gap-6 sm:grid-cols-2'>
							<div className='space-y-2'>
								<Skeleton className='h-4 w-[80px]' />
								<Skeleton className='h-10 w-full' />
							</div>
							<div className='space-y-2'>
								<Skeleton className='h-4 w-[80px]' />
								<Skeleton className='h-10 w-full' />
							</div>
						</div>
						<div className='space-y-2'>
							<Skeleton className='h-4 w-[80px]' />
							<Skeleton className='h-10 w-full' />
						</div>
						<div className='space-y-2'>
							<Skeleton className='h-4 w-[80px]' />
							<Skeleton className='h-24 w-full' />
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
