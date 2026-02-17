export interface User {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    city: string;
    confirmed: boolean;
    suspended: boolean;
    first_access: number;
}