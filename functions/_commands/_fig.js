import { spawn } from "child_process";
import { path } from "@ffmpeg-installer/ffmpeg";
import { writeFile, readFileSync, unlinkSync } from "fs";

import pkg from "@adiwajshing/baileys";
const { downloadContentFromMessage } = pkg;

import { Spam } from "../_functions/_functionsMessage.js";
import { sendReaction, sendMessageQuoted } from "../_functions/_sendMessage.js";

const getRandom = (v) => {
  return `${Math.floor(Math.random() * 10000)}${v}`;
};

export const CreateSticker = async ({
  message: typed,
  Jid: remoteJid,
    cc: client
}) => {

    var Config = JSON.parse(readFileSync("./root/configurations.json", "utf8"));

  const {
    details: [
      {
        messageContent: { imageMessage: image, videoMessage: video },
        messageQuoted = {}
      } = {}
    ] = []
  } = typed || {};

  const { quotedMessage: { imageMessage: Qimage, videoMessage: Qvideo } = {} } =
    messageQuoted || {};

    let isImage = image || Qimage;
    let isVideo = video?.seconds < 10 || Qvideo?.seconds < 10;

  if (!isImage && !isVideo)
    return await sendMessageQuoted({
      client: client,
      param: typed,
      answer:
        "Imagem ou Video (até 10 segundos) invalido."
    });

  const INimage = getRandom(".webp");
  const OUTimage = getRandom(".webp");

  var buffer = Buffer.from([]);
  for await (const chunk of await downloadContentFromMessage(
    !!isImage ? image || Qimage : video || Qvideo,
    !!isImage ? 'image' : 'video'
  )) {
    buffer = Buffer.concat([buffer, chunk]);
  }

  writeFile(INimage, buffer, function (err) {
    if (err) {
      console.log(err);
      return;
    }

    const args = [
      "-i",
      INimage,
      "-vcodec",
      "libwebp",
      "-filter:v",
      "fps=fps=15",
      "-lossless",
      "1",
      "-loop",
      "0",
      "-preset",
      "default",
      "-an",
      "-vsync",
      "0",
      "-s",
      !!isImage ? "800:800" : "200:200",
      OUTimage
    ];

    const ffmpeg = spawn(path, args);

    ffmpeg.on("exit", async () => {
        await client.sendMessage(
          remoteJid,
          {
            sticker: readFileSync(OUTimage),
          },
          {
            quoted: typed.details[0].messageAll
          },
        );
        await sendReaction({
          client: client,
          param: typed,
          answer: Config.parameters.commands[0].execution[0].onsucess
        }).then(() => Spam(remoteJid));
      
      unlinkSync(INimage);
      unlinkSync(OUTimage);
    });

      ffmpeg.on("error", async (err) => {
        await sendMessageQuoted({
          client: client,
          param: typed,
          answer: "Erro ao converter."
        });
      await sendReaction({
        client: client,
        param: typed,
        answer: Config.parameters.commands[0].execution[0].onerror
      }).then(() => Spam(remoteJid));
      unlinkSync(INimage);
      unlinkSync(OUTimage);
    });
      return
  });
};
