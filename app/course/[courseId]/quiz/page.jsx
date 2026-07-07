"use client"
import { getQuizData, getCourseById } from '@/configs/action';
import React, { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { HiOutlineTrophy, HiOutlineArrowLeft, HiOutlineArrowRight, HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi2';

function QuizPage({ params }) {
    const unwrappedParams = use(params);
    const courseId = unwrappedParams?.courseId;
    const router = useRouter();

    const [courseName, setCourseName] = useState('');
    const [quizData, setQuizData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);

    useEffect(() => {
        const fetchQuiz = async () => {
            if (!courseId) return;
            setLoading(true);
            try {
                const [courseRes, quizRes] = await Promise.all([
                    getCourseById(courseId),
                    getQuizData(courseId)
                ]);

                setCourseName(courseRes?.courseOutput?.["Course Name"] || 'Course');

                if (!quizRes.isFullyCompleted) {
                    alert("You need to complete all chapters before taking the quiz!");
                    router.replace(`/course/${courseId}/start`);
                    return;
                }

                if (!quizRes.mcqs || quizRes.mcqs.length === 0) {
                    alert("No quiz questions found for this course.");
                    router.replace(`/course/${courseId}/start`);
                    return;
                }

                setQuizData(quizRes);
            } catch (error) {
                console.error("Failed to load quiz:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [courseId]);

    const currentQuestion = quizData?.mcqs?.[currentIndex];
    const totalQuestions = quizData?.mcqs?.length || 0;
    const progressPercent = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;

    const handleOptionSelect = (option) => {
        if (hasAnswered) return; // prevent re-answering
        setSelectedOption(option);
        setHasAnswered(true);

        const isCorrect = option === currentQuestion.correctAnswer;
        if (isCorrect) setScore(score + 1);
    };

    const handleNext = () => {
        if (currentIndex + 1 >= totalQuestions) {
            setQuizFinished(true);
            return;
        }
        setCurrentIndex(prev => prev + 1);
        setSelectedOption(null);
        setHasAnswered(false);
    };

    const getOptionStyle = (option) => {
        if (!hasAnswered) {
            return 'border-border/30 bg-[#181818] hover:bg-[#282828] hover:border-white/20';
        }

        // After answering
        if (option === currentQuestion.correctAnswer) {
            return 'border-[#1DB954] bg-[#1DB954]/15 shadow-[0_0_20px_rgba(29,185,84,0.2)]';
        }
        if (option === selectedOption && option !== currentQuestion.correctAnswer) {
            return 'border-[#E22134] bg-[#E22134]/15 shadow-[0_0_20px_rgba(226,33,52,0.2)]';
        }
        return 'border-border/20 bg-[#181818] opacity-50';
    };

    // Loading state
    if (loading) {
        return (
            <div className='flex items-center justify-center h-screen bg-background'>
                <div className='flex flex-col items-center gap-3'>
                    <div className='w-8 h-8 rounded-full border-2 border-[#1DB954] border-t-transparent animate-spin' />
                    <p className='text-slate-400 font-medium'>Loading quiz...</p>
                </div>
            </div>
        );
    }

    if (!quizData) return null;

    // Results screen
    if (quizFinished) {
        const percentage = Math.round((score / totalQuestions) * 100);
        const isPassing = percentage >= 70;

        return (
            <div className='min-h-screen bg-background flex items-center justify-center p-6'>
                <div className='max-w-2xl w-full animate-fade-in-up'>

                    {/* Score Card */}
                    <div className='text-center mb-10'>
                        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${isPassing ? 'bg-[#1DB954]/15' : 'bg-[#E22134]/15'}`}>
                            <HiOutlineTrophy className={`text-5xl ${isPassing ? 'text-[#1DB954]' : 'text-[#E22134]'}`} />
                        </div>
                        <h1 className='text-3xl font-bold text-white mb-2'>
                            {isPassing ? '🎉 Excellent Work!' : 'Keep Learning!'}
                        </h1>
                        <p className='text-slate-400 mb-6'>{courseName}</p>

                        {/* Score */}
                        <div className='flex flex-col items-center justify-center mb-8'>
                            <span className={`text-6xl font-black mb-2 tracking-tight ${isPassing ? 'text-[#1DB954]' : 'text-[#E22134]'}`}>
                                {percentage}%
                            </span>
                            <span className='text-sm font-medium text-slate-400 bg-[#282828] px-4 py-1.5 rounded-full'>
                                {score} out of {totalQuestions} correct
                            </span>
                        </div>
                    </div>



                    {/* Action Buttons */}
                    <div className='flex gap-4 justify-center'>
                        <button
                            onClick={() => router.push(`/course/${courseId}/start`)}
                            className='flex items-center gap-2 px-6 py-3 bg-[#282828] text-white rounded-full font-semibold hover:bg-[#333] transition-all'
                        >
                            <HiOutlineArrowLeft className='text-lg' />
                            Back to Course
                        </button>
                        <button
                            onClick={() => {
                                setQuizFinished(false);
                                setCurrentIndex(0);
                                setSelectedOption(null);
                                setHasAnswered(false);
                                setScore(0);
                            }}
                            className='flex items-center gap-2 px-6 py-3 bg-[#1DB954] text-black rounded-full font-bold hover:bg-[#1ed760] transition-all shadow-lg shadow-[#1DB954]/20'
                        >
                            Retake Quiz
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Quiz question screen
    return (
        <div className='min-h-screen bg-background flex flex-col'>

            {/* Top Bar */}
            <div className='border-b border-border/30 bg-[#0d0d14]'>
                <div className='max-w-3xl mx-auto px-6 py-4 flex items-center justify-between'>
                    <button
                        onClick={() => router.push(`/course/${courseId}/start`)}
                        className='text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm'
                    >
                        <HiOutlineArrowLeft />
                        Exit Quiz
                    </button>
                    <span className='text-sm text-slate-400 font-medium'>
                        {currentIndex + 1} / {totalQuestions}
                    </span>
                </div>

                {/* Progress bar */}
                <div className='w-full bg-[#282828] h-1'>
                    <div
                        className='bg-[#1DB954] h-1 transition-all duration-500 ease-out'
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>

            {/* Question Area */}
            <div className='flex-1 flex items-center justify-center p-6'>
                <div className='max-w-2xl w-full animate-fade-in-up' key={currentIndex}>

                    {/* Chapter Tag */}
                    <div className='mb-4'>
                        <span className='text-xs font-medium px-3 py-1.5 rounded-full bg-[#1DB954]/10 text-[#1DB954] border border-[#1DB954]/20'>
                            {currentQuestion?.chapterTitle}
                        </span>
                    </div>

                    {/* Question */}
                    <h2 className='text-xl md:text-2xl font-bold text-white mb-8 leading-snug'>
                        {currentQuestion?.question}
                    </h2>

                    {/* Options */}
                    <div className='flex flex-col gap-3'>
                        {currentQuestion?.options?.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleOptionSelect(option)}
                                disabled={hasAnswered}
                                className={`flex items-center gap-3 w-full text-left p-4 rounded-xl border transition-all duration-300 ${getOptionStyle(option)} ${!hasAnswered ? 'cursor-pointer' : 'cursor-default'}`}
                            >
                                {/* Option letter */}
                                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all duration-300 ${hasAnswered && option === currentQuestion.correctAnswer
                                    ? 'bg-[#1DB954] text-black'
                                    : hasAnswered && option === selectedOption && option !== currentQuestion.correctAnswer
                                        ? 'bg-[#E22134] text-white'
                                        : 'bg-[#282828] text-slate-300'
                                    }`}>
                                    {String.fromCharCode(65 + idx)}
                                </span>

                                {/* Option text */}
                                <span className='text-slate-200 text-sm flex-1'>{option}</span>

                            </button>
                        ))}
                    </div>

                    {/* Next button */}
                    {hasAnswered && (
                        <div className='mt-8 flex justify-end animate-fade-in'>
                            <button
                                onClick={handleNext}
                                className='flex items-center gap-2 px-8 py-3 bg-[#1DB954] text-black rounded-full font-bold hover:bg-[#1ed760] transition-all shadow-lg shadow-[#1DB954]/20 hover:scale-105'
                            >
                                {currentIndex + 1 >= totalQuestions ? 'See Results' : 'Next Question'}
                                <HiOutlineArrowRight className='text-lg' />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default QuizPage;
