import { useState, type ImgHTMLAttributes } from 'react'

interface SmartImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  label?: string
  className?: string
  imgClassName?: string
}

/**
 * Renders a real <img> when the file exists; falls back to a calm, on-brand
 * placeholder tile (labeled "사진 준비중") when it 404s. This lets the whole site
 * be wired up before final photography is delivered — dropping a real file at the
 * same path in /public/images automatically replaces the placeholder, no code change.
 */
export default function SmartImage({
  src,
  alt,
  label,
  className = '',
  imgClassName = '',
  loading = 'lazy',
  decoding = 'async',
  ...rest
}: SmartImageProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-brown-deep via-brown to-charcoal text-ivory/70 ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="flex flex-col items-center gap-2 px-4 text-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <circle cx="9" cy="11" r="1.6" stroke="currentColor" strokeWidth="1.5" />
            <path d="m4 17 5.5-5 4 3.5L18 11l3 4" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <span className="text-sm font-medium">{label ?? '사진 준비중'}</span>
        </div>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding={decoding}
      onError={() => setFailed(true)}
      className={`${className} ${imgClassName}`}
      {...rest}
    />
  )
}
