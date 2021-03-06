import {Request} from 'express';

export interface DataStoredInToken {
    id: number;
}

export interface TokenData {
    token: string;
    expiresIn: number;
}

export interface RequestWithToken extends Request {
    token: string;
}
