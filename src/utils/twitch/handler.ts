import {ChatUserstate} from "tmi.js";
import TWIClient from "../../structs/TWIClient";

export default (client: TWIClient, channel: string, us: ChatUserstate, message: string, self: boolean) => {
    if (self) return
    let res = `${us["display-name"] || us.username}: ${message}`.replace(/\\(\*|_|`|~|\\)/g, '$1').replace(/(\*|_|`|~|\\)/g, '\\$1')
    if (res.length > 100) {
        res = res.slice(0,100) + '...'
    }
    client.queue.push(res)
}