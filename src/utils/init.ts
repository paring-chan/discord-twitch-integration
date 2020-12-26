import TWIClient from "../structs/TWIClient";

export default (client: TWIClient) => {
    client.tmi.removeAllListeners()
    client.discord.removeAllListeners()
    client.tmi.on('message', (channel, tag, msg, self) => {
        if (self) return
        console.log(msg)
    })
    client.discord.on('message', msg => require('./discord/handler').default(msg, client))
}