import { RotateCcw, ShieldCheck, Leaf, Headphones } from 'lucide-react';

export default function TrustBar() {
  const trusts = [
    {
      icon: RotateCcw,
      title: "FREE & EASY RETURNS",
      desc: "30-day trial period, zero stress"
    },
    {
      icon: ShieldCheck,
      title: "100% SECURE CHECKOUT",
      desc: "Encrypted bank-grade servers"
    },
    {
      icon: Leaf,
      title: "SUSTAINABLY MADE",
      desc: "Good for the planet & your style"
    },
    {
      icon: Headphones,
      title: "24/7 VIP CLIENT ASSIST",
      desc: "Fast support from actual humans"
    }
  ];

  return (
    <div id="trust-bar" className="bg-brand-cream border-y border-brand-black/10 py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {trusts.map((t, idx) => (
            <div 
              key={idx} 
              className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-3.5 group p-2 md:p-3 hover:bg-stone-50 transition-all rounded"
            >
              <div className="flex-shrink-0 bg-brand-black text-brand-cream p-3 rounded-full group-hover:bg-brand-gold group-hover:text-brand-black transition-colors duration-300">
                <t.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-sans text-xs md:text-sm font-bold tracking-[0.12em] text-brand-black uppercase">
                  {t.title}
                </h3>
                <p className="font-sans text-xs text-stone-500 mt-0.5 tracking-wide">
                  {t.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
