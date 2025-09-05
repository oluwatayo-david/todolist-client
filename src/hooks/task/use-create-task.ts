import {useSelector} from "react-redux";
import {type RootState, useAppDispatch} from "../../../api/store/store.ts";
import {createTask} from "../../../api/features/task/taskThrunk.ts";
import type {TaskData} from "../../../interfaces/interfaces.ts";

export const useCreateTask = () => {
    const dispatch = useAppDispatch();
    const {task, loading, error} = useSelector((state: RootState) => state.task);

    const create = async (taskData:TaskData) => {
        return dispatch(createTask(taskData)).unwrap();
    };






    return {
        create, task, loading, error
    };
};
