import { useState } from 'react';
import { HelpCircle, Star, Sparkles } from 'lucide-react';

export default function BrandStory() {
  const [readMore, setReadMore] = useState(false);

  return (
    <section id="brand-story" className="py-20 bg-brand-cream border-b border-brand-black/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Big Editorial Dress Image */}
          <div className="lg:col-span-5 relative">
            <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-brand-gold" />
            <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-brand-gold" />
            
            <div className="aspect-[4/5] bg-stone-100 overflow-hidden shadow-2xl rounded">
              <img
                src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=700&q=80"
                alt="Afinds high fashion shoot"
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top hover:scale-103 transition-transform duration-1000"
              />
            </div>
            
            {/* Small Floating Copysheet */}
            <div className="absolute bottom-6 right-[-20px] bg-brand-black text-brand-cream p-4 max-w-[200px] shadow-lg hidden sm:block border-l-4 border-brand-gold rounded-r">
              <p className="font-serif italic text-xs tracking-wide">
                "There is dressing up, and then there is dressing in Afinds."
              </p>
              <span className="text-[10px] uppercase tracking-widest text-brand-gold font-bold block mt-2">
                — ANONYMOUS EX-GIRLFRIEND
              </span>
            </div>
          </div>

          {/* Right Column: Copywriting & Stats */}
          <div className="lg:col-span-7 space-y-6 lg:pl-4">
            <span className="text-[10px] text-brand-gold font-bold tracking-[0.25em] uppercase block">
              OUR CONFIDENT DECLARATION
            </span>
            
            <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-brand-black leading-tight">
              We make clothes that do <br className="hidden md:inline" />
              the <span className="italic font-normal text-brand-gold underline decoration-1 decoration-brand-gold/60 underline-offset-4">talking</span> for you.
            </h2>
            
            <p className="font-sans text-sm text-stone-600 leading-relaxed tracking-wide">
              Let's be completely honest with each other. Look around. The e-commerce world is flooded with boring, overly complex organic cotton blend shirts that claim to let you "discover your true self." 
            </p>
            
            <p className="font-sans text-sm text-stone-600 leading-relaxed tracking-wide">
              We started <strong>Afinds</strong> with one humble, slightly scientifically unproven mission: <strong>make clothes worth talking about.</strong> We custom tailor each silhouette to drape perfectly, ensuring that when you step into the room, your posture sits taller, your jokes sound funnier, and yes — your wardrobe looks incredibly impressive.
            </p>

            {readMore && (
              <div className="font-sans text-sm text-stone-600 space-y-4 animate-fadeIn">
                <p className="leading-relaxed tracking-wide">
                  And as for our tagline? "If you want to have a beautiful girlfriend, buy this shirt." We know, it sounds ridiculously confident. But after shipping tens of thousands of parcels, we have received enough frantic text confirmations from clients telling us about successful first dates to make us scratch our heads. 
                </p>
                <p className="leading-relaxed tracking-wide">
                  Is it magic? Is it luxury thread weave count? Or is it simply the confidence booster of wearing streetwear that finally, actually fits your body and matches your voice? We'll let you be the judge of that.
                </p>
              </div>
            )}

            <button
              onClick={() => setReadMore(!readMore)}
              className="text-xs uppercase font-extrabold tracking-widest text-brand-gold hover:text-brand-black transition-colors underline underline-offset-6 block cursor-pointer"
            >
              {readMore ? "Read Less Story" : "Read Our Full, Unfiltered Story →"}
            </button>

            {/* Stat row: "10,000+ Happy Customers | Est. 2022 | Ships to 50+ Countries" */}
            <div className="pt-8 border-t border-brand-black/10">
              <div className="grid grid-cols-3 gap-4 text-center sm:text-left">
                <div>
                  <span className="font-serif text-lg sm:text-2xl font-bold text-brand-black block">
                    10,000+
                  </span>
                  <span className="text-[10px] text-stone-500 font-bold uppercase tracking-widest block mt-1">
                    Happy Clients
                  </span>
                </div>
                <div className="border-x border-brand-black/10 px-4">
                  <span className="font-serif text-lg sm:text-2xl font-bold text-brand-black block">
                    Est. 2022
                  </span>
                  <span className="text-[10px] text-stone-500 font-bold uppercase tracking-widest block mt-1">
                    Rome / Tokyo Drip
                  </span>
                </div>
                <div>
                  <span className="font-serif text-lg sm:text-2xl font-bold text-brand-black block">
                    50+
                  </span>
                  <span className="text-[10px] text-stone-500 font-bold uppercase tracking-widest block mt-1">
                    Countries Shipped
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
