const requireRole = require("../middlewares/requireRole");

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("requireRole middleware", () => {
  it("calls next() when user has an allowed role", () => {
    const req = { user: { role: "admin" } };
    const res = mockRes();
    const next = jest.fn();

    requireRole("admin")(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("returns 403 when user role is not allowed", () => {
    const req = { user: { role: "customer" } };
    const res = mockRes();
    const next = jest.fn();

    requireRole("admin")(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 403 when there is no authenticated user", () => {
    const req = {};
    const res = mockRes();
    const next = jest.fn();

    requireRole("admin")(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});
