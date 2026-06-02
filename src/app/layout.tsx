import type { Metadata, Viewport } from "next"
import { Inter, Noto_Sans_Thai } from "next/font/google"
import "./globals.css"
import { WebSiteSchema } from "@/components/seo/medical-schema"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-thai",
  subsets: ["thai"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://healthcompass.th"

export const viewport: Viewport = {
  themeColor: "#0d9488",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    template: "%s | FirstScreen",
    default: "FirstScreen — รู้ความเสี่ยง ก่อนโรครู้จักคุณ",
  },

  description:
    "แพลตฟอร์มนำทางสุขภาพเชิงป้องกันสำหรับประเทศไทย ประเมินความเสี่ยงโรค วางแผนตรวจคัดกรอง ตรวจอาการ และเข้าถึงข้อมูลสุขภาพที่อ้างอิงหลักฐานทางการแพทย์",

  keywords: [
    "สุขภาพ", "ตรวจสุขภาพ", "ประเมินความเสี่ยง", "ตรวจอาการ",
    "มะเร็ง", "เบาหวาน", "ความดันโลหิตสูง", "โรคหัวใจ",
    "health screening Thailand", "preventive health", "risk assessment",
    "Thailand health", "สุขภาพเชิงป้องกัน", "firstscreen",
  ],

  authors: [{ name: "FirstScreen Team", url: BASE_URL }],
  creator: "FirstScreen",
  publisher: "FirstScreen",

  // hreflang — 8 languages as planned
  alternates: {
    canonical: BASE_URL,
    languages: {
      "th": `${BASE_URL}/th`,
      "en": `${BASE_URL}/en`,
      "zh": `${BASE_URL}/zh`,
      "ja": `${BASE_URL}/ja`,
      "ko": `${BASE_URL}/ko`,
      "ms": `${BASE_URL}/ms`,
      "vi": `${BASE_URL}/vi`,
      "id": `${BASE_URL}/id`,
      "x-default": `${BASE_URL}/th`,
    },
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "th_TH",
    alternateLocale: ["en_US", "zh_CN", "ja_JP", "ko_KR"],
    siteName: "FirstScreen",
    title: "FirstScreen — รู้ความเสี่ยง ก่อนโรครู้จักคุณ",
    description: "ประเมินความเสี่ยงโรค วางแผนตรวจคัดกรอง ข้อมูลอ้างอิงหลักฐาน Thailand-first",
    url: BASE_URL,
    images: [
      {
        url: `${BASE_URL}/og?title=รู้ความเสี่ยง ก่อนโรครู้จักคุณ&subtitle=แพลตฟอร์มนำทางสุขภาพเชิงป้องกัน Thailand-first`,
        width: 1200,
        height: 630,
        alt: "FirstScreen — แพลตฟอร์มนำทางสุขภาพเชิงป้องกัน",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "FirstScreen — รู้ความเสี่ยง ก่อนโรครู้จักคุณ",
    description: "แพลตฟอร์มนำทางสุขภาพเชิงป้องกัน ประเมินความเสี่ยง วางแผนตรวจคัดกรอง",
    images: [`${BASE_URL}/og?title=รู้ความเสี่ยง ก่อนโรครู้จักคุณ`],
  },

  verification: {
    // Add when verified: google: "xxxx", yandex: "xxxx"
  },

  category: "health",

  icons: {
    icon: [
      { url: '/brand/firstscreen-icon.png', type: 'image/png' },
      { url: '/brand/firstscreen-icon.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/brand/firstscreen-icon.png',
  },

  // YMYL (Your Money or Your Life) — medical content signals
  other: {
    "rating": "general",
    "revisit-after": "7 days",
    "language": "th",
    "content-language": "th, en",
    "geo.region": "TH",
    "geo.country": "Thailand",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="th"
      className={`${inter.variable} ${notoSansThai.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Favicon — FirstScreen icon (multiple sizes for all browsers) */}
        <link rel="icon" href="/brand/firstscreen-icon.png" type="image/png" sizes="any" />
        <link rel="icon" href="/brand/firstscreen-icon.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/brand/firstscreen-icon.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/apple-icon.png" sizes="180x180" />
        <link rel="shortcut icon" href="/brand/firstscreen-icon.png" />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        {/* Global WebSite JSON-LD */}
        <WebSiteSchema baseUrl={BASE_URL} />
        {children}
      </body>
    </html>
  )
}
