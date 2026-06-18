"use client"
import React from 'react'
import Link from 'next/link'
import { HiOutlineSparkles, HiOutlineAcademicCap, HiOutlinePlayCircle } from "react-icons/hi2"
import Image from 'next/image'
import { UserButton, useAuth } from '@clerk/nextjs'

const Hero = () => {
  const { isSignedIn } = useAuth();

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#121212]">
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column: Text & CTA */}
            <div>
              {/* Badge */}
              {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#181818] border border-white/10 text-sm text-[#1DB954] mb-8 animate-fade-in-up">
                <HiOutlineSparkles className="text-[#1DB954]" />
                <span className="font-medium">Powered by Google Gemini AI</span>
              </div> */}

              {/* Main heading */}
              <h1 className="text-5xl sm:text-6xl font-black leading-[1.1] tracking-tight animate-fade-in-up stagger-2 text-white">
                Build Courses
                <br />
                <span className="text-[#1DB954]">with AI Magic</span>
              </h1>

              <p className="mt-6 text-lg text-[#B3B3B3] max-w-xl leading-relaxed animate-fade-in-up stagger-3">
                Unlock personalized education with AI-driven course creation. 
                Generate structured curricula, detailed lessons, and YouTube tutorials — all in minutes.
              </p>

              {/* CTA buttons */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-in-up stagger-4">
                <Link href="/dashboard" 
                  className="inline-flex items-center justify-center gap-2 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 text-base no-underline">
                  <HiOutlineSparkles className="text-xl" />
                  Start Building Free
                </Link>

                <Link href="#features"
                  className="inline-flex items-center justify-center gap-2 bg-transparent border border-white/20 text-white font-bold px-8 py-4 rounded-full hover:bg-white/10 transition-all duration-300 text-base no-underline">
                  <HiOutlinePlayCircle className="text-xl" />
                  See How It Works
                </Link>
              </div>

              {/* Stats row */}
              <div className="mt-12 flex gap-8 animate-fade-in-up stagger-5">
                <div>
                  <h3 className="text-2xl font-bold text-white">10x</h3>
                  <p className="text-xs text-[#B3B3B3] mt-1 font-semibold uppercase tracking-wider">Faster</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#1DB954]">AI</h3>
                  <p className="text-xs text-[#B3B3B3] mt-1 font-semibold uppercase tracking-wider">Smart</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">24/7</h3>
                  <p className="text-xs text-[#B3B3B3] mt-1 font-semibold uppercase tracking-wider">Available</p>
                </div>
              </div>
            </div>

            {/* Right Column: Animated Text Banner */}
            <div className="hidden lg:block animate-fade-in-up stagger-3">
                <div className="relative rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(29,185,84,0.15)] bg-[#0A0A0A] border border-white/5 p-10 h-[450px] flex flex-col justify-center group hover:border-[#1DB954]/30 transition-colors duration-500">
                    
                    <div className="relative z-10 space-y-8">
                        <h3 className="text-3xl font-black text-white tracking-tight leading-tight">
                            Your Personal <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1DB954] to-cyan-400">
                                AI Professor
                            </span>
                        </h3>
                        
                        <div className="space-y-6">
                            <div className="flex items-start gap-4 animate-fade-in-up stagger-4">
                                <div className="w-10 h-10 rounded-full bg-[#1DB954]/10 flex items-center justify-center flex-shrink-0 mt-1 border border-[#1DB954]/20 shadow-[0_0_15px_rgba(29,185,84,0.2)]">
                                    <HiOutlineSparkles className="text-[#1DB954] text-xl" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg">Instant Curriculum</h4>
                                    <p className="text-[#B3B3B3] text-sm leading-relaxed mt-1">Type any topic, and Gemini AI instantly drafts a professional, multi-chapter syllabus tailored to your goals.</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-4 animate-fade-in-up stagger-5">
                                <div className="w-10 h-10 rounded-full bg-[#1DB954]/10 flex items-center justify-center flex-shrink-0 mt-1 border border-[#1DB954]/20 shadow-[0_0_15px_rgba(29,185,84,0.2)]">
                                    <HiOutlinePlayCircle className="text-[#1DB954] text-xl" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg">Curated Video Lessons</h4>
                                    <p className="text-[#B3B3B3] text-sm leading-relaxed mt-1">Automatically fetches and embeds the highest-rated YouTube tutorials for every single chapter to enhance learning.</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-4 animate-fade-in-up stagger-5">
                                <div className="w-10 h-10 rounded-full bg-[#1DB954]/10 flex items-center justify-center flex-shrink-0 mt-1 border border-[#1DB954]/20 shadow-[0_0_15px_rgba(29,185,84,0.2)]">
                                    <HiOutlineAcademicCap className="text-[#1DB954] text-xl" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg">Interactive Learning</h4>
                                    <p className="text-[#B3B3B3] text-sm leading-relaxed mt-1">Track your progress, read detailed explanations, and master new skills in a distraction-free, premium UI.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Background glow effects */}
                    <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[400px] h-[400px] bg-[#1DB954]/10 rounded-full blur-[100px] group-hover:bg-[#1DB954]/20 transition-all duration-700 pointer-events-none"></div>
                </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 px-6 bg-[#181818]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Everything You Need to <span className="text-[#1DB954]">Create & Learn</span>
            </h2>
            <p className="mt-4 text-[#B3B3B3] max-w-xl mx-auto">
              From AI-generated curricula to embedded video tutorials — Curriculum AI handles it all.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <HiOutlineSparkles className="text-3xl text-[#1DB954]" />,
                title: "AI Course Generation",
                description: "Input a topic and let Google Gemini AI create a structured syllabus with chapters, descriptions, and timelines.",
              },
              {
                icon: <HiOutlinePlayCircle className="text-3xl text-[#1DB954]" />,
                title: "YouTube Integration",
                description: "Automatically find and embed the most relevant YouTube tutorials for every single chapter in your course.",
              },
              {
                icon: <HiOutlineAcademicCap className="text-3xl text-[#1DB954]" />,
                title: "Learn & Share",
                description: "Study generated courses with an interactive reader, share with friends, and explore courses by other creators.",
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-[#121212] p-8 rounded-xl hover:-translate-y-2 transition-transform duration-300 group cursor-default">
                <div className="w-14 h-14 rounded-full bg-[#181818] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-[#B3B3B3] leading-relaxed text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#121212] border-t border-white/10 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#B3B3B3] font-medium">Curriculum-AI - trusted by students</p>
          <div className="flex gap-6 items-center">
            <Link href="/dashboard" className="text-sm text-[#B3B3B3] font-bold hover:text-white transition-colors no-underline">Dashboard</Link>
            {!isSignedIn ? (
              <Link href="/sign-in" className="text-sm text-[#B3B3B3] font-bold hover:text-white transition-colors no-underline">Log in</Link>
            ) : (
              <UserButton />
            )}
          </div>
        </div>
      </footer>
    </>
  )
}

export default Hero