import { Logo } from "@/components/ui/logo"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-bottom border-slate-100 h-20">
                <div className="container mx-auto px-4 h-full flex items-center justify-between">
                    <Logo href="/" size="md" />
                    <Link
                        href="/login"
                        className="text-blue-600 hover:text-blue-700 font-bold flex items-center transition-colors"
                    >
                        العودة للتسجيل
                        <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                    </Link>
                </div>
            </header>

            <main className="pt-32 pb-20 px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12">
                        <h1 className="text-4xl font-extrabold text-slate-900 mb-8 leading-tight">سياسة الخصوصية</h1>

                        <div className="space-y-8 text-slate-600 leading-relaxed text-lg">
                            <section>
                                <h2 className="text-2xl font-bold text-slate-800 mb-4">1. مقدمة</h2>
                                <p>
                                    نحن في أوبن فورم (OpenForm) نولي أهمية قصوى لخصوصيتكم. توضح هذه السياسة كيفية جمعنا واستخدامنا وحماية بياناتكم الشخصية عند استخدامكم لمنصتنا.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-800 mb-4">2. البيانات التي نجمعها</h2>
                                <p>
                                    نجمع البيانات التي تقدمونها طواعية مثل بريدكم الإلكتروني وصور الحساب عند التسجيل، بالإضافة إلى البيانات التقنية مثل عنوان البروتوكول (IP) ونوع المتصفح لتحسين تجربتكم.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-800 mb-4">3. كيف نستخدم بياناتكم</h2>
                                <p>
                                    نستخدم البيانات لتقديم خدماتنا، وتطوير المنصة، وتوفير الدعم التقني، وحماية حساباتكم من الوصول غير المصرح به. لن نشارك بياناتكم مع أطراف ثالثة لأغراض تسويقية دون موافقتكم الصريحة.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-800 mb-4">4. أمن البيانات</h2>
                                <p>
                                    نطبق إجراءات أمنية متقدمة لحماية بياناتكم، وتستخدم منصتنا تقنيات تشفير قوية لضمان سرية المعلومات، خاصة عند التعامل مع كلمات المرور وبيانات الجلسات عبر Supabase.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-800 mb-4">5. حقوقكم</h2>
                                <p>
                                    لكم الحق في الوصول إلى بياناتكم الشخصية، أو تعديلها، أو طلب حذف حسابكم بالكامل في أي وقت عبر لوحة التحكم الخاصة بكم.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-800 mb-4">6. التواصل معنا</h2>
                                <p>
                                    إذا كانت لديكم أي استفسارات بخصوص سياسة الخصوصية، يمكنكم التواصل معنا عبر البريد الإلكتروني الخاص بالدعم الفني.
                                </p>
                            </section>
                        </div>

                        <div className="mt-12 pt-8 border-top border-slate-100 text-center text-slate-400 text-sm">
                            آخر تحديث: 3 يناير 2026
                        </div>
                    </div>
                </div>
            </main>

            <footer className="py-10 text-center text-slate-400 text-sm">
                <p>© 2026 أوبن فورم - جميع الحقوق محفوظة</p>
            </footer>
        </div>
    )
}
