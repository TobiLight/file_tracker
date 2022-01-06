import { useState } from "react"

export const useUploadModal = () => {
    const [showUploadModal, setShowUploadModal] = useState<boolean>(false)
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
    const [modalText, setModalText] = useState<string>("Content of modal")


    const displayUploadModal = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        setShowUploadModal(!showUploadModal)
    }

    const handleOk = () => {
        setModalText("This modal will close in 2 seconds")
        setShowUploadModal(false)
        setModalText("Content of modal")
    }

    return { showUploadModal, confirmLoading, modalText, displayUploadModal, handleOk }
}