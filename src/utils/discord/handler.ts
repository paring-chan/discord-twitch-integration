import {Message} from "discord.js";
import TWIClient from "../../structs/TWIClient";
// @ts-ignore
import config from '../../../config.json'

async function handle(msg: Message, client: TWIClient) {
    if (msg.channel.id === config.channels.discord) await client.tmi.say(config.channels.twitch, `[디스코드][${msg.author.tag}]: ${msg.content.length > 100 ? msg.content.slice(0,100) + '...' : msg.content}`)
}

export default async (msg: Message, client: TWIClient) => {
    if (msg.author.bot) return
    const prefix = '#'
    if (!msg.content.startsWith(prefix)) return handle(msg, client)
    const args = msg.content.slice(prefix.length).split(' ')
    const command = args.shift()!
    switch (command) {
        case 'reload':
            Object.keys(require.cache).filter(r=>!r.includes('node_modules')).map(it => delete require.cache[it])
            require('../init').default(client)
            await msg.react('✅')
    }
}