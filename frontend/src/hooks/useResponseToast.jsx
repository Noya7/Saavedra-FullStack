import { useEffect } from "react";
import { useNavigate, useNavigation } from "react-router-dom"
import { toast } from "react-toastify";

const useResponseToast = (responseData) =>{
    const navigation = useNavigation()
    const navigate = useNavigate()
    useEffect(() => {
        if (navigation.state === 'idle' && responseData) {
            responseData.error?.message && toast.error(responseData.error.message);
            responseData.payload?.message && toast.success(responseData.payload.message); navigate('../')
        }
      }, [navigation.state, responseData]);
}

export default useResponseToast;