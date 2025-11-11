import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { researchNewsParallel } from "./graphs/search_news/index.js";

const app = new Hono();

// Middleware
app.use(cors());
app.use(logger());

app.get("/", (c) => c.text("Hello! News Research API is running."));

app.get("/health", (c) => {
	return c.json({ status: "ok" });
});

/**
 * POST /research
 * Body: { "topic": "your research topic" }
 *
 * Research a topic across 12 major media sources in parallel
 */
app.post("/research", async (c) => {
	try {
		const body = await c.req.json();
		const { topic } = body;

		if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
			return c.json(
				{
					success: false,
					error: "Topic is required and must be a non-empty string",
				},
				400,
			);
		}

		console.log(`\n🔍 Starting research for topic: "${topic}"`);

		// Execute parallel news research
		const result = await researchNewsParallel(topic);

		if (result.success) {
			return c.json({
				success: true,
				topic: result.topic,
				summary: result.summary,
				sourcesCount: result.sources.length,
				sources: result.sources.map((source) => ({
					name: source.name,
					url: source.url,
					relevance: source.relevance,
					summary: source.summary,
				})),
				keyFindings: result.keyFindings,
			});
		} else {
			return c.json(
				{
					success: false,
					error: result.error || "Research failed",
				},
				500,
			);
		}
	} catch (error) {
		console.error("Error in /research endpoint:", error);
		return c.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Internal server error",
			},
			500,
		);
	}
});

/**
 * GET /research/:topic
 *
 * Research a topic via GET request (URL parameter)
 */
app.get("/research/:topic", async (c) => {
	try {
		const topic = c.req.param("topic");

		if (!topic || topic.trim().length === 0) {
			return c.json(
				{
					success: false,
					error: "Topic is required",
				},
				400,
			);
		}

		console.log(`\n🔍 Starting research for topic: "${topic}"`);

		// Execute parallel news research
		const result = await researchNewsParallel(decodeURIComponent(topic));

		if (result.success) {
			return c.json({
				success: true,
				topic: result.topic,
				summary: result.summary,
				sourcesCount: result.sources.length,
				sources: result.sources.map((source) => ({
					name: source.name,
					url: source.url,
					relevance: source.relevance,
					summary: source.summary,
				})),
				keyFindings: result.keyFindings,
			});
		} else {
			return c.json(
				{
					success: false,
					error: result.error || "Research failed",
				},
				500,
			);
		}
	} catch (error) {
		console.error("Error in /research/:topic endpoint:", error);
		return c.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Internal server error",
			},
			500,
		);
	}
});

export default app;
