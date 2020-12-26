import TWIClient from "../structs/TWIClient";

export default (client: TWIClient) => {
    client.tmi.removeAllListeners()
    client.tmi.on('message', (channel, tag, msg, self) => {
        if (self) return
        console.log(msg)
    })
}