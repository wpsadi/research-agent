import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { llm } from "../../../configs/llm.js";
import { AggregatedSummarySchema } from "../schemas/index.js";
import type { MediaSource, ParallelNewsStateType } from "../types/state.js";

/**
 * Node: Aggregate results from all parallel media sources
 *
 * This node collects all research results, filters out nulls,
 * and creates a comprehensive aggregated summary.
 */
export async function aggregateResults( state: ParallelNewsStateType ) {
	console.log( "📊 Aggregating results from all media sources..." );

	try {
		// Collect all media source results
		const allResults: MediaSource[] = [
			state.bbcResults,
			state.reutersResults,
			state.ndtvResults,
			state.cnnResults,
			state.alJazeeraResults,
			state.guardianResults,
			state.nyTimesResults,
			state.washingtonPostResults,
			state.apNewsResults,
			state.forbesResults,
			state.bloombergResults,
			state.economicTimesResults,
		].filter( ( result ): result is MediaSource => result !== null );

		console.log( `  📈 Aggregating ${allResults.length} sources` );

		if ( allResults.length === 0 ) {
			console.log( "  ⚠️  No results to aggregate" );
			return {
				aggregatedSummary: `No information found about "${state.topic}" from any media sources.`,
				allSources: [],
				keyFindings: [],
			};
		}

		// Sort by relevance (highest first)
		allResults.sort( ( a, b ) => b.relevance - a.relevance );

		// Prepare content for aggregation - OPTIMIZED: Only send summaries, not full content
		const sourceSummaries = allResults
			.map(
				( source, idx ) =>
					`[${idx + 1}] ${source.name} (Relevance: ${source.relevance}/10)\n${source.summary}`,
			)
			.join( "\n\n" );

		// Generate aggregated summary - OPTIMIZED: Concise prompt for faster processing
		const parser = StructuredOutputParser.fromZodSchema(
			AggregatedSummarySchema,
		);
		const prompt = ChatPromptTemplate.fromMessages( [
			[
				"system",
				"You are a senior news analyst. Quickly synthesize key information from multiple media sources. Be concise and focus on the most important findings.",
			],
			[
				"human",
				`Topic: {topic}\n\nSources (${allResults.length}):\n{sourceSummaries}\n\n{format_instructions}`,
			],
		] );

		const chain = prompt.pipe( llm ).pipe( parser );
		const result = await chain.invoke( {
			topic: state.topic,
			sourceSummaries,
			format_instructions: parser.getFormatInstructions(),
		} );

		// Format final aggregated summary
		const aggregatedSummary = `
# News Research Summary: ${state.topic}

## Overview
${result.summary}

## Key Findings
${result.keyFindings.map( ( finding, idx ) => `${idx + 1}. ${finding}` ).join( "\n" )}

## Consensus Across Sources
${result.consensus}

## Notable Differences & Perspectives
${result.differences}

## Confidence Level
${result.confidence.toUpperCase()}

## Sources Analyzed (${allResults.length} total)
${allResults.map( ( source, idx ) => `${idx + 1}. [${source.name}](${source.url}) - Relevance: ${source.relevance}/10` ).join( "\n" )}

---
*Research completed across ${allResults.length} major media sources with ${result.confidence} confidence*
`;

		console.log( `✅ Aggregation complete with ${result.confidence} confidence` );

		return {
			aggregatedSummary,
			allSources: allResults,
			keyFindings: result.keyFindings,
			messages: [{ role: "assistant", content: aggregatedSummary }],
		};
	} catch ( error ) {
		console.error( "❌ Error aggregating results:", error );
		return {
			error: `Aggregation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
			aggregatedSummary: "Failed to aggregate results",
			allSources: [],
			keyFindings: [],
		};
	}
}
