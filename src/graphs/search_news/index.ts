import { createParallelNewsGraph } from "./graph.js";

// ============================================================================
// MAIN EXECUTION FUNCTION
// ============================================================================

/**
 * Execute the parallel news research graph for a given topic
 *
 * Researches the topic across 12 major media sources in parallel,
 * then aggregates the results into a comprehensive summary.
 */
export async function researchNewsParallel(topic: string) {
	console.log(`\n${"=".repeat(70)}`);
	console.log(`🚀 Starting parallel news research on: "${topic}"`);
	console.log(`📰 Searching across 12 media sources simultaneously...`);
	console.log(`${"=".repeat(70)}\n`);

	const graph = createParallelNewsGraph();

	try {
		const result = await graph.invoke({
			topic,
			messages: [],
		});

		console.log(`\n${"=".repeat(70)}`);
		console.log("✅ Parallel research completed!");
		console.log(`📊 Sources analyzed: ${result.allSources?.length || 0}/12`);
		console.log(`${"=".repeat(70)}\n`);

		return {
			success: true,
			topic: result.topic,
			summary: result.aggregatedSummary,
			sources: result.allSources,
			keyFindings: result.keyFindings,
			error: result.error,
		};
	} catch (error) {
		console.error("❌ Parallel research failed:", error);
		return {
			success: false,
			topic,
			summary: "",
			sources: [],
			keyFindings: [],
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

// ============================================================================
// EXPORTS
// ============================================================================

// Export main functions
export { createParallelNewsGraph };

// Export edges
export * from "./edges/index.js";
// Export nodes
export * from "./nodes/index.js";

// Export schemas
export * from "./schemas/index.js";
export type { MediaSource, ParallelNewsStateType } from "./types/state.js";
// Export types and state
export { ParallelNewsState } from "./types/state.js";

// Export media source configs
export * from "./utils/media-sources.js";

// Default export
export default createParallelNewsGraph;
