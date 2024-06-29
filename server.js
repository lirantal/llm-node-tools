import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createToolCallingAgent } from "langchain/agents";
import { AgentExecutor } from "langchain/agents";

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

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant"],
  ["placeholder", "{chat_history}"],
  ["human", "{input}"],
  ["placeholder", "{agent_scratchpad}"],
]);

const agent = createToolCallingAgent({ llm, tools, prompt });
const agentExecutor = new AgentExecutor({ agent, tools, verbose: true });

const output = await agentExecutor.invoke({ input: query });
console.log(output);
