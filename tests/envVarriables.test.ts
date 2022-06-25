import dotenv from "dotenv";

describe("Tests if env variables are in proper state", () => {
    beforeAll(() => {
        dotenv.config();
    });

    it("Should load port", () => {
        const port = parseInt(process.env.PORT ?? "");

        expect(port).toBeGreaterThanOrEqual(0);
        expect(port).toBeLessThanOrEqual(100_000);
    });

    it("Should have USE_INTEGER_DIVISION set to allowed value", () => {
        const allowedValues = ["true", "false"];
        const isEqualToEnvValue = (s: string) => s === process.env.USE_INTEGER_DIVISION;
        
        expect(allowedValues.find(isEqualToEnvValue)).not.toBeUndefined();
    })
});