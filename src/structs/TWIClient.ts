import tmi from 'tmi.js'
import Discord, {Team, User} from 'discord.js'
// @ts-ignore
import config from '../../config.json'
import Dokdo from "dokdo";

declare module 'discord.js' {
    interface Client {
        twi: TWIClient
    }
}

export default class TWIClient {
    tmi: tmi.Client = tmi.Client({
        channels: [config.channels.twitch]
    })

    loop = setInterval(this.sendWebhook.bind(this), 1000)

    queue: string[] = []

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

    owner: string[] = []
    dokdo?: Dokdo

    discord: Discord.Client = new Discord.Client({
        presence: {
            activity: {
                type: 'STREAMING',
                url: 'https://twitch.tv/' + config.channels.twitch,
                name: config.channels.twitch
            }
        },
        disableMentions: 'all',
        restTimeOffset: 0
    })

    webhook = new Discord.WebhookClient(config.webhook.id, config.webhook.secret, {
        disableMentions: 'all'
    })

    constructor() {
        this.discord.twi = this
        const init = require('../utils/init').default
        init(this)
    }

    async run() {
        await this.tmi.connect().then(() => {
            console.log('Connected to Twitch.')
        })
        await this.discord.login(config.tokens.discord)
        const app = await this.discord.fetchApplication()
        if (app.owner instanceof Team) {
            this.owner = app.owner.members.map(it => it.id)
        } else if (app.owner instanceof User) {
            this.owner = [app.owner.id]
        }
        this.dokdo = new Dokdo(this.discord, {
            prefix: '#',
            owners: this.owner,
            noPerm(msg) {
                return msg.react('❌')
            },
        })
        this.discord.on('message', this.dokdo.run.bind(this.dokdo))
        console.log(`Connected to discord`)
    }
}