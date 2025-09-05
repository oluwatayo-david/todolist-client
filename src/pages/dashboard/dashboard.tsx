import {TaskCard} from "../../components/ui/task-card.tsx";
import {Header} from "../../components/ui/header.tsx";
import {useGetTasks} from "../../hooks/task/use-get-tasks.tsx";
import {TaskCardSkeletonGrid} from "../../components/task-card-skeleton.tsx";

function DashboardPage() {
    const { task, loading, error } = useGetTasks();

    return (
        <div className={'p-4 w-full'}>
            <div className={'w-full mb-8'}>
                <Header/>
            </div>

            {loading ? (
                <TaskCardSkeletonGrid count={6} />
            ) : error ? (
                <div className="col-span-full flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
                        <p className="text-gray-500 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            ) : !task || !Array.isArray(task) || task.length === 0 ? (
                <div className="col-span-full flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
                        <p className="text-gray-500">Create your first task to get started!</p>
                    </div>
                </div>
            ) : (
                <div className={'grid lg:grid-cols-3 md:grid-cols-2 gap-4 grid-cols-1'}>
                    {task.map((taskItem, index) => (
                        <TaskCard
                            id={taskItem?._id}
                            key={taskItem?._id || index}
                            taskImage={taskItem?.taskImage?.url}
                            name={taskItem?.name}
                            details={taskItem?.details}
                            startDate={taskItem?.startDate}
                            endDate={taskItem?.endDate}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default DashboardPage