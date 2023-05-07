import { readFileSync } from "fs"

import { Restricted } from '../_functions/_functionsMessage.js'
import {
    sendReaction,
    sendMessageQuoted
} from '../_functions/_sendMessage.js'

export const Restrict = async ({ MP, message, _args }) => {

    var Config = JSON.parse(readFileSync('./root/configurations.json', 'utf8'))

    if(!_args[1]) {
        return await sendMessageQuoted({
            client: MP,
            param: message,
            answer: Config.parameters.commands[2].messages.handler[1].answer.help
            .replaceAll('@prefix', Config.parameters.bot[1].prefix.set)
            .replaceAll('@type', _args[0])
        })
        .finally( async () => {
            await sendReaction({
                client: MP,
                param: message,
                answer: Config.parameters.commands[0].execution[0].onerror
            })
        })
    }

    if(Config.parameters.commands[0].execution[3].restricted.includes(_args[1])) {
        return await sendMessageQuoted({
            client: MP,
            param: message,
            answer: Config.parameters.commands[2].messages.handler[1].answer.limited
        })
        .finally( async () => {
            await sendReaction({
                client: MP,
                param: message,
                answer: Config.parameters.commands[0].execution[0].onerror
            })
        })
    }

    if(Config.parameters.commands[0].execution[2].local.includes(_args[1]) && _args[0] === 'restrict') {
        return await sendMessageQuoted({
            client: MP,
            param: message,
            answer: Config.parameters.commands[2].messages.handler[1].answer.restrict.made
        })
        .finally( async () => {
            await sendReaction({
                client: MP,
                param: message,
                answer: Config.parameters.commands[0].execution[0].onerror
            })
        })
    }

    if(!Config.parameters.commands[0].execution[2].local.includes(_args[1]) && _args[0] === 'unrestrict') {
        return await sendMessageQuoted({
            client: MP,
            param: message,
            answer: Config.parameters.commands[2].messages.handler[1].answer.restrict.unmade
        })
        .finally( async () => {
            await sendReaction({
                client: MP,
                param: message,
                answer: Config.parameters.commands[0].execution[0].onerror
            })
        })
    }

    if(_args[2]) {
        return await sendMessageQuoted({
            client: MP,
            param: message,
            answer: Config.parameters.commands[2].messages.handler[1].answer.issue
            .replaceAll('@prefix', Config.parameters.bot[1].prefix.set)
            .replaceAll('@type', _args[0])
            .replaceAll('@comma', _args[1])
        })
        .finally( async () => {
            await sendReaction({
                client: MP,
                param: message,
                answer: Config.parameters.commands[0].execution[0].onerror
            })
        })
    }

    Restricted({ Modo: _args[0], Parametro: _args[1] })

    return await sendMessageQuoted({
        client: MP,
        param: message,
        answer: _args[0] === 'unrestrict'?
        Config.parameters.commands[2].messages.handler[1].answer.restrict.remaction
        .replaceAll('@comma', _args[1])
        :
        Config.parameters.commands[2].messages.handler[1].answer.restrict.addaction
        .replaceAll('@comma', _args[1])
    })
    .finally( async () => {
        await sendReaction({
            client: MP,
            param: message,
            answer: Config.parameters.commands[0].execution[0].onsucess
        })
    })
}