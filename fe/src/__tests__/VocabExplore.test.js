import VocabularyTopic from "../Component/Vocabulary/VocabularyTopic";
import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithCustom } from "../constant/testConst";
import fetchMock from "fetch-mock";

const mockVocab = [
  {
    idVocList: "16bdbd4f-68d7-4314-b25b-77b062c06020",
    idUser: "0eaf6926-d068-49a3-a42e-ce446d603178",
    idRoadMap: null,
    title: "Cơ thể con người",
    description: "Từ vựng tiếng Anh thông dụng về cơ thể con người",
    author: "pro1",
    quantity: 0,
    createDate: "6/15/2024 8:19:05 AM",
    status: "0",
    isPublic: true,
  },
  {
    idVocList: "39e937c7-8d96-4854-bb16-bd0bdc29099f",
    idUser: "0eaf6926-d068-49a3-a42e-ce446d603178",
    idRoadMap: null,
    title: "House Holds",
    description: "Đồ gia dụng trong bếp",
    author: "pro1",
    quantity: 5,
    createDate: "6/25/2024 3:01:03 PM",
    status: "string",
    isPublic: true,
  },
];
describe("Explore Vocabulary", () => {
  beforeEach(() => {
    fetchMock.reset();
    fetchMock.get(
      `${
        process.env.REACT_APP_API_BASE_URL ?? "/api"
      }/VocList/GetAllPublicVocList`,
      {
        status: 200,
        body: mockVocab,
      }
    );
    window.scrollTo = jest.fn();
  });

  test("Vocab List", async () => {
    renderWithCustom(<VocabularyTopic />);

    const vocab = await screen.findByText(/Danh Sách Từ Vựng/i);
    expect(vocab).toBeInTheDocument();

    const topic1 = await screen.findAllByText(/House Holds/i);
    expect(topic1[0]).toBeInTheDocument();

    const topic2 = await screen.findAllByText(/Cơ thể con người/i);
    expect(topic2[0]).toBeInTheDocument();
  });

  test("Vocab List Navigate", async () => {
    renderWithCustom(<VocabularyTopic />);

    const topicItem = await screen.findByText(/House Holds/i);
    fireEvent.click(topicItem);
    expect(window.location.href).toContain(
      "39e937c7-8d96-4854-bb16-bd0bdc29099f"
    );
  });
});
