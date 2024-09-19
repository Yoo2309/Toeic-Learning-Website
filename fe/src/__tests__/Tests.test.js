import TestIndex from "../Component/Test/TestIndex";
import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithCustom } from "../constant/testConst";
import fetchMock from "fetch-mock";

const mockTest = [
  {
    idTest: "e109ad2c-6eda-4395-8638-74ebf489b1c6",
    idType: "9c2cdc56-6774-4304-ad5e-c88403cc0e18",
    idRoadMap: null,
    name: "EST 2022 Test 1 FullTest",
    createDate: "1/1/0001 12:00:00 AM",
    useDate: "1/1/0001 12:00:00 AM",
    isVip: null,
  },
  {
    idTest: "d6f4bc74-798c-46e8-bf80-bc8bd65b9432",
    idType: "9c2cdc56-6774-4304-ad5e-c88403cc0e18",
    idRoadMap: null,
    name: "EST 2022 Test 2 FullTest",
    createDate: "1/1/0001 12:00:00 AM",
    useDate: "1/1/0001 12:00:00 AM",
    isVip: null,
  },
];
const mockMiniTest = [
  {
    idTest: "b620e770-e42b-4b3b-b57c-361fdef1a8c1",
    idType: "9c2cdc56-6774-4304-ad5e-c88403cc0e18",
    idRoadMap: null,
    name: "EST 2022 Test 3 FullTest",
    createDate: "1/1/0001 12:00:00 AM",
    useDate: "1/1/0001 12:00:00 AM",
    isVip: null,
  },
];
describe("Test Component", () => {
  beforeEach(() => {
    fetchMock.reset();
    window.scrollTo = jest.fn();
    fetchMock.get(
      `${
        process.env.REACT_APP_API_BASE_URL ?? "/api"
      }/Test/GetAllTestByType/FullTest`,

      {
        status: 200,
        body: mockTest,
      }
    );
    fetchMock.get(
      `${
        process.env.REACT_APP_API_BASE_URL ?? "/api"
      }/Test/GetAllTestByType/MiniTest`,

      {
        status: 200,
        body: mockMiniTest,
      }
    );
  });

  test("List Index", async () => {
    renderWithCustom(<TestIndex />);

    const test = await screen.findAllByText(/Kiểm Tra/i);
    expect(test[0]).toBeInTheDocument();

    const toeflBasicElement = await screen.findByText(
      "EST 2022 Test 1 FullTest"
    );
    expect(toeflBasicElement).toBeInTheDocument();

    const advancedGrammarElement = await screen.findByText(
      "EST 2022 Test 2 FullTest"
    );
    expect(advancedGrammarElement).toBeInTheDocument();

    const basicGrammarElement = await screen.findByText(
      "EST 2022 Test 3 FullTest"
    );
    expect(basicGrammarElement).toBeInTheDocument();
  });

  test("Test navigate", async () => {
    renderWithCustom(<TestIndex />);

    const courseItem = await screen.findByText("EST 2022 Test 1 FullTest");
    fireEvent.click(courseItem);
    expect(window.location.href).toContain(
      "e109ad2c-6eda-4395-8638-74ebf489b1c6"
    );
  });
});
