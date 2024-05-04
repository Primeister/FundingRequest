/**
 * @jest-environment jsdom
 */

const { PostForm } = require("../form");

describe("PostForm", () => {
  beforeEach(() => {
    jest.resetModules();
    document.body.innerHTML = `
      <input id="surname" value="Doe" />
      <input id="firstname" value="John" />
      <input id="mobile" value="1234567890" />
      <input id="email" value="test@example.com" />
      <input id="idnumber" value="123456789" />
      <input id="dob" value="1990-01-01" />
      <input id="citizenship" value="US" />
    `;
    sessionStorage.setItem("FundingName", "Test Funding");
    window.location.href = "";
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it("should post form data and redirect to applicants.html", async () => {
    const postDataMock = jest.fn();
    global.postData = postDataMock;

    await PostForm();

    expect(postDataMock).toHaveBeenCalledWith({
      surname: "Doe",
      firstname: "John",
      mobile: "1234567890",
      email: "test@example.com",
      id_number: "123456789",
      dob: "1990-01-01",
      citizenship: "US",
      funding_name: "Test Funding",
    });
    expect(window.location.href).toBe("applicants.html");
  });

  it("should handle empty form fields", async () => {
    document.getElementById("surname").value = "";
    document.getElementById("firstname").value = "";
    document.getElementById("mobile").value = "";
    document.getElementById("email").value = "";
    document.getElementById("idnumber").value = "";
    document.getElementById("dob").value = "";
    document.getElementById("citizenship").value = "";

    const postDataMock = jest.fn();
    global.postData = postDataMock;

    await PostForm();

    expect(postDataMock).toHaveBeenCalledWith({
      surname: "",
      firstname: "",
      mobile: "",
      email: "",
      id_number: "",
      dob: "",
      citizenship: "",
      funding_name: "Test Funding",
    });
  });
});

describe("postData", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should send POST request with correct headers and body", async () => {
    const data = {
      surname: "Doe",
      firstname: "John",
      mobile: "1234567890",
      email: "test@example.com",
      id_number: "123456789",
      dob: "1990-01-01",
      citizenship: "US",
      funding_name: "Test Funding",
    };
    const bodyContent = JSON.stringify(data);
    const headersList = {
      Accept: "*/*",
      "Content-Type": "application/json",
    };

    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ message: "Success" }),
    });

    await postData(data);

    expect(global.fetch).toHaveBeenCalledWith(
      "https://fundreq.azurewebsites.net/application/post",
      {
        method: "POST",
        mode: "cors",
        headers: headersList,
        body: bodyContent,
      }
    );
  });

  it("should handle non-JSON response", async () => {
    const data = {
      surname: "Doe",
      firstname: "John",
      mobile: "1234567890",
      email: "test@example.com",
      id_number: "123456789",
      dob: "1990-01-01",
      citizenship: "US",
      funding_name: "Test Funding",
    };

    global.fetch.mockResolvedValueOnce({
      json: () => Promise.reject(new Error("Not JSON")),
    });

    await expect(postData(data)).rejects.toThrow("Not JSON");
  });

  it("should handle network error", async () => {
    const data = {
      surname: "Doe",
      firstname: "John",
      mobile: "1234567890",
      email: "test@example.com",
      id_number: "123456789",
      dob: "1990-01-01",
      citizenship: "US",
      funding_name: "Test Funding",
    };

    global.fetch.mockRejectedValueOnce(new Error("Network error"));

    await expect(postData(data)).rejects.toThrow("Network error");
  });
});
