type Props = { isOpen: boolean; onClose: () => void };

const MobileOverlay: React.FC<Props> = ({ isOpen, onClose }) => (
    <div
        className={`fixed inset-0 bg-black/20 z-40 md:hidden transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
    />
);

export default MobileOverlay;