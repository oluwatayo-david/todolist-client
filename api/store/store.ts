import {configureStore} from "@reduxjs/toolkit";
import {useDispatch} from "react-redux";
import {persistReducer, persistStore} from "redux-persist";
import storage from 'redux-persist/lib/storage';
import {combineReducers} from "redux";
import authReducer from "../features/auth/authSlice.ts";
import taskReducer from "../features/task/taskSlice.ts";


const persistConfig = {
    key: "root",
    storage,
    whitelist: ['auth' , 'task'],
};


const rootReducer
    = combineReducers({
auth: authReducer,
    task: taskReducer
});


const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = () =>
    useDispatch<AppDispatch>();