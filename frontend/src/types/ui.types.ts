export interface ISidebarItem extends Object {
    id: SidebarTab;
    label: string;
    icon: React.ReactNode;
    count?: number;
}

const SIDEBAR_TAB =  {
    NOTES: 'notes',
    LABELS: 'labels',
    ARCHIVE: 'archive',
    TRASH: 'trash'
} as const;

export type SidebarTab = typeof SIDEBAR_TAB[keyof typeof SIDEBAR_TAB];
