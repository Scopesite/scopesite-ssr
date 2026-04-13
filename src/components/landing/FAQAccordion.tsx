'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FadeInOnScroll } from '@/components/animations';

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
  theme?: 'light' | 'dark';
}

function FAQAccordionItem({ question, answer, isOpen, onClick, theme = 'light' }: FAQAccordionItemProps) {
  const isLight = theme === 'light';
  
  return (
    <div className={`border-b ${isLight ? 'border-brand-navy/10' : 'border-white/10'} last:border-b-0`}>
      <button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between text-left group"
        aria-expanded={isOpen}
      >
        <span className={`${isLight ? 'text-brand-navy' : 'text-white'} font-medium text-lg pr-8`}>
          {question}
        </span>
        <ChevronDown 
          className={`w-6 h-6 text-brand-gold transition-transform duration-300 flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`} 
          aria-hidden="true"
        />
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-out ${
          isOpen ? 'max-h-[500px] pb-6' : 'max-h-0'
        }`}
        role="region"
        aria-hidden={!isOpen}
      >
        <p className={`faq-answer ${isLight ? 'text-muted' : 'text-white/70'} leading-relaxed whitespace-pre-line`}>
          {answer}
        </p>
      </div>
    </div>
  );
}

interface FAQAccordionProps {
  items: FAQItem[];
  theme?: 'light' | 'dark';
  defaultOpen?: number;
  className?: string;
}

export function FAQAccordion({ items, theme = 'light', defaultOpen = 0, className = '' }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen);
  const isLight = theme === 'light';

  return (
    <div 
      className={`${isLight ? 'bg-white' : 'bg-brand-graphite/50'} rounded-2xl p-6 md:p-8 ${className}`}
    >
      {items.map((faq, index) => (
        <FAQAccordionItem
          key={index}
          question={faq.question}
          answer={faq.answer}
          isOpen={openIndex === index}
          onClick={() => setOpenIndex(openIndex === index ? null : index)}
          theme={theme}
        />
      ))}
    </div>
  );
}

interface FAQSectionProps {
  title?: string;
  subtitle?: string;
  items: FAQItem[];
  theme?: 'light' | 'dark';
  className?: string;
}

export function FAQSection({ 
  title = 'Frequently Asked Questions',
  subtitle,
  items, 
  theme = 'dark',
  className = ''
}: FAQSectionProps) {
  const isDark = theme === 'dark';

  return (
    <section className={`${isDark ? 'bg-brand-navy' : 'section-white'} py-section ${className}`}>
      <div className="container-content">
        <FadeInOnScroll>
          <div className="text-center mb-8 md:mb-12">
            <h2 className={`${isDark ? 'text-white' : 'text-brand-navy'} mb-4 text-xl sm:text-2xl md:text-h2`}>
              {title}
            </h2>
            {subtitle && (
              <p className={`${isDark ? 'text-white/70' : 'text-brand-navy/70'} max-w-2xl mx-auto`}>
                {subtitle}
              </p>
            )}
          </div>
        </FadeInOnScroll>
        
        <FadeInOnScroll delay={0.2}>
          <div className="max-w-3xl mx-auto">
            <FAQAccordion items={items} theme={isDark ? 'dark' : 'light'} />
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
