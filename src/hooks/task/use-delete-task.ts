import {useSelector} from "react-redux";
import {type RootState, useAppDispatch} from "../../../api/store/store.ts";
import {deleteTask} from "../../../api/features/task/taskThrunk.ts";

export const useDeleteTask = () => {
    const dispatch = useAppDispatch();
    const {error} = useSelector((state: RootState) => state.task);

    const deletetask = async (id:any) => {
        return dispatch(deleteTask(id)).unwrap();
    };






    return {
        deletetask ,  error
    };
};
