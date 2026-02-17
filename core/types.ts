export type AgentStatus = "pending" | "in_progress" | "done"

export interface AgentOutput {
  phase: StudioPhase
  objective: string
  tasks: string[]
  status: AgentStatus
  nextAction: string
}

export interface Agent {
  name: string
  run(input: string, context?: string): Promise<AgentOutput>
}

export type AgentName =
  | "producer"
  | "archivist"
  | "gamedesign"

export enum StudioPhase {
  STUDIO_SETUP = "studio_setup",
  KNOWLEDGE_PREPARATION = "knowledge_preparation",
  GAME_DESIGN = "game_design"
}
