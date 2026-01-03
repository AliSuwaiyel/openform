'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/ui/logo'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { KeyRound, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react'

function VerifyOtpContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const email = searchParams.get('email')
    const [otp, setOtp] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        if (!email) {
            router.push('/login')
        }
    }, [email, router])

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || otp.length !== 6) {
            toast.error('يرجى إدخال رمز التحقق المكون من 6 أرقام')
            return
        }

        setIsLoading(true)
        const { error } = await supabase.auth.verifyOtp({
            email,
            token: otp,
            type: 'signup',
        })

        if (error) {
            toast.error('رمز التحقق غير صحيح أو منتهي الصلاحية')
            setIsLoading(false)
        } else {
            setIsSuccess(true)
            toast.success('تم التحقق من حسابك بنجاح')
            setTimeout(() => {
                router.push('/dashboard')
            }, 1500)
        }
    }

    const handleResend = async () => {
        if (!email) return

        toast.info('جاري إعادة إرسال الرمز...')
        const { error } = await supabase.auth.resend({
            type: 'signup',
            email,
        })

        if (error) {
            toast.error('فشل إرسال الرمز، يرجى المحاولة لاحقاً')
        } else {
            toast.success('تم إرسال رمز جديد إلى بريدك الإلكتروني')
        }
    }

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4"
            >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900">تم التحقق بنجاح!</h1>
                <p className="text-slate-500 text-lg">جاري توجيهك إلى لوحة التحكم...</p>
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md px-6 py-12 relative z-10"
        >
            <div className="text-center mb-10">
                <div className="flex justify-center mb-6">
                    <Logo href="/" size="lg" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">تحقق من حسابك</h1>
                <p className="text-slate-500 mt-3 text-lg leading-relaxed px-4">
                    لقد أرسلنا رمز التحقق إلى بريدك الإلكتروني <br />
                    <span className="font-semibold text-slate-900 dir-ltr">{email}</span>
                </p>
            </div>

            <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/60 p-10 border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50 z-0" />

                <form onSubmit={handleVerify} className="space-y-8 relative z-10">
                    <div className="space-y-4">
                        <Label htmlFor="otp" className="text-slate-700 font-bold text-center block text-lg">
                            رمز التحقق (OTP)
                        </Label>
                        <div className="relative">
                            <KeyRound className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 pointer-events-none" />
                            <Input
                                id="otp"
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={6}
                                placeholder="000000"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                disabled={isLoading}
                                className="h-16 pl-4 pr-14 text-3xl tracking-[0.5em] font-mono text-center border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl transition-all"
                                dir="ltr"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading || otp.length !== 6}
                        className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] rounded-2xl"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <Loader2 className="animate-spin ml-2 h-6 w-6" />
                                جاري التحقق...
                            </span>
                        ) : (
                            'تأكيد الحساب'
                        )}
                    </Button>

                    <div className="text-center pt-2">
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={isLoading}
                            className="text-sm font-semibold text-slate-400 hover:text-blue-600 transition-colors py-2 px-4 rounded-lg hover:bg-blue-50"
                        >
                            لم يصلك الرمز؟ <span className="text-blue-600 underline underline-offset-4">إعادة الإرسال</span>
                        </button>
                    </div>
                </form>
            </div>

            <div className="text-center mt-8">
                <button
                    onClick={() => router.push('/login')}
                    className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-all group"
                >
                    <ArrowLeft className="ml-2 w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    العودة لتسجيل الدخول
                </button>
            </div>
        </motion.div>
    )
}

export default function VerifyOtpPage() {
    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#fafbfc]">
            {/* Background Decor */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.08),transparent_50%)]" />
                <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.08),transparent_50%)]" />
            </div>

            <Suspense fallback={
                <div className="flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                    <p className="text-slate-500 font-medium">جاري التحميل...</p>
                </div>
            }>
                <VerifyOtpContent />
            </Suspense>
        </div>
    )
}
