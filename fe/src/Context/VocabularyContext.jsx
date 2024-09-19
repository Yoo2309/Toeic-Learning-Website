import React, { useState, useEffect, createContext } from "react";
import { toast } from "react-toastify";

const VocabularyContext = createContext([]);

const VocabularyProvider = ({ children }) => {
  const [allWords, setAllWords] = useState([]);

  async function fetchAllVocabulary() {
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Vocabulary/GetAllVocabularies`
      );
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`${errorData.message}`);
      } else {
        const data = await response.json();
        setAllWords(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchAllVocabulary();
  }, []);

  return (
    <VocabularyContext.Provider value={{ allWords }}>
      {children}
    </VocabularyContext.Provider>
  );
};

export { VocabularyContext, VocabularyProvider };
