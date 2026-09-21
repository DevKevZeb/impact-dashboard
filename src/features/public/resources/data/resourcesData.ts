export interface ResourceItem {
  title: string;
  description: string;
  category: string;
}

export const TOOLKITS: ResourceItem[] = [
  { title: "SME Online Storefront Starter Kit", description: "Step-by-step guide to setting up an online store, from product listings to payments.", category: "E-commerce" },
  { title: "Digital Payments Readiness Checklist", description: "Practical checklist for merchants adopting mobile money and card payments.", category: "Payments" },
  { title: "Cross-Border Trade Documentation Guide", description: "Templates and guidance for customs documentation when exporting from the Pacific.", category: "Trade Facilitation" },
  { title: "Women in Trade Business Planning Toolkit", description: "Business planning worksheets tailored for women-led micro and small enterprises.", category: "Inclusion" },
  { title: "Cybersecurity Basics for Small Businesses", description: "Plain-language guide to protecting customer data and online transactions.", category: "Digital Economy" },
  { title: "Export Product Certification Handbook", description: "Overview of certification requirements for common Pacific export categories.", category: "Trade Facilitation" },
];

export const REPORTS: ResourceItem[] = [
  { title: "Pacific Regional E-commerce Diagnostic Report", description: "A regional assessment of e-commerce readiness across six Pacific Island countries.", category: "Regional" },
  { title: "Fiji National E-commerce Strategy & Roadmap", description: "National strategy outlining priority reforms and investment areas for Fiji.", category: "Country Report" },
  { title: "Samoa Digital Trade Facilitation Review", description: "Review of trade facilitation reforms supporting Samoa's digital economy transition.", category: "Country Report" },
  { title: "Pacific SME Digital Adoption Survey", description: "Survey results on digital tool adoption among small and medium enterprises.", category: "Research" },
  { title: "Gender & Digital Inclusion in Pacific Trade", description: "Analysis of barriers and opportunities for women-led businesses in digital trade.", category: "Research" },
];
