import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { llm } from "../../../configs/llm.js";
import { internetSearch } from "../../../tools/internet_search.js";
import { SearchQuerySchema } from "../schemas/index.js";
import type { ParallelNewsStateType } from "../types/state.js";

/**
 * Node: Execute internet search (for parallel news research)
 *
 * This node generates an optimized search query using LLM,
 * executes the search via Tavily, and returns structured results.
 * Note: This is a legacy node - use parallel-research.ts for the main parallel implementation.
 */
export async function executeSearch(state: ParallelNewsStateType) {
	console.log("🌐 Executing internet search...");

	try {
		// Generate search query first
		const parser = StructuredOutputParser.fromZodSchema(SearchQuerySchema);
		const prompt = ChatPromptTemplate.fromMessages([
			[
				"system",
				"You are a research assistant. Generate an optimized search query for the given topic.",
			],
			["human", `Topic: {topic}\n\n{format_instructions}`],
		]);

		const chain = prompt.pipe(llm).pipe(parser);
		const { query, maxResults } = await chain.invoke({
			topic: state.topic,
			format_instructions: parser.getFormatInstructions(),
		});

		console.log(`📡 Searching for: "${query}"`);

		// Execute search
		const searchResult = await internetSearch.invoke({
			query,
			maxResults,
			includeRawContent: true,
		});

		// Parse search results - handle both string and object responses
		const results =
			typeof searchResult === "string"
				? JSON.parse(searchResult)
				: searchResult;
		const resultsArray = Array.isArray(results)
			? results
			: results.results || [];
		const searchResults = resultsArray.map(
			(r: {
				url: string;
				title?: string;
				content?: string;
				raw_content?: string;
			}) => ({
				url: r.url,
				title: r.title || "Untitled",
				content: r.content || r.raw_content || "",
			}),
		);

		console.log(`✅ Found ${searchResults.length} results`);
		return {
			searchResults,
			messages: [
				{
					role: "assistant",
					content: `Found ${searchResults.length} relevant sources`,
				},
			],
		};
	} catch (error) {
		console.error("❌ Error executing search:", error);
		return {
			error: `Search failed: ${error instanceof Error ? error.message : "Unknown error"}`,
			searchResults: [],
			messages: [],
		};
	}
}
