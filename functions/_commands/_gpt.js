//import :p
import { readFileSync, createWriteStream, unlink, writeFileSync } from "fs";

import ax from 'axios';
const { get } = ax

import { Configuration, OpenAIApi } from "openai"

import { Spam } from '../_functions/_functionsMessage.js'
import {
  sendReaction,
  sendMessageQuoted,
  sendCaptionImageQuoted,
} from "../_functions/_sendMessage.js";

const config = new Configuration({
    organization: "org-YKs4uuLUdHi1h2nayJZcnhzd",
    apiKey: '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',
})

const openai = new OpenAIApi(config)

const response = async (x) => await openai.createChatCompletion({
    model: "gpt-3.5-turbo-0301",
    messages: [{ role: "user", content: x }],
    max_tokens: 1000,
    temperature: 0,
})

export const GPT = async ({ client, message, _args, remoteJid, typed }) => {

    let Input = typed.msg.key.parameters.details[1].sender.messageText.slice(5)

    if (typed.msg.key.boolean.message[0].isQuotedMessage) {
        Input = typed.msg.key.parameters.details[0]?.messageQuotedText || ""; // If message is a quoted message, set Input to the quoted text. If it's undefined, use an empty string instead.
        const quotedMessage = typed.msg.key.parameters.details[0].messageContextinfo?.quotedMessage;
        if (quotedMessage?.imageMessage?.caption !== undefined) {
            Input += ` ${quotedMessage.imageMessage.caption}`;
        }
        if (quotedMessage?.videoMessage?.caption !== undefined) {
            Input += ` ${quotedMessage.videoMessage.caption}`;
        }
            Input += ". "; // Add a period and space after the captions (if any)
            Input += typed.msg.key.parameters.details[0].text || ""; // Finally, add the original Input (which may or may not have been modified) to the end of the string. If it's undefined, use an empty string instead.
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

    if (_args[1] === 'foto') {

        try {
            const response = async (x) =>
                await openai.createImage({
                    prompt: x,
                    n: 1,
                    size: "1024x1024",
                });
            
            const resposta = await response(Input)

            await downloadImage(resposta.data.data[0].url, './functions/_commands/_gpt.jpeg');

            async function downloadImage(url, filename) {
                const response = await get(url, { responseType: 'stream' });
                const writer = createWriteStream(filename, { autoClose: true });

                return new Promise((resolve, reject) => {
                    response.data.pipe(writer);

                    writer.on('finish', async () => {
                        await sendCaptionImageQuoted({
                            client: client,
                            param: message,
                            answer: `Cá está sua: "${Input}"`,
                            path_image: "./functions/_commands/_gpt.jpeg",
                        });

                        await sendReaction({
                            client: client,
                            param: message,
                            answer: Config.parameters.commands[0].execution[0].onsucess
                        })

                        Spam(remoteJid)

                        unlink(filename, () => {
                            resolve();
                        });

                        return 'Success.'
                    });

                    writer.on('error', async (error) => {
                        await sendMessageQuoted({
                            client: client,
                            param: message,
                            answer: 'Deu para baixar a foto não.'
                        })
                        await sendReaction({
                            client: client,
                            param: message,
                            answer: Config.parameters.commands[0].execution[0].onsucess
                        })

                        Spam(remoteJid)
                    
                        unlink(filename, () => {
                            reject(error);
                        });

                        return 'Error.'
                    });
                });
            }
        } catch { }
    } else {
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
}
