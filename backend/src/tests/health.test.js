const request = require("supertest");
const app = require("../app");

describe("GET /", () => {
  it("returns API running status", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "API running" });
  });
});
