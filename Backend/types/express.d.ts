declare global {
    namespace Express {
        interface User {
            id: number;
            username: string;
            salt: string;
            hashedPassword: string;
        }
    }
}

export {};