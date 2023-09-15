import {
    sendReaction,
    sendMessageQuoted,
    Provided,
    Config,
} from '../../exports.js'

export const Provide = async ({ MP, message, _args }) => {

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

    if(Config.parameters.commands[0].execution[1].unsafe.includes(_args[1]) && _args[0] === 'provide') {
        return await sendMessageQuoted({
            client: MP,
            param: message,
            answer: Config.parameters.commands[2].messages.handler[1].answer.provide.made
        })
        .finally( async () => {
            await sendReaction({
                client: MP,
                param: message,
                answer: Config.parameters.commands[0].execution[0].onerror
            })
        })
    }

    if(!Config.parameters.commands[0].execution[1].unsafe.includes(_args[1]) && _args[0] === 'unprovide') {
        return await sendMessageQuoted({
            client: MP,
            param: message,
            answer: Config.parameters.commands[2].messages.handler[1].answer.provide.unmade
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

    Provided({ Modo: _args[0], Parametro: _args[1] })

    return await sendMessageQuoted({
        client: MP,
        param: message,
        answer: _args[0] === 'unprovide'?
        Config.parameters.commands[2].messages.handler[1].answer.provide.remaction
        .replaceAll('@comma', _args[1])
        :
        Config.parameters.commands[2].messages.handler[1].answer.provide.addaction
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

