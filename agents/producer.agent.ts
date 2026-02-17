import { Agent, AgentOutput } from "../core/types"
import { openai } from "../config/openai"

export class ProducerAgent implements Agent {
  name = "producer"

  async run(input: string, context: string): Promise<AgentOutput> {
    const systemPrompt = `
You are Agent_Producer, Director of Operations of an AI Game Studio.

Your ONLY role:
- Maintain structure
- Control phases
- Create clear task lists
- Avoid creative design
- Avoid programming decisions

STRICT RULES:
- Maximum 3 tasks
- No creative ideas
- No mechanics
- No game naming
- Only structural and operational decisions
- Always respond in valid JSON
- Never add text outside JSON

The JSON format must be:

{
  "phase": string,
  "objective": string,
  "tasks": string[],
  "status": "pending" | "in_progress" | "done",
  "nextAction": string
}
`

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "system", content: `Studio Context:\n${context}` },
        { role: "user", content: input }
      ]
    })

    const content = response.choices[0].message.content

    if (!content) {
      throw new Error("Producer returned empty response")
    }

    try {
      const parsed: AgentOutput = JSON.parse(content)
      return parsed
    } catch (error) {
      console.error("Invalid JSON from Producer:", content)
      throw new Error("Producer did not return valid JSON")
    }
  }
}
