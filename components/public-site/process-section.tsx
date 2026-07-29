const steps = [
    "Kontakt",
    "Strategia",
    "Realizacja",
    "Publikacja",
    "Rozwój",
  ] as const;
  
  export function ProcessSection() {
    return (
      <section className="shell py-12">
        <div className="gradient rounded-4xl p-8 md:p-16">
          <p className="eyebrow">
            Jak pracujemy
          </p>
  
          <div className="mt-8 grid gap-4 md:grid-cols-5">
            {steps.map((step, index) => (
              <div key={step}>
                <span className="text-sm text-[#5b5cf0]">
                  0{index + 1}
                </span>
  
                <p className="mt-2 font-bold">
                  {step}
                </p>
  
                {index < steps.length - 1 && (
                  <div className="mt-4 hidden h-px bg-[#c9c8d6] md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }