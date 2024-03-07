import { chatbotPrompt } from "@/app/helpers/constants/chatbot-prompt";
import {
  ChatGPTMessage,
  OpenAIStream,
  OpenAIStreamPayload,
} from "@/lib/open-ai-stream";
import { MessageArraySchema } from "@/lib/validators/message";

export async function POST(req: Request) {
  const { messages } = await req.json();
  console.log(messages);
  const parsemess = MessageArraySchema.parse(messages);
  const outboundmsg: ChatGPTMessage[] = parsemess.map((message) => ({
    role: message.isUserMessage ? "user" : "system",
    content: message.text,
  }));
  outboundmsg.unshift({ content: chatbotPrompt, role: "system" });
  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: outboundmsg,
    temperature: 0.4,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 2,
    max_tokens: 150,
    stream: true,
    n: 1,
  };
  const stream = await OpenAIStream(payload);
  return new Response(stream);
}
