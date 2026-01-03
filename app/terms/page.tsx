import { Logo } from "@/components/ui/logo"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function TermsPage() {
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
                        <h1 className="text-4xl font-extrabold text-slate-900 mb-8 leading-tight">الشروط والأحكام</h1>

                        <div className="space-y-8 text-slate-600 leading-relaxed text-lg">
                            <section>
                                <h2 className="text-2xl font-bold text-slate-800 mb-4">1. قبول الشروط</h2>
                                <p>
                                    من خلال استخدام منصة أوبن فورم (OpenForm)، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، يرجى التوقف عن استخدام المنصة.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-800 mb-4">2. الحسابات والتسجيل</h2>
                                <p>
                                    يجب أن تكون المعلومات المقدمة عند التسجيل (مثل البريد الإلكتروني وكلمة المرور) دقيقة وكاملة. أنت مسؤول عن الحفاظ على سرية بيانات حسابك وعن جميع الأنشطة التي تتم من خلاله.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-800 mb-4">3. استخدام المنصة</h2>
                                <p>
                                    يُمنع استخدام المنصة لأي أغراض غير قانونية أو لانتهاك حقوق الآخرين. أنت تدرك أنك المسؤول الوحيد عن النماذج التي تنشئها والبيانات التي تجمعها عبر المنصة.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-800 mb-4">4. الملكية الفكرية</h2>
                                <p>
                                    جميع العلامات التجارية والشعارات والمحتوى البرمجي للمنصة هي ملك حصري لـ أوبن فورم. يُسمح لك كخدمة باستخدام المنصة لإنشاء نماذجك الخاصة، ولكن لا يحق لك نسخ أو تعديل الكود المصدري للمنصة دون إذن.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-800 mb-4">5. إخلاء المسؤولية</h2>
                                <p>
                                    تُقدم المنصة &quot;كما هي&quot; دون أي ضمانات صريحة أو ضمنية. نحن لا نتحمل المسؤولية عن أي فقدان للبيانات أو توقف للخدمة ناتج عن مشاكل تقنية خارجة عن إرادتنا.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-800 mb-4">6. التعديلات</h2>
                                <p>
                                    نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سنقوم بإبلاغ المستخدمين بأي تغييرات جوهرية عبر البريد الإلكتروني أو من خلال إشعار على المنصة.
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
