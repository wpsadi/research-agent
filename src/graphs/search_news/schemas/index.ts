import { z } from "zod";

/**
 * Schema for generating optimized search queries
 */
export const SearchQuerySchema = z.object({
	query: z
		.string()
		.describe("The optimized search query to find relevant information"),
	maxResults: z
		.number()
		.min(3)
		.max(10)
		.describe("Number of results to retrieve (3-10)"),
});

/**
 * Schema for content summary and relevance scoring
 */
export const ContentSummarySchema = z.object({
	summary: z
		.string()
		.describe("A concise summary of the key information from this source"),
	relevance: z
		.number()
		.min(0)
		.max(10)
		.describe("Relevance score of this content to the topic (0-10)"),
});

/**
 * Schema for the final comprehensive summary
 */
export const FinalSummarySchema = z.object({
	summary: z
		.string()
		.describe("Comprehensive summary synthesizing all sources"),
	keyPoints: z
		.array(z.string())
		.describe("List of key points extracted from all sources"),
	confidence: z
		.enum(["high", "medium", "low"])
		.describe("Confidence level in the summary based on source quality"),
});

/**
 * Schema for media source summary with key points
 */
export const MediaSourceSummarySchema = z.object({
	summary: z
		.string()
		.describe("A concise summary of the article from this media source"),
	relevance: z
		.number()
		.min(0)
		.max(10)
		.describe("Relevance score of this article to the topic (0-10)"),
	keyPoints: z
		.array(z.string())
		.describe("List of 2-4 key points from the article"),
});

/**
 * Schema for aggregated news summary
 */
export const AggregatedSummarySchema = z.object({
	summary: z
		.string()
		.describe(
			"Comprehensive summary synthesizing information from all media sources",
		),
	keyFindings: z
		.array(z.string())
		.describe("Top 5-10 key findings across all sources"),
	consensus: z.string().describe("Areas where multiple sources agree"),
	differences: z
		.string()
		.describe(
			"Notable differences or unique perspectives from different sources",
		),
	confidence: z
		.enum(["high", "medium", "low"])
		.describe("Confidence level based on source coverage and agreement"),
});

/**
 * Type exports for use in nodes
 */
export type SearchQuery = z.infer<typeof SearchQuerySchema>;
export type ContentSummary = z.infer<typeof ContentSummarySchema>;
export type FinalSummary = z.infer<typeof FinalSummarySchema>;
export type MediaSourceSummary = z.infer<typeof MediaSourceSummarySchema>;
export type AggregatedSummary = z.infer<typeof AggregatedSummarySchema>;
