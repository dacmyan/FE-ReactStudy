export interface RitualMedia {
    id: string;
    type: "image" | "video";
    url: string;
    alt: string;
    ritualId: string;
}

export interface Tag {
    id: string;
    name: string;
    description: string;
}

export interface RitualTag {
    id: string;
    ritualId: string;
    tagId: string;
    tag: Tag;
}

export interface RitualOffering {
    id: string;
    name: string;
    description: string;
    ritualId: string;
}

export interface Prayer {
    id: string;
    name: string;
    content: string;
    note: string;
    description: string;
    ritualId: string;
}

export interface RitualReview {
    id: string;
    rating: number;
    comment: string;
    user?: {
        fullName: string;
        email: string;
    };
    createdAt: string;
}

export interface RitualCategory {
    id: string;
    name: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    deletedAt: string | null;
}

export interface Ritual {
    id: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    deletedAt: string | null;
    name: string;
    timeOfExecution: number | null;
    dateLunar: string;
    dateSolar: string;
    difficultyLevel: string;
    description: string;
    content: string;
    reference: string;
    isHot: boolean;
    ritualCategoryId: string;
    ritualCategory?: RitualCategory;
    ritualMedias: RitualMedia[];
    ritualTags: RitualTag[];
    ritualOfferings?: RitualOffering[];
    prayers?: Prayer[];
    ritualReviews?: RitualReview[];
}