import { ChatOpenAI } from "@langchain/openai";

const llm = new ChatOpenAI({
	model: "gpt-oss-120b",
	configuration: {
		baseURL: process.env.OPENAI_BASE_URL,
	},
});

export { llm };
