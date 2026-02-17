import { Orchestrator } from "./core/orchestrator"

const input = process.argv.slice(2).join(" ")

if (!input) {
  console.log("Please provide an instruction.")
  process.exit(1)
}

async function main() {
  const orchestrator = new Orchestrator()
  await orchestrator.run(input)
}

main()
