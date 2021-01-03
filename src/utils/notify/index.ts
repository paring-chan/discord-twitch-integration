// @ts-ignore
import config from '../../../config.json'
import TWIClient from "../../structs/TWIClient";
import TwitchChannel from "../../structs/TwitchChannel";
import {HelixStream} from "twitch";
import {MessageEmbed} from "discord.js";

export async function destroy(client: TWIClient) {
    for (const channel of client.channels) {
        if (channel.subscription) {
            await channel.subscription.stop().catch(() => null)
        }
    }
}

export async function start(client: TWIClient, channel: TwitchChannel) {
    const id = await client.twitchAPIClient.helix.users.getUserByName(channel.channel.twitch).then(res => res?.id)
    if (!id) return

    channel.stream = await client.twitchAPIClient.helix.streams.getStreamByUserId(id) || undefined

    channel.subscription = await client.webhookListener.subscribeToStreamChanges(id, async (stream?: HelixStream) => {
        if (stream) {
            if (!channel.stream) {
                await channel.webhook.send(channel.channel.notifyMessage, {
                    embeds: [
                        new MessageEmbed().setTitle(stream.title).addField('카테고리', stream.gameId, true).addField('시청자 수', stream.viewers, true)
                            .setImage(stream.thumbnailUrl).setURL(`https://twitch.tv/${channel.channel.twitch}`)
                    ],
                    disableMentions: 'none'
                })
            }
        } else {
            if (channel.stream) {
                await channel.webhook.send({
                    embeds: [
                        new MessageEmbed().setTitle('방송 끝').addField('시청자 수', channel.stream.viewers, true)
                            .setImage(channel.stream.thumbnailUrl).setURL(`https://twitch.tv/${channel.channel.twitch}`)
                    ],
                    disableMentions: 'none'
                })
            }
        }
        channel.stream = stream || undefined
    })
}
