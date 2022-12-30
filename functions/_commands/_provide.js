import { readFileSync } from "fs"

import { Provided } from '../_functions/_cmds.js'

import { sendReaction } from '../_functions/_rect.js'
import { sendMessageQuoted } from '../_functions/_smsq.js'

export const Provide = async ({ MP, message, _args }) => {

    var getGroupProperties = JSON.parse(readFileSync("./database/commands/distributed.json"))
    var getConfigProperties = JSON.parse(readFileSync("./root/config.json"))
    //This function was created to provide commands to cammom users and only admins

    if(!_args[1]) {
        return await sendMessageQuoted({
            client: MP,
            param: message,
            answer: `Tente inserindo algum comando. Como "${getConfigProperties.prefix}${_args[0]} comando".`
        })
        .finally( async () => {
            await sendReaction({
                client: MP,
                param: message,
                answer: getConfigProperties.reaction.error
            })
        })
    }

    if(getGroupProperties.commands.default.includes(_args[1])) {
        return await sendMessageQuoted({
            client: MP,
            param: message,
            answer: `Opa! não é possível alterar a execução deste comando.`
        })
        .finally( async () => {
            await sendReaction({
                client: MP,
                param: message,
                answer: getConfigProperties.reaction.error
            })
        })
    }

    if(getGroupProperties.off.secure.includes(_args[1]) && _args[0] === 'provide') {
        return await sendMessageQuoted({
            client: MP,
            param: message,
            answer: 'Este comando já está incluso na lista de comandos permitidos por membros comuns.'
        })
        .finally( async () => {
            await sendReaction({
                client: MP,
                param: message,
                answer: getConfigProperties.reaction.error
            })
        })
    }

    if(!getGroupProperties.off.secure.includes(_args[1]) && _args[0] === 'unprovide') {
        return await sendMessageQuoted({
            client: MP,
            param: message,
            answer: 'Este comando já não está incluso na lista de comandos permitidos por membros comuns.'
        })
        .finally( async () => {
            await sendReaction({
                client: MP,
                param: message,
                answer: getConfigProperties.reaction.error
            })
        })
    }

    if(_args[2]) {
        return await sendMessageQuoted({
            client: MP,
            param: message,
            answer: `Os comandos normalmente não possuem muitos parametros. Tente apenas "${getConfigProperties.prefix}${_args[0]} ${_args[1]}".`
        })
        .finally( async () => {
            await sendReaction({
                client: MP,
                param: message,
                answer: getConfigProperties.reaction.error
            })
        })
    }
    
    Provided({ Modo: _args[0], Parametro:_args[1] })

    return await sendMessageQuoted({
        client: MP,
        param: message,
        answer: `O comando ${_args[1]} foi ${_args[0] === 'unprovide'? 
        'removido da lista de comandos permitidos por usuários comuns.' : 
        'adicionado a lista de comandos permitidos por usuários comuns.'}`
    })
    .finally( async () => {
        await sendReaction({
            client: MP,
            param: message,
            answer: getConfigProperties.reaction.success
        })
    })
}