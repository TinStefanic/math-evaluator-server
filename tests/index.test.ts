import supertest, { SuperTest, Test } from "supertest";
import app from '../src/index';

const requestWithSupertest: SuperTest<Test> = supertest(app);

describe("Endpoints tests", () => {

    it("GET /api should respond with status 400 if 'expression' parameter is missing", async () => {
        const res = await requestWithSupertest.get("/api");
        
        expect(res.status).toEqual(400);
    });

    it.each([
        ["3 + 5 - -"],
        ["8 - 9 + 1 1"],
        [""],
        ["  "],
        ["(5 - 8 + ())"]
    ])("GET /api should respond with status 422 if expression cannot be evaluated: '%s'", async (input: string) => {
        const urlParams = new URLSearchParams({expression: input});

        const res = await requestWithSupertest.get("/api?" + urlParams.toString());

        expect(res.status).toEqual(422);
    });

    describe.each([
        ["7 - 9", -2],
        ["6 / 3 * 2", 4],
        [" (1 + 1 ) - 4", -2]
    ])("GET /api should handle correct input: '%s'", (input: string, expectedResult: number) => {
        const urlParams = new URLSearchParams({expression: input});

        it("Should respond with status 200", async () => {
            const res = await requestWithSupertest.get("/api?" + urlParams.toString());

            expect(res.status).toEqual(200);
        });

        it("Should respond with correct result", async () => {
            const res = await requestWithSupertest.get("/api?" + urlParams.toString());

            expect(res.body.result).toEqual(expectedResult);
        });
    });
});