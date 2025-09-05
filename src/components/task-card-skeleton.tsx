import { Skeleton } from "./ui/skeleton.tsx";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "./ui/card.tsx";

function TaskCardSkeleton() {
    return (
        <Card className="w-full max-w-md mx-auto shadow-lg min-w-[300px]">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-3/4" />

                    <Skeleton className="h-8 w-8 rounded" />
                </div>

                <div className="flex items-center gap-2 mt-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                </div>
            </CardHeader>

            <CardContent className="px-4 pb-4">
                {/* Task Image Skeleton */}
                <div className="mb-4">
                    <Skeleton className="w-full h-48 rounded-lg" />
                </div>

                {/* Task Details Skeleton */}
                <div className="space-y-3">
                    {/* Description lines */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>

                    {/* Date Information Skeleton */}
                    <div className="flex flex-col gap-2">
                        {/* Start date skeleton */}
                        <div className="flex items-center gap-1">
                            <Skeleton className="h-3 w-3" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                        {/* End date skeleton */}
                        <div className="flex items-center gap-1">
                            <Skeleton className="h-3 w-3" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="px-4 pt-0 pb-4 mt-auto">
                {/* View button skeleton */}
                <Skeleton className="w-full h-10 rounded" />
            </CardFooter>
        </Card>
    );
}

function TaskCardSkeletonGrid({ count = 3 }: { count?: number }) {
    return (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 grid-cols-1">
            {Array.from({ length: count }).map((_, index) => (
                <TaskCardSkeleton key={index} />
            ))}
        </div>
    );
}

export { TaskCardSkeleton, TaskCardSkeletonGrid };