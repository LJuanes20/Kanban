import { User } from "./user-model";

export interface AuthResponse {
    token: string;
    expiresAt: string;
    user: User;
}