import dotenv from "dotenv";
import { config } from '../src/configuration/config';

describe("Tests config", () => {
    dotenv.config();

    it("Should override port", () => {
        process.env.PORT = "13";

        expect(config.port).toEqual(13);
    });

    it("Should load useIntegerDivision", () => {
        process.env.USE_INTEGER_DIVISION = "true";

        expect(config.useIntegerDivision).toEqual(true);
    });
});