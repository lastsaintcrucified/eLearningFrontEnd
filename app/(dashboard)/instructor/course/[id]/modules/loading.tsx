import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ModulesLoading() {
	return (
		<div className='flex flex-col gap-6'>
			<div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
				<div>
					<Skeleton className='h-8 w-[250px]' />
					<Skeleton className='h-4 w-[180px] mt-2' />
				</div>
				<div className='flex items-center gap-2'>
					<Skeleton className='h-10 w-[120px]' />
					<Skeleton className='h-10 w-[120px]' />
				</div>
			</div>

			<div className='space-y-6'>
				{[1, 2].map((i) => (
					<Card key={i}>
						<CardHeader className='pb-3'>
							<div className='flex items-center justify-between'>
								<div className='flex items-center gap-2'>
									<Skeleton className='h-8 w-8 rounded-md' />
									<div>
										<Skeleton className='h-5 w-[200px]' />
										<Skeleton className='h-4 w-[150px] mt-1' />
									</div>
								</div>
								<Skeleton className='h-8 w-8 rounded-full' />
							</div>
						</CardHeader>
						<CardContent>
							<div className='space-y-3'>
								<Skeleton className='h-10 w-full' />
								<div className='pl-4 space-y-2'>
									{[1, 2, 3].map((j) => (
										<Skeleton
											key={j}
											className='h-12 w-full'
										/>
									))}
									<Skeleton className='h-9 w-[120px] mt-2' />
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
