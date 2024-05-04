/**
 * @jest-environment jsdom
 */

const { fetchData } = require("../fundingOpp");

describe("fetchData", () => {
  beforeEach(() => {
    jest.resetModules();
    sessionStorage.clear();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should throw an error if email is not found in sessionStorage", async () => {
    await expect(fetchData()).rejects.toThrow(
      "Email not found in sessionStorage"
    );
  });

  it("should fetch funding opportunities and populate the DOM", async () => {
    const mockData = [
      {
        FundingName: "Test Funding 1",
        FundingType: "Grant",
        FundingDescription: "This is a test funding opportunity.",
        Requirements: "Requirement 1, Requirement 2",
        Deadline: "2023-06-30",
      },
      {
        FundingName: "Test Funding 2",
        FundingType: "Loan",
        FundingDescription: "Another test funding opportunity.",
        Requirements: "Requirement 3, Requirement 4",
        Deadline: "2023-07-31",
      },
    ];

    sessionStorage.setItem("email", "test@example.com");
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    document.body.innerHTML = "<div id='landing-section'></div>";

    await fetchData();

    const opportunitySections = document.querySelectorAll(
      ".opportunitySection"
    );
    expect(opportunitySections.length).toBe(2);

    const firstSection = opportunitySections[0];
    expect(firstSection.querySelector("h1").textContent).toBe("Test Funding 1");
    expect(firstSection.querySelectorAll("p")[0].textContent).toBe(
      "Funding Type: Grant"
    );
    expect(firstSection.querySelectorAll("p")[1].textContent).toBe(
      "Description: This is a test funding opportunity."
    );
    expect(firstSection.querySelectorAll("p")[2].textContent).toBe(
      "Requirements: Requirement 1, Requirement 2"
    );
    expect(firstSection.querySelectorAll("p")[3].textContent).toBe(
      "Deadline: 2023-06-30"
    );

    const secondSection = opportunitySections[1];
    expect(secondSection.querySelector("h1").textContent).toBe(
      "Test Funding 2"
    );
    expect(secondSection.querySelectorAll("p")[0].textContent).toBe(
      "Funding Type: Loan"
    );
    expect(secondSection.querySelectorAll("p")[1].textContent).toBe(
      "Description: Another test funding opportunity."
    );
    expect(secondSection.querySelectorAll("p")[2].textContent).toBe(
      "Requirements: Requirement 3, Requirement 4"
    );
    expect(secondSection.querySelectorAll("p")[3].textContent).toBe(
      "Deadline: 2023-07-31"
    );
  });

  it("should handle network error", async () => {
    sessionStorage.setItem("email", "test@example.com");
    global.fetch.mockRejectedValueOnce(new Error("Network error"));

    await expect(fetchData()).rejects.toThrow("Network error");
  });

  it("should handle non-OK response", async () => {
    sessionStorage.setItem("email", "test@example.com");
    global.fetch.mockResolvedValueOnce({ ok: false });

    await expect(fetchData()).rejects.toThrow("Could not fetch resource");
  });
});
