"use client"
import React from 'react'
import { HiOutlineCheckCircle, HiOutlineSparkles, HiOutlineStar, HiOutlineRocketLaunch } from "react-icons/hi2"

const plans = [
    {
        id: 'weekly',
        name: 'Starter',
        price: '₹99',
        period: '/week',
        description: 'Perfect for trying out AI course generation',
        badge: null,
        icon: <HiOutlineSparkles className="text-2xl" />,
        gradient: 'from-slate-500/20 to-slate-600/10',
        accentColor: 'text-slate-300',
        borderColor: 'border-slate-500/20',
        features: [
            '5 AI course credits per week',
            'Basic Gemini AI generation',
            'YouTube video integration',
            'Email support',
            'Course sharing',
        ],
        excluded: [
            'Priority support',
            'Advanced AI models',
            'Unlimited courses',
        ]
    },
    {
        id: 'monthly',
        name: 'Pro',
        price: '₹499',
        period: '/month',
        description: 'Best for regular learners and creators',
        badge: 'POPULAR',
        icon: <HiOutlineStar className="text-2xl" />,
        gradient: 'from-violet-500/20 to-purple-600/10',
        accentColor: 'text-violet-400',
        borderColor: 'border-violet-500/30',
        features: [
            '25 AI course credits per month',
            'Advanced Gemini AI generation',
            'YouTube video integration',
            'Priority email support',
            'Course sharing & embedding',
            'Custom course banners',
            'Edit chapters & descriptions',
        ],
        excluded: [
            'Unlimited courses',
        ]
    },
    {
        id: 'yearly',
        name: 'Enterprise',
        price: '₹1,999',
        period: '/year',
        description: 'Unlimited access for power users & teams',
        badge: 'BEST VALUE',
        icon: <HiOutlineRocketLaunch className="text-2xl" />,
        gradient: 'from-cyan-500/20 to-blue-600/10',
        accentColor: 'text-cyan-400',
        borderColor: 'border-cyan-500/30',
        features: [
            'Unlimited AI course credits',
            'Premium Gemini AI (highest quality)',
            'YouTube video integration',
            '24/7 priority support',
            'Course sharing & embedding',
            'Custom course banners',
            'Edit chapters & descriptions',
            'Early access to new features',
            'Analytics dashboard (coming soon)',
        ],
        excluded: []
    }
]

const Upgrade = () => {
  return (
    <div className='min-h-[80vh]'>
        {/* Header Section */}
        <div className='text-center mb-12'>
            <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card-light text-sm text-violet-300 mb-6'>
                <HiOutlineSparkles className="text-violet-400" />
                <span>Upgrade Your Plan</span>
            </div>
            <h1 className='text-3xl sm:text-4xl font-bold text-white'>
                Unlock the Full Power of <span className='gradient-text'>Curriculum AI</span>
            </h1>
            <p className='text-slate-400 mt-4 max-w-xl mx-auto leading-relaxed'>
                Choose the plan that fits your learning journey. All plans include AI-powered course generation, YouTube integration, and more.
            </p>
        </div>

        {/* Plans Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto'>
            {plans.map((plan) => (
                <div 
                    key={plan.id} 
                    className={`relative glass-card p-6 bg-gradient-to-br ${plan.gradient} transition-all duration-300 hover-lift group ${plan.badge === 'POPULAR' ? 'ring-1 ring-violet-500/40 glow-violet' : ''}`}
                >
                    {/* Badge */}
                    {plan.badge && (
                        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold tracking-wider
                            ${plan.badge === 'POPULAR' 
                                ? 'gradient-primary text-white shadow-lg shadow-violet-500/30' 
                                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            }`}
                        >
                            {plan.badge}
                        </div>
                    )}

                    {/* Plan Header */}
                    <div className='mt-2 mb-6'>
                        <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 ${plan.accentColor} group-hover:scale-110 transition-transform duration-300`}>
                            {plan.icon}
                        </div>
                        <h3 className='text-lg font-semibold text-white'>{plan.name}</h3>
                        <p className='text-xs text-slate-400 mt-1'>{plan.description}</p>
                        
                        <div className='mt-4 flex items-baseline gap-1'>
                            <span className={`text-4xl font-black ${plan.accentColor}`}>{plan.price}</span>
                            <span className='text-sm text-slate-500'>{plan.period}</span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className='h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6' />

                    {/* Features */}
                    <ul className='space-y-3 mb-8'>
                        {plan.features.map((feature, idx) => (
                            <li key={idx} className='flex items-start gap-2.5 text-sm'>
                                <HiOutlineCheckCircle className={`text-base mt-0.5 flex-shrink-0 ${plan.accentColor}`} />
                                <span className='text-slate-300'>{feature}</span>
                            </li>
                        ))}
                        {plan.excluded.map((feature, idx) => (
                            <li key={`ex-${idx}`} className='flex items-start gap-2.5 text-sm'>
                                <span className='text-base mt-0.5 flex-shrink-0 text-slate-600'>✕</span>
                                <span className='text-slate-500 line-through'>{feature}</span>
                            </li>
                        ))}
                    </ul>

                    {/* CTA Button */}
                    <button 
                        disabled
                        className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-300 cursor-not-allowed
                            ${plan.badge === 'POPULAR' 
                                ? 'gradient-primary text-white opacity-80' 
                                : `border ${plan.borderColor} text-slate-300 opacity-70`
                            }`}
                    >
                        Coming Soon
                    </button>
                </div>
            ))}
        </div>

        {/* Footer note */}
        <div className='text-center mt-12'>
            <p className='text-sm text-slate-500'>
                🔒 Secure payments powered by Razorpay (coming soon). Cancel anytime.
            </p>
            <p className='text-xs text-slate-600 mt-2'>
                All prices are in Indian Rupees (INR) and inclusive of applicable taxes.
            </p>
        </div>
    </div>
  )
}

export default Upgrade
