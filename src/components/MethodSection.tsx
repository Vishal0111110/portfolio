import ChapterSection from '@/components/ChapterSection'
import { CARD_HOVER } from '@/lib/cardHover'
import type { ResumeData } from '@/data/resume'

type Method = ResumeData['method']

export default function MethodSection({ method }: { method: Method }) {
  return (
    <ChapterSection
      sectionId="method"
      titleId="method-heading"
      eyebrow={method.eyebrow}
      title={method.title}
      blurb={method.blurb}
    >
      <div className={`glass-mono rounded-xl p-4 sm:p-5 space-y-4 ${CARD_HOVER}`}>
        {method.paragraphs.map((paragraph, i) => (
          <p key={i} className="text-sm sm:text-[15px] text-[var(--color-off-white)] leading-[1.58] font-light tracking-[0.003em]">
            {paragraph}
          </p>
        ))}
      </div>
    </ChapterSection>
  )
}
