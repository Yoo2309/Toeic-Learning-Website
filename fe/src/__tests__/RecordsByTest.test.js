import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { UserProviderTest } from "../constant/testConst";
import fetchMock from "fetch-mock";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import RecordByTest from "../Component/Test/TestRecord/RecordByTest";

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
const mockTest = {
  idTest: "e109ad2c-6eda-4395-8638-74ebf489b1c6",
  idType: "9c2cdc56-6774-4304-ad5e-c88403cc0e18",
  idRoadMap: null,
  name: "EST 2022 Test 1 FullTest",
  createDate: "1/1/0001 12:00:00 AM",
  useDate: "1/1/0001 12:00:00 AM",
  isVip: false,
};

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
      }/Record/GetRecordByUserTest/12345&&${mockTest.idTest}`,

      {
        status: 200,
        body: mockRecords,
      }
    );
    fetchMock.get(
      `${process.env.REACT_APP_API_BASE_URL ?? "/api"}/Test/GetTestById/${
        mockTest.idTest
      }`,

      {
        status: 200,
        body: mockTest,
      }
    );
  });

  test("List Index", async () => {
    render(
      <UserProviderTest>
        <MemoryRouter initialEntries={[`/test/${mockTest.idTest}`]}>
          <Routes>
            <Route path="/test/:id" element={<RecordByTest />} />
          </Routes>
        </MemoryRouter>
      </UserProviderTest>
    );

    const test = await screen.findByText(mockTest.name);
    expect(test).toBeInTheDocument();

    const record = await screen.findByText(mockRecords[0].createDate);
    expect(record).toBeInTheDocument();
  });

  test("Detail navigate", async () => {
    render(
      <UserProviderTest>
        <MemoryRouter initialEntries={[`/test/${mockTest.idTest}`]}>
          <Routes>
            <Route path="/test/:id" element={<RecordByTest />} />
          </Routes>
        </MemoryRouter>
      </UserProviderTest>
    );

    const linkElement = await screen.findByText(/Xem chi tiết/i);

    expect(linkElement).toBeInTheDocument();

    expect(linkElement.href).toContain(
      `/test/result/${mockRecords[0].idRecord}`
    );
  });

  test("History navigate", async () => {
    render(
      <UserProviderTest>
        <MemoryRouter initialEntries={[`/test/${mockTest.idTest}`]}>
          <Routes>
            <Route path="/test/:id" element={<RecordByTest />} />
          </Routes>
        </MemoryRouter>
      </UserProviderTest>
    );

    await screen.findAllByText(/Lịch sử /i);

    const historyButton = screen.getByTestId("test-history");
    fireEvent.click(historyButton);

    expect(mockedUsedNavigate).toHaveBeenCalledWith(`/test/record`);
  });

  test("Do test navigate", async () => {
    render(
      <UserProviderTest>
        <MemoryRouter initialEntries={[`/test/${mockTest.idTest}`]}>
          <Routes>
            <Route path="/test/:id" element={<RecordByTest />} />
          </Routes>
        </MemoryRouter>
      </UserProviderTest>
    );

    const doTest = await screen.findByText(/làm bài thi ngay/i);

    fireEvent.click(doTest);

    expect(mockedUsedNavigate).toHaveBeenCalledWith(
      `/do-test/${mockTest.idTest}`
    );
  });
});
