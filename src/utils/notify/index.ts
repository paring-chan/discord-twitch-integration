// @ts-ignore
import config from '../../../config.json'
import fetch from "node-fetch";
import TWIClient from "../../structs/TWIClient";

let loop: NodeJS.Timeout

let streaming = false

export function destroy() {
    if (loop) clearInterval(loop)
}

export function start(client: TWIClient) {
    setInterval(async () => {
        const data = await fetch('https://api.twitch.tv/kraken/streams/' + config.twitch.id, {
            headers: {
                'Client-ID': config.twitch.clientID,
                Accept: 'application/vnd.twitchtv.v5+json'
            }
        }).then(res => res.json())
        if (!data.stream) {
            streaming = false
        } else {
            if (!streaming) {
                streaming = true
                await client.webhook.send(config.notifyMessage)
            }
        }
    }, 10000)
}
