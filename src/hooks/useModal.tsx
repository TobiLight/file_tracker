import { useState, useCallback } from "react";

export const useModal = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = useCallback(() => {
        setIsModalVisible(true);
    }, []);

    const handleCancel = useCallback(() => {
        setIsModalVisible(false);
    }, []);

    return { isModalVisible, showModal, handleCancel }
}