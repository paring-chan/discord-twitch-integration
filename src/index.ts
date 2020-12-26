import TWIClient from "./structs/TWIClient";

process.on('unhandledRejection', console.error)
process.on('uncaughtException', console.error)

const client = new TWIClient()

client.run()
