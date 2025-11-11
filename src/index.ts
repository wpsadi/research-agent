import { agent } from "./agent";

console.log("🤖 Agent Research System");
console.log("=".repeat(80));

const result = await agent.invoke({
	messages: [{ role: "user", content: "Recent attack in delhi" }],
});

// Print the agent's response
console.log(`\n${"=".repeat(80)}`);
console.log("📝 FINAL ANSWER:");
console.log("=".repeat(80));
console.log(result.messages[result.messages.length - 1].content);
console.log("=".repeat(80));
