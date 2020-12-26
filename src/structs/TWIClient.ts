import tmi from 'tmi.js'
import Discord, {Team, User} from 'discord.js'
// @ts-ignore
import config from '../../config.json'
import Dokdo from "dokdo";

export default class TWIClient {
    tmi: tmi.Client = tmi.Client({
        channels: [config.channels.twitch]
    })

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
        disableMentions: 'all'
    })

    constructor() {
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