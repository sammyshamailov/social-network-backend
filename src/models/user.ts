export interface User {
    email: string;
    _id: string;
    username: string;
    avatarUrl: string;
    registrationDate: string;
    lastLoginDate: string;
}

export interface UserDetails {
    email: string;
    username: string;
    file: {
        content: string;
        name: String;
    }
    password: string;
}