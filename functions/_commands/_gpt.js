//import :p
import {
  readFileSync,
  createWriteStream,
  unlink,
  createReadStream
} from "fs";
import ax from "axios";
const { get } = ax;
import { Configuration, OpenAIApi } from "openai";
import { Spam } from "../_functions/_functionsMessage.js";
import {
  sendReaction,
  sendMessageQuoted,
  sendCaptionImageQuoted
} from "../_functions/_sendMessage.js";
import { downloadContentFromMessage } from "@adiwajshing/baileys";
import { path } from "@ffmpeg-installer/ffmpeg";
import { spawn } from "child_process";

const getRandom = (v) => {
	return `${Math.floor(Math.random() * 10000)}${v}`
}

const config = new Configuration({
  organization: "org-VKh6dAMHl83oAzaDrjctqTwU",
  apiKey: "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"
});

const openai = new OpenAIApi(config);

const response = async (x) =>
  await openai.createChatCompletion({
    model: "gpt-4",
    messages: [{ role: "user", content: x }],
    max_tokens: 8000,
    temperature: 0,
  });

const resp = async (x) =>
  await openai.createTranscription(createReadStream(x), "whisper-1");

const response1 = async (x) =>
  await openai.createImage({
    prompt: x,
    n: 1,
    size: "1024x1024"
  });

export const GPT = async ({ client, message, _args, remoteJid, typed }) => {
  let Input = typed.parameters.details[1].sender.messageText.slice(5);

  if (typed.boolean.message[0].isQuotedMessage) {
    Input = typed.parameters.details[0]?.messageQuotedText || "";
    const quotedMessage =
      typed.parameters.details[0].messageContextinfo?.quotedMessage;
    if (quotedMessage?.imageMessage?.caption !== undefined) {
      Input += ` ${quotedMessage.imageMessage.caption}`;
    }
    if (quotedMessage?.videoMessage?.caption !== undefined) {
      Input += ` ${quotedMessage.videoMessage.caption}`;
    }
    Input += ". ";
    Input += typed.parameters.details[0].text || "";
  }

  var Config = JSON.parse(readFileSync("./root/configurations.json", "utf8"));

  if (!Input) {
    await sendMessageQuoted({
      client: client,
      param: message,
      answer:
        "Tente inserindo alguma pergunta... com (!GPT (pergunta?)) ou marcando a mensagem ou ambas juntas :)"
    })
      .then(async () => {
        await sendReaction({
          client: client,
          param: message,
          answer: Config.parameters.commands[0].execution[0].onerror
        });
      })
      .then(() => Spam(remoteJid));

    return "Error.";
  }

  switch (_args[1]) {
    case "foto":
      try {
        const resposta = await response1(Input);
        const image = getRandom(".jpeg");
        await downloadImage(resposta.data.data[0].url, image);

        async function downloadImage(url, filename) {
          const response = await get(url, { responseType: "stream" });
          const writer = createWriteStream(filename, { autoClose: true });

          return new Promise((resolve, reject) => {
            response.data.pipe(writer);

            writer.on("finish", async () => {
              await sendCaptionImageQuoted({
                client: client,
                param: message,
                answer: '',
                path_image: image
              });

              await sendReaction({
                client: client,
                param: message,
                answer: Config.parameters.commands[0].execution[0].onsucess
              });

              Spam(remoteJid);

              unlink(filename, () => {
                resolve();
              });

              return "Success.";
            });

            writer.on("error", async (error) => {
              await sendMessageQuoted({
                client: client,
                param: message,
                answer: "Deu para baixar a foto não."
              });
              await sendReaction({
                client: client,
                param: message,
                answer: Config.parameters.commands[0].execution[0].onsucess
              });

              Spam(remoteJid);

              unlink(filename, () => {
                reject(error);
              });

              return "Error.";
            });
          });
        }
      } catch {}
      break;
    case "audio":
      if (
        typed.boolean?.message[0]?.isQuotedMessage &&
        !!typed.parameters?.details[0]?.messageQuoted?.quotedMessage
          ?.audioMessage
      ) {
        (async function createAudio() {
          const buffer = await downloadContentFromMessage(
            typed.parameters.details[0].messageQuoted.quotedMessage
              .audioMessage,
            "audio"
          );
          const INaudio = getRandom(".mp3");
          const OUTaudio = getRandom(".wav");
          const writer = createWriteStream(INaudio, {
            autoClose: true
          });

          return new Promise((resolve) => {
            buffer.pipe(writer);

            writer.on("finish", async () => {

              const args = [
                "-i",
                INaudio,
                "-acodec",
                "pcm_s16le",
                "-ac",
                "1",
                "-ar",
                "16000",
                OUTaudio
              ];

              const ffmpeg = spawn(path, args);

              ffmpeg.on("exit", async () => {
                const transcript = await resp(OUTaudio);

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

                unlink(INaudio, () => {
                  unlink(OUTaudio, () => {
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

                unlink(INaudio, () => {
                  unlink(OUTaudio, () => {
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

              unlink(INaudio, () => {
                unlink(OUTaudio, () => {
                  resolve();
                });
              });

              return "Error.";
            });
          });
        })();
      }
      break;
    default:
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
};
