import {createAsyncThunk} from "@reduxjs/toolkit";
import axiosInstance from "../../request/axiosInstance";
import  {AxiosError} from "axios";
import type {TaskData} from "../../../interfaces/interfaces";


export const createTask = createAsyncThunk(
    "task/create-task",
    async (taskData:TaskData , {rejectWithValue, fulfillWithValue}) => {
        try {
            const response = await axiosInstance.post("/tasks", taskData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });



            return fulfillWithValue(response.data)
        } catch (error) {
            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data?.error ||
                    error.response?.data?.message ||
                    error.message ||
                    'task creation failed ';

                return rejectWithValue(errorMessage);
            }
            return rejectWithValue(error);
        }
    }
);



export const getTask = createAsyncThunk(
    "task/get-task",
    async (_, {rejectWithValue, fulfillWithValue}) => {
        try {
            const response = await axiosInstance.get("/tasks");


            return fulfillWithValue(response.data)
        } catch (error) {
            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data?.error ||
                    error.response?.data?.message ||
                    error.message ||
                    'Login failed';

                return rejectWithValue(errorMessage);
            }
            return rejectWithValue(error);

        }
    }
);



export const getTaskDetails = createAsyncThunk(
    "task/get-task-details",
    async (id, {rejectWithValue, fulfillWithValue}) => {
        try {
            const response = await axiosInstance.get(`/tasks/${id}`);


            return fulfillWithValue(response.data)
        } catch (error) {
            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data?.error ||
                    error.response?.data?.message ||
                    error.message ||
                    'Login failed';

                return rejectWithValue(errorMessage);
            }
            return rejectWithValue(error);

        }
    }
);



export const deleteTask = createAsyncThunk(
    "task/delete-task",
    async (id, {rejectWithValue, fulfillWithValue}) => {
        try {
            const response = await axiosInstance.delete(`/tasks/${id}`);


            return fulfillWithValue(response.data)
        } catch (error) {
            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data?.error ||
                    error.response?.data?.message ||
                    error.message ||
                    'Login failed';

                return rejectWithValue(errorMessage);
            }
            return rejectWithValue(error);

        }
    }
);



