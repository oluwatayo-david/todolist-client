import {useCallback, useEffect} from "react";
import {useSelector} from "react-redux";
import {type RootState, useAppDispatch} from "../../../api/store/store.ts";
import {getTask} from "../../../api/features/task/taskThrunk.ts";
import {toast} from "sonner";
export const useGetTasks = () => {
    const dispatch = useAppDispatch();
    const {task , loading  , error} = useSelector(
        (state: RootState) => state.task
    );

    const fetchData = useCallback(async () => {
        try {
            await dispatch(getTask()).unwrap();
        } catch (error: any) {
            toast.error(error)
        }
    }, []);

    useEffect(() => {
        fetchData()
    }, []);


    const refetchData = async ()=>{
        try {
            await dispatch(getTask()).unwrap();
        } catch (error: any) {
            toast.error(error)
        }
    }





    return {
        task , loading , refetchData , error
    };
};