import React from "react";

const MENTORS = [
  {
    name: "Anjali Shrestha",
    role: "Senior Accountant @ Nabil Bank",
    tags: ["Audit", "FinTech", "Leadership"],
    rating: "4.9",
    reviews: "120 reviews",
    badge: "Expert",
    badgeColor: "bg-success text-white",
    img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Rajesh Thapa",
    role: "Full Stack Developer @ Fusemachines",
    tags: ["React", "AWS", "AI"],
    rating: "5.0",
    reviews: "84 reviews",
    badge: "Pro",
    badgeColor: "bg-primary text-white",
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Sita Gurung",
    role: "HR Manager @ Chaudhary Group",
    tags: ["Talent Acquisition", "Culture"],
    rating: "4.8",
    reviews: "45 reviews",
    badge: "Intermediate",
    badgeColor: "bg-accent text-white",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
  },
];

export default function Mentors() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center">
        <h2 className="font-display text-2xl sm:text-3xl text-ink">Meet Your Mentors</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Learn from Nepal's top professionals working at leading organizations.
        </p>
      </div>

      <div className="mt-12 grid md:grid-cols-3 gap-6">
        {MENTORS.map((m) => (
          <div
            key={m.name}
            className="bg-surface border border-line rounded-lg overflow-hidden shadow-card hover:shadow-lg transition-shadow"
          >
            <div className="relative">
              <img src={m.img} alt={m.name} className="w-full h-40 object-cover" />
              <span
                className={`absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-1 rounded-full ${m.badgeColor}`}
              >
                {m.badge}
              </span>
            </div>

            <div className="p-5">
              <h3 className="font-semibold text-ink">{m.name}</h3>
              <p className="mt-0.5 text-sm text-ink-soft">{m.role}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {m.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium bg-surface-muted text-ink-soft px-2.5 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#F5A623">
                    <path d="M12 2l2.4 7.4H22l-6 4.5 2.3 7.1-6.3-4.6L5.7 21l2.3-7.1-6-4.5h7.6L12 2z" />
                  </svg>
                  <span className="font-semibold text-ink">{m.rating}</span>
                  <span className="text-ink-soft">({m.reviews})</span>
                </div>
                <a href="#" className="text-sm font-medium text-primary hover:underline">
                  View Tasks
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
