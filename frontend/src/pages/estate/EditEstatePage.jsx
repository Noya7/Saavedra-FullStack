import { useLoaderData } from "react-router-dom";
import CreateEstateForm from "../../components/forms/estate/create/CreateEstateForm";
import Modal from "../../components/layout/modal/Modal"

export default () => {
    return (
        <Modal>
            <CreateEstateForm />
        </Modal>
    )
}