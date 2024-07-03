import {RangeProduceOperation} from "@/Pages/Atelier/Operations";

export interface User {
    id: number;
    name: string;
    role_id: number
    role: Role
    posts: Post[]
    ranges: Range[]
    email: string;
    email_verified_at: string;
}

type Range = {
    id: number;
    name: string;
    user: User;
    piece: Piece;
    operations: Operation[];
};
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

export interface Operation{
    id: number,
    name: string,
    time: string,
    post_id: number,
    machine_id: number
}

export interface Post {
    id: number;
    name: string;
}

export interface Machine {
    id: number;
    name: string;
    post_id: number;
    range_produce_operations: RangeProduceOperation[];
    operations: Operation[]
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
};
