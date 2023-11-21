export type AssetType = 'app' | 'panel' | 'image';

export interface Asset {
    id: string;
    name: string;
    description: string;
    type: AssetType;
    thumbnail: string;
    url: string;
    tags: string[];
}

export const TYPE_ICONS = {
    app: 'ti ti-package',
    panel: 'ti ti-layout-grid',
    image: 'ti ti-photo'
};
