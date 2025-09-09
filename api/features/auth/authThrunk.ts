import {createAsyncThunk} from "@reduxjs/toolkit";
import axiosInstance from "../../request/axiosInstance";
import  {AxiosError} from "axios";
import type {UserData} from "../../../interfaces/interfaces.ts";



export const signupUser = createAsyncThunk(
    "auth/signupUser",
    async (userData: UserData, {rejectWithValue, fulfillWithValue}) => {
        try {
            const response = await axiosInstance.post("/auth/sign-up", userData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            const token = response.data?.data?.token;
            localStorage.setItem("token", token);


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


//  Login User
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (credentials: { email: string; password: string }, {rejectWithValue, fulfillWithValue}) => {
        try {
            const response = await axiosInstance.post("/auth/sign-in", credentials);
            const token = response.data?.data?.token;
            await localStorage.setItem("token", token);
            console.log(response?.data)
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


export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, {rejectWithValue, fulfillWithValue}) => {

        try {
            const response = await axiosInstance.post("/api/v1/auth/logout");
            await localStorage.removeItem("token");
            return fulfillWithValue(response.data)
        } catch (error) {
            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data?.error ||
                    error.response?.data?.message ||
                    error.message ||
                    'logout  failed';

                return rejectWithValue(errorMessage);
            }
            return rejectWithValue(error);

        }
    }
);









