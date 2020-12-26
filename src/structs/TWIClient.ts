import tmi from 'tmi.js'
// @ts-ignore
import config from '../../config.json'

export default class TWIClient {
    tmi: tmi.Client = tmi.Client({
        channels: [config.channels.twitch]
    })

    constructor() {
        this.tmi.on('message', (channel, tag, msg, self) => {
            if (self) return
            console.log(msg)
        })
    }

    async run() {
        await this.tmi.connect().then(() => {
            console.log('Connected to Twitch.')
        })
    }
}