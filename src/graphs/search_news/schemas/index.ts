import { z } from "zod";

/**
 * Schema for generating optimized search queries
 */
export const SearchQuerySchema = z.object( {
	query: z
		.string()
		.describe( "The optimized search query to find relevant information" ),
	maxResults: z
		.number()
		.min( 3 )
		.max( 10 )
		.describe( "Number of results to retrieve (3-10)" ),
} );

/**
 * Schema for content summary and relevance scoring
 */
export const ContentSummarySchema = z.object( {
	summary: z
		.string()
		.describe( "A concise summary of the key information from this source" ),
	relevance: z
		.number()
		.min( 0 )
		.max( 10 )
		.describe( "Relevance score of this content to the topic (0-10)" ),
} );

/**
 * Schema for the final comprehensive summary
 */
export const FinalSummarySchema = z.object( {
	summary: z
		.string()
		.describe( "Comprehensive summary synthesizing all sources" ),
	keyPoints: z
		.array( z.string() )
		.describe( "List of key points extracted from all sources" ),
	confidence: z
		.enum( ["high", "medium", "low"] )
		.describe( "Confidence level in the summary based on source quality" ),
} );

/**
 * Schema for media source summary with key points
 */
export const MediaSourceSummarySchema = z.object( {
	summary: z
		.string()
		.describe( "A concise 2-3 sentence summary of the article" ),
	relevance: z
		.number()
		.min( 0 )
		.max( 10 )
		.describe( "Relevance score (0-10)" ),
	keyPoints: z
		.array( z.string() )
		.min( 2 )
		.max( 3 )
		.describe( "Top 2-3 key points only" ),
} );

/**
 * Schema for aggregated news summary - OPTIMIZED for faster generation
 */
export const AggregatedSummarySchema = z.object( {
	summary: z
		.string()
		.describe(
			"3-4 paragraph summary synthesizing all sources",
		),
	keyFindings: z
		.array( z.string() )
		.min( 5 )
		.max( 8 )
		.describe( "Top 5-8 key findings" ),
	consensus: z.string().describe( "1-2 sentences on source agreement" ),
	differences: z
		.string()
		.describe(
			"1-2 sentences on different perspectives",
		),
	confidence: z
		.enum( ["high", "medium", "low"] )
		.describe( "Confidence level" ),
} );

/**
 * Type exports for use in nodes
 */
export type SearchQuery = z.infer<typeof SearchQuerySchema>;
export type ContentSummary = z.infer<typeof ContentSummarySchema>;
export type FinalSummary = z.infer<typeof FinalSummarySchema>;
export type MediaSourceSummary = z.infer<typeof MediaSourceSummarySchema>;
export type AggregatedSummary = z.infer<typeof AggregatedSummarySchema>;
