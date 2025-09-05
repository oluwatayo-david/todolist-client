import {createSlice} from "@reduxjs/toolkit";
import {

    loginUser,
    logoutUser,

    signupUser,

} from "./authThrunk";

import {editUser} from "../user/userThrunk.ts";


interface AuthState {
    user: null;
    token: string | null;
    loading: boolean;
    error: string | null;
    resendOtpLoading: boolean;
    isAuthenticated: boolean | null;
}

const initialState: AuthState = {
    user: null,
    token: null,
    loading: false,
    error: null,
    resendOtpLoading: false,
    isAuthenticated: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearAuthState: (state) => {
            state.user = null;
            state.token = null;
            state.loading = false;
            state.error = null;

        },
    },
    extraReducers: (builder) => {
        builder
            //  Signup
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload?.data?.data?.user;
                state.error = null;

            })
            .addCase(signupUser.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.payload && typeof action.payload === "object"
                    ? (action.payload as any).message || "An unknown error occurred"
                    : action.payload as string;

            })


            //  Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload?.data?.user;
                state.error = null;

            })
            .addCase(loginUser.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.payload && typeof action.payload === "object"
                    ? (action.payload as any).message || "An unknown error occurred"
                    : action.payload as string;

            })


            // // Logout

            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.error = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.payload && typeof action.payload === "object"
                    ? (action.payload as any).message || "An unknown error occurred"
                    : action.payload as string;

            })

            .addCase(editUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user =  action.payload?.data
                state.error = null;

            })
            .addCase(editUser.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.payload && typeof action.payload === "object"
                    ? (action.payload as any).message || "An unknown error occurred"
                    : action.payload as string;

            })




    },
});

export const {clearAuthState} = authSlice.actions;
export default authSlice.reducer;