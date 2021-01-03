// @ts-ignore
import config from "../../config.json";
import tmi from 'tmi.js'
import Discord from "discord.js";
import {Subscription} from "twitch-webhooks";
import {HelixStream} from "twitch";

type Channel = {
    twitch: string
    discord: string
    webhook: {
        id: string
        secret: string
    }
    notifyMessage: string
}

interface TwitchChannel {
    subscription: Subscription
}

class TwitchChannel {
    channel: Channel
    stream?: HelixStream
    connected = false

    loop?: NodeJS.Timeout

    queue: string[] = []

    webhook: Discord.WebhookClient

    async sendWebhook() {
        if (!this.queue.length) return
        let items: string[] = []
        while (this.queue.length) {
            const item = this.queue.shift()!
            if (items.join('\n').length + item.length + 1 > 2000) {
                this.queue.unshift(item)
                break
            }
            items.push(item)
        }
        await this.webhook.send(items.join('\n'))
    }

    constructor(channel: Channel) {
        this.channel = channel
        this.webhook = new Discord.WebhookClient(channel.webhook.id, channel.webhook.secret, {
            disableMentions: 'all'
        })
    }

    async start() {
        this.loop = setInterval(this.sendWebhook.bind(this), 1000)
    }

    async stop() {
        clearInterval(this.loop!)
    }
}

export default TwitchChannel
