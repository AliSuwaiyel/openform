'use client'

import { useMemo } from 'react'
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'
import { Form, Response, QuestionConfig, Json } from '@/lib/database.types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
    BarChart3,
    PieChart as PieChartIcon,
    Users,
    Clock,
    CheckCircle2,
    ListFilter
} from 'lucide-react'

interface AnalyticsDashboardProps {
    form: Form
    responses: Response[]
}

const COLORS = [
    '#3b82f6', // blue-500
    '#10b981', // emerald-500
    '#f59e0b', // amber-500
    '#ef4444', // red-500
    '#8b5cf6', // violet-500
    '#ec4899', // pink-500
    '#06b6d4', // cyan-500
    '#f97316', // orange-500
]

function getChartData(question: QuestionConfig, responses: Response[]) {
    const counts: Record<string, number> = {}
    let total = 0

    responses.forEach((r) => {
        const answers = r.answers as Record<string, Json>
        const answer = answers[question.id]

        if (answer === null || answer === undefined) return

        if (Array.isArray(answer)) {
            answer.forEach((val) => {
                const key = String(val)
                counts[key] = (counts[key] || 0) + 1
                total++
            })
        } else {
            let key = String(answer)
            if (question.type === 'yes_no') {
                key = answer ? 'نعم' : 'لا'
            }
            counts[key] = (counts[key] || 0) + 1
            total++
        }
    })

    // Sort and format for Recharts
    const data = Object.entries(counts).map(([name, value]) => ({
        name,
        value,
        percentage: total > 0 ? (value / total) * 100 : 0,
    }))

    // For ratings/scales, ensure they are sorted by key
    if (question.type === 'rating' || question.type === 'opinion_scale') {
        data.sort((a, b) => Number(a.name) - Number(b.name))
    } else {
        data.sort((a, b) => b.value - a.value)
    }

    return { data, total }
}

export function AnalyticsDashboard({ form, responses }: AnalyticsDashboardProps) {
    const questions = (form.questions as QuestionConfig[]) || []
    const totalResponses = responses.length

    const stats = useMemo(() => {
        if (totalResponses === 0) return null

        // Simple completion rate logic (if all required questions have answers)
        const requiredQuestions = questions.filter(q => q.required)
        const completedResponses = responses.filter(r => {
            const answers = r.answers as Record<string, Json>
            return requiredQuestions.every(q => answers[q.id] !== null && answers[q.id] !== undefined)
        }).length

        const completionRate = Math.round((completedResponses / totalResponses) * 100)

        // Last submission time
        const lastSubmission = responses.length > 0
            ? new Date(Math.max(...responses.map(r => new Date(r.submitted_at).getTime())))
            : null

        return {
            totalResponses,
            completionRate,
            lastSubmission: lastSubmission?.toLocaleString('ar-SA', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
            })
        }
    }, [responses, questions])

    if (totalResponses === 0) {
        return (
            <div className="py-20 text-center">
                <p className="text-slate-500">لا توجد بيانات كافية لعرض الإحصائيات</p>
            </div>
        )
    }

    return (
        <div className="space-y-8" dir="rtl">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">إجمالي الردود</p>
                            <p className="text-2xl font-bold">{stats?.totalResponses}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-slate-500">معدل الإكمال</p>
                            <div className="flex items-center gap-2">
                                <p className="text-2xl font-bold">{stats?.completionRate}%</p>
                                <Progress value={stats?.completionRate} className="h-2 flex-1" />
                            </div>
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">آخر رد</p>
                            <p className="text-lg font-bold">{stats?.lastSubmission}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Question Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {questions.map((question, index) => {
                    const { data, total } = getChartData(question, responses)

                    if (total === 0) return null

                    const isChartable = [
                        'dropdown',
                        'checkboxes',
                        'yes_no',
                        'rating',
                        'opinion_scale'
                    ].includes(question.type)

                    return (
                        <Card key={question.id} className="p-6 flex flex-col h-full">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-slate-400 text-sm">{index + 1}.</span>
                                        <h3 className="font-semibold text-slate-900">{question.title}</h3>
                                    </div>
                                    <Badge variant="secondary" className="font-normal">
                                        {total} {total === 1 ? 'رد' : 'ردود'}
                                    </Badge>
                                </div>
                                {isChartable && (
                                    <div className="p-2 bg-slate-50 rounded-lg">
                                        {question.type === 'checkboxes' || question.type === 'opinion_scale' ? (
                                            <BarChart3 className="w-4 h-4 text-slate-400" />
                                        ) : (
                                            <PieChartIcon className="w-4 h-4 text-slate-400" />
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-h-[300px]">
                                {isChartable ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        {question.type === 'checkboxes' || question.type === 'opinion_scale' ? (
                                            <BarChart
                                                data={data}
                                                layout="vertical"
                                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                                <XAxis type="number" hide />
                                                <YAxis
                                                    dataKey="name"
                                                    type="category"
                                                    width={100}
                                                    tick={{ fontSize: 12 }}
                                                    orientation="right"
                                                />
                                                <Tooltip
                                                    contentStyle={{ direction: 'rtl', textAlign: 'right' }}
                                                    formatter={(value: any) => [`${value} رد`, 'العدد']}
                                                />
                                                <Bar
                                                    dataKey="value"
                                                    fill="#3b82f6"
                                                    radius={[0, 4, 4, 0]}
                                                    barSize={24}
                                                />
                                            </BarChart>
                                        ) : (
                                            <PieChart>
                                                <Pie
                                                    data={data}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {data.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        )}
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                                            <ListFilter className="w-4 h-4" />
                                            أحدث الإجابات:
                                        </div>
                                        <div className="space-y-2">
                                            {responses
                                                .filter(r => (r.answers as Record<string, Json>)[question.id])
                                                .slice(-5)
                                                .reverse()
                                                .map((r, i) => (
                                                    <div key={i} className="p-3 bg-slate-50 rounded-lg text-sm border border-slate-100">
                                                        {String((r.answers as Record<string, Json>)[question.id])}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
