import type React from "react";
import Modal from "./Modal.modal";
import SettingsContent from "../settings/Settings.content";

interface ISettingsProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsModal: React.FC<ISettingsProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Settings"
            size="xl"
            showCloseButton
        >
            <SettingsContent />
        </Modal>
    );
};

export default SettingsModal;
