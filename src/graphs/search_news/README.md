# Parallel News Research Graph

A parallelized LangGraph implementation that researches topics across **12 major media sources simultaneously** and aggregates results into a comprehensive summary.

## ⚡ Key Features

- **Parallel Execution**: Researches 12 news sources at the same time
- **Smart Aggregation**: Combines insights from multiple sources
- **Relevance Scoring**: Filters and ranks content by relevance
- **Consensus Analysis**: Identifies agreements and differences across sources
- **Comprehensive Coverage**: BBC, Reuters, NDTV, CNN, Al Jazeera, Guardian, NY Times, Washington Post, AP News, Forbes, Bloomberg, Economic Times

## 📁 Structure

```
search_news/
├── index.ts                    # Main entry point
├── graph.ts                    # Parallel graph construction
├── README.md                   # This file
├── types/
│   └── state.ts               # Parallel state definitions
├── schemas/
│   └── index.ts               # Zod schemas for structured output
├── nodes/
│   ├── index.ts               # Node exports
│   ├── parallel-research.ts   # 12 parallel research nodes
│   └── aggregate.ts           # Aggregation node
├── edges/
│   └── index.ts               # Conditional edge logic
└── utils/
    └── media-sources.ts       # Media source configurations
```

## 🚀 Usage

### Simple Usage

```typescript
import { researchNewsParallel } from "./graphs/search_news/index.js";

const result = await researchNewsParallel("Latest developments in AI");

console.log(result.summary);         // Aggregated summary
console.log(result.sources);         // All sources analyzed
console.log(result.keyFindings);     // Key findings across sources
```

### Advanced Usage

```typescript
import { createParallelNewsGraph } from "./graphs/search_news/index.js";

const graph = createParallelNewsGraph();
const output = await graph.invoke({
  topic: "Climate change policies 2025",
  messages: [],
});

// Access individual source results
console.log(output.bbcResults);
console.log(output.reutersResults);
// ... and 10 more sources
```

## 📦 Exports

- `createParallelNewsGraph()` - Creates and compiles the parallel graph
- `researchNewsParallel(topic)` - Convenience function to research a topic
- `ParallelNewsState` - State annotation
- `ParallelNewsStateType` - TypeScript type for state
- `MediaSource` - Interface for media source results
- `MEDIA_SOURCES` - Configuration for all 12 media sources
- All schemas, nodes, and edges

## 🔄 Graph Flow

```
                              START
                                ↓
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
    [BBC]  [Reuters]  [NDTV]  [CNN]  [Al Jazeera]  [Guardian]
        │                       │                       │
    [NY Times]  [Wash Post]  [AP News]  [Forbes]  [Bloomberg]  [Eco Times]
        │                       │                       │
        └───────────────────────┼───────────────────────┘
                                ↓
                          [AGGREGATE]
                                ↓
                              END
```

## 📊 Output Format

```markdown
# News Research Summary: [Topic]

## Overview
[Comprehensive summary synthesizing all sources]

## Key Findings
1. [Finding 1]
2. [Finding 2]
...

## Consensus Across Sources
[Areas where multiple sources agree]

## Notable Differences & Perspectives
[Unique perspectives from different sources]

## Confidence Level
HIGH/MEDIUM/LOW

## Sources Analyzed (X total)
1. [BBC News](url) - Relevance: 9/10
2. [Reuters](url) - Relevance: 8/10
...
```

## 🎯 Media Sources

The graph researches these 12 major news sources in parallel:

1. **BBC News** - bbc.com/news
2. **Reuters** - reuters.com
3. **NDTV** - ndtv.com
4. **CNN** - cnn.com
5. **Al Jazeera** - aljazeera.com
6. **The Guardian** - theguardian.com
7. **New York Times** - nytimes.com
8. **Washington Post** - washingtonpost.com
9. **AP News** - apnews.com
10. **Forbes** - forbes.com
11. **Bloomberg** - bloomberg.com
12. **Economic Times** - economictimes.indiatimes.com

## 🛠️ Extending

### Add More Media Sources

1. Add configuration in `utils/media-sources.ts`:
```typescript
{
  name: "New Source",
  domain: "newsource.com",
  searchPattern: "site:newsource.com",
  stateKey: "newSourceResults",
}
```

2. Add state field in `types/state.ts`:
```typescript
newSourceResults: Annotation<MediaSource | null>({
  reducer: (_x, y) => y,
  default: () => null,
}),
```

3. Create node in `nodes/parallel-research.ts` and export it
4. Add node to graph in `graph.ts`

## 💡 Benefits

- **Speed**: Parallel execution is ~12x faster than sequential
- **Comprehensive**: Multiple perspectives on the same topic
- **Balanced**: Aggregates diverse viewpoints
- **Reliable**: Cross-validates information across sources
- **Smart**: Filters low-relevance content automatically
