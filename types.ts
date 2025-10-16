export enum ItemType {
    Artifact = 'Artifact',
    Museum = 'Museum',
    Site = 'Site'
}

export enum Era {
    Prehistoric = 'Prehistoric',
    Ancient = 'Ancient',
    Classical = 'Classical',
    Medieval = 'Medieval',
    Renaissance = 'Renaissance',
    Modern = 'Modern'
}

export enum Region {
    Africa = 'Africa',
    Asia = 'Asia',
    Europe = 'Europe',
    NorthAmerica = 'North America',
    SouthAmerica = 'South America',
    Oceania = 'Oceania'
}

export interface ArchaeologicalItem {
    id: string;
    name: string;
    description: string;
    type: ItemType | string;
    era: Era | string;
    region: Region | string;
    location: string;
    imageUrl: string;
    museumIds?: string[];
    isDisabled?: boolean;
}

export interface FilterCriteria {
    searchTerm?: string;
    type?: ItemType | string;
    era?: Era | string;
    region?: Region | string;
}

export interface AdditionRequest {
    id: string;
    name: string;
    description: string;
    type: ItemType | string;
    location: string;
    imageUrl?: string;
    userEmail?: string;
    status: 'pending';
    submittedAt: any; // Firestore Timestamp
}