interface BrandPanelProps {
  headline?: React.ReactNode;
  subtitle?: string;
  pills?: string[];
  testimonial?: {
    quote: string;
    name: string;
    title: string;
    initials: string;
  };
}

const defaultPills = ["Budget Builder", "Client Portal", "Item Library", "Cost Tracking"];

const defaultTestimonial = {
  quote: "Scope transformed our workflow. What used to take days of spreadsheet management now happens in minutes.",
  name: "Jennifer Martinez",
  title: "Luxe Interiors Design Studio",
  initials: "JM",
};

export function BrandPanel({
  headline,
  subtitle = "The budget management platform built for interior designers who care about every detail.",
  pills = defaultPills,
  testimonial = defaultTestimonial,
}: BrandPanelProps) {
  return (
    <div className="relative hidden w-[52%] overflow-hidden lg:block">
      {/* Mesh gradient background */}
      <div className="absolute inset-0 bg-[#0B1120]">
        <div className="absolute inset-0 animate-mesh-slow opacity-60">
          <div className="absolute -left-1/4 -top-1/4 h-[80%] w-[80%] rounded-full bg-[radial-gradient(ellipse,#1a365d_0%,transparent_70%)] blur-3xl" />
          <div className="absolute -bottom-1/4 -right-1/4 h-[70%] w-[70%] rounded-full bg-[radial-gradient(ellipse,#14b8a6_0%,transparent_70%)] blur-3xl" />
          <div className="absolute left-1/3 top-1/2 h-[50%] w-[50%] rounded-full bg-[radial-gradient(ellipse,#0d9488_0%,transparent_70%)] blur-3xl" />
        </div>
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-40" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-between p-12">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
            <span className="text-lg font-bold text-white">S</span>
          </div>
          <span className="text-lg font-semibold text-white/90">Scope</span>
        </div>

        {/* Hero text */}
        <div className="max-w-lg">
          {headline ?? (
            <h1 className="text-[2.75rem] font-semibold leading-[1.15] tracking-tight text-white">
              Beautiful budgets,
              <br />
              <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
                effortless approvals.
              </span>
            </h1>
          )}
          <p className="mt-5 text-lg leading-relaxed text-white/60">{subtitle}</p>

          {pills.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {pills.map((pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70 backdrop-blur-sm"
                >
                  {pill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Testimonial */}
        {testimonial && (
          <div className="max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <p className="text-sm leading-relaxed text-white/70">
              "{testimonial.quote}"
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-400 text-xs font-semibold text-white">
                {testimonial.initials}
              </div>
              <div>
                <p className="text-sm font-medium text-white/90">{testimonial.name}</p>
                <p className="text-xs text-white/50">{testimonial.title}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
