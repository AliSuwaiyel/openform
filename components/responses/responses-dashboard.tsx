'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Form, Response, QuestionConfig, Json } from '@/lib/database.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Card } from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import {
  ArrowRight,
  Search,
  Download,
  Trash2,
  MoreVertical,
  FileText,
  ExternalLink,
  Copy,
  Pencil,
  Image as ImageIcon,
  File,
  Eye,
} from 'lucide-react'

interface ResponsesDashboardProps {
  form: Form
  responses: Response[]
}

function formatDate(date: string) {
  return new Date(date).toLocaleString('ar-SA', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

interface FileUpload {
  name: string
  type: string
  size?: number
  data?: string  // base64 data URL (fallback)
  url?: string   // R2 URL (preferred)
}

function isFileUpload(answer: Json): boolean {
  if (answer === null || typeof answer !== 'object' || Array.isArray(answer)) {
    return false
  }
  const obj = answer as Record<string, unknown>
  // Check if it has name and either url or data (file upload signature)
  return (
    'name' in obj &&
    typeof obj.name === 'string' &&
    (('url' in obj && typeof obj.url === 'string') ||
      ('data' in obj && typeof obj.data === 'string'))
  )
}

function asFileUpload(answer: Json): FileUpload {
  return answer as unknown as FileUpload
}

function getFileUrl(file: FileUpload): string {
  // Prefer URL (R2) over data (base64)
  return file.url || file.data || ''
}

function formatAnswer(answer: Json): string {
  if (answer === null || answer === undefined) return '-'
  if (typeof answer === 'boolean') return answer ? 'نعم' : 'لا'
  if (Array.isArray(answer)) return answer.join(', ')
  if (typeof answer === 'object') {
    // Handle file uploads
    if (isFileUpload(answer)) {
      return asFileUpload(answer).name
    }
    return JSON.stringify(answer)
  }
  return String(answer)
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' ب'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' ك.ب'
  return (bytes / (1024 * 1024)).toFixed(1) + ' م.ب'
}

export function ResponsesDashboard({ form, responses: initialResponses }: ResponsesDashboardProps) {
  const router = useRouter()
  const supabase = createClient()
  const questions = (form.questions as QuestionConfig[]) || []

  const [responses, setResponses] = useState(initialResponses)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [responseToDelete, setResponseToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [filePreview, setFilePreview] = useState<FileUpload | null>(null)

  // Filter responses based on search query
  const filteredResponses = useMemo(() => {
    if (!searchQuery.trim()) return responses

    const query = searchQuery.toLowerCase()
    return responses.filter(response => {
      const answers = response.answers as Record<string, Json>
      return Object.values(answers).some(answer =>
        formatAnswer(answer).toLowerCase().includes(query)
      )
    })
  }, [responses, searchQuery])

  const handleDelete = async () => {
    if (!responseToDelete) return

    setIsDeleting(true)
    const { error } = await supabase
      .from('responses')
      .delete()
      .eq('id', responseToDelete)

    if (error) {
      toast.error('فشل في حذف الرد')
    } else {
      setResponses(prev => prev.filter(r => r.id !== responseToDelete))
      toast.success('تم حذف الرد')
    }
    setIsDeleting(false)
    setDeleteDialogOpen(false)
    setResponseToDelete(null)
  }

  const exportToCSV = () => {
    if (responses.length === 0) {
      toast.error('لا يوجد ردود لتصديرها')
      return
    }

    // Build CSV header
    const headers = ['تاريخ التقديم', ...questions.map(q => q.title || 'بدون عنوان')]

    // Build CSV rows
    const rows = responses.map(response => {
      const answers = response.answers as Record<string, Json>
      return [
        formatDate(response.submitted_at),
        ...questions.map(q => formatAnswer(answers[q.id]))
      ]
    })

    // Create CSV content (UTF-8 with BOM for Excel Arabic support)
    const csvContent = [
      headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','),
      ...rows.map(row =>
        row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      )
    ].join('\n')

    // Download
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${form.title || 'form'}-responses-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(link.href)

    toast.success('تم تصدير ملف CSV بنجاح')
  }

  const copyFormLink = () => {
    const link = `${window.location.origin}/f/${form.slug}`
    navigator.clipboard.writeText(link)
    toast.success('تم نسخ الرابط إلى الحافظة')
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12 py-8 text-right" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4 justify-start">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowRight className="w-4 h-4 ml-2" />
              العودة
            </Button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{form.title}</h1>
              {form.status === 'published' && (
                <Badge className="bg-emerald-100 text-emerald-700">منشور</Badge>
              )}
              {form.status === 'draft' && (
                <Badge variant="secondary">مسودة</Badge>
              )}
              {form.status === 'closed' && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-700">مغلق</Badge>
              )}
            </div>
            <p className="text-slate-600 mt-1">
              {responses.length} {responses.length === 1 ? 'رد' : 'ردود'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/forms/${form.id}/edit`}>
              <Button variant="outline" size="sm">
                <Pencil className="w-4 h-4 ml-2" />
                تعديل النموذج
              </Button>
            </Link>
            {form.status === 'published' && (
              <>
                <Button variant="outline" size="sm" onClick={copyFormLink}>
                  <Copy className="w-4 h-4 ml-2" />
                  نسخ الرابط
                </Button>
                <Link href={`/f/${form.slug}`} target="_blank">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4 ml-2" />
                    عرض النموذج
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Responses section */}
      {responses.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
            <FileText className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">لا توجد ردود بعد</h2>
          <p className="text-slate-600 max-w-sm mx-auto">
            {form.status === 'published'
              ? 'شارك نموذجك للبدء في جمع الردود'
              : 'قم بنشر نموذجك للبدء في جمع الردود'
            }
          </p>
          {form.status === 'published' && (
            <Button onClick={copyFormLink} className="mt-6 bg-blue-600 hover:bg-blue-700">
              <Copy className="w-4 h-4 ml-2" />
              نسخ رابط النموذج
            </Button>
          )}
        </Card>
      ) : (
        <>
          {/* Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="بحث في الردود..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button onClick={exportToCSV} variant="outline">
              <Download className="w-4 h-4 ml-2" />
              تصدير CSV
            </Button>
          </div>

          {/* Table */}
          <Card className="overflow-hidden">
            <ScrollArea className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px] sticky right-0 bg-white z-10 pr-6 text-right">تاريخ التقديم</TableHead>
                    {questions.map((question, index) => (
                      <TableHead key={question.id} className="min-w-[200px] text-right">
                        <span className="text-slate-400 ml-2">{index + 1}.</span>
                        {question.title || 'بدون عنوان'}
                        {question.required && <span className="text-red-500 mr-1">*</span>}
                      </TableHead>
                    ))}
                    <TableHead className="w-[60px] sticky left-0 bg-white z-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResponses.map((response) => {
                    const answers = response.answers as Record<string, Json>
                    return (
                      <TableRow key={response.id}>
                        <TableCell className="font-medium sticky right-0 bg-white z-10 pr-6 text-right">
                          {formatDate(response.submitted_at)}
                        </TableCell>
                        {questions.map((question) => {
                          const answer = answers[question.id]

                          // Special rendering for file uploads
                          if (isFileUpload(answer)) {
                            const file = asFileUpload(answer)
                            const isImage = file.type?.startsWith('image/')
                            return (
                              <TableCell key={question.id} className="max-w-[300px] text-right">
                                <button
                                  onClick={() => setFilePreview(file)}
                                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors text-sm group flex-row-reverse"
                                >
                                  {isImage ? (
                                    <ImageIcon className="w-4 h-4" />
                                  ) : (
                                    <File className="w-4 h-4" />
                                  )}
                                  <span className="truncate max-w-[150px]">{file.name}</span>
                                  <Eye className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                              </TableCell>
                            )
                          }

                          return (
                            <TableCell key={question.id} className="max-w-[300px] truncate text-right">
                              {formatAnswer(answer)}
                            </TableCell>
                          )
                        })}
                        <TableCell className="sticky left-0 bg-white z-10">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                              <DropdownMenuItem
                                onClick={() => {
                                  setResponseToDelete(response.id)
                                  setDeleteDialogOpen(true)
                                }}
                                className="text-red-600 focus:text-red-600 text-right"
                              >
                                <Trash2 className="ml-2 h-4 w-4" />
                                حذف الرد
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </Card>

          {filteredResponses.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <p className="text-slate-500">لا توجد ردود تطابق بحثك</p>
            </div>
          )}
        </>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">حذف الرد</DialogTitle>
            <DialogDescription className="text-right">
              هل أنت متأكد من رغبتك في حذف هذا الرد؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row-reverse gap-2 sm:justify-start">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'جاري الحذف...' : 'حذف'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* File preview dialog */}
      <Dialog open={!!filePreview} onOpenChange={() => setFilePreview(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 justify-start">
              {filePreview?.type?.startsWith('image/') ? (
                <ImageIcon className="w-5 h-5 text-blue-600" />
              ) : (
                <File className="w-5 h-5 text-blue-600" />
              )}
              <span className="truncate">{filePreview?.name}</span>
            </DialogTitle>
            <DialogDescription className="text-right">
              {filePreview?.size ? formatFileSize(filePreview.size) + ' • ' : ''}{filePreview?.type}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-auto min-h-0 mt-4">
            {filePreview?.type?.startsWith('image/') ? (
              <img
                src={getFileUrl(filePreview)}
                alt={filePreview.name}
                className="max-w-full h-auto rounded-lg mx-auto"
              />
            ) : filePreview?.type === 'application/pdf' ? (
              <iframe
                src={getFileUrl(filePreview)}
                className="w-full h-[60vh] rounded-lg border"
                title={filePreview.name}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                <File className="w-16 h-16 mb-4 opacity-50" />
                <p>المعاينة غير متاحة لهذا النوع من الملفات</p>
              </div>
            )}
          </div>

          <DialogFooter className="mt-4 flex-row-reverse gap-2 sm:justify-start">
            <Button variant="outline" onClick={() => setFilePreview(null)}>
              إغلاق
            </Button>
            {filePreview?.url ? (
              <a href={filePreview.url} target="_blank" rel="noopener noreferrer" download={filePreview.name}>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Download className="w-4 h-4 ml-2" />
                  تحميل
                </Button>
              </a>
            ) : (
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  if (filePreview?.data) {
                    const link = document.createElement('a')
                    link.href = filePreview.data
                    link.download = filePreview.name
                    link.click()
                  }
                }}
              >
                <Download className="w-4 h-4 ml-2" />
                تحميل
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
