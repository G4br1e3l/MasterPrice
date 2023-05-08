//import :p
import { readFileSync, createWriteStream, unlink, writeFile, createReadStream } from "fs";

import ax from 'axios';
const { get, post } = ax

import { Configuration, OpenAIApi } from "openai"

import { Spam } from '../_functions/_functionsMessage.js'
import {
  sendReaction,
  sendMessageQuoted,
  sendCaptionImageQuoted,
} from "../_functions/_sendMessage.js";
import { downloadContentFromMessage } from "@adiwajshing/baileys";

import { path } from '@ffmpeg-installer/ffmpeg';
import { spawn } from 'child_process';

const config = new Configuration({
    organization: "org-VKh6dAMHl83oAzaDrjctqTwU",
    apiKey: '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',
})

const openai = new OpenAIApi(config)

const response = async (x) => await openai.createChatCompletion({
    model: "gpt-3.5-turbo-0301",
    messages: [{ role: "user", content: x }],
    max_tokens: 1000,
    temperature: 0,
})
////////////////////////////////////

const resp = async (x) => await openai.createTranscription(
  createReadStream(x),
  "whisper-1"
);

/////////////////////////////////

const response1 = async (x) =>
  await openai.createImage({
    prompt: x,
    n: 1,
    size: "1024x1024"
});

//////////////////////////////
export const GPT = async ({ client, message, _args, remoteJid, typed }) => {

    let Input = typed.parameters.details[1].sender.messageText.slice(5)

    if (typed.boolean.message[0].isQuotedMessage) {
        Input = typed.parameters.details[0]?.messageQuotedText || ""; // If message is a quoted message, set Input to the quoted text. If it's undefined, use an empty string instead.
        const quotedMessage = typed.parameters.details[0].messageContextinfo?.quotedMessage;
        if (quotedMessage?.imageMessage?.caption !== undefined) {
            Input += ` ${quotedMessage.imageMessage.caption}`;
        }
        if (quotedMessage?.videoMessage?.caption !== undefined) {
            Input += ` ${quotedMessage.videoMessage.caption}`;
        }
            Input += ". "; // Add a period and space after the captions (if any)
            Input += typed.parameters.details[0].text || ""; // Finally, add the original Input (which may or may not have been modified) to the end of the string. If it's undefined, use an empty string instead.
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
            
            const resposta = await response1(Input)

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
    } else if (
      _args[1] === "audio" &&
      typed.boolean?.message[0]?.isQuotedMessage &&
      !!typed.parameters?.details[0]?.messageQuoted?.quotedMessage?.audioMessage
    ) {
      (async function createAudio() {
        const buffer = await downloadContentFromMessage(
          typed.parameters.details[0].messageQuoted.quotedMessage.audioMessage,
          "audio"
        );

        const writer = createWriteStream("./functions/_commands/gpt.mp3", {
          autoClose: true
        });

        return new Promise((resolve) => {
          buffer.pipe(writer);

          writer.on("finish", async () => {
            const ffmpegPath = path;
            const inputFile = "./functions/_commands/gpt.mp3";
            const outputFile = "./functions/_commands/gpt.wav";

            const args = [
              "-i",
              inputFile,
              "-acodec",
              "pcm_s16le",
              "-ac",
              "1",
              "-ar",
              "16000",
              outputFile
            ];

            const ffmpeg = spawn(ffmpegPath, args);

            ffmpeg.on("exit", async () => {
              const transcript = await resp("./functions/_commands/gpt.wav");

              await sendMessageQuoted({
                client: client,
                param: message,
                answer: transcript.data.text
              });
              await sendReaction({
                client: client,
                param: message,
                answer: Config.parameters.commands[0].execution[0].onsucess
              });

              unlink("./functions/_commands/gpt.mp3", () => {
                unlink("./functions/_commands/gpt.wav", () => {
                  resolve();
                });
              });

              Spam(remoteJid);

              return "Success.";
            });

            ffmpeg.on("error", async () => {
              await sendMessageQuoted({
                client: client,
                param: message,
                answer: "Vish... Deu ruim a tradução meu bom"
              });
              await sendReaction({
                client: client,
                param: message,
                answer: Config.parameters.commands[0].execution[0].onsucess
              });

              unlink("./functions/_commands/gpt.mp3", () => {
                unlink("./functions/_commands/gpt.wav", () => {
                  resolve();
                });
              });

              Spam(remoteJid);

              return "Error.";
            });
          });

          writer.on("error", async () => {
            await sendMessageQuoted({
              client: client,
              param: message,
              answer: "Deu para traduzir o audio não."
            });
            await sendReaction({
              client: client,
              param: message,
              answer: Config.parameters.commands[0].execution[0].onsucess
            });

            Spam(remoteJid);

            unlink("./functions/_commands/gpt.mp3", () => {
              unlink("./functions/_commands/gpt.wav", () => {
                resolve();
              });
            });

            return "Error.";
          });
        });
      })();
    } else {
      try {
        const resposta = await response(Input);

        await sendMessageQuoted({
          client: client,
          param: message,
          answer: resposta.data.choices[0].message.content.trim()
        });
        await sendReaction({
          client: client,
          param: message,
          answer: Config.parameters.commands[0].execution[0].onsucess
        });
        Spam(remoteJid);

        return "Success.";
      } catch (erro) {
        switch (erro?.response?.status) {
          case 429:
            await sendMessageQuoted({
              client: client,
              param: message,
              answer:
                "Ooops! Muitas solicitações de resposta, aguarde um momento e tente novamente mais tarde."
            });
            await sendReaction({
              client: client,
              param: message,
              answer: Config.parameters.commands[0].execution[0].onsucess
            });

            Spam(remoteJid);
            return "Error.";

          default:
            await sendMessageQuoted({
              client: client,
              param: message,
              answer:
                "Por um código de erro desconhecido, a API parou de funcionar."
            });
            await sendReaction({
              client: client,
              param: message,
              answer: Config.parameters.commands[0].execution[0].onsucess
            });

            Spam(remoteJid);
            return "Error.";
        }
      }
    }
}
