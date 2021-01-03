import {Message} from "discord.js";
import TWIClient from "../../structs/TWIClient";
// @ts-ignore
import config from '../../../config.json'
import {destroy} from "../notify";
import TwitchChannel from "../../structs/TwitchChannel";

async function handle(msg: Message, channel: TwitchChannel, client: TWIClient) {
    if (!channel) return
    if (
        (msg.content || msg.attachments.first()))
        await client.tmi.say(channel.channel.twitch, `[디스코드][${msg.author.tag}]: ${msg.content
        && (msg.content.length > 100 ?
            msg.content.slice(0, 100) + '...' :
            msg.content) ||
        msg.attachments.first()?.url
        }`).then(console.log)
}

export default async (msg: Message, client: TWIClient) => {
    if (msg.author.bot) return
    const prefix = '#'
    if (!msg.content.startsWith(prefix)) return handle(msg, client.channels.find(r => r.channel.discord === msg.channel.id)!, client)
    const args = msg.content.slice(prefix.length).split(' ')
    const command = args.shift()!
    switch (command) {
        case 'reload':
            await destroy(client)
            Object.keys(require.cache).filter(r => !r.includes('node_modules')).map(it => delete require.cache[it])
            await require('../init').default(client)
            await msg.react('✅')
    }
}