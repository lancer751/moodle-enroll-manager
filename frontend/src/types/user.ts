export interface User {
    id: number;
    dni: string | null;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    moodleId?: number;
    phone: string | null;
}