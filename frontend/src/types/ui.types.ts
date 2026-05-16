export interface ISidebarItem {
    id: SidebarTab;
    label: string;
    icon: React.ReactNode;
    count?: number;
}

const SIDEBAR_TAB = {
    NOTES: "notes",
    LABELS: "labels",
    ARCHIVE: "archive",
    TRASH: "trash",
    SHARED: "shared"
} as const;

export type SidebarTab = (typeof SIDEBAR_TAB)[keyof typeof SIDEBAR_TAB];

const SETTINGS_TAB = {
    ACCOUNT: "account",
    APPEARANCE: "appearance",
} as const;

export interface ISettingsSidebarItem {
    id: SettingsTab;
    label: string;
    count?: number;
}

export type SettingsTab = (typeof SETTINGS_TAB)[keyof typeof SETTINGS_TAB];
