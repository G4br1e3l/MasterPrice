//import :p
import { readFileSync } from 'fs'

import { Configuration, OpenAIApi } from "openai"

import { Spam } from '../_functions/_functionsMessage.js'
import {
    sendReaction,
    sendMessageQuoted
} from '../_functions/_sendMessage.js'

export const GPT = async ({ client, message, _args, remoteJid, typed }) => {

    var Config = JSON.parse(readFileSync('./root/configurations.json', 'utf8'))

    if (!_args[1]){
        await sendMessageQuoted({
            client: client, 
            param: message,
            answer: 'Tente inserindo alguma pergunta...'
        })
        .then( async () => {
            await sendReaction({
                client: client,
                param: message,
                answer: Config.parameters.commands[0].execution[0].onerror
            })
        }).then(() => Spam(remoteJid))

        return
    }

    const config = new Configuration({
        organization: "org-RhYnp9r8WqhtFIsFXLmd56W3",
        apiKey: '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',
    })

    const openai = new OpenAIApi(config)

    const response = async (x) => await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: x }],
    })

    const resposta = await response(typed.msg.key.parameters.details[1].sender.messageText.slice(5))

    await sendMessageQuoted({
        client: client,
        param: message,
        answer: resposta.data.choices[0].message.content.trim()
    })
    .then( async () => {
        await sendReaction({
            client: client,
            param: message,
            answer: Config.parameters.commands[0].execution[0].onsucess
        })
    })
    .finally(() => Spam(remoteJid))
}