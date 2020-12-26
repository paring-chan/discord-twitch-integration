// @ts-ignore
import config from '../../../config.json'

let loop: NodeJS.Timeout


export function destroy() {
    if (loop) clearInterval(loop)
}

export function start() {
}
