import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'th', 'zh', 'ja', 'ko', 'ms', 'vi', 'id'],
  defaultLocale: 'th',
  localePrefix: 'as-needed',
})
