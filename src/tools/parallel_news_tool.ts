import { tool } from "langchain";
import z from "zod";
import { researchNewsParallel } from "../graphs/search_news";

export const parallelNewsResearchTool = tool(
	async ({ topic }: { topic: string }) => {
		try {
			console.log(
				`\n🔍 Researching topic: "${topic}" across 12 media sources...`,
			);

			const result = await researchNewsParallel(topic);

			if (result.success) {
				return {
					success: true,
					summary: result.summary,
					sourcesCount: result.sources.length,
					keyFindings: result.keyFindings,
					sources: result.sources.map((s) => ({
						name: s.name,
						url: s.url,
						relevance: s.relevance,
					})),
				};
			} else {
				return {
					success: false,
					error: result.error,
					message:
						"Failed to research the topic. Please try again with a different query.",
				};
			}
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
				message: "An error occurred during research.",
			};
		}
	},
	{
		name: "parallel_news_research",
		description:
			"Research a news topic across 12 major media sources in parallel (BBC, Reuters, NDTV, CNN, Al Jazeera, Guardian, NY Times, Washington Post, AP News, Forbes, Bloomberg, Economic Times). Returns a comprehensive aggregated summary with key findings, consensus across sources, and differences in perspectives. Use this for comprehensive news research on current events, breaking news, or any topic requiring multiple source verification.",
		schema: z.object({
			topic: z
				.string()
				.describe(
					"The news topic or query to research across multiple media sources. Be specific and clear (e.g., 'AI breakthroughs 2025', 'Climate change policies', 'Stock market trends')",
				),
		}),
	},
);
