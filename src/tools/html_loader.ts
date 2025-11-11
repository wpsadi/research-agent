import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { HtmlToTextTransformer } from "@langchain/community/document_transformers/html_to_text";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import type { SelectorType } from "cheerio";
import { tool } from "langchain";
import { z } from "zod";

export const htmlLoader = tool(
	async ({
		url,
		selector,
		transformToText = true,
		splitText = false,
		chunkSize = 1000,
		chunkOverlap = 200,
	}: {
		url: string;
		selector?: string;
		transformToText?: boolean;
		splitText?: boolean;
		chunkSize?: number;
		chunkOverlap?: number;
	}) => {
		try {
			// Create loader with optional selector
			const loader = selector
				? new CheerioWebBaseLoader(url, {
						selector: selector as unknown as SelectorType,
					})
				: new CheerioWebBaseLoader(url);

			// Load the documents
			let docs = await loader.load();

			// Apply transformations based on parameters
			if (transformToText || splitText) {
				const transformer = new HtmlToTextTransformer();

				if (splitText) {
					// Create splitter with custom options
					const splitter = new RecursiveCharacterTextSplitter({
						chunkSize,
						chunkOverlap,
					});

					// Chain splitter and transformer
					const sequence = splitter.pipe(transformer);
					docs = await sequence.invoke(docs);
				} else if (transformToText) {
					// Just transform to text without splitting
					docs = await transformer.transformDocuments(docs);
				}
			}

			// Format the response
			return {
				success: true,
				url,
				documentsCount: docs.length,
				documents: docs.map((doc, index) => ({
					index,
					content: doc.pageContent,
					metadata: doc.metadata,
					contentLength: doc.pageContent.length,
				})),
				totalContentLength: docs.reduce(
					(sum, doc) => sum + doc.pageContent.length,
					0,
				),
			};
		} catch (error) {
			return {
				success: false,
				error: `Failed to load HTML from ${url}: ${error instanceof Error ? error.message : "Unknown error"}`,
				url,
			};
		}
	},
	{
		name: "html_loader",
		description:
			"Load and parse HTML content from a URL. Can optionally transform HTML to text, split into chunks, and filter by CSS selector. Useful for extracting content from web pages for analysis or processing.",
		schema: z.object({
			url: z
				.string()
				.url()
				.describe(
					"The URL of the web page to load (must be a valid HTTP/HTTPS URL)",
				),
			selector: z
				.string()
				.optional()
				.describe(
					"Optional CSS selector to extract specific elements from the page (e.g., '.main-content', '#article', 'p.description')",
				),
			transformToText: z
				.boolean()
				.optional()
				.default(true)
				.describe(
					"Whether to transform HTML to plain text (removes HTML tags). Default is true",
				),
			splitText: z
				.boolean()
				.optional()
				.default(false)
				.describe(
					"Whether to split the content into smaller chunks. Useful for large documents. Default is false",
				),
			chunkSize: z
				.number()
				.optional()
				.default(1000)
				.describe(
					"Size of each text chunk in characters when splitText is true. Default is 1000",
				),
			chunkOverlap: z
				.number()
				.optional()
				.default(200)
				.describe(
					"Number of characters to overlap between chunks when splitText is true. Default is 200",
				),
		}),
	},
);
