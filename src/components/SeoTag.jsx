import { usePageSeo } from './useSeo.js'

// Đặt SEO cho 1 trang qua JSX — an toàn khi nằm trong nhánh điều kiện (hook chỉ chạy khi nhánh này render).
export default function SeoTag(props) { usePageSeo(props); return null }
