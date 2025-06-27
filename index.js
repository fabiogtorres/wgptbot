import { create } from 'venom-bot';
import 'dotenv/config';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

create().then((client) => start(client));

function start(client) {
  client.onMessage(async (message) => {
    if (message.isGroupMsg && message.body.toLowerCase().startsWith('gpt')) {
      const prompt = message.body.slice(3).trim();
      try {
        const chat = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
        });
        const reply = chat.choices[0].message.content;
        client.sendText(message.from, reply);
      } catch (error) {
        console.error('Erro com a API:', error.message);
        client.sendText(message.from, 'Erro ao consultar o ChatGPT.');
      }
    }
  });
}
