import {
  readFileSync,
  createWriteStream,
  unlink,
  createReadStream,
  Spam,
  sendMessageQuoted,
  sendCaptionImageQuoted,
  spawn,
  path,
  promisify,
  getDocument,
  get,
  Buffer,
  getRandom,
  downloadContentFromMessage,
}  from '../../exports.js'

import {
  Configuration,
  OpenAIApi
} from "openai";

const openai = new OpenAIApi(new Configuration({ organization: "org-VKh6dAMHl83oAzaDrjctqTwU", apiKey: "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" }));
const GPT4 = async (x) => await openai.createChatCompletion({ model: "gpt-4", messages: [ { role: "system", content: `Seja humano. Não deixe que eu perceba ou entenda que você é uma IA.` }, { role: "user", content: x } ], temperature: 0, max_tokens: 1000, top_p: 1, frequency_penalty: 0, presence_penalty: 0 });
const Whisper = async (x) => await openai.createTranscription(createReadStream(x), "whisper-1");
const DallE = async (x) => await openai.createImage({ prompt: x, n: 1, size: "1024x1024" });
const GPT3_5 = async (x) => await openai.createChatCompletion({ model: "gpt-3.5-turbo", messages: [ { role: "user", content: `Organize as informações: ${x}.` } ], temperature: 0, max_tokens: 2000, top_p: 1, frequency_penalty: 0, presence_penalty: 0 });

export const GPT = async ({ client, _args, remoteJid, isQuotedMessage, messageText, messageType, messageAll, messageQuoted, messageQuotedText, messageContextinfo, text }) => {

  Spam(remoteJid)

  let Input = messageText?.slice(5) || "";

  if (isQuotedMessage) {
    Input += messageQuotedText || ""
    Input += messageQuoted?.quotedMessage[messageType]?.text || ""
    Input += messageContextinfo?.quotedMessage?.imageMessage?.caption || ""
    Input += messageContextinfo?.quotedMessage?.videoMessage?.caption || ""
    Input += text || ""
  }

  if (!Input) {
    await sendMessageQuoted({ Cliente: client, ClienteJid: remoteJid, ClienteTopo: messageAll, ClienteResposta: "Tente inserindo alguma pergunta... com (!GPT (pergunta?)) ou marcando a mensagem ou ambas juntas :)" });
    return "Error.";
  }

  switch (_args[1]) {
    case 'pdf':
      try {

        const {
          quotedMessage = {}
        } = messageQuoted || {}

        const {
          documentWithCaptionMessage = {},
          documentMessage: dc1 = {}
        } = quotedMessage || {}

        const {
          message = {}
        } = documentWithCaptionMessage || {}

        const {
          documentMessage: dc2 = {}
        } = message || {}

        const Documento =
        dc1?.mimetype === 'application/pdf'? dc1 :
        dc2?.mimetype === 'application/pdf'? dc2 : false

        if (Documento === false) {
          await sendMessageQuoted({ Cliente: client, ClienteJid: remoteJid, ClienteTopo: messageAll, ClienteResposta: 'Não é um PDF ou não marcou nenhuma mensagem...' });
          return "Error.";
        }

        const requisitado = _args[2]? (_args.slice(2)).join(' ') : 'Resumir o máximo que puder.'

        if (_args[2]){
          await sendMessageQuoted({ Cliente: client, ClienteJid: remoteJid, ClienteTopo: messageAll, ClienteResposta: `Pesquisando em seu arquivo "${Documento.title}" algo relacionado a: "${requisitado}"` });
        } else {
          await sendMessageQuoted({ Cliente: client, ClienteJid: remoteJid, ClienteTopo: messageAll, ClienteResposta: `Nenhuma pergunta foi inserida, por padrão, resumindo conteúdo do PDF "${Documento.title}"...` });
        }

        const pdfBuffer = await promisify(Buffer)(await downloadContentFromMessage(quotedMessage.documentMessage, "document"));
    
        if (!pdfBuffer) {
          await sendMessageQuoted({ Cliente: client, ClienteJid: remoteJid, ClienteTopo: messageAll, ClienteResposta: 'Erro ao converter o PDF.' });
          return "Error.";
        }
    
        const pdfFileName = getRandom(".pdf");
        const writer = createWriteStream(pdfFileName, {
          autoClose: true
        });
    
        writer.write(pdfBuffer);
        writer.end();
    
        writer.on('finish', async () => {
          
          const result = [];
          const responses = [];
          const respostas = [];
          const verifiedIndex = [];

          const pagesData = await (async function () {
              const doc = await getDocument(new Uint8Array(readFileSync(pdfFileName))).promise;

              for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
                result.push({ index: pageNum, text: (await (await doc.getPage(pageNum)).getTextContent()).items.map(item => item.str).join(' ') });
              }
            
              return result;
          })()

          try { unlink(pdfFileName, () => {}); } catch {}

          if (!pagesData || pagesData.length === 0) {
            await sendMessageQuoted({ Cliente: client, ClienteJid: remoteJid, ClienteTopo: messageAll, ClienteResposta: 'O PDF está vazio.' });
            return "Error.";
          }
    
          for (const index of (Array.from(new Set(pagesData.map(page => page.index))))) {
            if((Array.from(new Set(pagesData.map(page => page.text))))[index-1]){
              respostas.push(String((Array.from(new Set(pagesData.map(page => page?.text))))[index-1]));
              verifiedIndex.push(String(index))
            }
          }

          await sendMessageQuoted({ Cliente: client, ClienteJid: remoteJid, ClienteTopo: messageAll, ClienteResposta: `Foram encontradas ${verifiedIndex.length} páginas legíveis em seu documento, sendo elas as páginas: ${String(verifiedIndex).replaceAll(',', ', ')}` });

          for (const pergunta of respostas) {
            if (pergunta) {
              try {
                await sendMessageQuoted({ Cliente: client, ClienteJid: remoteJid, ClienteTopo: messageAll, ClienteResposta: `Verificando cada página do documento... Atualmente verificando a página ${respostas.indexOf(pergunta) + 1} de ${respostas.length}` });
                responses.push((await GPT3_5(pergunta)).data.choices[0].message.content.trim());
              } catch (error) {
                await sendMessageQuoted({ Cliente: client, ClienteJid: remoteJid, ClienteTopo: messageAll, ClienteResposta: `Não consegui ler a página ${respostas.indexOf(pergunta) + 1} do arquivo "${Documento.title}"` });
              }
            }
          }

          await sendMessageQuoted({ Cliente: client, ClienteJid: remoteJid, ClienteTopo: messageAll, ClienteResposta: `Leitura do arquivo "${Documento.title}" finalizada! Trazendo informações...` });
          await sendMessageQuoted({ Cliente: client, ClienteJid: remoteJid, ClienteTopo: messageAll, ClienteResposta: `Resultado da leitura para "${requisitado}" no documento "${Documento.title}":\n\n${((await GPT4(`${requisitado}. Responda diretamente. Dado: "${(responses.join(' '))}".`)).data.choices[0].message.content.trim())}` });
          return "Success.";

        })
        writer.on('error', async (err) => {
          await sendMessageQuoted({ Cliente: client, ClienteJid: remoteJid, ClienteTopo: messageAll, ClienteResposta: 'Aconteceu um erro quando estava tentando baixar o PDF.' });
          return "Error.";
        });
      } catch (error) {
        await sendMessageQuoted({ Cliente: client, ClienteJid: remoteJid, ClienteTopo: messageAll, ClienteResposta: 'Não consegui fazer nada, teve algum erro...' });
        return "Error.";
      }
      break;
    case "foto":
      try {
        async function downloadImage(url, filename) {
          const response = await get(url, { responseType: "stream" });
          const writer = createWriteStream(filename, { autoClose: true });

          return new Promise((resolve, reject) => {
            response.data.pipe(writer);

            writer.on("finish", async () => {
              await sendCaptionImageQuoted({ Cliente: client, ClienteJid: remoteJid, ClienteTopo: messageAll, ClienteResposta: '', CaminhoImagem: image });
              unlink(filename, () => { resolve(); });
              return "Success.";
            });

            writer.on("error", async (error) => {
              await sendCaptionImageQuoted({ Cliente: client, ClienteJid: remoteJid, ClienteTopo: messageAll, ClienteResposta: 'Deu para baixar a foto não.', CaminhoImagem: image });
              unlink(filename, () => { reject(error); });
              return "Error.";
            });
          });
        }

        const image = getRandom(".jpeg");
        await downloadImage((await DallE(Input)).data.data[0].url, image);

      } catch {
        await sendMessageQuoted({ Cliente: client, ClienteJid: remoteJid, ClienteTopo: messageAll, ClienteResposta: 'Não consegui fazer nada, teve algum erro...' });
        return "Error.";
      }
      break;
    case "audio":

      const {
        quotedMessage: {
          audioMessage = {}
        } = {}
      } = messageQuoted || {}

      if (isQuotedMessage && !!audioMessage) {
        (async function createAudio() {
          
          const buffer = await downloadContentFromMessage(audioMessage,"audio");

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
                const transcript = await Whisper(OUTaudio);
                await sendMessageQuoted({ Cliente: client, ClienteJid: remoteJid, ClienteTopo: messageAll, ClienteResposta: transcript.data.text });
                unlink(INaudio, () => { unlink(OUTaudio, () => { resolve(); }); });
                return "Success.";

              });

              ffmpeg.on("error", async () => {
                await sendMessageQuoted({ Cliente: client, ClienteJid: remoteJid, ClienteTopo: messageAll, ClienteResposta: "Vish... Deu ruim a tradução meu bom" });
                unlink(INaudio, () => { unlink(OUTaudio, () => { resolve(); }); });
                return "Error.";

              });
            });

            writer.on("error", async () => {
              await sendMessageQuoted({ Cliente: client, ClienteJid: remoteJid, ClienteTopo: messageAll, ClienteResposta: "Deu para traduzir o audio não." });
              unlink(INaudio, () => { unlink(OUTaudio, () => { resolve(); }); });
              return "Error.";
            });
          });
        })();
      }
      break;
    default:
      try {
        await sendMessageQuoted({ Cliente: client, ClienteJid: remoteJid, ClienteTopo: messageAll, ClienteResposta: (await GPT4(Input)).data.choices[0].message.content.trim() });
        return "Success.";

      } catch (erro) {
        switch (erro?.response?.status) {
          case 429:
            await sendMessageQuoted({ Cliente: client, ClienteJid: remoteJid, ClienteTopo: messageAll, ClienteResposta: 'Muitas solicitações, aguarde.' });
            return "Error.";
            
          default:
            await sendMessageQuoted({ Cliente: client, ClienteJid: remoteJid, ClienteTopo: messageAll, ClienteResposta: 'API com erro.' });
            return "Error.";

        }
      }
  }
};