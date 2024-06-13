export interface User {
    id: number;
    name: string;
    role: Role
    email: string;
    email_verified_at: string;
}

export interface Role {
    id: number;
    name: string;
}

export interface Piece {
    id: number;
    ref: string;
    name: string;
    type: string;
    price: number;
}

export interface PieceRef {
    id: number;
    piece_to_create_id: number;
    piece_need_id: number;
    quantity: number;
    created_at: string;
    updated_at: string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
};
