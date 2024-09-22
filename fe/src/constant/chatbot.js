import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
export const OPENAI_ENDPOINT = "https://utemyvietnam.openai.azure.com";
export const OPENAI_API_KEY = "59cadad899ea4b84880981aa7575a2d8";
export const OPENAI_DEPLOYMENT = "victoryu-chatbot";
export const AZURE_SEARCH_ENDPOINT =
  "https://victoryusearch.search.windows.net";
export const AZURE_SEARCH_KEY = "D0xRUU6jt2lhscpxMPthgxHK3YGyKLeXyCkvFXn42IAzSeDbiqOI";
export const AZURE_SEARCH_INDEX = "toeic-index";
export const openAIClient = new OpenAIClient(
  OPENAI_ENDPOINT,
  new AzureKeyCredential(OPENAI_API_KEY)
);
