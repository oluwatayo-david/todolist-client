import {useSelector} from "react-redux";
import {type RootState, useAppDispatch} from "../../api/store/store.ts";
import {editUser} from "../../api/features/user/userThrunk.ts";

export const useEditUser = () => {
    const dispatch = useAppDispatch();
    const {user, loading, error } = useSelector((state: RootState) => state.auth);

    const edit = async (userData:any) => {
        return dispatch(editUser(userData)).unwrap();
    };








    return {
        user,
        loading,
        error,
        edit
    };
};
