import { readFileSync } from "fs"

import { Restricted, sendReaction, sendMessageQuoted } from '../_functions/_cmds.js'

export const Restrict = async ({ MP, message, _args }) => {

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

    if(getGroupProperties.commands.only.group.includes(_args[1]) && _args[0] === 'restrict') {
        return await sendMessageQuoted({
            client: MP,
            param: message,
            answer: 'Este comando já está incluso na lista de comandos permitidos apenas em grupos.'
        })
        .finally( async () => {
            await sendReaction({
                client: MP,
                param: message,
                answer: getConfigProperties.reaction.error
            })
        })
    }

    if(!getGroupProperties.commands.only.group.includes(_args[1]) && _args[0] === 'unrestrict') {
        return await sendMessageQuoted({
            client: MP,
            param: message,
            answer: 'Este comando já não está incluso na lista de comandos permitidos apenas em grupos.'
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
    
    Restricted({ Modo: _args[0], Parametro:_args[1] })

    return await sendMessageQuoted({
        client: MP,
        param: message,
        answer: `O comando ${_args[1]} foi ${_args[0] === 'unrestrict'? 
        'removido da lista de comandos permitidos apenas em grupos.' : 
        'adicionado a lista de comandos permitidos apenas em grupos.'}`
    })
    .finally( async () => {
        await sendReaction({
            client: MP,
            param: message,
            answer: getConfigProperties.reaction.success
        })
    })
}