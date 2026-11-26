import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface GalleryProps {
  images: string[]
  /** Project title, used to build per-image alt text. */
  alt: string
}

/** Strip of screenshot thumbnails with a click-to-expand lightbox. Used on project detail pages. */
export default function Gallery({ images, alt }: GalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const close = useCallback(() => setOpenIndex(null), [])
  const step = useCallback(
    (delta: number) => {
      setOpenIndex((i) => (i === null ? i : (i + delta + images.length) % images.length))
    },
    [images.length],
  )

  useEffect(() => {
    if (openIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') step(1)
      else if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openIndex, close, step])

  if (images.length === 0) return null

  return (
    <>
      <ul className="gallery-strip">
        {images.map((src, i) => (
          <li key={src}>
            <button
              type="button"
              className="gallery-thumb"
              onClick={() => setOpenIndex(i)}
              aria-label={`View ${alt} screenshot ${i + 1} of ${images.length}`}
            >
              <img src={src} alt="" loading="lazy" />
            </button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {openIndex !== null && (
          <motion.div
            className="gallery-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={`${alt} screenshots`}
          >
            <img
              className="gallery-lightbox-image"
              src={images[openIndex]}
              alt={`${alt} screenshot ${openIndex + 1} of ${images.length}`}
              onClick={(e) => e.stopPropagation()}
            />
            <button type="button" className="gallery-close" onClick={close} aria-label="Close">
              ×
            </button>
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  className="gallery-nav gallery-prev"
                  onClick={(e) => {
                    e.stopPropagation()
                    step(-1)
                  }}
                  aria-label="Previous screenshot"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="gallery-nav gallery-next"
                  onClick={(e) => {
                    e.stopPropagation()
                    step(1)
                  }}
                  aria-label="Next screenshot"
                >
                  ›
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
