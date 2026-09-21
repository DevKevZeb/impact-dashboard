/**
 * Single source of truth for demo-mode fake data.
 *
 * Everything below is cross-referenced by id (countries <-> KPAs <-> strategic
 * outputs <-> measures <-> indicators, programs <-> projects <-> donors/agencies,
 * etc.) so every screen in the app tells a consistent story. Arrays are mutable
 * (`let`, not `const`) because mock CRUD handlers push/splice/update them in
 * place to simulate a real backend for the lifetime of the browser session.
 *
 * Real feature types are imported and reused wherever the shape matches
 * exactly, per the project rule of never inventing parallel type definitions.
 */
import type { Country } from "@/features/country/types/CountryType";
import type { Currency } from "@/features/country/types/CurrencyType";
import type { Kpa } from "@/features/kpa/types/KpaType";
import type { StrategicOutput } from "@/features/strategic-output/types/StrategicOutput";
import type { Measure } from "@/features/measures/types/measureTypes";
import type { IndicatorType } from "@/features/indicator-type/types/IndicatorTypeType";
import type { Donor } from "@/features/donors/types/donor.types";
import type { Agency } from "@/features/agency/types/agency.types";
import type { Beneficiary } from "@/features/beneficiaries/types/beneficiaries.types";
import type { ProjectState } from "@/features/project-states/types/projectstate.types";
import type { ProgramState } from "@/features/program-states/types/programState.types";
import type { Sdg } from "@/features/sdgs/types/sdg.types";
import type { Contact, Program } from "@/features/programs/types/program.types";
import type { Project } from "@/features/projects/types/project.types";
import type { Role, Permission } from "@/features/roles-permissions/types/rolesPermissions.types";
import type { UserDTO } from "@/features/users/mappers/user.mapper";
import type { CountryDashboardShare } from "@/features/dashboard/country-dashboard/country-dashboard-share/types/countryDashboardShare.types";
import { SCOPES } from "@/features/auth/utils/permissions";

// ---------------------------------------------------------------------------
// Currencies & Countries
// ---------------------------------------------------------------------------

export const currencies: Currency[] = [
  { id: 1, code: "FJD" },
  { id: 2, code: "WST" },
  { id: 3, code: "TOP" },
  { id: 4, code: "VUV" },
  { id: 5, code: "SBD" },
  { id: 6, code: "PGK" },
];

export const countries: (Country & { active: boolean })[] = [
  { id: 1, name: "Fiji", active: true, currency: currencies[0] },
  { id: 2, name: "Samoa", active: true, currency: currencies[1] },
  { id: 3, name: "Tonga", active: true, currency: currencies[2] },
  { id: 4, name: "Vanuatu", active: false, currency: currencies[3] },
  { id: 5, name: "Solomon Islands", active: false, currency: currencies[4] },
  { id: 6, name: "Papua New Guinea", active: true, currency: currencies[5] },
];

export function findCountry(id: number) {
  return countries.find((c) => c.id === id);
}

// ---------------------------------------------------------------------------
// KPAs / Strategic Outputs / Measures / Indicators
// ---------------------------------------------------------------------------

export const kpas: Kpa[] = [
  { id: 1, name: "Trade Facilitation & Market Access", implementation: 0 },
  { id: 2, name: "Digital Economy & Connectivity", implementation: 0 },
  { id: 3, name: "Private Sector Development", implementation: 0 },
  { id: 4, name: "Climate & Disaster Resilience", implementation: 0 },
  { id: 5, name: "Gender Equality & Social Inclusion", implementation: 0 },
  { id: 6, name: "Regional Integration & Cooperation", implementation: 0 },
  { id: 7, name: "Institutional Capacity Building", implementation: 0 },
  { id: 8, name: "Innovation & Entrepreneurship", implementation: 0 },
];

export const indicatorTypes: IndicatorType[] = [
  { id: 1, name: "Top-down", is_bottom_up: false },
  { id: 2, name: "Bottom-up", is_bottom_up: true },
];

interface IndicatorTemplate {
  name: string;
  typeId: number;
  target: number;
}
interface MeasureTemplate {
  name: string;
  indicators: IndicatorTemplate[];
}
interface StrategicOutputTemplate {
  name: string;
  measures: MeasureTemplate[];
}
interface KpaTemplate {
  kpaId: number;
  strategicOutputs: StrategicOutputTemplate[];
}

// Canonical KPA -> Strategic Output -> Measure -> Indicator framework, shared
// across every country that has adopted a given KPA (mirrors how Pacific
// regional M&E frameworks reuse the same indicator set across countries).
const kpaTemplates: KpaTemplate[] = [
  {
    kpaId: 1,
    strategicOutputs: [
      {
        name: "Streamlined customs clearance processes",
        measures: [
          { name: "Reduction in average clearance time", indicators: [{ name: "Average customs clearance time (days)", typeId: 2, target: 2 }] },
          { name: "Adoption of single-window trade systems", indicators: [{ name: "Countries live on single-window platform", typeId: 1, target: 6 }] },
        ],
      },
      {
        name: "Expanded market access agreements",
        measures: [
          { name: "New trade agreements executed", indicators: [{ name: "Trade agreements signed", typeId: 1, target: 5 }] },
          { name: "Export diversification", indicators: [{ name: "New export product lines certified", typeId: 2, target: 12 }] },
        ],
      },
    ],
  },
  {
    kpaId: 2,
    strategicOutputs: [
      {
        name: "Improved rural internet connectivity",
        measures: [
          { name: "Broadband coverage expansion", indicators: [{ name: "% of rural population with broadband access", typeId: 2, target: 75 }] },
          { name: "Digital literacy uptake", indicators: [{ name: "Citizens trained in digital skills", typeId: 2, target: 4000 }] },
        ],
      },
      {
        name: "E-commerce enablement for SMEs",
        measures: [
          { name: "SME online storefront adoption", indicators: [{ name: "SMEs with active online storefront", typeId: 2, target: 300 }] },
          { name: "Digital payments adoption", indicators: [{ name: "Merchants accepting digital payments", typeId: 2, target: 500 }] },
        ],
      },
    ],
  },
  {
    kpaId: 3,
    strategicOutputs: [
      {
        name: "Strengthened SME competitiveness",
        measures: [
          { name: "Access to business development services", indicators: [{ name: "SMEs receiving advisory support", typeId: 2, target: 250 }] },
          { name: "Formalization of informal businesses", indicators: [{ name: "Newly registered micro-enterprises", typeId: 2, target: 180 }] },
        ],
      },
      {
        name: "Improved investment climate",
        measures: [
          { name: "Reduced business registration time", indicators: [{ name: "Average business registration time (days)", typeId: 2, target: 5 }] },
          { name: "Foreign direct investment facilitation", indicators: [{ name: "FDI facilitation approvals processed", typeId: 1, target: 40 }] },
        ],
      },
    ],
  },
  {
    kpaId: 4,
    strategicOutputs: [
      {
        name: "Climate-resilient infrastructure",
        measures: [
          { name: "Coastal protection works completed", indicators: [{ name: "Km of coastal protection upgraded", typeId: 2, target: 30 }] },
          { name: "Disaster early-warning coverage", indicators: [{ name: "Communities with early-warning systems", typeId: 2, target: 60 }] },
        ],
      },
      {
        name: "Community disaster preparedness",
        measures: [
          { name: "Disaster response training", indicators: [{ name: "Community responders trained", typeId: 2, target: 900 }] },
          { name: "Resilience fund disbursement", indicators: [{ name: "Resilience grants disbursed", typeId: 1, target: 55 }] },
        ],
      },
    ],
  },
  {
    kpaId: 5,
    strategicOutputs: [
      {
        name: "Women's economic empowerment",
        measures: [
          { name: "Women-led business support", indicators: [{ name: "Women-led SMEs financed", typeId: 2, target: 150 }] },
          { name: "Leadership representation", indicators: [{ name: "Women in program leadership roles", typeId: 1, target: 35 }] },
        ],
      },
      {
        name: "Inclusive access to services",
        measures: [
          { name: "Accessibility upgrades", indicators: [{ name: "Public facilities with accessibility upgrades", typeId: 2, target: 45 }] },
          { name: "Youth participation", indicators: [{ name: "Youth engaged in program activities", typeId: 2, target: 1200 }] },
        ],
      },
    ],
  },
  {
    kpaId: 6,
    strategicOutputs: [
      {
        name: "Harmonized regional trade standards",
        measures: [
          { name: "Standards alignment", indicators: [{ name: "Product standards harmonized regionally", typeId: 1, target: 22 }] },
          { name: "Cross-border cooperation agreements", indicators: [{ name: "Active cross-border MOUs", typeId: 1, target: 14 }] },
        ],
      },
      {
        name: "Regional knowledge sharing",
        measures: [
          { name: "Joint regional forums", indicators: [{ name: "Regional forums convened", typeId: 1, target: 8 }] },
          { name: "Shared data platforms", indicators: [{ name: "Countries contributing to shared data platform", typeId: 1, target: 6 }] },
        ],
      },
    ],
  },
  {
    kpaId: 7,
    strategicOutputs: [
      {
        name: "Strengthened public sector M&E capacity",
        measures: [
          { name: "M&E staff trained", indicators: [{ name: "Government officers trained in M&E", typeId: 2, target: 120 }] },
          { name: "M&E systems adopted", indicators: [{ name: "Ministries using the ePulse dashboard", typeId: 1, target: 9 }] },
        ],
      },
      {
        name: "Improved policy coordination",
        measures: [
          { name: "Inter-agency working groups", indicators: [{ name: "Active inter-agency working groups", typeId: 1, target: 10 }] },
          { name: "Policy review cycles completed", indicators: [{ name: "Annual policy reviews completed", typeId: 1, target: 4 }] },
        ],
      },
    ],
  },
  {
    kpaId: 8,
    strategicOutputs: [
      {
        name: "Startup ecosystem development",
        measures: [
          { name: "Incubation program reach", indicators: [{ name: "Startups incubated", typeId: 2, target: 60 }] },
          { name: "Access to early-stage finance", indicators: [{ name: "Startups securing seed funding", typeId: 2, target: 25 }] },
        ],
      },
      {
        name: "Innovation culture in public services",
        measures: [
          { name: "Innovation challenges run", indicators: [{ name: "Public-sector innovation challenges held", typeId: 1, target: 6 }] },
          { name: "Youth entrepreneurship uptake", indicators: [{ name: "Youth entrepreneurs graduating programs", typeId: 2, target: 400 }] },
        ],
      },
    ],
  },
];

// Which KPAs each country has adopted so far (deliberately uneven, like a real rollout).
const countryKpaAssignments: Record<number, number[]> = {
  1: [1, 2, 3, 4, 5, 6, 7, 8], // Fiji - fully onboarded
  2: [1, 2, 3, 4, 5, 6, 7, 8], // Samoa - fully onboarded
  3: [1, 2, 3, 4, 5, 6, 7], // Tonga
  4: [1, 2, 3, 4], // Vanuatu
  5: [1, 2, 5, 7], // Solomon Islands
  6: [1, 3, 6], // Papua New Guinea
};

export interface SeedCountryKpa {
  id_ck: number;
  country_id: number;
  id_kpa: number;
  name: string;
  strategic_outputs_count: number;
  measures_count: number;
  indicators_count: number;
}

export interface SeedStrategicOutput extends Omit<StrategicOutput, "country_kpa_id"> {
  id_ck: number;
}

export interface SeedMeasure extends Measure {
  strategic_output_id: number;
}

export interface SeedIndicator {
  id: number;
  name: string;
  target: number;
  actual_value: number;
  type_id: number;
  measure_id: number;
}

export const countryKpas: SeedCountryKpa[] = [];
export const strategicOutputs: SeedStrategicOutput[] = [];
export const measures: SeedMeasure[] = [];
export const indicators: SeedIndicator[] = [];

// Deterministic pseudo-random in [0, 1), seeded by an integer so demo numbers
// never change between renders/reloads within a build.
function seededRatio(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

{
  let ckId = 1;
  let soId = 1;
  let measureId = 1;
  let indicatorId = 1;

  for (const country of countries) {
    const assignedKpaIds = countryKpaAssignments[country.id] ?? [];
    for (const kpaId of assignedKpaIds) {
      const template = kpaTemplates.find((t) => t.kpaId === kpaId)!;
      const kpa = kpas.find((k) => k.id === kpaId)!;
      const thisCk = ckId++;

      let soCountForCk = 0;
      let measureCountForCk = 0;
      let indicatorCountForCk = 0;

      template.strategicOutputs.forEach((soTemplate, soIndex) => {
        const thisSoId = soId++;
        soCountForCk += 1;

        let measureCountForSo = 0;
        soTemplate.measures.forEach((measureTemplate, measureIndex) => {
          const thisMeasureId = measureId++;
          measureCountForSo += 1;
          measureCountForCk += 1;

          let indicatorCountForMeasure = 0;
          measureTemplate.indicators.forEach((indicatorTemplate) => {
            const thisIndicatorId = indicatorId++;
            indicatorCountForMeasure += 1;
            indicatorCountForCk += 1;

            const ratio = 0.35 + seededRatio(thisIndicatorId * 7 + country.id) * 0.6; // 35%-95% implementation
            indicators.push({
              id: thisIndicatorId,
              name: indicatorTemplate.name,
              target: indicatorTemplate.target,
              actual_value: Math.round(indicatorTemplate.target * ratio * 100) / 100,
              type_id: indicatorTemplate.typeId,
              measure_id: thisMeasureId,
            });
          });

          measures.push({
            id: thisMeasureId,
            name: measureTemplate.name,
            numbering: `${soIndex + 1}.${measureIndex + 1}`,
            strategic_output_id: thisSoId,
            indicators_count: indicatorCountForMeasure,
          });
        });

        strategicOutputs.push({
          id: thisSoId,
          name: soTemplate.name,
          numbering: `${soIndex + 1}`,
          id_ck: thisCk,
          measures_count: measureCountForSo,
        });
      });

      countryKpas.push({
        id_ck: thisCk,
        country_id: country.id,
        id_kpa: kpa.id,
        name: kpa.name,
        strategic_outputs_count: soCountForCk,
        measures_count: measureCountForCk,
        indicators_count: indicatorCountForCk,
      });
    }
  }
}

/** Implementation % for a single indicator, clamped to [0, 100]. */
export function indicatorImplementation(indicator: SeedIndicator): number {
  if (!indicator.target) return 0;
  return Math.max(0, Math.min(100, Math.round((indicator.actual_value / indicator.target) * 10000) / 100));
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round((values.reduce((sum, v) => sum + v, 0) / values.length) * 100) / 100;
}

export function measureImplementation(measureId: number): number {
  const values = indicators.filter((i) => i.measure_id === measureId).map(indicatorImplementation);
  return average(values);
}

export function strategicOutputImplementation(soId: number): number {
  const soMeasures = measures.filter((m) => m.strategic_output_id === soId);
  return average(soMeasures.map((m) => measureImplementation(m.id)));
}

export function countryKpaImplementation(idCk: number): number {
  const sos = strategicOutputs.filter((so) => so.id_ck === idCk);
  return average(sos.map((so) => strategicOutputImplementation(so.id)));
}

// ---------------------------------------------------------------------------
// Reference / catalog data
// ---------------------------------------------------------------------------

export const donors: Donor[] = [
  { id: 1, name: "Australian Department of Foreign Affairs and Trade" },
  { id: 2, name: "New Zealand Ministry of Foreign Affairs and Trade" },
  { id: 3, name: "European Union Pacific Delegation" },
  { id: 4, name: "World Bank Group" },
  { id: 5, name: "Asian Development Bank" },
  { id: 6, name: "United Nations Development Programme" },
  { id: 7, name: "Japan International Cooperation Agency" },
  { id: 8, name: "United States Agency for International Development" },
  { id: 9, name: "Green Climate Fund" },
  { id: 10, name: "Global Environment Facility" },
  { id: 11, name: "Pacific Community (SPC)" },
  { id: 12, name: "Korea International Cooperation Agency" },
  { id: 13, name: "United Kingdom Foreign, Commonwealth & Development Office" },
  { id: 14, name: "International Finance Corporation" },
  { id: 15, name: "Pacific Islands Forum Secretariat" },
];

export const agencies: Agency[] = [
  { id: 1, name: "Pacific Trade Invest", url: "https://www.pacifictradeinvest.com", isApproved: true },
  { id: 2, name: "Fiji Revenue and Customs Service", url: "https://www.frcs.org.fj", isApproved: true },
  { id: 3, name: "Samoa Chamber of Commerce and Industry", url: "https://www.samoachamber.ws", isApproved: true },
  { id: 4, name: "Tonga Ministry of Commerce", url: "https://www.commerce.gov.to", isApproved: true },
  { id: 5, name: "Vanuatu Investment Promotion Authority", url: "https://www.investvanuatu.org", isApproved: true },
  { id: 6, name: "Solomon Islands Chamber of Commerce", url: "https://www.sicci.com.sb", isApproved: true },
  { id: 7, name: "PNG Investment Promotion Authority", url: "https://www.ipa.gov.pg", isApproved: true },
  { id: 8, name: "Pacific Islands Private Sector Organisation", url: "https://www.pipso.org.fj", isApproved: true },
  { id: 9, name: "Pacific Digital Economy Programme Office", url: "https://www.pacificdigital.org", isApproved: false },
  { id: 10, name: "Secretariat of the Pacific Regional Environment Programme", url: "https://www.sprep.org", isApproved: true },
];

export const beneficiaries: Beneficiary[] = [
  { id: 1, name: "Fiji Women in Business Association" },
  { id: 2, name: "Samoa Small Business Enterprise Centre" },
  { id: 3, name: "Tonga Youth Entrepreneurs Network" },
  { id: 4, name: "Vanuatu Farmers Support Association" },
  { id: 5, name: "Solomon Islands Fisheries Cooperative" },
  { id: 6, name: "PNG Smallholder Coffee Growers Association" },
  { id: 7, name: "Pacific Female Exporters Network" },
  { id: 8, name: "Nadi Handicraft Producers Cooperative" },
  { id: 9, name: "Apia Digital Skills Collective" },
  { id: 10, name: "Nuku'alofa Tourism Operators Association" },
  { id: 11, name: "Port Vila Micro-Enterprise Network" },
  { id: 12, name: "Honiara Coastal Communities Alliance" },
  { id: 13, name: "Port Moresby Artisan Guild" },
  { id: 14, name: "Suva Youth Tech Hub" },
  { id: 15, name: "Pacific Rural Women's Cooperative" },
  { id: 16, name: "Savusavu Agro-Processing Group" },
  { id: 17, name: "Vava'u Marine Products Association" },
  { id: 18, name: "Luganville Trade Association" },
  { id: 19, name: "Auki Community Development Trust" },
  { id: 20, name: "Lae Manufacturers Alliance" },
  { id: 21, name: "Pacific Persons with Disabilities Network" },
  { id: 22, name: "Nausori Creative Industries Collective" },
  { id: 23, name: "Neiafu Smallholder Vanilla Growers" },
  { id: 24, name: "Gizo Ecotourism Cooperative" },
  { id: 25, name: "Mount Hagen Highlands Producers Group" },
  { id: 26, name: "Pacific Young Innovators Network" },
];

export const projectStates: ProjectState[] = [
  { id: 1, state: "Planning" },
  { id: 2, state: "In Progress" },
  { id: 3, state: "On Hold" },
  { id: 4, state: "Completed" },
  { id: 5, state: "Cancelled" },
];

export const programStates: ProgramState[] = [
  { id: 1, name: "Draft" },
  { id: 2, name: "Active" },
  { id: 3, name: "Completed" },
  { id: 4, name: "Archived" },
];

export const sdgs: Sdg[] = Array.from({ length: 17 }, (_, i) => {
  const n = i + 1;
  const padded = String(n).padStart(2, "0");
  return {
    id: n,
    image: `sdg_images/seed_sdg-${padded}.png`,
    filename: `sdg-${padded}.png`,
    // Wikimedia thumb URLs need the file's actual hash-prefix folder (e.g.
    // "9/9d/"), which differs per file and can't be guessed - hardcoding one
    // prefix for all 17 files (an earlier version of this seed did) 404s for
    // nearly all of them. `Special:FilePath` is Wikimedia's own redirect
    // endpoint that resolves the correct thumb URL by filename alone, so this
    // stays correct without needing to look up 17 individual hashes.
    image_url: `https://commons.wikimedia.org/wiki/Special:FilePath/Sustainable_Development_Goal_${n}.png?width=240`,
  };
});

export const contacts: Contact[] = [
  { id: 1, first_name: "Litia", last_name: "Ravouvou", title: "Program Director", email: "litia.ravouvou@example.org", phone: "+6799991001" },
  { id: 2, first_name: "Sione", last_name: "Taufa", title: "Trade Facilitation Advisor", email: "sione.taufa@example.org", phone: "+6769991002" },
  { id: 3, first_name: "Malia", last_name: "Faleolo", title: "M&E Coordinator", email: "malia.faleolo@example.org", phone: "+6859991003" },
  { id: 4, first_name: "Kalo", last_name: "Naupoto", title: "Country Manager", email: "kalo.naupoto@example.org", phone: "+6799991004" },
  { id: 5, first_name: "Esther", last_name: "Kilangit", title: "Private Sector Liaison", email: "esther.kilangit@example.org", phone: "+6789991005" },
  { id: 6, first_name: "Peter", last_name: "Waqavonovono", title: "Digital Economy Lead", email: "peter.waqa@example.org", phone: "+6799991006" },
  { id: 7, first_name: "Ana", last_name: "Tuilagi", title: "Gender & Inclusion Officer", email: "ana.tuilagi@example.org", phone: "+6859991007" },
  { id: 8, first_name: "Joseph", last_name: "Kalu", title: "Climate Resilience Specialist", email: "joseph.kalu@example.org", phone: "+6759991008" },
  { id: 9, first_name: "Losalini", last_name: "Baleiverata", title: "Program Manager", email: "losalini.b@example.org", phone: "+6799991009" },
  { id: 10, first_name: "Viliami", last_name: "Fifita", title: "Regional Coordinator", email: "viliami.fifita@example.org", phone: "+6769991010" },
];

// ---------------------------------------------------------------------------
// Programs
// ---------------------------------------------------------------------------

interface SeedProgram extends Program {
  country_id: number; // convenience field used only by mock handlers, not sent from the real backend shape but harmless as extra JSON on the wire
}

const programDefinitions: { name: string; description: string; countryId: number; stateId: number; sdgIds: number[]; contactId: number }[] = [
  { name: "Pacific Digital Trade Facilitation Programme", description: "Modernizes customs and trade systems across Fiji to cut clearance times and widen market access for exporters.", countryId: 1, stateId: 2, sdgIds: [8, 9, 17], contactId: 1 },
  { name: "Blue Pacific Resilience Initiative", description: "Builds climate-resilient coastal infrastructure and early-warning systems in vulnerable Fijian communities.", countryId: 1, stateId: 2, sdgIds: [13, 14], contactId: 6 },
  { name: "Samoa Women in Trade Programme", description: "Expands access to finance and export markets for women-led micro and small enterprises in Samoa.", countryId: 2, stateId: 2, sdgIds: [5, 8], contactId: 3 },
  { name: "Digital Samoa Connectivity Project", description: "Extends affordable broadband access and digital literacy training to rural Samoan villages.", countryId: 2, stateId: 2, sdgIds: [9, 4], contactId: 6 },
  { name: "Tonga Private Sector Growth Facility", description: "Provides business development services and streamlined registration to grow Tongan SMEs.", countryId: 3, stateId: 2, sdgIds: [8, 9], contactId: 2 },
  { name: "Tonga Climate-Smart Agriculture Programme", description: "Supports smallholder farmers in Tonga to adopt climate-resilient agricultural practices.", countryId: 3, stateId: 1, sdgIds: [2, 13], contactId: 8 },
  { name: "Vanuatu Market Access Enhancement Project", description: "Improves port logistics and trade documentation systems to boost Vanuatu's export competitiveness.", countryId: 4, stateId: 2, sdgIds: [8, 17], contactId: 2 },
  { name: "Solomon Islands Fisheries Value Chain Programme", description: "Strengthens sustainable fisheries value chains and cooperative market access in Solomon Islands.", countryId: 5, stateId: 2, sdgIds: [14, 8], contactId: 9 },
  { name: "PNG Highlands Agribusiness Development Programme", description: "Connects smallholder coffee and produce growers in the PNG Highlands to regional export markets.", countryId: 6, stateId: 2, sdgIds: [2, 8], contactId: 5 },
  { name: "Pacific Regional Innovation & Entrepreneurship Fund", description: "Co-funds startup incubation and seed financing for young entrepreneurs across six Pacific countries.", countryId: 1, stateId: 1, sdgIds: [8, 9], contactId: 10 },
];

// Lorem Picsum's `/seed/<text>/` endpoint deterministically returns the same
// photo for the same seed string - unlike Unsplash Source (discontinued) or
// guessing real photo IDs, this never 404s and needs no per-program lookup.
function bannerImageFor(name: string): string {
  const seed = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return `https://picsum.photos/seed/${seed}/800/450`;
}

export const programs: SeedProgram[] = programDefinitions.map((def, index) => {
  const id = index + 1;
  const country = findCountry(def.countryId)!;
  return {
    id,
    name: def.name,
    description: def.description,
    banner_img: bannerImageFor(def.name),
    program_url: null,
    contact: contacts[def.contactId - 1],
    program_state: programStates.find((s) => s.id === def.stateId)!,
    sdgs: def.sdgIds.map((sdgId) => sdgs[sdgId - 1]),
    program_summary: { start_date: null, end_date: null, donors: [], implementing_agencies: [], budget: 0 },
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-06-01T00:00:00Z",
    projects_count: 0,
    can_edit: true,
    country_id: def.countryId,
    country_user_roles: [{ id, country: { id: country.id, name: country.name, active: country.active, currency_code: country.currency.code } }],
  };
});

export function findProgram(id: number) {
  return programs.find((p) => p.id === id);
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

const projectNameBank = [
  "Customs Single-Window Rollout",
  "Rural Broadband Expansion Phase 2",
  "Women Exporters Finance Facility",
  "Coastal Protection Works - North Shore",
  "SME Business Registration Portal",
  "Youth Digital Skills Bootcamp",
  "Coffee Value Chain Certification",
  "Fisheries Cold-Chain Upgrade",
  "Trade Documentation Digitization",
  "Community Early-Warning Network",
  "Startup Incubator Cohort 3",
  "Handicraft Export Market Access",
  "Agro-Processing Equipment Grant",
  "Digital Payments for Market Vendors",
  "Disaster Response Training Series",
  "Cross-Border Trade Corridor Study",
  "Inclusive Tourism Certification",
  "Smallholder Vanilla Export Pilot",
  "Regional Standards Harmonization Workshop",
  "Public Sector M&E Capacity Building",
  "Seed Fund for Female Entrepreneurs",
  "Port Logistics Modernization",
  "Climate-Smart Farming Extension Services",
  "Micro-Enterprise Formalization Drive",
];

function projectDescription(name: string, countryName: string): string {
  return `${name} supports the wider program's goals in ${countryName}, tracking measurable progress against the country's KPA framework.`;
}

// Deterministically build ~24 projects distributed across the 10 programs,
// each pulling its KPA/strategic-output/measure/indicator selection from that
// program's country KPA tree so every project's dashboard numbers are
// consistent with the country-KPA screens.
function buildProjects(): Project[] {
  const result: Project[] = [];
  let projectId = 1;

  programs.forEach((program, programIndex) => {
    const countryId = program.country_id;
    const ownedCks = countryKpas.filter((ck) => ck.country_id === countryId);
    if (ownedCks.length === 0) return;

    const projectsForThisProgram = 2 + (programIndex % 3); // 2, 3 or 4 projects per program (~24 total)

    for (let i = 0; i < projectsForThisProgram; i++) {
      const nameIndex = (projectId - 1) % projectNameBank.length;
      const name = `${projectNameBank[nameIndex]} - ${program.name.split(" ")[0]}`;

      const ck = ownedCks[(projectId + i) % ownedCks.length];
      const sos = strategicOutputs.filter((so) => so.id_ck === ck.id_ck);
      const so = sos[i % sos.length];
      const soMeasures = measures.filter((m) => m.strategic_output_id === so.id);
      const measure = soMeasures[i % soMeasures.length];
      const measureIndicators = indicators.filter((ind) => ind.measure_id === measure.id);

      const stateId = 1 + ((projectId + i) % projectStates.length);
      const progress = Math.round(seededRatio(projectId * 3.1) * 100);
      const weight = Math.round(seededRatio(projectId * 5.7) * 100) / 1000; // 0 - 0.1
      const budget = 25000 + Math.round(seededRatio(projectId * 9.3) * 475000);

      const donorId1 = donors[(projectId + i) % donors.length].id;
      const donorId2 = donors[(projectId + i + 4) % donors.length].id;
      const agencyId = agencies[(projectId + i) % agencies.length].id;
      const beneficiaryId = beneficiaries[(projectId + i) % beneficiaries.length].id;
      const contactId = contacts[(projectId + i) % contacts.length].id;

      const startYear = 2023 + (projectId % 2);
      const startMonth = 1 + ((projectId + i) % 10);
      const start = new Date(Date.UTC(startYear, startMonth - 1, 5));
      const end = new Date(Date.UTC(startYear + 1, startMonth - 1, 5));

      const country = findCountry(countryId)!;

      result.push({
        id: projectId,
        name,
        description: projectDescription(name, country.name),
        project_url: "",
        start_date: start,
        end_date: end,
        progress,
        comments: "Progress tracked monthly against the country KPA dashboard.",
        budget,
        weight,
        contact: contacts.find((c) => c.id === contactId)!,
        beneficiary: beneficiaries.find((b) => b.id === beneficiaryId)!,
        project_state: projectStates.find((s) => s.id === stateId)!,
        kpa: { id: ck.id_kpa, name: ck.name, strategic_outputs_count: ck.strategic_outputs_count },
        measure: { id: measure.id, name: measure.name, indicators_count: measure.indicators_count },
        strategic_output: {
          id: so.id,
          name: so.name,
          numbering: so.numbering,
          country: { id: country.id, name: country.name },
          measures_count: so.measures_count,
        },
        donors: [
          { id: donorId1, name: donors.find((d) => d.id === donorId1)!.name, contribution: 60 },
          { id: donorId2, name: donors.find((d) => d.id === donorId2)!.name, contribution: 40 },
        ],
        agencies: [
          { id: agencyId, name: agencies.find((a) => a.id === agencyId)!.name, url: agencies.find((a) => a.id === agencyId)!.url, contribution: 100 },
        ],
        program_id: program.id,
        indicators: measureIndicators.length > 0 ? measureIndicators.map((ind) => ({
          id: ind.id,
          name: ind.name,
          target: ind.target,
          actual_value: ind.actual_value,
          measure_id: ind.measure_id,
          type: indicatorTypes.find((t) => t.id === ind.type_id),
        })) : [],
      });

      projectId += 1;
    }
  });

  return result;
}

export const projects: Project[] = buildProjects();

export function findProjectIndex(id: number) {
  return projects.findIndex((p) => p.id === id);
}

// Backfill each program's `program_summary` + `projects_count` from its actual projects,
// so program detail screens and dashboards always agree with the project list.
(function computeProgramSummaries() {
  for (const program of programs) {
    const ownProjects = projects.filter((p) => p.program_id === program.id);
    program.projects_count = ownProjects.length;

    if (ownProjects.length === 0) continue;

    const starts = ownProjects.map((p) => new Date(p.start_date).getTime());
    const ends = ownProjects.map((p) => new Date(p.end_date).getTime());
    const budget = ownProjects.reduce((sum, p) => sum + (p.budget ?? 0), 0);

    const donorNames = new Map<number, string>();
    const agencyNames = new Map<number, string>();
    ownProjects.forEach((p) => {
      p.donors.forEach((d) => { if (d.id) donorNames.set(d.id, d.name); });
      p.agencies.forEach((a) => { if (a.id) agencyNames.set(a.id, a.name); });
    });

    program.program_summary = {
      start_date: new Date(Math.min(...starts)).toISOString().slice(0, 10),
      end_date: new Date(Math.max(...ends)).toISOString().slice(0, 10),
      donors: Array.from(donorNames.entries()).map(([id, name]) => ({ id, name })),
      implementing_agencies: Array.from(agencyNames.entries()).map(([id, name]) => ({ id, name })),
      budget,
    };
  }
})();

// ---------------------------------------------------------------------------
// Roles & Permissions
// ---------------------------------------------------------------------------

export const roles: Role[] = [
  { id: 1, name: "admin" },
  { id: 2, name: "country-manager" },
  { id: 3, name: "project-manager" },
];

export const permissions: Permission[] = Object.entries(SCOPES)
  .filter(([, scope]) => scope !== "*:*")
  .map(([key, scope], index) => {
    const [module, action = "manage"] = scope.split(":");
    return {
      id: index + 1,
      name: key,
      scope,
      module,
      description: `Allows ${action === "*" ? "full access to" : `"${action}"`} the "${module}" module`,
    };
  });

function permissionIdsForModules(modules: string[], excludeActions: string[] = []): number[] {
  return permissions
    .filter((p) => modules.includes(p.module) && !excludeActions.some((a) => p.scope.endsWith(`:${a}`)))
    .map((p) => p.id);
}

/**
 * Mirrors the real product's RBAC split (per the client's own description,
 * not a generic "admin = everything" demo shortcut):
 *  - admin: system administration - users/roles, the global reference
 *    catalogs (countries, KPA definitions, indicator types, SDGs, program
 *    & project states) and cross-country visibility. Does NOT create
 *    programs/projects, and does NOT touch a specific country's KPA tree.
 *  - country-manager: activates their country and builds out its KPA ->
 *    strategic output -> measure -> indicator framework. Reviews
 *    country-join requests for their country.
 *  - project-manager: creates and runs programs/projects for an already
 *    activated country, once its KPA tree exists. Only reads the KPA/SO/
 *    measure/indicator catalogs (to attach a project to them), never
 *    writes them.
 */
export const rolePermissionIds: Record<number, number[]> = {
  1: permissionIdsForModules([
    "admin_dashboard", "users", "roles", "countries", "kpas", "indicator_types",
    "sdgs", "program_states", "project_states", "donors", "agencies", "beneficiaries",
  ]),
  2: [
    ...permissionIdsForModules(["countries"], ["delete"]), // activate/manage their own country
    ...permissionIdsForModules(["country_kpas", "strategic_outputs", "measures", "indicators", "country_join_requests"]),
    ...permissionIdsForModules(["kpas", "indicator_types"]).filter((id) => permissions.find((p) => p.id === id)?.scope.endsWith(":read")),
  ],
  3: [
    ...permissionIdsForModules(["programs", "projects", "country_join_requests"]),
    ...permissionIdsForModules(["donors", "agencies", "beneficiaries", "sdgs", "kpas", "country_kpas", "strategic_outputs", "measures", "indicators"])
      .filter((id) => permissions.find((p) => p.id === id)?.scope.endsWith(":read")),
  ],
};

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export const userStates = [
  { id: 1, name: "active" },
  { id: 2, name: "pending" },
  { id: 3, name: "unverified" },
];

export const demoUsers: UserDTO[] = [
  {
    id: 1, name: "Demo Admin", email: "demo@admin.com",
    roles: [{ id: 1, name: "admin" }],
    user_state: userStates[0],
    country_user_role: null,
    created_at: "2024-01-05T00:00:00Z", updated_at: "2024-01-05T00:00:00Z",
  },
  {
    id: 2, name: "Litia Ravouvou", email: "litia.ravouvou@example.org",
    roles: [{ id: 2, name: "country-manager" }],
    user_state: userStates[0],
    country_user_role: { id: 1, country: { id: 1, name: "Fiji" } },
    created_at: "2024-01-10T00:00:00Z", updated_at: "2024-01-10T00:00:00Z",
  },
  {
    id: 3, name: "Malia Faleolo", email: "malia.faleolo@example.org",
    roles: [{ id: 2, name: "country-manager" }],
    user_state: userStates[0],
    country_user_role: { id: 2, country: { id: 2, name: "Samoa" } },
    created_at: "2024-01-12T00:00:00Z", updated_at: "2024-01-12T00:00:00Z",
  },
  {
    id: 4, name: "Viliami Fifita", email: "viliami.fifita@example.org",
    roles: [{ id: 3, name: "project-manager" }],
    user_state: userStates[0],
    country_user_role: { id: 3, country: { id: 3, name: "Tonga" } },
    created_at: "2024-02-01T00:00:00Z", updated_at: "2024-02-01T00:00:00Z",
  },
  {
    id: 5, name: "Esther Kilangit", email: "esther.kilangit@example.org",
    roles: [{ id: 3, name: "project-manager" }],
    user_state: userStates[1],
    country_user_role: { id: 4, country: { id: 6, name: "Papua New Guinea" } },
    created_at: "2024-03-14T00:00:00Z", updated_at: "2024-03-14T00:00:00Z",
  },
  {
    id: 6, name: "Kalo Naupoto", email: "kalo.naupoto@example.org",
    roles: [{ id: 2, name: "country-manager" }],
    user_state: userStates[2],
    country_user_role: { id: 5, country: { id: 4, name: "Vanuatu" } },
    created_at: "2024-04-02T00:00:00Z", updated_at: "2024-04-02T00:00:00Z",
  },
  {
    id: 7, name: "Ana Tuilagi", email: "ana.tuilagi@example.org",
    roles: [{ id: 3, name: "project-manager" }],
    user_state: userStates[1],
    country_user_role: { id: 6, country: { id: 5, name: "Solomon Islands" } },
    created_at: "2024-05-20T00:00:00Z", updated_at: "2024-05-20T00:00:00Z",
  },
];

// ---------------------------------------------------------------------------
// Country dashboard shares / program assignments / country join requests
// ---------------------------------------------------------------------------

export const countryDashboardShares: CountryDashboardShare[] = [
  {
    id: 1, country_id: 1, owner_country_user_role_id: 1, shared_user_role_id: 1,
    country: { id: 1, name: "Fiji" },
    owner_country_user_role: { id: 1, user: { id: 2, name: "Litia Ravouvou", email: "litia.ravouvou@example.org" }, country: { id: 1, name: "Fiji" } },
    shared_user_role: { id: 1, user: { id: 1, name: "Demo Admin", email: "demo@admin.com" }, role: { id: 1, name: "admin" } },
    created_at: "2024-02-01T00:00:00Z", updated_at: "2024-02-01T00:00:00Z",
  },
  {
    id: 2, country_id: 2, owner_country_user_role_id: 2, shared_user_role_id: 1,
    country: { id: 2, name: "Samoa" },
    owner_country_user_role: { id: 2, user: { id: 3, name: "Malia Faleolo", email: "malia.faleolo@example.org" }, country: { id: 2, name: "Samoa" } },
    shared_user_role: { id: 1, user: { id: 1, name: "Demo Admin", email: "demo@admin.com" }, role: { id: 1, name: "admin" } },
    created_at: "2024-02-05T00:00:00Z", updated_at: "2024-02-05T00:00:00Z",
  },
  {
    id: 3, country_id: 3, owner_country_user_role_id: 3, shared_user_role_id: 1,
    country: { id: 3, name: "Tonga" },
    owner_country_user_role: { id: 3, user: { id: 4, name: "Viliami Fifita", email: "viliami.fifita@example.org" }, country: { id: 3, name: "Tonga" } },
    shared_user_role: { id: 1, user: { id: 1, name: "Demo Admin", email: "demo@admin.com" }, role: { id: 1, name: "admin" } },
    created_at: "2024-03-01T00:00:00Z", updated_at: "2024-03-01T00:00:00Z",
  },
];

export interface SeedProgramAssignment {
  id: number;
  program_id: number;
  country_user_role_id: number;
  country_user_role: { id: number; country: { id: number; name: string } };
}

export const programAssignments: SeedProgramAssignment[] = programs.map((program, index) => ({
  id: index + 1,
  program_id: program.id,
  country_user_role_id: (index % demoUsers.length) + 1,
  country_user_role: {
    id: (index % demoUsers.length) + 1,
    country: { id: program.country_id, name: findCountry(program.country_id)!.name },
  },
}));

export interface SeedJoinRequest {
  id: number;
  country_id: number;
  country: { id: number; name: string; active: number };
  requester_user_role_id: number;
  requester_user_role: { user: { id: number; name: string; email: string }; role: { id: number; name: string } };
  status: "pending" | "approved" | "rejected" | "revoked";
  created_at: string;
  updated_at: string;
}

export const countryJoinRequests: SeedJoinRequest[] = [
  {
    id: 1, country_id: 4, country: { id: 4, name: "Vanuatu", active: 0 },
    requester_user_role_id: 6,
    requester_user_role: { user: { id: 6, name: "Kalo Naupoto", email: "kalo.naupoto@example.org" }, role: { id: 4, name: "viewer" } },
    status: "pending", created_at: "2024-06-01T00:00:00Z", updated_at: "2024-06-01T00:00:00Z",
  },
  {
    id: 2, country_id: 5, country: { id: 5, name: "Solomon Islands", active: 0 },
    requester_user_role_id: 7,
    requester_user_role: { user: { id: 7, name: "Ana Tuilagi", email: "ana.tuilagi@example.org" }, role: { id: 3, name: "project-manager" } },
    status: "approved", created_at: "2024-05-25T00:00:00Z", updated_at: "2024-05-28T00:00:00Z",
  },
];
