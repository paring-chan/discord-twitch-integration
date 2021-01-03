import tmi from 'tmi.js'
import Discord, {Team, User} from 'discord.js'
// @ts-ignore
import config from '../../config.json'
import Dokdo from "dokdo";
import TwitchChannel from "./TwitchChannel";
import {ApiClient, ClientCredentialsAuthProvider} from "twitch";
import {SimpleAdapter, WebHookListener} from "twitch-webhooks";

declare module 'discord.js' {
    interface Client {
        twi: TWIClient
    }
}

export default class TWIClient {
    owner: string[] = []
    dokdo?: Dokdo
    channels: TwitchChannel[]
    twitchAuthProvider = new ClientCredentialsAuthProvider(config.twitch.clientID, config.twitch.clientSecret)
    twitchAPIClient = new ApiClient({authProvider: this.twitchAuthProvider})
    webhookListener = new WebHookListener(this.twitchAPIClient, new SimpleAdapter(config.twitch.webhook))
    tmi: tmi.Client

    discord: Discord.Client = new Discord.Client({
        presence: {
            activity: {
                type: 'STREAMING',
                url: 'https://twitch.tv/chinokafuu1204',
                name: 'TWITCH'
            }
        },
        disableMentions: 'all',
        restTimeOffset: 0
    })

    constructor() {
        this.discord.twi = this
        this.channels = config.channels.map((it: any) => new TwitchChannel(it))
        this.tmi = tmi.Client({
            channels: config.channels.map((it: any) => it.twitch),
            identity: {
                username: config.twitch.username,
                password: config.twitch.password
            }
        })
    }

    async run() {
        await this.webhookListener.listen()
        const init = require('../utils/init').default
        await init(this)
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