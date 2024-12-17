import axiosClient from "../config/axiosClient";

const chatbotAIApi = {
  createMenuAI(eventId, budget) {
    const url = `/AiMenu/generate?eventId=${eventId}&budget=${budget}`;
    return axiosClient.post(url);
  },
};

export default chatbotAIApi;
