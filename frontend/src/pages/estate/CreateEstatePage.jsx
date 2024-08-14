import { useNavigate, useNavigation } from "react-router-dom";
import CreateEstateForm from "../../components/forms/estate/create/CreateEstateForm";
import Modal from "../../components/layout/modal/Modal"

const CreateEstatePage = () => {
    const navigate = useNavigate();
    const navigation = useNavigation();
    const closeHandler = () =>{
        navigation.state === 'idle' && navigate('../')
    }
    return (
        <Modal onClose={closeHandler}>
            <CreateEstateForm />
        </Modal>
    )
}

export default CreateEstatePage;