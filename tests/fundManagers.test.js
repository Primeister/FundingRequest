/**
 * @jest-environment jsdom
 */

const { PostFunding } = require("../fundManagers");

describe("PostFunding", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <input id="fundingName" />
      <input id="fundingType" />
      <textarea id="description"></textarea>
      <textarea id="requirements"></textarea>
      <input id="deadline" />
    `;
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
  });

  it("should post funding data with valid inputs", () => {
    const postMock = jest.fn();
    global.post = postMock;

    document.getElementById("fundingName").value = "Test Funding";
    document.getElementById("fundingType").value = "Grant";
    document.getElementById("description").value = "Test description";
    document.getElementById("requirements").value = "Test requirements";
    document.getElementById("deadline").value = "2023-06-30";

    PostFunding();

    expect(postMock).toHaveBeenCalledWith({
      name: "Test Funding",
      type: "Grant",
      description: "Test description",
      requirements: "Test requirements",
      deadline: "2023-06-30",
    });
  });

  it("should handle empty inputs", () => {
    const postMock = jest.fn();
    global.post = postMock;

    PostFunding();

    expect(postMock).toHaveBeenCalledWith({
      name: "",
      type: "",
      description: "",
      requirements: "",
      deadline: "",
    });
  });

  it("should not post funding data if required fields are missing", () => {
    const postMock = jest.fn();
    global.post = postMock;

    document.getElementById("fundingName").value = "";
    document.getElementById("fundingType").value = "Grant";
    document.getElementById("description").value = "Test description";
    document.getElementById("requirements").value = "Test requirements";
    document.getElementById("deadline").value = "2023-06-30";

    PostFunding();

    expect(postMock).not.toHaveBeenCalled();
  });
});
/**
 * @jest-environment jsdom
 */

const { post } = require("../fundManagers");

describe("post", () => {
  beforeEach(() => {
    jest.resetModules();
    global.fetch = jest.fn();
  });

  it("should post data to the correct URL", async () => {
    const data = { key: "value" };
    const email = "test@example.com";
    const response = {
      json: jest.fn().mockResolvedValueOnce({ message: "Success" }),
    };
    global.fetch.mockResolvedValueOnce(response);

    await post(data, email);

    expect(fetch).toHaveBeenCalledWith(
      `https://fundreq.azurewebsites.net/fundManagers/advert/post/${email}`,
      expect.objectContaining({
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
    );
  });

  it("should log the response from the server", async () => {
    const data = { key: "value" };
    const email = "test@example.com";
    const response = {
      json: jest.fn().mockResolvedValueOnce({ message: "Success" }),
    };
    global.fetch.mockResolvedValueOnce(response);
    const consoleSpy = jest.spyOn(console, "log");

    await post(data, email);

    expect(consoleSpy).toHaveBeenCalledWith({ message: "Success" });
    consoleSpy.mockRestore();
  });

  it("should handle errors from the server", async () => {
    const data = { key: "value" };
    const email = "test@example.com";
    const response = {
      json: jest.fn().mockResolvedValueOnce({ error: "Server error" }),
    };
    global.fetch.mockResolvedValueOnce(response);
    const consoleSpy = jest.spyOn(console, "log");

    await post(data, email);

    expect(consoleSpy).toHaveBeenCalledWith({ error: "Server error" });
    consoleSpy.mockRestore();
  });
});
