import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URI || "", {
	maxRetriesPerRequest: 2,
});

export const connectRedis = async () => {
	redis.on("error", (err) => console.log("Redis Client Error", err));
	await redis.connect();
	console.log("Connected to Redis");
};

export const disconnectRedis = async () => {
	try {
		if (redis.status === "ready") {
			await redis.quit();
		}
	} catch (e) {
		console.error("Error closing Redis connection:", e);
	}
};

export { redis };
