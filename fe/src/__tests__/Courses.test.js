import Courses from "../Component/Courses/Courses";
import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithCustom } from "../constant/testConst";
import fetchMock from "fetch-mock";

const mockCourses = [
  {
    idCourse: "9f6dfe05-743e-4c75-a5e0-517ef47d5e0c",
    idRoadMap: null,
    name: "ADVANCED GRAMMAR",
    description: "Khóa học ngữ pháp nâng cao",
    isVip: true,
  },
  {
    idCourse: "6e778ced-ec5c-48ef-bfac-56b6cd72175f",
    idRoadMap: null,
    name: "TOEIC BASIC",
    description:
      "Khóa học căn bản giúp học viên hiểu về cấu trúc đề thi cũng như cách làm của từng part cập nhật",
    isVip: false,
  },
  {
    idCourse: "1aeb7d2d-b809-45ae-bff2-83f1c143a2f5",
    idRoadMap: null,
    name: "BASIC GRAMMAR",
    description: "Khóa học ngữ pháp căn bản cho người mất gốc.",
    isVip: false,
  },
];
describe("Courses", () => {
  beforeEach(() => {
    fetchMock.reset();
    window.scrollTo = jest.fn();
  });

  test("Courses Component", async () => {
    fetchMock.get(
      `${process.env.REACT_APP_API_BASE_URL ?? "/api"}/Course/GetAllCourses`,
      {
        status: 200,
        body: mockCourses,
      }
    );
    renderWithCustom(<Courses />);

    const test = await screen.findByText(/Các Khóa Học Của VictoryU/i);
    expect(test).toBeInTheDocument();

    const toeicBasicElement = await screen.findByText("TOEIC BASIC");
    expect(toeicBasicElement).toBeInTheDocument();

    const advancedGrammarElement = await screen.findByText("ADVANCED GRAMMAR");
    expect(advancedGrammarElement).toBeInTheDocument();

    const basicGrammarElement = await screen.findByText("BASIC GRAMMAR");
    expect(basicGrammarElement).toBeInTheDocument();
  });

  test("Course navigate", async () => {
    fetchMock.get(
      `${process.env.REACT_APP_API_BASE_URL ?? "/api"}/Course/GetAllCourses`,
      {
        status: 200,
        body: mockCourses,
      }
    );

    renderWithCustom(<Courses />);

    const courseItem = await screen.findByText("ADVANCED GRAMMAR");
    fireEvent.click(courseItem);
    expect(window.location.href).toContain(
      "9f6dfe05-743e-4c75-a5e0-517ef47d5e0c"
    );
  });
});
