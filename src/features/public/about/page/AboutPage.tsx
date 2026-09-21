import { Globe2, HandCoins, Handshake, Target } from "lucide-react";
import Banner from "../../components/Banner";

const PILLARS = [
  {
    icon: Target,
    title: "Trade Facilitation",
    description: "Modernizing customs and trade systems to widen market access for Pacific exporters.",
  },
  {
    icon: Globe2,
    title: "Digital Economy",
    description: "Expanding connectivity and e-commerce enablement so SMEs can sell online with confidence.",
  },
  {
    icon: Handshake,
    title: "Regional Cooperation",
    description: "Harmonizing standards and sharing knowledge across six Pacific Island countries.",
  },
  {
    icon: HandCoins,
    title: "Inclusive Growth",
    description: "Prioritizing women-led businesses, youth entrepreneurs, and underserved communities.",
  },
];

export default function AboutPage() {
  return (
    <div className="mb-20">
      <Banner
        title="About"
        description="A regional initiative supporting e-commerce development across the Pacific"
        image="https://pacificecommerce.org/wp-content/uploads/2022/04/banner-450.png"
      />

      <div className="flex flex-col items-center justify-center">
        <div className="w-5/7 py-14 space-y-16">
          <div>
            <h1 className="third-head-label">Our Mission</h1>
            <h3 className="mt-6 leading-relaxed">
              The Pacific E-commerce Initiative supports national governments, implementing agencies and
              donor partners across the Pacific in tracking progress on their national E-commerce
              Strategies and Roadmaps. It brings together programs, projects, Key Priority Areas and
              indicators from six countries into a single, transparent view of regional development
              impact.
            </h3>
          </div>

          <div>
            <h1 className="third-head-label mb-10">What We Focus On</h1>
            <div className="grid sm:grid-cols-2 gap-8">
              {PILLARS.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex gap-4 rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
                  <Icon className="w-8 h-8 text-primary shrink-0" />
                  <div>
                    <h3 className="font-semibold text-secondary text-lg mb-1">{title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h1 className="third-head-label">How It Works</h1>
            <h3 className="mt-6 leading-relaxed">
              Each country's KPI framework is built from Key Priority Areas, broken down into Strategic
              Outputs, Measures and Indicators. Programs and projects are mapped against this framework,
              so progress reported at the project level rolls up automatically into country and regional
              dashboards - the same numbers shown on the <a href="/statistics" className="text-primary underline">Statistics</a> and{" "}
              <a href="/development/progress" className="text-primary underline">Progress</a> pages.
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
