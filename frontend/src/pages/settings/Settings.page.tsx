import type React from "react";
import SettingsContent from "../../components/settings/Settings.content";

const SettingsPage: React.FC = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Cài đặt</h1>
            <SettingsContent />
        </div>
    )
}

export default SettingsPage;
