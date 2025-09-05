export interface SignupData {
    email?: string;
    profileImage?: any;
    name?: string;
    password?: string;
    password_confirmation?: string;
}


export interface TaskData {
    id?:string;
    name?: string;
    taskImage?: null;
    details?: string;
    startDate?: null;
    endDate?: null;
}

export interface Error {
    error?: unknown;
}
