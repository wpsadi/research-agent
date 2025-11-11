import type { ResearchState } from "../types/state.js";

/**
 * Conditional edge: Determine if we should continue to content extraction
 *
 * Checks if search results are available and no errors occurred.
 * Returns "extract" to continue or "end" to stop.
 */
export function shouldContinue(state: ResearchState): string {
	if (state.error) {
		console.log("⛔ Error detected, stopping graph");
		return "end";
	}

	if (state.searchResults && state.searchResults.length > 0) {
		console.log("✅ Search results available, continuing to extraction");
		return "extract";
	}

	console.log("⚠️  No search results, ending graph");
	return "end";
}

/**
 * Conditional edge: Determine if we should continue to final summary
 *
 * Checks if content was extracted and no errors occurred.
 * Returns "summarize" to continue or "end" to stop.
 */
export function shouldSummarize(state: ResearchState): string {
	if (state.error) {
		console.log("⛔ Error detected, stopping graph");
		return "end";
	}

	if (state.extractedContent && state.extractedContent.length > 0) {
		console.log("✅ Content extracted, continuing to summarization");
		return "summarize";
	}

	console.log("⚠️  No extracted content, ending graph");
	return "end";
}
