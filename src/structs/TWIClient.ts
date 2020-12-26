import tmi from 'tmi.js'
// @ts-ignore
import config from '../../config.json'

export default class TWIClient {
    tmi: tmi.Client = tmi.Client({
        channels: [config.channels.twitch]
    })

    constructor() {
        const init = require('../utils/init').default
        init(this)
    }

    async run() {
        await this.tmi.connect().then(() => {
            console.log('Connected to Twitch.')
        })
    }
}