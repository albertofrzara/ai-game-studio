import { ProducerAgent } from "../agents/producer.agent"
import { ArchivistAgent } from "../agents/archivist.agent"
import { AgentOutput, AgentName, StudioPhase } from "./types"
import { MemoryService, StudioMemory } from "../memory/memory.service"

export class Orchestrator {
  private memory: StudioMemory

  constructor() {
    this.memory = MemoryService.load()
  }

  async run(input: string): Promise<void> {
    const activeAgent = this.memory.activeAgent

    let result: AgentOutput

    switch (activeAgent) {
      case "producer":
        const producer = new ProducerAgent()
        result = await producer.run(input, JSON.stringify(this.memory, null, 2))
        break

      case "archivist":
        const archivist = new ArchivistAgent()
        result = await archivist.run(input, JSON.stringify(this.memory, null, 2))
        break

      default:
        throw new Error(`Unknown agent: ${activeAgent}`)
    }

    this.processResult(result)
  }

  private processResult(result: AgentOutput) {
    console.log("=== AGENT RESULT ===")
    console.log(result)

    // Actualizamos fase
    this.memory.activePhase = result.phase

    // Evitar duplicados
    if (!this.memory.decisions.includes(result.objective)) {
      this.memory.decisions.push(result.objective)
    }

    // Actualizamos tareas y status
    this.memory.currentTasks = result.tasks
    this.memory.lastStatus = result.status

    // 🔥 TRANSITION LOGIC
    this.memory.activeAgent = this.resolveNextAgent(result)

    // Guardamos memoria
    MemoryService.save(this.memory)

    console.log("=== MEMORY UPDATED ===")
    console.log("Next active agent:", this.memory.activeAgent)
  }

  private resolveNextAgent(result: AgentOutput): AgentName {
    const objectiveLower = result.objective.toLowerCase()

    if (result.phase === StudioPhase.STUDIO_SETUP && objectiveLower.includes("knowledge base")) {
      return "archivist"
    }

    if (result.phase === StudioPhase.KNOWLEDGE_PREPARATION) {
      return "archivist"
    }

    return this.memory.activeAgent
  }
}
