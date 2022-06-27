import dotenv from 'dotenv';
dotenv.config();

export interface IConfig {
    get port(): number;
    get useIntegerDivision(): boolean;
    get clientPort(): number;
}

export const config: IConfig = {
    get port(): number {
        return parseInt(process.env.PORT ?? "40404");
    },

    get useIntegerDivision(): boolean {
        return Boolean(JSON.parse(process.env.USE_INTEGER_DIVISION ?? "false"));
    },

    get clientPort(): number {
        return parseInt(process.env.CLIENT_PORT ?? "3000");
    }
};