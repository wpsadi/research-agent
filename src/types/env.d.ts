declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: "development" | "production";

			OPENAI_API_KEY: string;
			OPENAI_BASE_URL: string;

			TAVILY_API_KEY: string;
			SERPAPI_API_KEY: string;

			REDIS_URI: string;
		}
	}
}

export {};
