import type {TaskData} from "../../../interfaces/interfaces.ts";
import { Link } from "react-router-dom"

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./card.tsx"
import {useAuth} from "../../hooks/use-auth.ts";
import {Button} from "./button.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./dialog"
import {FaEllipsis, FaCalendarDay, FaClock} from "react-icons/fa6";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "./tooltip"
import {formatDateDisplay} from "../../lib/utils.ts";
import {useDeleteTask} from "../../hooks/task/use-delete-task.ts";
import {useState} from "react";
import {toast} from "sonner";

function TaskCard({ name, details, taskImage, endDate, startDate , _id }: TaskData) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const {deletetask} = useDeleteTask();

    const handleEdit = () => {
        console.log('Edit task:', name);
    };

    const handleDeleteClick = () => {
        setShowDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            setLoading(true);
            await deletetask(_id);

            setShowDeleteDialog(false);
            toast.success('Task deleted successfully');
        } catch (e: any) {
            toast.error(e || 'Failed to delete task');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCancel = () => {
        if (!loading) {
            setShowDeleteDialog(false);
        }
    };

    const handleOpenChange = (open: boolean) => {
        if (!loading || open) {
            setShowDeleteDialog(open);
        }
    };

    return (
        <>
            <Card className="w-full max-w-md mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300 min-w-[300px]">
                <CardHeader className="">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-gray-800 truncate">
                            {name || 'Untitled Task'}
                        </CardTitle>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <FaEllipsis className="h-4 w-4" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Options</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={handleEdit}>
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleDeleteClick} className="text-red-600">
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* User Profile Section */}
                    <div className="flex items-center  ">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                            {user?.profileImage?.url ? (
                                <img
                                    src={user.profileImage.url}
                                    className="w-full h-full object-cover"
                                    alt={`${user?.name || 'User'} profile`}
                                    onError={(e) => {
                                        console.error('Profile image failed to load');
                                        e.currentTarget.style.display = 'none';
                                        if (e.currentTarget.nextElementSibling) {
                                            (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                                        }
                                    }}
                                />
                            ) : null}

                            {/* Fallback when no profile image or image fails to load */}
                            <div
                                className="w-full h-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-600"
                                style={{ display: user?.profileImage?.url ? 'none' : 'flex' }}
                            >
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="">
                    {taskImage && (
                        <div className="mb-2">
                            <img
                                src={taskImage}
                                className="w-full h-48 object-cover rounded-lg shadow-sm"
                                alt={`Task: ${name}`}
                                onError={(e) => {
                                    const placeholder = e.currentTarget.parentElement?.querySelector('.image-placeholder');
                                    if (placeholder) {
                                        e.currentTarget.style.display = 'none';
                                        (placeholder as HTMLElement).style.display = 'flex';
                                    }
                                }}
                            />
                            <div
                                className="image-placeholder w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300"
                                style={{ display: 'none' }}
                            >
                                <div className="text-center">
                                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-gray-400 text-sm">Image not available</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Task Details */}
                    <div className="space-y-3">
                        <p className="text-sm text-gray-700 line-clamp-3">
                            {details || 'No description provided...'}
                        </p>

                        {/* Date Information */}
                        <div className="flex flex-col gap-2 text-xs text-gray-500">
                            {startDate && (
                                <div className="flex items-center gap-1">
                                    <FaCalendarDay className="h-3 w-3" />
                                    <span>Start: {formatDateDisplay(startDate)}</span>
                                </div>
                            )}
                            {endDate && (
                                <div className="flex items-center gap-1">
                                    <FaClock className="h-3 w-3" />
                                    <span>Due: {formatDateDisplay(endDate)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="px-4 pt-0 pb-4">
                    <Link  className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 px-3 text-center" to={`task/${_id}`}>
                        View Task
                    </Link>
                </CardFooter>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={handleOpenChange}>
                <DialogContent className="sm:max-w-[425px]" onPointerDownOutside={(e) => {
                    if (loading) e.preventDefault();
                }}>
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Delete Task</DialogTitle>
                        <DialogDescription className="text-gray-600">
                            Are you sure you want to delete the task <span className="font-semibold">"{name || 'Untitled Task'}"</span>?
                            <br />
                            <span className="text-red-500 text-sm mt-2 block">This action cannot be undone and will permanently remove the task from your account.</span>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex lg:gap-3 gap-0 flex-row">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleDeleteCancel}
                            disabled={loading}
                            className="flex-1 sm:flex-none"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDeleteConfirm}
                            disabled={loading}
                            className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 focus:ring-red-600"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Deleting...
                                </>
                            ) : (
                                'Delete Task'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

export { TaskCard }