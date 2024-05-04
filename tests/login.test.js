/**
 * @jest-environment jsdom
 */

const { login } = require("../main");

describe("login", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
  });

  it("should call homepage with correct data on successful login", async () => {
    const data = {
      username: "testuser",
      userType: "applicants",
      email: "test@example.com",
      name: "John",
      surname: "Doe",
    };
    const homepageMock = jest.fn();
    global.homepage = homepageMock;

    const response = {
      json: jest.fn().mockResolvedValueOnce({
        message: "User logged in successfully",
        userType: "applicants",
      }),
    };
    global.fetch = jest.fn().mockResolvedValueOnce(response);

    await login(data);

    expect(homepageMock).toHaveBeenCalledWith({
      ...data,
      userType: "applicants",
    });
  });

  it("should display error alert on failed login", async () => {
    const data = {
      username: "testuser",
      userType: "applicants",
      email: "test@example.com",
      name: "John",
      surname: "Doe",
    };
    const alertMock = jest.spyOn(window, "alert");

    const response = {
      json: jest.fn().mockResolvedValueOnce({ error: "Invalid credentials" }),
    };
    global.fetch = jest.fn().mockResolvedValueOnce(response);

    await login(data);

    expect(alertMock).toHaveBeenCalledWith("Invalid credentials");
  });
});
