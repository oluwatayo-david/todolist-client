import {createSlice} from "@reduxjs/toolkit";
import {createTask, deleteTask, getTask, getTaskDetails} from "./taskThrunk";
import type {TaskData} from "../../../interfaces/interfaces.ts";
interface TaskState {
    task: TaskData[];
    loading: boolean;
    error: string | null;
    taskDetails: TaskData[];
}

const initialState: TaskState = {
    task: [],
    loading: false,
    error: null,
    taskDetails:[]
};

const taskSlice = createSlice({
    name: "task",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder

            .addCase(createTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.loading = false;
                state.task= [action.payload?.data , ...state.task]
                state.error = null;

            })
            .addCase(createTask.rejected, (state, action) => {
                state.task= [];
                state.loading = false;
                state.error = action.payload && typeof action.payload === "object"
                    ? (action.payload as any).message || "An unknown error occurred"
                    : action.payload as string;

            })
            .addCase(getTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTask.fulfilled, (state, action) => {
                state.loading = false;
                state.task =  action.payload?.data
                state.error = null;

            })
            .addCase(getTask.rejected, (state, action) => {
                state.task= [];
                state.loading = false;
                state.error = action.payload && typeof action.payload === "object"
                    ? (action.payload as any).message || "An unknown error occurred"
                    : action.payload as string;

            })
            .addCase(getTaskDetails.pending, (state) => {
                state.error = null;
            })
            .addCase(getTaskDetails.fulfilled, (state, action) => {
                state.taskDetails =  action.payload?.data
                state.error = null;

            })
            .addCase(getTaskDetails.rejected, (state, action) => {
                state.error = action.payload && typeof action.payload === "object"
                    ? (action.payload as any).message || "An unknown error occurred"
                    : action.payload as string;

            })
            .addCase(deleteTask.pending, (state) => {
                state.error = null;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.error = null;
                state.task = state.task.filter((t)=>{
                return  t._id !== action.payload.data._id
                })
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.error = action.payload && typeof action.payload === "object"
                    ? (action.payload as any).message || "An unknown error occurred"
                    : action.payload as string;

            })



    },
});

export default taskSlice.reducer;