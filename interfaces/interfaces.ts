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
    taskImage?: {
        url?:string;
        publicID?:string;
    } | null ;
    details?: string;
    startDate?:string | null;
    endDate?: string | null;
}


export interface UserData {
    _id?: string;
    name?: string;
    email?: string;
    profileImage?: {
        url?:string;
        publicID?:string;
    } | null;
}


