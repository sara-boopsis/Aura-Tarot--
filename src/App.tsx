/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, RefreshCw, Moon, Sun, Compass, Heart, Briefcase, HelpCircle, ChevronRight, Loader2, MessageSquare, Send, Languages } from 'lucide-react';
import { MAJOR_ARCANA, TarotCard, shuffleDeck } from './constants';
import { getInitialReveal, getFinalReading, InitialReveal, ReadingResult } from './services/geminiService';

type AppState = 'welcome' | 'struggle' | 'mode' | 'drawing' | 'initial_reveal' | 'elaboration' | 'final_reading';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'zh-CN', name: '简体中文' },
  { code: 'zh-TW', name: '繁體中文' },
  { code: 'ja', name: '日本語' }
];

const UI_TEXT: Record<string, any> = {
  en: {
    welcome: "Seek the wisdom hidden within.",
    subtitle: "Aura Tarot combines ancient archetypes with modern intelligence to illuminate your path.",
    begin: "Begin Your Journey",
    clarity: "What area of your life needs clarity?",
    depth: "How deep shall we look?",
    choose: "Choose your cards.",
    trust: "Trust your intuition. Select {count} cards from the deck.",
    drawn: "Your Spread ({current} / {total})",
    revealing: "Consulting the spirits...",
    spoken: "The Cards have Spoken.",
    resonate: "Does this resonate with you?",
    share: "To provide a deeper, more accurate reading, please share what is currently weighing on your heart.",
    shareBtn: "Share My Story",
    tellMore: "Tell me more...",
    struggles: "What specific struggles are you facing? How do you feel about the cards we just revealed?",
    placeholder: "I feel like the High Priestess really speaks to my current confusion about...",
    path: "Your Personal Path",
    advice: "The Oracle's Advice",
    steps: "Concrete Steps",
    reset: "Seek a new path",
    categories: {
      Love: "Love & Relationships",
      Career: "Career & Purpose",
      Growth: "Personal Growth",
      General: "General Guidance"
    }
  },
  'zh-CN': {
    welcome: "探索内在的智慧。",
    subtitle: "灵气塔罗结合古老原型与现代智能，照亮您的前行之路。",
    begin: "开启旅程",
    clarity: "您生活的哪个领域需要指引？",
    depth: "我们需要探索多深？",
    choose: "选择您的卡牌。",
    trust: "相信您的直觉。从牌组中选择 {count} 张牌。",
    drawn: "您的牌阵 ({current} / {total})",
    revealing: "正在咨询神灵...",
    spoken: "卡牌已开启。",
    resonate: "这是否引起了您的共鸣？",
    share: "为了提供更深入、更准确的解读，请分享您目前心中的负担。",
    shareBtn: "分享我的故事",
    tellMore: "告诉我更多...",
    struggles: "您面临的具体困扰是什么？您对刚才揭示的卡牌有什么感觉？",
    placeholder: "我觉得女祭司牌确实说中了我目前关于...的困惑",
    path: "您的专属路径",
    advice: "神谕的建议",
    steps: "具体步骤",
    reset: "寻求新路径",
    categories: {
      Love: "爱情与关系",
      Career: "事业与目标",
      Growth: "个人成长",
      General: "通用指引"
    }
  },
  'zh-TW': {
    welcome: "探索內在的智慧。",
    subtitle: "靈氣塔羅結合古老原型與現代智能，照亮您的前行之路。",
    begin: "開啟旅程",
    clarity: "您生活的哪個領域需要指引？",
    depth: "我們需要探索多深？",
    choose: "選擇您的卡牌。",
    trust: "相信您的直覺。從牌組中選擇 {count} 張牌。",
    drawn: "您的牌陣 ({current} / {total})",
    revealing: "正在諮詢神靈...",
    spoken: "卡牌已開啟。",
    resonate: "這是否引起了您的共鳴？",
    share: "為了提供更深入、更準確的解讀，請分享您目前心中的負擔。",
    shareBtn: "分享我的故事",
    tellMore: "告訴我更多...",
    struggles: "您面臨的具体困擾是什麼？您對剛才揭示的卡牌有什麼感覺？",
    placeholder: "我覺得女祭司牌確實說中了我目前關於...的困惑",
    path: "您的專屬路徑",
    advice: "神諭的建議",
    steps: "具體步驟",
    reset: "尋求新路徑",
    categories: {
      Love: "愛情與關係",
      Career: "事業與目標",
      Growth: "個人成長",
      General: "通用指引"
    }
  },
  ja: {
    welcome: "内に秘められた知恵を求めて。",
    subtitle: "オーラタロットは、古代の原型と現代の知性を組み合わせ、あなたの道を照らします。",
    begin: "旅を始める",
    clarity: "人生のどの領域に明快さが必要ですか？",
    depth: "どれほど深く探求しましょうか？",
    choose: "カードを選んでください。",
    trust: "直感を信じて。デッキから {count} 枚のカードを選んでください。",
    drawn: "あなたのスプレッド ({current} / {total})",
    revealing: "精霊に相談中...",
    spoken: "カードが語りかけました。",
    resonate: "これは心に響きますか？",
    share: "より深く正確なリーディングを提供するために、今あなたの心にある重荷を共有してください。",
    shareBtn: "物語を共有する",
    tellMore: "もっと詳しく...",
    struggles: "具体的にどのような悩みに直面していますか？先ほど現れたカードについてどう感じますか？",
    placeholder: "女教皇のカードが、私の現在の...に関する混乱を言い当てているように感じます。",
    path: "あなたの個人的な道",
    advice: "オラクルからの助言",
    steps: "具体的なステップ",
    reset: "新しい道を探す",
    categories: {
      Love: "愛と人間関係",
      Career: "キャリアと目的",
      Growth: "自己成長",
      General: "総合的なガイダンス"
    }
  }
};

export default function App() {
  const [state, setState] = useState<AppState>('welcome');
  const [lang, setLang] = useState('en');
  const [category, setCategory] = useState('General');
  const [cardCount, setCardCount] = useState(3);
  const [drawnCards, setDrawnCards] = useState<TarotCard[]>([]);
  const [initialReveal, setInitialReveal] = useState<InitialReveal | null>(null);
  const [elaboration, setElaboration] = useState('');
  const [finalReading, setFinalReading] = useState<ReadingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [shuffledDeck, setShuffledDeck] = useState<TarotCard[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  const t = UI_TEXT[lang] || UI_TEXT.en;

  useEffect(() => {
    if (state === 'drawing') {
      setShuffledDeck(shuffleDeck(MAJOR_ARCANA));
      setSelectedIndices([]);
      setDrawnCards([]);
    }
  }, [state]);

  const handleDrawCard = (index: number) => {
    if (selectedIndices.includes(index) || drawnCards.length >= cardCount) return;
    
    const card = shuffledDeck[index];
    setSelectedIndices([...selectedIndices, index]);
    setDrawnCards([...drawnCards, card]);
  };

  useEffect(() => {
    if (drawnCards.length === cardCount && state === 'drawing') {
      handleInitialReveal();
    }
  }, [drawnCards]);

  const handleInitialReveal = async () => {
    setLoading(true);
    try {
      const result = await getInitialReveal(drawnCards, category, lang);
      setInitialReveal(result);
      setState('initial_reveal');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalReading = async () => {
    if (!elaboration.trim()) return;
    setLoading(true);
    try {
      const result = await getFinalReading(drawnCards, category, elaboration, initialReveal!, lang);
      setFinalReading(result);
      setState('final_reading');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setState('welcome');
    setCategory('General');
    setCardCount(3);
    setDrawnCards([]);
    setInitialReveal(null);
    setElaboration('');
    setFinalReading(null);
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center px-4 py-12">
      <div className="atmosphere" />
      
      <div className="absolute top-6 right-6 z-50">
        <div className="glass flex items-center gap-2 px-3 py-2 rounded-full">
          <Languages className="w-4 h-4 text-stone-500" />
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value)}
            className="bg-transparent text-xs text-stone-300 focus:outline-none cursor-pointer"
          >
            {LANGUAGES.map(l => (
              <option key={l.code} value={l.code} className="bg-stone-900">{l.name}</option>
            ))}
          </select>
        </div>
      </div>

      <header className="mb-12 text-center z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 mb-2"
        >
          <Moon className="w-6 h-6 text-stone-400" />
          <h1 className="text-4xl font-light tracking-widest uppercase serif">Aura Tarot</h1>
          <Sun className="w-6 h-6 text-stone-400" />
        </motion.div>
        <p className="text-stone-400 text-sm tracking-widest uppercase">Intuitive Guidance • AI Powered</p>
      </header>

      <main className="w-full max-w-4xl z-10 flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {state === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="glass p-12 rounded-3xl text-center space-y-8 max-w-2xl mx-auto"
            >
              <div className="space-y-4">
                <h2 className="text-5xl serif font-light leading-tight">{t.welcome}</h2>
                <p className="text-stone-400 text-lg font-light">{t.subtitle}</p>
              </div>
              <button
                onClick={() => setState('struggle')}
                className="group relative inline-flex items-center gap-3 bg-stone-100 text-stone-900 px-8 py-4 rounded-full font-medium transition-all hover:bg-white hover:scale-105"
              >
                {t.begin}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          )}

          {state === 'struggle' && (
            <motion.div
              key="struggle"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass p-8 md:p-12 rounded-3xl space-y-8 max-w-2xl mx-auto w-full"
            >
              <h2 className="text-3xl serif font-light text-center">{t.clarity}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: t.categories.Love, icon: Heart, value: 'Love' },
                  { label: t.categories.Career, icon: Briefcase, value: 'Career' },
                  { label: t.categories.Growth, icon: Compass, value: 'Growth' },
                  { label: t.categories.General, icon: HelpCircle, value: 'General' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setCategory(opt.value);
                      setState('mode');
                    }}
                    className="flex items-center gap-4 p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-left"
                  >
                    <opt.icon className="w-6 h-6" />
                    <span className="font-medium">{opt.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {state === 'mode' && (
            <motion.div
              key="mode"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass p-8 md:p-12 rounded-3xl space-y-8 max-w-2xl mx-auto w-full text-center"
            >
              <h2 className="text-3xl serif font-light">{t.depth}</h2>
              <div className="flex justify-center gap-6">
                {[3, 5].map((count) => (
                  <button
                    key={count}
                    onClick={() => {
                      setCardCount(count);
                      setState('drawing');
                    }}
                    className="group flex flex-col items-center gap-4 p-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all w-40"
                  >
                    <div className="flex -space-x-2">
                      {[...Array(count)].map((_, i) => (
                        <div key={i} className="w-8 h-12 rounded border border-white/20 bg-stone-800 group-hover:bg-stone-700 transition-colors" />
                      ))}
                    </div>
                    <span className="text-xl font-medium">{count} Cards</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {state === 'drawing' && (
            <motion.div
              key="drawing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-8 w-full"
            >
              <div className="space-y-2">
                <h2 className="text-4xl serif font-light">{t.choose}</h2>
                <p className="text-stone-400">{t.trust.replace('{count}', cardCount.toString())}</p>
              </div>

              <div className="relative h-48 flex items-center justify-center mb-12">
                <div className="flex flex-wrap justify-center gap-1 max-w-4xl">
                  {shuffledDeck.map((_, i) => (
                    <motion.button
                      key={i}
                      initial={{ rotate: (i - 11) * 2, x: (i - 11) * 5 }}
                      whileHover={{ y: -20, scale: 1.1, zIndex: 50 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDrawCard(i)}
                      disabled={selectedIndices.includes(i) || drawnCards.length >= cardCount}
                      className={`w-10 h-16 md:w-14 md:h-24 rounded-lg border border-white/20 shadow-xl transition-all relative overflow-hidden flex-shrink-0 ${
                        selectedIndices.includes(i) 
                          ? 'opacity-0 scale-0 pointer-events-none' 
                          : 'bg-stone-900 hover:bg-stone-800'
                      }`}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-stone-700/20 via-transparent to-transparent" />
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-stone-500 text-xs uppercase tracking-[0.3em]">
                  {t.drawn.replace('{current}', drawnCards.length.toString()).replace('{total}', cardCount.toString())}
                </div>
                <div className="flex justify-center gap-4 min-h-[160px]">
                  {[...Array(cardCount)].map((_, i) => (
                    <div key={i} className="relative">
                      <div className="w-24 h-36 md:w-32 md:h-48 rounded-xl border border-white/5 bg-white/5 flex items-center justify-center">
                        {!drawnCards[i] && <Sparkles className="w-6 h-6 text-stone-800" />}
                      </div>
                      <AnimatePresence>
                        {drawnCards[i] && (
                          <motion.div
                            initial={{ scale: 0.5, opacity: 0, y: 100 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            className="absolute inset-0 w-24 h-36 md:w-32 md:h-48 rounded-xl border-2 border-stone-400/30 bg-stone-800 shadow-2xl flex items-center justify-center"
                          >
                            <div className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Card {i + 1}</div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
              
              {loading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center gap-3 text-stone-400 pt-8"
                >
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="uppercase tracking-[0.2em] text-[10px] font-bold">{t.revealing}</span>
                </motion.div>
              )}
            </motion.div>
          )}

          {state === 'initial_reveal' && initialReveal && (
            <motion.div
              key="initial_reveal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12 w-full"
            >
              <div className="text-center space-y-4 max-w-2xl mx-auto">
                <h2 className="text-4xl serif font-light">{t.spoken}</h2>
                <div className="glass p-6 rounded-2xl italic text-stone-300 leading-relaxed relative">
                  <span className="absolute -top-3 -left-2 text-4xl text-stone-700 serif">“</span>
                  {initialReveal.overallVibe}
                  <span className="absolute -bottom-6 -right-2 text-4xl text-stone-700 serif">”</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-6">
                {drawnCards.map((card, i) => (
                  <motion.div
                    key={i}
                    initial={{ rotateY: 90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    transition={{ delay: i * 0.15 }}
                    className="w-40 space-y-4"
                  >
                    <div className="aspect-[2/3] rounded-xl overflow-hidden border border-white/10 shadow-2xl relative group">
                      <img 
                        src={card.image} 
                        alt={card.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-[10px] font-bold tracking-widest text-white uppercase">{initialReveal.cardMeanings[i]?.name || card.name}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-center">
                      <p className="text-[10px] uppercase tracking-widest text-stone-500 font-bold border-b border-white/5 pb-1">{initialReveal.cardMeanings[i]?.essence}</p>
                      <p className="text-[11px] text-stone-400 leading-tight italic px-2">"{initialReveal.cardMeanings[i]?.message}"</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="glass p-8 rounded-3xl space-y-6 max-w-2xl mx-auto text-center border-stone-400/20">
                <h3 className="text-2xl serif font-light">{t.resonate}</h3>
                <p className="text-stone-400 text-sm leading-relaxed">{t.share}</p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setState('elaboration')}
                    className="bg-stone-100 text-stone-900 px-8 py-3 rounded-full font-medium inline-flex items-center gap-2 hover:bg-white transition-all shadow-xl"
                  >
                    {t.shareBtn} <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {state === 'elaboration' && (
            <motion.div
              key="elaboration"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass p-8 md:p-12 rounded-3xl space-y-8 max-w-2xl mx-auto w-full"
            >
              <div className="flex items-center gap-3 text-stone-400 mb-4">
                <MessageSquare className="w-5 h-5" />
                <span className="uppercase tracking-widest text-xs">Conversational Reading</span>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-3xl serif font-light">{t.tellMore}</h2>
                <p className="text-stone-400">{t.struggles}</p>
                
                <div className="relative">
                  <textarea
                    autoFocus
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-lg font-light focus:outline-none focus:ring-2 focus:ring-stone-400 min-h-[250px] transition-all"
                    placeholder={t.placeholder}
                    value={elaboration}
                    onChange={(e) => setElaboration(e.target.value)}
                  />
                  <button
                    disabled={!elaboration.trim() || loading}
                    onClick={handleFinalReading}
                    className="absolute bottom-4 right-4 bg-stone-100 text-stone-900 p-3 rounded-xl hover:bg-white transition-all disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {state === 'final_reading' && finalReading && (
            <motion.div
              key="final_reading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12 pb-24 max-w-3xl mx-auto w-full"
            >
              <div className="glass p-8 md:p-12 rounded-3xl space-y-10">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="h-px bg-white/10 flex-1" />
                  <Sparkles className="w-6 h-6 text-stone-500" />
                  <div className="h-px bg-white/10 flex-1" />
                </div>

                <section className="space-y-4">
                  <h3 className="text-xs uppercase tracking-[0.3em] text-stone-500 font-semibold text-center">{t.path}</h3>
                  <p className="text-xl md:text-2xl font-light leading-relaxed serif text-stone-200 text-center">
                    {finalReading.interpretation}
                  </p>
                </section>

                <div className="h-px bg-white/10 w-full" />

                <section className="space-y-4">
                  <h3 className="text-xs uppercase tracking-[0.3em] text-stone-500 font-semibold">{t.advice}</h3>
                  <p className="text-stone-300 leading-relaxed italic text-lg">
                    "{finalReading.advice}"
                  </p>
                </section>

                <section className="space-y-6">
                  <h3 className="text-xs uppercase tracking-[0.3em] text-stone-500 font-semibold">{t.steps}</h3>
                  <div className="grid gap-4">
                    {finalReading.actionSteps.map((step, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="flex items-start gap-4 bg-white/5 p-5 rounded-2xl border border-white/5"
                      >
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-stone-800 text-stone-400 text-[10px] flex items-center justify-center font-bold">
                          0{i + 1}
                        </span>
                        <p className="text-stone-300 text-sm">{step}</p>
                      </motion.div>
                    ))}
                  </div>
                </section>

                <button
                  onClick={reset}
                  className="w-full flex items-center justify-center gap-2 text-stone-500 hover:text-stone-200 transition-colors pt-8 group"
                >
                  <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                  <span className="text-xs uppercase tracking-widest">{t.reset}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-12 text-stone-600 text-[10px] uppercase tracking-[0.2em] z-10">
        © {new Date().getFullYear()} Aura Tarot • All rights reserved
      </footer>
    </div>
  );
}
