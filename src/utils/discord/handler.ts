import {Message} from "discord.js";
import TWIClient from "../../structs/TWIClient";

export default async (msg: Message, client: TWIClient) => {
    const prefix = '#'
    if (!msg.content.startsWith(prefix)) return
    const args = msg.content.slice(prefix.length).split(' ')
    const command = args.shift()!
    switch (command) {
        case 'reload':
            Object.keys(require.cache).filter(r=>!r.includes('node_modules')).map(it => delete require.cache[it])
            require('../init').default(client)
            await msg.react('✅')
    }
}