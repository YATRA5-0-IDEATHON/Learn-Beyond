import React from "react";

export default function CTA() {
  return (
    <section className="bg-primary">
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="font-display text-3xl sm:text-4xl text-white">
          Ready to build your career brick by brick?
        </h2>
        <p className="mt-4 text-white/70 text-sm sm:text-base max-w-xl mx-auto">
          Join the community that values evidence over theory. Build your Skill
          Passport and get matched with employers hiring in Nepal today.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button className="bg-accent hover:bg-accent-light text-white font-semibold text-sm px-7 py-3 rounded-full shadow-lg transition-colors">
            Create Student Account
          </button>
          <button className="bg-primary-light hover:bg-primary-light/80 text-white font-semibold text-sm px-7 py-3 rounded-full border border-white/20 transition-colors">
            Partner as a Company
          </button>
        </div>
      </div>
    </section>
  );
}
