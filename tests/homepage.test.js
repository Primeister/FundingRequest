/**
 * @jest-environment jsdom
 */


const homepage = require("../script").homepage;

describe("homepage", () => {
  beforeEach(() => {
    jest.resetModules();
    Object.defineProperty(window, "location", {
      value: { href: "" },
      writable: true,
    });
  });

  it("should set username and email in sessionStorage", () => {
    const data = {
      username: "testuser",
      userType: "applicants",
      email: "test@example.com",
      name: "John",
      surname: "Doe",
    };

    homepage(data);

    expect(sessionStorage.getItem("username")).toBe("John Doe");
    expect(sessionStorage.getItem("email")).toBe("test@example.com");
  });

  it("should redirect to applicants.html for applicants", () => {
    const data = { userType: "applicants" };

    homepage(data);

    expect(window.location.href).toBe("applicants.html");
  });

  it("should redirect to fundmanagers.html for funders", () => {
    const data = { userType: "funders" };

    homepage(data);

    expect(window.location.href).toBe("fundmanagers.html");
  });

  it("should redirect to admin.html for admins", () => {
    const data = { userType: "admins" };

    homepage(data);

    expect(window.location.href).toBe("admin.html");
  });

  it("should not redirect for other user types", () => {
    const data = { userType: "other" };

    homepage(data);

    expect(window.location.href).toBe("");
  });
});
