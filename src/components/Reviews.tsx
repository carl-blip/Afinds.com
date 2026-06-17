import { Star, ShieldCheck } from 'lucide-react';
import { reviews } from '../data';

export default function Reviews() {
  return (
    <section id="reviews-section" className="py-20 bg-stone-50 border-b border-brand-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Caption */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] text-brand-gold font-bold tracking-[0.25em] uppercase block mb-2">
            THE DATE-PROVEN PERFORMANCE FEEDBACK
          </span>
          <h2 className="font-serif text-3xl md:text-4.5xl font-bold tracking-tight text-brand-black">
            Reviews Worth Reporting
          </h2>
          <p className="font-sans text-xs text-stone-500 mt-2">
            Actual verified feedback from customers who successfully upgraded their luck.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {reviews.map((r) => (
            <div 
              key={r.id} 
              className="bg-brand-cream border border-brand-black/5 p-8 rounded shadow-xs relative flex flex-col justify-between group hover:border-brand-gold/40 hover:shadow-lg transition-all duration-300"
            >
              <div>
                {/* Visual Avatar Initials */}
                <div className="flex items-center gap-3.5 mb-6">
                  <div className="w-10 h-10 rounded-full bg-brand-black text-brand-gold flex items-center justify-center font-bold text-xs select-none">
                    {r.initials}
                  </div>
                  <div>
                    <h4 className="font-sans text-sm font-bold text-brand-black flex items-center gap-1">
                      {r.name}
                      {r.verified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" title="Verified Wearer" />
                      )}
                    </h4>
                    <span className="text-[10px] text-stone-400 block">{r.date}</span>
                  </div>
                </div>

                {/* Stars Indicator */}
                <div className="flex text-brand-gold mb-4">
                  {[...Array(5)].map((_, idx) => (
                    <Star 
                      key={idx} 
                      className={`w-4 h-4 ${idx < r.rating ? 'fill-brand-gold' : ''}`} 
                    />
                  ))}
                </div>

                {/* Review Copy text */}
                <p className="font-sans text-xs sm:text-sm text-stone-600 leading-relaxed italic tracking-wide">
                  "{r.text}"
                </p>
              </div>

              {/* Verified Wearer Footer Label */}
              <div className="pt-6 mt-6 border-t border-brand-black/5 flex items-center justify-between text-[10px] font-sans font-bold tracking-wider text-brand-gold uppercase">
                <span>Verified Wearer</span>
                <span className="text-stone-400">Rating: 10/10</span>
              </div>
            </div>
          ))}
        </div>

        {/* Brand partners & Payment trust icons row */}
        <div className="border-t border-brand-black/10 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="font-sans text-[10px] text-stone-500 font-bold uppercase tracking-[0.2em] text-center md:text-left">
            SECURE BANK-GRADE ENCRYPTED CHECKOUTS
          </p>
          
          {/* Custom SVG logo row */}
          <div className="flex items-center gap-6 text-stone-400">
            {/* Visa Logo */}
            <svg className="w-12 h-6 fill-current hover:text-brand-gold transition-colors" viewBox="0 0 24 8" aria-hidden="true">
              <path d="M0 0h3.5l1.8 4.8L6.8 0H10l-3.2 8H3.5L1.8 3.2 0.8 7.5c0-.1-.1-.3-.2-.5L0 0zm10 0h2.5l1.6 8h-2.5l-1.6-8zm4.5 4c0-1.5.8-2.5 2-2.5.6 0 1 .3 1.2.6l.2-.5H20l-.3 1.5c0 .1-.1.2-.2.3l-1.5 4.6h-2.5l1-3.2c-.3 0-.5-.1-.7-.1-.6 0-1 .4-1 1.1 0 .2.1.4.2.6L14.5 4z" />
            </svg>
            {/* Mastercard Logo */}
            <svg className="w-10 h-6 fill-current hover:text-brand-gold transition-colors" viewBox="0 0 24 15" aria-hidden="true">
              <circle cx="7" cy="7.5" r="7" />
              <circle cx="17" cy="7.5" r="7" className="opacity-70" />
            </svg>
            {/* PayPal Logo */}
            <svg className="w-12 h-6 fill-current hover:text-brand-gold transition-colors" viewBox="0 0 24 10" aria-hidden="true">
              <path d="M4 1h4c2.5 0 3 1.5 2 3.5S6.5 7.5 4 7.5H2l-1 2H0l2.5-9L4 1zM4 6.5h2c1 0 1.5-.5 2-1.5s-.3-2-1.5-2H4.5l-1 3.5z" />
              <path d="M10 2.5h4c2.5 0 3 1.5 2 3.5s-3.5 3-6 3H8l-1 2H6l2.5-9L10 2.5zM10 8h2c1 0 1.5-.5 2-1.5s-.3-2-1.5-2H10.5l-1 3.5z" className="opacity-85" />
            </svg>
            {/* Apple Pay Logo */}
            <svg className="w-12 h-6 fill-current hover:text-brand-gold transition-colors" viewBox="0 0 24 10" aria-hidden="true">
              <path d="M2.5 4.5c0-1.8 1.4-3.2 3.2-3.2s3.2 1.4 3.2 3.2-1.4 3.2-3.2 3.2-3.2-1.4-3.2-3.2zm2 0c0 .8.6 1.4 1.2 1.4s1.2-.6 1.2-1.4c0-.8-.6-1.4-1.2-1.4s-1.2.6-1.2 1.4z" />
              <path d="M11 2v6h2V6h2V4h-2V2h-2zM17.5 1h-2v8h2v-3h2V4h-2V1z" />
            </svg>
          </div>
        </div>

      </div>
    </section>
  );
}
