import { SERPGoogleScholarAPITool } from "@langchain/community/tools/google_scholar";

export const google_scholar_tool = new SERPGoogleScholarAPITool({
	apiKey: process.env.SERPAPI_API_KEY,
});
