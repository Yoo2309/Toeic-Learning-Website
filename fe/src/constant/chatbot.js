import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
export const OPENAI_ENDPOINT = "https://utemyvietnam.openai.azure.com";
export const OPENAI_DEPLOYMENT = "victoryu-chatbot";
export const AZURE_SEARCH_ENDPOINT =
  "https://victoryusearch.search.windows.net";
export const AZURE_SEARCH_INDEX = "toeic-index";
export const openAIClient = new OpenAIClient(
  OPENAI_ENDPOINT,
  new AzureKeyCredential(process.env.REACT_APP_OPENAI_API_KEY)
);
