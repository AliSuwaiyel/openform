import { QuestionType, QuestionConfig } from './database.types'
import {
  Type,
  AlignLeft,
  List,
  CheckSquare,
  Mail,
  Phone,
  Hash,
  Calendar,
  Star,
  Gauge,
  ThumbsUp,
  Upload,
  Link,
  LucideIcon
} from 'lucide-react'

export interface QuestionTypeInfo {
  type: QuestionType
  label: string
  description: string
  icon: LucideIcon
  defaultConfig: Partial<QuestionConfig>
}

export const questionTypes: QuestionTypeInfo[] = [
  {
    type: 'short_text',
    label: 'نص قصير',
    description: 'مدخل نصي من سطر واحد',
    icon: Type,
    defaultConfig: {
      placeholder: 'اكتب إجابتك هنا...',
    },
  },
  {
    type: 'long_text',
    label: 'نص طويل',
    description: 'مساحة نصية متعددة الأسطر',
    icon: AlignLeft,
    defaultConfig: {
      placeholder: 'اكتب إجابتك هنا...',
    },
  },
  {
    type: 'dropdown',
    label: 'قائمة منسدلة',
    description: 'اختر خياراً واحداً من القائمة',
    icon: List,
    defaultConfig: {
      options: ['خيار 1', 'خيار 2', 'خيار 3'],
    },
  },
  {
    type: 'checkboxes',
    label: 'مربعات اختيار',
    description: 'اختر خيارات متعددة من القائمة',
    icon: CheckSquare,
    defaultConfig: {
      options: ['خيار 1', 'خيار 2', 'خيار 3'],
    },
  },
  {
    type: 'email',
    label: 'البريد الإلكتروني',
    description: 'مدخل لعنوان البريد الإلكتروني',
    icon: Mail,
    defaultConfig: {
      placeholder: 'name@example.com',
    },
  },
  {
    type: 'phone',
    label: 'الهاتف',
    description: 'مدخل لرقم الهاتف',
    icon: Phone,
    defaultConfig: {
      placeholder: '+1 (555) 000-0000',
    },
  },
  {
    type: 'number',
    label: 'رقم',
    description: 'مدخل رقمي',
    icon: Hash,
    defaultConfig: {
      placeholder: '0',
    },
  },
  {
    type: 'date',
    label: 'التاريخ',
    description: 'اختيار التاريخ',
    icon: Calendar,
    defaultConfig: {},
  },
  {
    type: 'rating',
    label: 'التقييم',
    description: 'تقييم بالنجوم (1-5)',
    icon: Star,
    defaultConfig: {
      minValue: 1,
      maxValue: 5,
    },
  },
  {
    type: 'opinion_scale',
    label: 'مقياس الرأي',
    description: 'مقياس رقمي (1-10)',
    icon: Gauge,
    defaultConfig: {
      minValue: 1,
      maxValue: 10,
    },
  },
  {
    type: 'yes_no',
    label: 'نعم / لا',
    description: 'خيار بسيط بنعم أو لا',
    icon: ThumbsUp,
    defaultConfig: {},
  },
  {
    type: 'file_upload',
    label: 'رفع ملف',
    description: 'رفع صور أو ملفات PDF',
    icon: Upload,
    defaultConfig: {
      allowedFileTypes: ['image/*', 'application/pdf'],
      maxFileSize: 10, // MB
    },
  },
  {
    type: 'url',
    label: 'رابط الموقع',
    description: 'مدخل رابط',
    icon: Link,
    defaultConfig: {
      placeholder: 'https://example.com',
    },
  },
]

export function getQuestionTypeInfo(type: QuestionType): QuestionTypeInfo | undefined {
  return questionTypes.find(qt => qt.type === type)
}

export function createDefaultQuestion(type: QuestionType): QuestionConfig {
  const typeInfo = getQuestionTypeInfo(type)
  const id = crypto.randomUUID()

  return {
    id,
    type,
    title: '',
    description: '',
    required: false,
    ...typeInfo?.defaultConfig,
  }
}

