import {ChatUserstate} from "tmi.js";
import TWIClient from "../../structs/TWIClient";

export default (client: TWIClient, channel: string, us: ChatUserstate, message: string, self: boolean) => {
    console.log('received')
}