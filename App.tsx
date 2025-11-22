import React, { useState } from 'react';
import MathChat from './components/MathChat';
import UploadSection from './components/UploadSection';
import { UploadedImage } from './types';
import { Calculator, Sigma } from 'lucide-react';

const App: React.FC = () => {
  const [taskImage, setTaskImage] = useState<UploadedImage | null>(null);
  const [workImage, setWorkImage] = useState<UploadedImage | null>(null);

  const handleTaskUpload = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setTaskImage({
      id: 'task',
      file,
      previewUrl,
      label: 'Условия задач'
    });
  };

  const handleWorkUpload = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setWorkImage({
      id: 'work',
      file,
      previewUrl,
      label: 'Решение ученика'
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <header className="mb-8 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-3 rounded-xl shadow-lg shadow-indigo-200">
                <Sigma size={32} strokeWidth={2.5} />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Помощник по математике</h1>
                <p className="text-slate-500 text-sm mt-0.5">Анализ решений и умные подсказки для Вити</p>
            </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)] min-h-[600px]">
        
        {/* Left Sidebar: Context & Uploads */}
        <div className="lg:col-span-4 flex flex-col gap-6 h-full">
          <div className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-lg border border-slate-200 flex-1 overflow-y-auto">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <Calculator size={20} className="text-indigo-500"/>
                    Контекст задачи
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Загрузите фото с условиями задач и фото с черновиком. 
                  ИИ проанализирует метод решения и даст подсказку в том же стиле.
                </p>
            </div>

            <div className="space-y-6">
                <UploadSection 
                    label="1. Фото условий задач"
                    image={taskImage}
                    onUpload={handleTaskUpload}
                    onRemove={() => setTaskImage(null)}
                />
                
                <div className="flex items-center gap-4 my-2">
                    <div className="h-px bg-slate-200 flex-1"></div>
                    <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">+</span>
                    <div className="h-px bg-slate-200 flex-1"></div>
                </div>

                <UploadSection 
                    label="2. Фото решения (черновик)"
                    image={workImage}
                    onUpload={handleWorkUpload}
                    onRemove={() => setWorkImage(null)}
                />
            </div>

            {taskImage && workImage && (
                 <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-xl">
                    <p className="text-green-700 text-xs font-medium text-center">
                        ✨ Все готово! Спросите подсказку в чате.
                    </p>
                 </div>
            )}
          </div>
          
          {/* Hand-written note decoration */}
          <div className="hidden lg:block bg-yellow-50 p-4 rounded-xl border border-yellow-100 shadow-sm rotate-1">
             <p className="font-handwriting text-xl text-slate-600 leading-6">
               "Главное — найти правильную оценку знаменателя..."
             </p>
             <p className="text-right text-xs text-slate-400 mt-2 font-sans">- Витя</p>
          </div>
        </div>

        {/* Right Main Area: Chat */}
        <div className="lg:col-span-8 h-full">
          <MathChat taskImage={taskImage} workImage={workImage} />
        </div>
      </main>
    </div>
  );
};

export default App;