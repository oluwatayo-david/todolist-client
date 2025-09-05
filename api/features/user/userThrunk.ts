import {createAsyncThunk} from "@reduxjs/toolkit";
import axiosInstance from "../../request/axiosInstance";
import  {AxiosError} from "axios";
import type {UserData} from "../../../interfaces/interfaces.ts";



export const editUser = createAsyncThunk(
    "user/editUser",
    async (userData:UserData, {rejectWithValue, fulfillWithValue}) => {
        try {
            const response = await axiosInstance.put(`/users/${userData?.id}`, userData, {
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
                    'Sign up failed';

                return rejectWithValue(errorMessage);
            }
            return rejectWithValue(error);
        }
    }
);


