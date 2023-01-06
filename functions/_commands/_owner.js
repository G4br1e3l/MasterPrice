import { readFileSync } from "fs"

import { Owned, sendReaction, sendMessageQuoted } from '../_functions/_cmds.js'

export const Owner = async ({ MP, message, _args }) => {

    var getConfigProperties = JSON.parse(readFileSync("./root/config.json"))
    //This function was created to provide commands to cammom users and only admins

    if(!_args[1]) {
        return await sendMessageQuoted({
            client: MP,
            param: message,
            answer: `Tente inserindo algum usuário. Como apenas "${getConfigProperties.prefix}${_args[0]} 55DDDNUMERO".`
        })
        .finally( async () => {
            await sendReaction({
                client: MP,
                param: message,
                answer: getConfigProperties.reaction.error
            })
        })
    }

    if(getConfigProperties.bot.owners.includes(_args[1]) && _args[0] === 'addowner') {
        return await sendMessageQuoted({
            client: MP,
            param: message,
            answer: 'Este usuário já está incluso na lista de donos.'
        })
        .finally( async () => {
            await sendReaction({
                client: MP,
                param: message,
                answer: getConfigProperties.reaction.error
            })
        })
    }

    if(!getConfigProperties.bot.owners.includes(_args[1]) && _args[0] === 'removeowner') {
        return await sendMessageQuoted({
            client: MP,
            param: message,
            answer: 'Este usuário já não está incluso na lista de donos.'
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
    
    Owned({ Modo: _args[0], Parametro:_args[1] })

    return await sendMessageQuoted({
        client: MP,
        param: message,
        answer: `O usuário ${_args[1]} foi ${_args[0] === 'removeowner'? 
        'removido da lista de donos.' : 
        'adicionado a lista de donos.'}`
    })
    .finally( async () => {
        await sendReaction({
            client: MP,
            param: message,
            answer: getConfigProperties.reaction.success
        })
    })
}