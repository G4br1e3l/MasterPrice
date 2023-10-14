import {
  Spam,
  path,
  spawn,
  downloadContentFromMessage,
  sendReaction,
  sendMessageQuoted,
  writeFile,
  Config,
  unlinkSync,
  sendSticker,
  readFileSync
} from '../../exports.js'


const getRandom = (v) => {
return `${Math.floor(Math.random() * 10000)}${v}`;
};

export const CreateSticker = async ({ Cliente, ClienteJid, ClienteTopo, image, video, Qimage, Qvideo }) => {

let isImage = image?.mimetype? image : Qimage?.mimetype? Qimage : false
let isVideo = video?.seconds < 10? video : Qvideo?.seconds < 10? Qvideo : false;

if (!isImage && !isVideo) return await sendMessageQuoted({ Cliente: Cliente, ClienteJid: ClienteJid, ClienteTopo: ClienteTopo, ClienteResposta: "Imagem ou Video (até 10 segundos) invalido." });

const INimage = getRandom(".webp");
const OUTimage = getRandom(".webp");

var buffer = Buffer.from([]);
for await (const chunk of await downloadContentFromMessage(isImage || isVideo, isImage? 'image' : 'video')) {
  buffer = Buffer.concat([buffer, chunk]);
}

writeFile(INimage, buffer, function (err) {

  if (err) {
    return 'Erro.';
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
    await sendSticker({ Cliente: Cliente, ClienteJid: ClienteJid, ClienteTopo: ClienteTopo, CaminhoFigurinha: readFileSync(OUTimage) });
    unlinkSync(INimage);
    unlinkSync(OUTimage);
  });

  ffmpeg.on("error", async (err) => {
    await sendMessageQuoted({ Cliente: Cliente, ClienteJid: ClienteJid, ClienteTopo: ClienteTopo, ClienteResposta: "Erro." });
    unlinkSync(INimage);
    unlinkSync(OUTimage);
  });

  return
});
};