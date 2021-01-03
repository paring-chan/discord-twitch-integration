import TWIClient from "../structs/TWIClient";
import {start} from "./notify";

export default async (client: TWIClient) => {
    client.tmi.removeAllListeners()
    client.tmi.on('message', (chn, tag, msg, self) => {
        require('./twitch/handler').default(client, chn, tag, msg, self)
    })
    await client.tmi.connect()
    client.discord.removeAllListeners()
    for (const channel of client.channels) {
        await channel.stop()
        await channel.start()
        await start(client, channel)
    }
    client.discord.on('message', msg => require('./discord/handler').default(msg, client))
    if (client.dokdo) {
        client.discord.on('message', client.dokdo.run.bind(client.dokdo))
    }
}