/**
 * Media source configurations for parallel research
 */

export interface MediaSourceConfig {
	name: string;
	domain: string;
	searchPattern: string;
	stateKey: string;
}

export const MEDIA_SOURCES: MediaSourceConfig[] = [
	{
		name: "BBC News",
		domain: "bbc.com",
		searchPattern: "site:bbc.com/news",
		stateKey: "bbcResults",
	},
	{
		name: "Reuters",
		domain: "reuters.com",
		searchPattern: "site:reuters.com",
		stateKey: "reutersResults",
	},
	{
		name: "NDTV",
		domain: "ndtv.com",
		searchPattern: "site:ndtv.com",
		stateKey: "ndtvResults",
	},
	{
		name: "CNN",
		domain: "cnn.com",
		searchPattern: "site:cnn.com",
		stateKey: "cnnResults",
	},
	{
		name: "Al Jazeera",
		domain: "aljazeera.com",
		searchPattern: "site:aljazeera.com",
		stateKey: "alJazeeraResults",
	},
	{
		name: "The Guardian",
		domain: "theguardian.com",
		searchPattern: "site:theguardian.com",
		stateKey: "guardianResults",
	},
	{
		name: "New York Times",
		domain: "nytimes.com",
		searchPattern: "site:nytimes.com",
		stateKey: "nyTimesResults",
	},
	{
		name: "Washington Post",
		domain: "washingtonpost.com",
		searchPattern: "site:washingtonpost.com",
		stateKey: "washingtonPostResults",
	},
	{
		name: "AP News",
		domain: "apnews.com",
		searchPattern: "site:apnews.com",
		stateKey: "apNewsResults",
	},
	{
		name: "Forbes",
		domain: "forbes.com",
		searchPattern: "site:forbes.com",
		stateKey: "forbesResults",
	},
	{
		name: "Bloomberg",
		domain: "bloomberg.com",
		searchPattern: "site:bloomberg.com",
		stateKey: "bloombergResults",
	},
	{
		name: "Economic Times",
		domain: "economictimes.indiatimes.com",
		searchPattern: "site:economictimes.indiatimes.com",
		stateKey: "economicTimesResults",
	},
];
