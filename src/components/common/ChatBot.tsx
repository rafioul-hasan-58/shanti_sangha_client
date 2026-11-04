"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  quickAction?: { label: string; href: string };
}

export default function ChatBot({ locale }: { locale: Locale }) {
  const isBn = locale === "bn";
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message
  const initialMessages: Message[] = [
    {
      id: "welcome-1",
      sender: "bot",
      text: isBn
        ? "আসসালামু আলাইকুম! সাভারচালা শান্তি সংঘের অফিসিয়াল ডিজিটাল সহকারীতে আপনাকে স্বাগতম। আমি আপনাকে কীভাবে সাহায্য করতে পারি?"
        : "Hello! Welcome to Shavarchala Shanti Sangha's official digital assistant. How can I help you today?",
      timestamp: "Just now",
    },
  ];

  const [messages, setMessages] = useState<Message[]>(initialMessages);

  // Suggested Prompts
  const quickPrompts = isBn
    ? [
        { label: "🏆 এসপিএল (SPL) সম্পর্কে", query: "এসপিএল টুর্নামেন্ট সম্পর্কে বলুন" },
        { label: "👥 ক্লাবের কার্যনির্বাহী কমিটি", query: "কমিটির সভাপতি ও সাধারণ সম্পাদক কে?" },
        { label: "🏅 ৩টি প্রধান বাৎসরিক আয়োজন", query: "ক্লাবের ৩টি বাৎসরিক আয়োজন কি কি?" },
        { label: "📝 নতুন সদস্য হওয়ার নিয়ম", query: "কীভাবে শান্তি সংঘের সদস্য হব?" },
        { label: "📱 অফিশিয়াল ফেসবুক পেজ", query: "ফেসবুক পেজ লিংক দিন" },
      ]
    : [
        { label: "🏆 About SPL Tournament", query: "Tell me about the SPL tournament" },
        { label: "👥 Committee Leaders", query: "Who are the club president and leaders?" },
        { label: "🏅 3 Signature Annual Events", query: "What are the 3 flagship annual events?" },
        { label: "📝 How to Join as Member", query: "How can I become a member?" },
        { label: "📱 Official Facebook Page", query: "Give me the official Facebook link" },
      ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  // Knowledge base answer generator
  const getBotResponse = (userText: string): { reply: string; action?: { label: string; href: string } } => {
    const q = userText.toLowerCase();

    // Greetings
    if (
      q.includes("সালাম") ||
      q.includes("হ্যালো") ||
      q.includes("হাই") ||
      q.includes("hello") ||
      q.includes("hi") ||
      q.includes("assalamu") ||
      q.includes("কেমন আছেন")
    ) {
      return {
        reply: isBn
          ? "ওয়ালাইকুম আসসালাম! আলহামদুলিল্লাহ, আমরা ভালো আছি। সাভারচালা শান্তি সংঘের ইতিহাস, এসপিএল, বাৎসরিক ক্রীড়া উৎসব বা সদস্য হওয়া নিয়ে যেকোনো প্রশ্ন করতে পারেন।"
          : "Hello and greetings! How can I assist you today? You can ask about our 19+ years heritage, SPL tournament, executive committee, or becoming a member.",
      };
    }

    // SPL / Premier League
    if (q.includes("spl") || q.includes("এসপিএল") || q.includes("প্রিমিয়ার লিগ") || q.includes("premier league")) {
      return {
        reply: isBn
          ? "এসপিএল (SPL - Shanti Sangha Premier League) হলো আমাদের সবচেয়ে জনপ্রিয় ক্রীড়া টুর্নামেন্ট! এতে গ্রীষ্মকালে জমজমাট ফুটবল এবং শীতকালে প্রিমিয়ার ক্রিকেট টুর্নামেন্ট অনুষ্ঠিত হয়।"
          : "SPL (Shanti Sangha Premier League) is our flagship championship! It features an exciting summer football league and a competitive winter cricket tournament.",
        action: { label: isBn ? "এসপিএল সেকশন দেখুন" : "View SPL Section", href: `/${locale}#spl` },
      };
    }

    // Former Presidents / Pioneers of Peace
    if (
      q.includes("প্রাক্তন সভাপতি") ||
      q.includes("formar") ||
      q.includes("former") ||
      q.includes("pioneer") ||
      q.includes("অগ্রদূত") ||
      q.includes("হারুন") ||
      q.includes("লুৎফর") ||
      q.includes("রোমান") ||
      q.includes("harun") ||
      q.includes("lutfor") ||
      q.includes("roman")
    ) {
      return {
        reply: isBn
          ? "সাভারচালা শান্তি সংঘের 'শান্তির অগ্রদূত' শ্রদ্ধেয় প্রাক্তন সভাপতিবৃন্দ হলেন জনাব হারুন শেখ, জনাব মোঃ লুৎফর রহমান এবং জনাব টি.কে. রোমান। তাঁদের দিকনির্দেশনা ও আত্মত্যাগে ক্লাবের ভিত্তি সুদৃঢ় হয়েছে।"
          : "The 'Pioneers of Peace' of Shavarchala Shanti Sangha are our esteemed former presidents: Harun Sheikh, Md. Lutfor Rahman, and T.K. Roman, whose visionary guidance built the club's foundation.",
        action: { label: isBn ? "শান্তির অগ্রদূত দেখুন" : "View Pioneers of Peace", href: `/${locale}#pioneer-of-peace` },
      };
    }

    // Committee / Leaders / President
    if (
      q.includes("কমিটি") ||
      q.includes("সভাপতি") ||
      q.includes("সম্পাদক") ||
      q.includes("committee") ||
      q.includes("president") ||
      q.includes("নেতা") ||
      q.includes("member") ||
      q.includes("leader")
    ) {
      return {
        reply: isBn
          ? "সাভারচালা শান্তি সংঘের বর্তমান কার্যনির্বাহী কমিটির সভাপতি জনাব মাহফুজুর রহমান এবং সাধারণ সম্পাদক জনাব মোঃ মুস্তাকিম। সিনিয়র সহ-সভাপতি মোঃ রাকিব ও রাসেল শুভ। কমিটিতে মোট ১৬ জন নিবেদিত নেতা রয়েছেন।"
          : "Shavarchala Shanti Sangha is led by President Mahfozor Rahman and General Secretary Md. Mustakim, along with 14 other executive committee leaders.",
        action: { label: isBn ? "কমিটি তালিকা দেখুন" : "View Committee", href: `/${locale}#committee` },
      };
    }

    // 3 Signature Annual Events
    if (
      q.includes("বাৎসরিক") ||
      q.includes("আয়োজন") ||
      q.includes("ওয়াজ") ||
      q.includes("mahfil") ||
      q.includes("annual") ||
      q.includes("৩টি") ||
      q.includes("three")
    ) {
      return {
        reply: isBn
          ? "বিগত ১৯+ বছর ধরে সাভারচালা শান্তি সংঘ ৩টি প্রধান বাৎসরিক কর্মসূচি পালন করে আসছে:\n১. এসপিএল (SPL - ফুটবল ও ক্রিকেট প্রিমিয়ার লিগ)\n২. বাৎসরিক ক্রীড়া প্রতিযোগিতা (সব বয়সের জন্য অ্যাথলেটিক্স ও দৌড়)\n৩. বাৎসরিক ওয়াজ মাহফিল (নৈতিক ও আধ্যাত্মিক সমাবেশ)।"
          : "For over 19+ years, Shanti Sangha has annually organized 3 signature events:\n1. SPL (Premier football & cricket)\n2. Annual Sports Program (Athletics & games for all ages)\n3. Annual Waz Mahfil (Spiritual & moral gathering).",
        action: { label: isBn ? "ইতিহাস ও ঐতিহ্য দেখুন" : "View Heritage", href: `/${locale}#about` },
      };
    }

    // Sports (Football, Cricket, Volleyball, Badminton)
    if (
      q.includes("ফুটবল") ||
      q.includes("ক্রিকেট") ||
      q.includes("ভলিবল") ||
      q.includes("ব্যাডমিন্টন") ||
      q.includes("football") ||
      q.includes("cricket") ||
      q.includes("volleyball") ||
      q.includes("badminton")
    ) {
      return {
        reply: isBn
          ? "আমরা চারটি মূল খেলাধুলা পরিচালনা করি:\n• ফুটবল: গ্রীষ্মকালীন এসপিএল টুর্নামেন্ট ও নিয়মিত ম্যাচ\n• ক্রিকেট: শীতকালীন ক্রিকেট উৎসব, জিপিএল ও এসপিএল\n• ভলিবল: নিয়মিত প্রীতি ম্যাচ ও আঞ্চলিক প্রতিযোগিতা\n• ব্যাডমিন্টন: শীতকালীন ইনডোর ও আউটডোর প্র্যাকটিস।"
          : "We actively host 4 sports:\n• Football: Summer SPL & regular matches\n• Cricket: Winter festival, GPL & SPL tournaments\n• Volleyball: Community matches & tournaments\n• Badminton: Winter practice & tournaments.",
        action: { label: isBn ? "খেলাধুলা সেকশন দেখুন" : "View Sports", href: `/${locale}#sports` },
      };
    }

    // Membership / Registration
    if (
      q.includes("সদস্য") ||
      q.includes("নিবন্ধন") ||
      q.includes("যোগ") ||
      q.includes("register") ||
      q.includes("join") ||
      q.includes("account") ||
      q.includes("ভর্তি")
    ) {
      return {
        reply: isBn
          ? "সাভারচালা শান্তি সংঘ পরিবারের অংশ হতে ওয়েবসাইটে নিবন্ধন সম্পন্ন করুন। নিবন্ধিত সদস্যরা টুর্নামেন্টে অংশগ্রহণ, ক্লাবের ড্যাশবোর্ড এবং বাৎসরিক আয়োজনে অগ্রাধিকার পান।"
          : "To join the Shavarchala Shanti Sangha family, simply register your account online. Registered members enjoy priority in tournaments, member directory, and club dashboard access.",
        action: { label: isBn ? "নিবন্ধন ফর্ম খুলুন" : "Register Now", href: `/${locale}/register` },
      };
    }

    // Facebook / Social
    if (q.includes("ফেসবুক") || q.includes("facebook") || q.includes("fb") || q.includes("page") || q.includes("পেজ")) {
      return {
        reply: isBn
          ? "আমাদের অফিশিয়াল ফেসবুক পেজ: https://web.facebook.com/s.s.royals2007 (@s.s.royals2007)। লাইক ও ফলো দিয়ে সবসময় সাথে থাকুন!"
          : "Our official Facebook page is: https://web.facebook.com/s.s.royals2007 (@s.s.royals2007). Follow us for the latest news and tournament updates!",
        action: { label: isBn ? "ফেসবুক পেজ খুলুন" : "Open Facebook Page", href: "https://web.facebook.com/s.s.royals2007" },
      };
    }

    // Foundation / History / 19+ Years
    if (
      q.includes("ইতিহাস") ||
      q.includes("প্রতিষ্ঠা") ||
      q.includes("কবে") ||
      q.includes("foundation") ||
      q.includes("history") ||
      q.includes("2007") ||
      q.includes("19")
    ) {
      return {
        reply: isBn
          ? "সাভারচালা শান্তি সংঘ ২০০৭ সালে এলাকার একদল উদ্যমী তরুণ ও ক্রীড়াপ্রেমীদের হাত ধরে প্রতিষ্ঠিত হয়। বিগত ১৯+ বছর ধরে এটি এলাকায় সৌহার্দ্য, সুস্থ ক্রীড়া চর্চা ও সমাজসেবার প্রতীক হিসেবে প্রতিষ্ঠিত।"
          : "Founded in 2007 by visionary youth and athletes in Shavarchala, Shanti Sangha has 19+ years of heritage promoting athletic excellence and brotherhood.",
        action: { label: isBn ? "আমাদের ইতিহাস পড়ুন" : "Read Full Story", href: `/${locale}#about` },
      };
    }

    // Default intelligent answer
    return {
      reply: isBn
        ? "ধন্যবাদ আপনার বার্তার জন্য! সাভারচালা শান্তি সংঘের খেলাধুলা, এসপিএল টুর্নামেন্ট, কমিটি বা ক্লাবে সদস্য হওয়া সম্পর্কিত আরও তথ্যের জন্য নিচের যেকোনো অপশনে ট্যাপ করতে পারেন।"
        : "Thank you for reaching out! You can explore details about our sports tournaments, SPL, committee, or becoming a member by choosing an option below.",
    };
  };

  const handleSend = (textToSend?: string) => {
    const query = (typeof textToSend === "string" ? textToSend : input).trim();
    if (!query) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getBotResponse(query);
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        quickAction: response.action,
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      {/* Floating Action Button (Matches the User's Attached Screenshot with Radiation Effect) */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center justify-center">
        {/* Radiating Waves / Radiation effect outside the button */}
        {!isOpen && (
          <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
            {/* Radiation Wave 1 (Brand Green) */}
            <span className="absolute w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-[#006a4e]/70 animate-radiate-1" />
            {/* Radiation Wave 2 (Vibrant Green) */}
            <span className="absolute w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-[#007a5a]/60 animate-radiate-2" />
            {/* Ambient outer glow */}
            <span className="absolute -inset-3 rounded-full bg-emerald-400/30 blur-md animate-pulse" />
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
          style={
            isOpen
              ? { backgroundColor: "#005a42" }
              : {
                  background:
                    "linear-gradient(135deg, #005a42 0%, #006a4e 40%, #007a5a 75%, #008f6b 100%)",
                }
          }
          className={`relative group w-14 h-14 sm:w-15 sm:h-15 rounded-full flex items-center justify-center border-[2.5px] border-white transition-all duration-300 transform active:scale-95 cursor-pointer ${
            isOpen
              ? "text-white rotate-90 shadow-2xl ring-4 ring-white/40"
              : "text-white hover:scale-105 shadow-[0_8px_24px_rgba(0,106,78,0.42),0_4px_12px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_28px_rgba(0,106,78,0.55),0_6px_16px_rgba(0,0,0,0.3)]"
          }`}
        >
          {isOpen ? (
            /* Close Icon when open */
            <svg
              className="w-6 h-6 stroke-white fill-none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            /* Speech bubble icon matching screenshot */
            <div className="relative flex items-center justify-center">
              <svg
                className="w-7 h-7 stroke-white fill-none group-hover:scale-105 transition-transform duration-200"
                viewBox="0 0 24 24"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
              </svg>
            </div>
          )}
        </button>
      </div>

      {/* Chatbot Popup Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[390px] md:w-[410px] h-[540px] max-h-[82vh] rounded-3xl bg-white border border-brand-200 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header (Styled with Nav Color #006a4e) */}
          <div className="bg-[#006a4e] text-white px-5 py-4 flex items-center justify-between border-b-2 border-white/20 shadow-md">
            <div className="flex items-center gap-3">
              {/* Crest Logo */}
              <div className="relative w-10 h-10 rounded-full bg-white p-1 shadow-sm ring-2 ring-white/50 shrink-0 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Shanti Sangha"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="leading-tight">
                <h3 className="font-extrabold text-sm sm:text-base tracking-wide flex items-center gap-1.5">
                  <span>{isBn ? "শান্তি সংঘ AI Bot" : "Shanti Sangha AI Bot"}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h3>
                <p className="text-[11px] text-white/80 font-medium">
                  {isBn ? "অনলাইন • সবসময় আপনার সাথে" : "Online • Always here to help"}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setMessages(initialMessages)}
                title={isBn ? "চ্যাট রিসেট করুন" : "Clear Chat"}
                className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title={isBn ? "বন্ধ করুন" : "Close"}
                className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-chalk/60">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xs font-sans whitespace-pre-line ${
                    msg.sender === "user"
                      ? "bg-[#006a4e] text-white rounded-tr-xs"
                      : "bg-white text-pitch border border-brand-200/90 rounded-tl-xs"
                  }`}
                >
                  {msg.text}

                  {/* Optional Quick Link Button inside Bot Message */}
                  {msg.quickAction && (
                    <div className="mt-3 pt-2.5 border-t border-brand-100 flex items-center">
                      <Link
                        href={msg.quickAction.href}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#006a4e] hover:underline"
                      >
                        <span>{msg.quickAction.label}</span>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Link>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-brand-400 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-1.5 bg-white border border-brand-200 rounded-2xl rounded-tl-xs px-4 py-3 w-18 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#006a4e] animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-[#006a4e] animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-[#006a4e] animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Question Chips */}
          <div className="px-3.5 py-2.5 bg-white border-t border-brand-100/90 overflow-x-auto scrollbar-none flex items-center gap-2">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(p.query)}
                className="shrink-0 text-[11px] font-semibold px-2.5 py-1.5 rounded-full bg-brand-50 hover:bg-[#006a4e] text-brand-700 hover:text-white border border-brand-200 hover:border-[#006a4e] transition-all duration-150 cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Input & Send Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-brand-200/90 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={isBn ? "আপনার প্রশ্ন লিখুন..." : "Type your question..."}
              className="flex-1 bg-brand-50/70 text-pitch text-sm px-4 py-2.5 rounded-2xl border border-brand-200 focus:bg-white focus:border-[#006a4e] focus:ring-2 focus:ring-[#006a4e]/20 outline-none transition-all placeholder-brand-400"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-200 active:scale-95 shadow-xs ${
                input.trim()
                  ? "bg-[#006a4e] hover:bg-[#005a42] text-white cursor-pointer hover:shadow-md hover:scale-105"
                  : "bg-brand-100 text-brand-300 cursor-not-allowed opacity-60"
              }`}
              aria-label="Send message"
            >
              <svg className="w-5 h-5 translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}

