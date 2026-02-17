import fs from "fs"
import path from "path"
import { AgentName, StudioPhase } from "../core/types"

const MEMORY_PATH = path.join(__dirname, "storage.json")

export interface StudioMemory {
  activePhase: StudioPhase
  activeAgent: AgentName
  decisions: string[]
  currentTasks: string[]
  lastStatus: "pending" | "in_progress" | "done"
}



export class MemoryService {
  static load(): StudioMemory {
    if (!fs.existsSync(MEMORY_PATH)) {
      const initial: StudioMemory = {
        activePhase: StudioPhase.STUDIO_SETUP,
        activeAgent: "producer",
        decisions: [],
        currentTasks: [],
        lastStatus: "pending"
      }

      fs.writeFileSync(MEMORY_PATH, JSON.stringify(initial, null, 2))
      return initial
    }

    const raw = fs.readFileSync(MEMORY_PATH, "utf-8")
    return JSON.parse(raw)
  }

  static save(memory: StudioMemory) {
    fs.writeFileSync(MEMORY_PATH, JSON.stringify(memory, null, 2))
  }
}
