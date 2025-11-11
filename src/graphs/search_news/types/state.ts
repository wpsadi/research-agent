import { Annotation, MessagesAnnotation } from "@langchain/langgraph";

/**
 * Media source information
 */
export interface MediaSource {
	name: string;
	url: string;
	content: string;
	summary: string;
	relevance: number;
}

/**
 * Main graph state for parallel news research across multiple media sources
 */
export const ParallelNewsState = Annotation.Root({
	...MessagesAnnotation.spec,
	topic: Annotation<string>({
		reducer: (_x, y) => y,
		default: () => "",
	}),
	// Results from each media source (parallel execution)
	bbcResults: Annotation<MediaSource | null>({
		reducer: (_x, y) => y,
		default: () => null,
	}),
	reutersResults: Annotation<MediaSource | null>({
		reducer: (_x, y) => y,
		default: () => null,
	}),
	ndtvResults: Annotation<MediaSource | null>({
		reducer: (_x, y) => y,
		default: () => null,
	}),
	cnnResults: Annotation<MediaSource | null>({
		reducer: (_x, y) => y,
		default: () => null,
	}),
	alJazeeraResults: Annotation<MediaSource | null>({
		reducer: (_x, y) => y,
		default: () => null,
	}),
	guardianResults: Annotation<MediaSource | null>({
		reducer: (_x, y) => y,
		default: () => null,
	}),
	nyTimesResults: Annotation<MediaSource | null>({
		reducer: (_x, y) => y,
		default: () => null,
	}),
	washingtonPostResults: Annotation<MediaSource | null>({
		reducer: (_x, y) => y,
		default: () => null,
	}),
	apNewsResults: Annotation<MediaSource | null>({
		reducer: (_x, y) => y,
		default: () => null,
	}),
	forbesResults: Annotation<MediaSource | null>({
		reducer: (_x, y) => y,
		default: () => null,
	}),
	bloombergResults: Annotation<MediaSource | null>({
		reducer: (_x, y) => y,
		default: () => null,
	}),
	economicTimesResults: Annotation<MediaSource | null>({
		reducer: (_x, y) => y,
		default: () => null,
	}),
	// Aggregated results
	aggregatedSummary: Annotation<string>({
		reducer: (_x, y) => y,
		default: () => "",
	}),
	allSources: Annotation<MediaSource[]>({
		reducer: (_x, y) => y,
		default: () => [],
	}),
	keyFindings: Annotation<string[]>({
		reducer: (_x, y) => y,
		default: () => [],
	}),
	error: Annotation<string | null>({
		reducer: (_x, y) => y,
		default: () => null,
	}),
});

/**
 * Type alias for the state
 */
export type ParallelNewsStateType = typeof ParallelNewsState.State;
