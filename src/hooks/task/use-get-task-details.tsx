import {useCallback} from "react";
import {useSelector} from "react-redux";
import {type RootState, useAppDispatch} from "../../../api/store/store.ts";
import {getTask, getTaskDetails} from "../../../api/features/task/taskThrunk.ts";
import {toast} from "sonner";
export const useGetTaskDetails = () => {
    const dispatch = useAppDispatch();
    const {taskDetails , loading , error  } = useSelector(
        (state: RootState) => state.task
    );

    const fetchData = useCallback(async (id:any) => {
        try {
            await dispatch(getTaskDetails(id)).unwrap();
        } catch (error: any) {
            toast.error(error)
        }
    }, [dispatch]);




    const refetchData = async ()=>{
        try {
            await dispatch(getTask()).unwrap();
        } catch (error: any) {
            toast.error(error)
        }
    }





    return {
        taskDetails , loading , refetchData , fetchData , error
    };
};