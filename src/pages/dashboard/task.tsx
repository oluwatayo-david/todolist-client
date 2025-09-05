import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "../../components/ui/dropdown-menu.tsx";
import { Button } from "../../components/ui/button.tsx";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../components/ui/tooltip.tsx";
import { FaEllipsis, FaCalendarDay, FaClock, FaArrowLeft } from "react-icons/fa6";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../../components/ui/card.tsx";
import { Badge } from "../../components/ui/badge.tsx";
import { Skeleton } from "../../components/ui/skeleton.tsx";
import { useParams } from "react-router-dom";
import { useGetTaskDetails } from "../../hooks/task/use-get-task-details.tsx";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { formatDateDisplay } from "../../lib/utils.ts";

function TaskPage() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);

    console.log(id);

    const handleEdit = () => {
        console.log('Edit task');
    };

    const handleDelete = () => {
        console.log('Delete task');
    };

    const handleBack = () => {
        console.log('Go back');
    };

    const { fetchData, taskDetails, error } = useGetTaskDetails();

    useEffect(() => {
        async function handleFetch() {
            try {
                setLoading(true);
                await fetchData(id);
            } catch (e: any) {
                toast.error(e);
            } finally {
                setLoading(false);
            }
        }
        handleFetch();
    }, [fetchData, id]);

    const TaskSkeleton = () => (
        <Card className="overflow-hidden shadow-xl border-0 lg:w-[500px] w-full">
            {/* Image Skeleton */}
            <div className="relative">
                <Skeleton className="w-full h-80 lg:h-96" />
                {/* Badge Skeleton */}
                <div className="absolute top-4 left-4">
                    <Skeleton className="h-6 w-20 rounded-full" />
                </div>
            </div>

            <CardHeader className="pb-4">
                {/* Title and Options Row Skeleton */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <Skeleton className="h-8 w-3/4 mb-2" />
                        <Skeleton className="h-6 w-1/2" />
                    </div>
                    <Skeleton className="h-10 w-10 rounded-md flex-shrink-0" />
                </div>

                {/* Date Information Skeleton */}
                <div className="flex flex-wrap gap-4 mt-4">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-0 pb-8">
                {/* Description Section Skeleton */}
                <div className="space-y-3">
                    <Skeleton className="h-6 w-28 mb-3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-3/4" />
                </div>

                {/* Action Buttons Skeleton */}
                <div className="flex gap-3 mt-8">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-24" />
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 min-w-full">
            <div className="max-w-4xl w-full">
                {/* Back Button */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        className="gap-2 text-gray-600 hover:text-gray-900"
                    >
                        <FaArrowLeft className="h-4 w-4" />
                        Back to Tasks
                    </Button>
                </div>

                {/* Show Skeleton, Error, or Actual Content */}
                {loading ? (
                    <TaskSkeleton />
                ) : error ? (
                    <Card className="overflow-hidden shadow-xl border-0 lg:w-[500px] w-full">
                        <CardContent className="flex items-center justify-center py-16">
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load task</h3>
                                <p className="text-gray-500 mb-4">{error}</p>
                                <div className="flex gap-3 justify-center">
                                    <Button
                                        onClick={() => window.location.reload()}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        Try Again
                                    </Button>
                                    <Button
                                        onClick={handleBack}
                                        variant="outline"
                                        className="gap-2"
                                    >
                                        <FaArrowLeft className="h-4 w-4" />
                                        Back to Tasks
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    /* Main Task Card */
                    <Card className="overflow-hidden shadow-xl border-0 lg:w-[500px] w-full">
                        {/* Large Image Section */}
                        <div className="relative">
                            <div className="w-full h-80 lg:h-96 overflow-hidden">
                                <img
                                    src={taskDetails?.taskImage?.url}
                                    alt="Task image"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Status Badge */}
                            <div className="absolute top-4 left-4">
                                <Badge className="bg-green-500 hover:bg-green-600 text-white">
                                    In Progress
                                </Badge>
                            </div>
                        </div>

                        <CardHeader className="pb-4">
                            {/* Title and Options Row */}
                            <div className="flex items-start justify-between gap-4">
                                <CardTitle className="text-2xl lg:text-3xl font-bold text-gray-900 flex-1 leading-tight">
                                    {taskDetails?.name}
                                </CardTitle>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-10 w-10 p-0 flex-shrink-0">
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <FaEllipsis className="h-5 w-5" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Task Options</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuItem onClick={handleEdit}>
                                            Edit Task
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
                                            Delete Task
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Date Information */}
                            <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <FaCalendarDay className="h-4 w-4 text-blue-500" />
                                    <span>Started: {formatDateDisplay(taskDetails?.startDate)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaClock className="h-4 w-4 text-orange-500" />
                                    <span>Due: {formatDateDisplay(taskDetails?.endDate)}</span>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="pt-0 pb-8">
                            {/* Description Section */}
                            <div className="prose max-w-none">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                                <div className="text-gray-700 leading-relaxed space-y-4">
                                    <p>
                                        {taskDetails?.details}
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 mt-8">
                                <Button className="bg-green-600 hover:bg-green-700 text-white px-6">
                                    Mark Complete
                                </Button>
                                <Button variant="outline" onClick={handleEdit} className="px-6">
                                    Edit Task
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}

export default TaskPage;