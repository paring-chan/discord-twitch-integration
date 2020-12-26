import WebSocket from 'ws'

let loop: NodeJS.Timeout

let ws: WebSocket | null


export function destroy() {
    if (loop) clearInterval(loop)
    ws?.close()
}

export function start() {
    ws = new WebSocket('wss://pubsub-edge.twitch.tv')

    ws.onopen = () => {
        console.log('connected to pubsub api')
        // @ts-ignore
        loop = setInterval(() => ws!.send(JSON.stringify({type: 'PING'})), 1000)
    }

    ws.onmessage = function (e) {
        console.log(JSON.parse(e.data as string))
    }
}
