import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { HumanMessage } from "@langchain/core/messages";

const llm = new ChatOpenAI({
  model: "gpt-3.5-turbo",
  temperature: 0,
});

const magicTool = tool(
  async ({ input }) => {
    return `${input + 2}`;
  },
  {
    name: "magic_function",
    description: "Applies a magic function to an input.",
    schema: z.object({
      input: z.number(),
    }),
  }
);

const tools = [magicTool];
const query = "what is the value of magic_function(3)?";
const app = createReactAgent({ llm, tools });

let agentOutput = await app.invoke({
  messages: [new HumanMessage(query)],
});

console.log(agentOutput);
