import { Agent, AgentOutput, StudioPhase } from "../core/types"

export class ArchivistAgent implements Agent {
  name: "archivist" = "archivist"

  async run(input: string, context?: string): Promise<AgentOutput> {
    return {
      phase: StudioPhase.KNOWLEDGE_PREPARATION,
      objective: "Prepare the knowledge base for the AI game studio.",
      tasks: [
        "Finalize the list of key topics for the knowledge base.",
        "Compile gathered information from team members.",
        "Review and organize the compiled information."
      ],
      status: "in_progress",
      nextAction: "Continue compiling information from team members."
    }
  }
}
