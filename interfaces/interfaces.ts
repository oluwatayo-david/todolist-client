export interface SignupData {
    email?: string;
    profileImage?: any;
    name?: string;
    password?: string;
    password_confirmation?: string;
}


export interface TaskData {
    _id?:string;
    name?: string;
    taskImage?: object;
    details?: string;
    startDate?:string | null;
    endDate?: string | null;
}


export interface UserData {
    _id?: string;
    name?: string;
    email?: string;
    profileImage?: object;
}

export interface Error {
    error?: unknown;
}
