import { StateGraph } from "@langchain/langgraph";
import {
	aggregateResults,
	researchAlJazeera,
	researchAPNews,
	researchBBC,
	researchBloomberg,
	researchCNN,
	researchEconomicTimes,
	researchForbes,
	researchGuardian,
	researchNDTV,
	researchNYTimes,
	researchReuters,
	researchWashingtonPost,
} from "./nodes/index.js";
import { ParallelNewsState } from "./types/state.js";

/**
 * Build and compile the parallel news research graph
 *
 * Graph Flow:
 * START → [12 Parallel Research Nodes] → Aggregate → END
 *          ├─ BBC
 *          ├─ Reuters
 *          ├─ NDTV
 *          ├─ CNN
 *          ├─ Al Jazeera
 *          ├─ Guardian
 *          ├─ NY Times
 *          ├─ Washington Post
 *          ├─ AP News
 *          ├─ Forbes
 *          ├─ Bloomberg
 *          └─ Economic Times
 *                 ↓
 *            Aggregate Results
 *                 ↓
 *               END
 */
export function createParallelNewsGraph() {
	const workflow = new StateGraph(ParallelNewsState)
		// Add all parallel research nodes
		.addNode("researchBBC", researchBBC)
		.addNode("researchReuters", researchReuters)
		.addNode("researchNDTV", researchNDTV)
		.addNode("researchCNN", researchCNN)
		.addNode("researchAlJazeera", researchAlJazeera)
		.addNode("researchGuardian", researchGuardian)
		.addNode("researchNYTimes", researchNYTimes)
		.addNode("researchWashingtonPost", researchWashingtonPost)
		.addNode("researchAPNews", researchAPNews)
		.addNode("researchForbes", researchForbes)
		.addNode("researchBloomberg", researchBloomberg)
		.addNode("researchEconomicTimes", researchEconomicTimes)

		// Add aggregation node
		.addNode("aggregate", aggregateResults)

		// Connect start to all parallel nodes (fan-out)
		.addEdge("__start__", "researchBBC")
		.addEdge("__start__", "researchReuters")
		.addEdge("__start__", "researchNDTV")
		.addEdge("__start__", "researchCNN")
		.addEdge("__start__", "researchAlJazeera")
		.addEdge("__start__", "researchGuardian")
		.addEdge("__start__", "researchNYTimes")
		.addEdge("__start__", "researchWashingtonPost")
		.addEdge("__start__", "researchAPNews")
		.addEdge("__start__", "researchForbes")
		.addEdge("__start__", "researchBloomberg")
		.addEdge("__start__", "researchEconomicTimes")

		// Connect all parallel nodes to aggregation (fan-in)
		.addEdge("researchBBC", "aggregate")
		.addEdge("researchReuters", "aggregate")
		.addEdge("researchNDTV", "aggregate")
		.addEdge("researchCNN", "aggregate")
		.addEdge("researchAlJazeera", "aggregate")
		.addEdge("researchGuardian", "aggregate")
		.addEdge("researchNYTimes", "aggregate")
		.addEdge("researchWashingtonPost", "aggregate")
		.addEdge("researchAPNews", "aggregate")
		.addEdge("researchForbes", "aggregate")
		.addEdge("researchBloomberg", "aggregate")
		.addEdge("researchEconomicTimes", "aggregate")

		// Connect aggregation to end
		.addEdge("aggregate", "__end__");

	return workflow.compile();
}
