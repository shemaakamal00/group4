import "express";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: string;
                level_id: number;
                acces_level: number;
            };
        }
    }
}