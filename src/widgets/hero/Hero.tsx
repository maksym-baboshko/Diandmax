import { useTranslations } from 'next-intl';
import { SectionWrapper, AnimatedReveal, Ornament } from '@/shared/ui';
import { Countdown } from '@/features/countdown/Countdown';

export function Hero() {
  const t = useTranslations('Hero');

  return (
    <SectionWrapper
      id="hero"
      fullHeight
      noPadding
      className="relative overflow-hidden"
    >
      <div className="min-h-screen w-full flex flex-col items-center justify-between relative py-12 md:pt-24 md:pb-8">
        <Ornament position='top-left' size='lg' />
        <Ornament position='top-right' size='lg' />
        <Ornament position='bottom-left' size='md' />
        <Ornament position='bottom-right' size='md' />

        <div className="flex-none h-12 md:h-24" />

        <div className='flex-1 flex flex-col items-center justify-center w-full max-w-6xl px-4 relative z-10'>
          <AnimatedReveal direction="down" delay={0.1}>
            <h1 className="heading-serif text-6xl sm:text-7xl md:text-7xl lg:text-8xl xl:text-[100px] mb-10 md:mb-16 text-text-primary text-center leading-[0.9]">
              <span className="hidden md:inline-block whitespace-nowrap">
                {t("groom_name")} <span className="text-accent italic">&</span> {t("bride_name")}
              </span>

              <span className="flex flex-col items-center md:hidden leading-tight">
                <span>{t("groom_name")}</span>
                <span className="text-accent text-5xl my-4">&</span>
                <span>{t("bride_name")}</span>
              </span>
            </h1>
          </AnimatedReveal>

          <AnimatedReveal direction='up' delay={0.2}>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-16 md:mb-24">
              <span className="text-sm md:text-base lg:text-lg tracking-widest uppercase text-text-secondary font-medium">
                {t("date")}
              </span>
              <span className="hidden md:inline-block w-1.5 h-1.5 rounded-full bg-accent/40" />
              <span className="text-sm md:text-base lg:text-lg tracking-widest uppercase text-text-secondary font-medium">
                {t("location")}
              </span>
            </div>
          </AnimatedReveal>

          <AnimatedReveal direction='up' delay={0.4}>
            <div className="scale-90 sm:scale-100">
              <Countdown />
            </div>
          </AnimatedReveal>

          <AnimatedReveal direction='up' delay={0.6} className="mt-16 md:mt-20 flex items-center gap-5">
            <div className="h-px w-20 md:w-32 bg-linear-to-r from-transparent to-accent/40" />
            <svg width="40" height="20" viewBox="0 0 36 18" fill="none" className="shrink-0 text-accent/55">
              <circle cx="12" cy="9" r="8" stroke="currentColor" strokeWidth="1.3" />
              <circle cx="24" cy="9" r="8" stroke="currentColor" strokeWidth="1.3" />
            </svg>
            <div className="h-px w-20 md:w-32 bg-linear-to-l from-transparent to-accent/40" />
          </AnimatedReveal>
        </div>

        <AnimatedReveal direction='up' delay={0.9} className="w-full relative z-10 flex-none">
          <div className='flex flex-col items-center gap-4'>
            <span className='text-xs tracking-widest uppercase text-text-secondary/60 font-medium'>
              {t('scroll_down')}
            </span>
            <div className='w-px h-16 bg-linear-to-b from-accent/50 to-transparent' />
          </div>
        </AnimatedReveal>
      </div>
    </SectionWrapper>
  );
}
