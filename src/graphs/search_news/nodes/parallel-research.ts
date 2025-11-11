import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { llm } from "../../../configs/llm.js";
import { htmlLoader } from "../../../tools/html_loader.js";
import { internetSearch } from "../../../tools/internet_search.js";
import { MediaSourceSummarySchema } from "../schemas/index.js";
import type { MediaSource, ParallelNewsStateType } from "../types/state.js";
import type { MediaSourceConfig } from "../utils/media-sources.js";
import { MEDIA_SOURCES } from "../utils/media-sources.js";

/**
 * Create a research node function for a specific media source
 */
function createMediaSourceNode(sourceConfig: MediaSourceConfig) {
	return async (state: ParallelNewsStateType) => {
		console.log(`📰 Researching ${sourceConfig.name}...`);

		try {
			// Build search query with site-specific pattern
			const query = `${sourceConfig.searchPattern} ${state.topic}`;
			console.log(`  🔍 Query: "${query}"`);

			// Execute search
			const searchResult = await internetSearch.invoke({
				query,
				maxResults: 3,
				includeRawContent: true,
				topic: "news",
			});

			// Parse search results
			const results =
				typeof searchResult === "string"
					? JSON.parse(searchResult)
					: searchResult;
			const resultsArray = Array.isArray(results)
				? results
				: results.results || [];

			if (resultsArray.length === 0) {
				console.log(`  ⚠️  No results found for ${sourceConfig.name}`);
				return {
					[sourceConfig.stateKey]: null,
				};
			}

			// Get the top result
			const topResult = resultsArray[0];
			let content = topResult.content || topResult.raw_content || "";

			// Try to load full content from the URL
			try {
				const loadResult = await htmlLoader.invoke({
					url: topResult.url,
					transformToText: true,
					splitText: false,
				});

				if (
					loadResult.success &&
					loadResult.documents &&
					loadResult.documents.length > 0 &&
					loadResult.documents[0]
				) {
					content = loadResult.documents[0].content.slice(0, 3000);
				}
			} catch (_loadError) {
				console.log(`  ⚠️  Could not load full content, using search result`);
			}

			// Summarize the content with relevance scoring
			const parser = StructuredOutputParser.fromZodSchema(
				MediaSourceSummarySchema,
			);
			const prompt = ChatPromptTemplate.fromMessages([
				[
					"system",
					`You are a news analyst. Summarize the following article from ${sourceConfig.name} in relation to the topic.`,
				],
				[
					"human",
					`Topic: {topic}\n\nArticle Content:\n{content}\n\n{format_instructions}`,
				],
			]);

			const chain = prompt.pipe(llm).pipe(parser);
			const { summary, relevance, keyPoints } = await chain.invoke({
				topic: state.topic,
				content: content.slice(0, 2000),
				format_instructions: parser.getFormatInstructions(),
			});

			const mediaSource: MediaSource = {
				name: sourceConfig.name,
				url: topResult.url,
				content: content.slice(0, 1000),
				summary: `${summary}\n\nKey Points:\n${keyPoints.map((p, i) => `${i + 1}. ${p}`).join("\n")}`,
				relevance,
			};

			console.log(
				`  ✅ ${sourceConfig.name} research complete (relevance: ${relevance}/10)`,
			);

			return {
				[sourceConfig.stateKey]: mediaSource,
			};
		} catch (error) {
			console.error(`  ❌ Error researching ${sourceConfig.name}:`, error);
			return {
				[sourceConfig.stateKey]: null,
			};
		}
	};
}

/**
 * Export individual media source nodes for parallel execution
 */
export const researchBBC = createMediaSourceNode(MEDIA_SOURCES[0]!);
export const researchReuters = createMediaSourceNode(MEDIA_SOURCES[1]!);
export const researchNDTV = createMediaSourceNode(MEDIA_SOURCES[2]!);
export const researchCNN = createMediaSourceNode(MEDIA_SOURCES[3]!);
export const researchAlJazeera = createMediaSourceNode(MEDIA_SOURCES[4]!);
export const researchGuardian = createMediaSourceNode(MEDIA_SOURCES[5]!);
export const researchNYTimes = createMediaSourceNode(MEDIA_SOURCES[6]!);
export const researchWashingtonPost = createMediaSourceNode(MEDIA_SOURCES[7]!);
export const researchAPNews = createMediaSourceNode(MEDIA_SOURCES[8]!);
export const researchForbes = createMediaSourceNode(MEDIA_SOURCES[9]!);
export const researchBloomberg = createMediaSourceNode(MEDIA_SOURCES[10]!);
export const researchEconomicTimes = createMediaSourceNode(MEDIA_SOURCES[11]!);
