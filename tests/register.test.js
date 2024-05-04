/**
 * @jest-environment jsdom
 */

const { register } = require("../script");

describe("register", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
  });

  it("should call homepage with correct data on successful registration", async () => {
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
      json: jest
        .fn()
        .mockResolvedValueOnce({ message: "User registered successfully" }),
    };
    global.fetch = jest.fn().mockResolvedValueOnce(response);

    await register(data);

    expect(homepageMock).toHaveBeenCalledWith(data);
  });

  it("should display error alert and highlight email field on email already used", async () => {
    const data = {
      username: "testuser",
      userType: "applicants",
      email: "test@example.com",
      name: "John",
      surname: "Doe",
    };
    const alertMock = jest.spyOn(window, "alert");
    const emailElMock = {
      style: {
        borderColor: "",
      },
    };
    global.emailEl = emailElMock;

    const response = {
      json: jest
        .fn()
        .mockResolvedValueOnce({
          error: "Email already used, try signing in.",
        }),
    };
    global.fetch = jest.fn().mockResolvedValueOnce(response);

    await register(data);

    expect(alertMock).toHaveBeenCalledWith(
      "Email already used, try signing in."
    );
    expect(emailElMock.style.borderColor).toBe("red");
  });

  it("should display error alert on other errors", async () => {
    const data = {
      username: "testuser",
      userType: "applicants",
      email: "test@example.com",
      name: "John",
      surname: "Doe",
    };
    const alertMock = jest.spyOn(window, "alert");

    const response = {
      json: jest.fn().mockResolvedValueOnce({ error: "Some other error" }),
    };
    global.fetch = jest.fn().mockResolvedValueOnce(response);

    await register(data);

    expect(alertMock).toHaveBeenCalledWith("Some other error");
  });
});
