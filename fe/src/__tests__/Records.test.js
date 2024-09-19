import React from "react";
import { screen } from "@testing-library/react";
import { renderWithUserRole } from "../constant/testConst";
import fetchMock from "fetch-mock";
import TestRecord from "../Component/Test/TestRecord/TestRecord";

const mockRecords = [
  {
    idRecord: "136b8702-537f-4315-b1c3-4c8d567b9b9c",
    idTest: "e109ad2c-6eda-4395-8638-74ebf489b1c6",
    idStudent: "85e8b325-d152-4296-a060-854176f10787",
    createDate: "6/30/2024 10:15:25 PM",
    listenCorrect: 0,
    listenScore: 0,
    readingCorrect: 0,
    readScore: 0,
    correctAns: 0,
    wrongAns: 36,
    totalScore: 0,
    testName: "EST 2022 Test 1 FullTest",
  },
];

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

describe("Record By Test", () => {
  beforeEach(() => {
    fetchMock.reset();
    fetchMock.get(
      `${
        process.env.REACT_APP_API_BASE_URL ?? "/api"
      }/Record/GetRecordByUser/12345`,

      {
        status: 200,
        body: mockRecords,
      }
    );
  });

  test("List Index", async () => {
    renderWithUserRole(<TestRecord />);

    const test = await screen.findByText(mockRecords[0].testName);
    expect(test).toBeInTheDocument();
  });
});
