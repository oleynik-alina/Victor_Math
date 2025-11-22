import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User as UserIcon, Loader2 } from 'lucide-react';
import { Message, Sender, UploadedImage } from '../types';
import { analyzeMathProblem } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface MathChatProps {
  taskImage: UploadedImage | null;
  workImage: UploadedImage | null;
}

const MathChat: React.FC<MathChatProps> = ({ taskImage, workImage }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Привет! Загрузи фото условий задач и фото решения Вити, и я подскажу, как решить 3-ю задачу его методом.',
      sender: Sender.Bot,
      timestamp: Date.now(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (!taskImage || !workImage) {
      const errorMsg: Message = {
        id: Date.now().toString(),
        text: 'Пожалуйста, сначала загрузите оба изображения (условия и решение).',
        sender: Sender.Bot,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      return;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: Sender.User,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const historyText = messages.map(m => `${m.sender}: ${m.text}`);
      const responseText = await analyzeMathProblem(
        taskImage.file,
        workImage.file,
        input,
        historyText
      );

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: Sender.Bot,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Что-то пошло не так. Попробуйте еще раз.',
        sender: Sender.Bot,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 flex items-center gap-3">
        <div className="bg-indigo-500 p-2 rounded-full">
          <Bot size={24} className="text-white" />
        </div>
        <div>
          <h2 className="font-bold text-lg">AI Репетитор</h2>
          <p className="text-xs text-slate-400">Помощник по математике (Gemini 3.0)</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${
              msg.sender === Sender.User ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[90%] lg:max-w-[85%] p-4 rounded-2xl shadow-sm relative ${
                msg.sender === Sender.User
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
              }`}
            >
              <div className={`text-sm leading-relaxed ${msg.sender === Sender.Bot ? 'prose prose-slate prose-sm max-w-none' : ''}`}>
                {msg.sender === Sender.Bot ? (
                   <ReactMarkdown 
                      remarkPlugins={[remarkMath]} 
                      rehypePlugins={[rehypeKatex]}
                      components={{
                        // Customize specific elements if needed
                        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />
                      }}
                   >
                    {msg.text}
                   </ReactMarkdown>
                ) : (
                  <span className="whitespace-pre-wrap">{msg.text}</span>
                )}
              </div>
              <div
                className={`text-[10px] mt-2 text-right ${
                  msg.sender === Sender.User ? 'text-indigo-200' : 'text-slate-400'
                }`}
              >
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start w-full animate-pulse">
            <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-slate-200 flex items-center gap-2">
              <Loader2 className="animate-spin text-indigo-500" size={16} />
              <span className="text-xs text-slate-500">Анализирую решение Вити...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              !taskImage || !workImage
                ? 'Сначала загрузите изображения...'
                : 'Например: Дай подсказку к 3 задаче...'
            }
            disabled={!taskImage || !workImage || isLoading}
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MathChat;