import { readFileSync } from "fs"

import { Distribute } from '../_functions/_cmds.js'

import { sendReaction } from '../_functions/_rect.js'
import { sendMessageQuoted } from '../_functions/_smsq.js'

export const Dimiss = async ({ MP, message, _args }) => {

    var Distributed = JSON.parse(readFileSync("./database/commands/distributed.json"))
    var set_me = JSON.parse(readFileSync("./root/config.json"))
    //This function was created to provide commands to cammom users and only admins

    if(_args[1] === _args[0]) {
        return await sendMessageQuoted({
            client: MP,
            param: message,
            answer: `Não é possível permissionar este próprio comando!`
        })
        .finally( async () => {
            await sendReaction({
                client: MP,
                param: message,
                answer: set_me.reaction.error
            })
        })
    }

    if(!_args[1]) {
        return await sendMessageQuoted({
            client: MP,
            param: message,
            answer: `Tente inserindo algum comando. Como "${set_me.prefix}${_args[0]} comando".`
        })
        .finally( async () => {
            await sendReaction({
                client: MP,
                param: message,
                answer: set_me.reaction.error
            })
        })
    }

    if(Distributed.off.secure.includes(_args[1]) && _args[0] === 'make') {
        return await sendMessageQuoted({
            client: MP,
            param: message,
            answer: 'Este comando já está incluso na lista de comandos permitidos por membros comuns.'
        })
        .finally( async () => {
            await sendReaction({
                client: MP,
                param: message,
                answer: set_me.reaction.error
            })
        })
    }

    if(!Distributed.off.secure.includes(_args[1]) && _args[0] === 'dimiss') {
        return await sendMessageQuoted({
            client: MP,
            param: message,
            answer: 'Este comando já não está incluso na lista de comandos permitidos por membros comuns.'
        })
        .finally( async () => {
            await sendReaction({
                client: MP,
                param: message,
                answer: set_me.reaction.error
            })
        })
    }

    if(_args[2]) {
        return await sendMessageQuoted({
            client: MP,
            param: message,
            answer: `Os comandos normalmente não possuem muitos parametros. Tente apenas "${set_me.prefix}${_args[0]} ${_args[1]}".`
        })
        .finally( async () => {
            await sendReaction({
                client: MP,
                param: message,
                answer: set_me.reaction.error
            })
        })
    }
    
    Distribute({ Modo: _args[0], Parametro:_args[1] })

    return await sendMessageQuoted({
        client: MP,
        param: message,
        answer: `O comando ${_args[1]} foi ${_args[0] === 'dimiss'? 
        'removido da lista de comandos permitidos por usuários comuns.' : 
        'adicionado a lista de comandos permitidos por usuários comuns.'}`
    })
    .finally( async () => {
        await sendReaction({
            client: MP,
            param: message,
            answer: set_me.reaction.success
        })
    })
}