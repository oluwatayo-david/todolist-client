import {useSelector} from "react-redux";
import {type RootState, useAppDispatch} from "../../api/store/store.ts";
import {

    loginUser,

    signupUser,

} from "../../api/features/auth/authThrunk.ts";
import type {SignupData} from "../../interfaces/interfaces.ts";
import {clearAuthState} from "../../api/features/auth/authSlice.ts";
import {useNavigate} from "react-router-dom";
import {toast} from "sonner";
export const useAuth = () => {
    const dispatch = useAppDispatch();
    const {user, loading, error, token, } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate()
    const signup = async (userData: SignupData) => {
        return dispatch(signupUser(userData)).unwrap();
    };



    const login = async (userData:any) => {
        return dispatch(loginUser(userData)).unwrap();
    };

    const logout =  () => {
         dispatch(clearAuthState());
       localStorage.removeItem('token')
        navigate('/' , {replace:true})
        toast.success('log out successful')
    };




    return {
        user,
        loading,
        error,
        signup,
        token,
        login,
        logout,
    };
};
