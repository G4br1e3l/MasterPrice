//import :p
import { readFileSync } from 'fs'

import { Configuration, OpenAIApi } from "openai"

import { Spam } from '../_functions/_functionsMessage.js'
import {
    sendReaction,
    sendMessageQuoted
} from '../_functions/_sendMessage.js'

const config = new Configuration({
    organization: "org-YKs4uuLUdHi1h2nayJZcnhzd",
    apiKey: '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',
})

const openai = new OpenAIApi(config)

const response = async (x) => await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: x }],
})

export const GPT = async ({ client, message, _args, remoteJid, typed }) => {

    let Input = typed.msg.key.parameters.details[1].sender.messageText.slice(5)

    if (typed.msg.key.boolean.message[0].isQuotedMessage){
        Input = typed.msg.key.parameters.details[0].messageQuotedText + ". " + Input
    }

    var Config = JSON.parse(readFileSync('./root/configurations.json', 'utf8'))

    if (!Input){
        await sendMessageQuoted({
            client: client,
            param: message,
            answer: 'Tente inserindo alguma pergunta... com (!GPT (pergunta?)) ou marcando a mensagem ou ambas juntas :)'
        })
        .then( async () => {
            await sendReaction({
                client: client,
                param: message,
                answer: Config.parameters.commands[0].execution[0].onerror
            })
        }).then(() => Spam(remoteJid))

        return 'Error.'
    }

    try {
        const resposta = await response(Input)

        await sendMessageQuoted({
            client: client,
            param: message,
            answer: resposta.data.choices[0].message.content.trim()
        })
        await sendReaction({
            client: client,
            param: message,
            answer: Config.parameters.commands[0].execution[0].onsucess
        })
        Spam(remoteJid)

        return 'Success.'

    } catch (erro) {
        switch (erro?.response?.status) {
            case 429:
                await sendMessageQuoted({
                    client: client,
                    param: message,
                    answer: 'Ooops! Muitas solicitações de resposta, aguarde um momento e tente novamente mais tarde.'
                })
                await sendReaction({
                    client: client,
                    param: message,
                    answer: Config.parameters.commands[0].execution[0].onsucess
                })

                Spam(remoteJid)
            return 'Error.'

            default:
            await sendMessageQuoted({
                client: client,
                param: message,
                answer: 'Por um código de erro desconhecido, a API parou de funcionar.'
            })
            await sendReaction({
                client: client,
                param: message,
                answer: Config.parameters.commands[0].execution[0].onsucess
            })

            Spam(remoteJid)
            return 'Error.'
        }
    }
}
