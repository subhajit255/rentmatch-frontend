import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Rocket,
  User,
  Home,
  Briefcase,
  MessageSquare,
  ShieldCheck,
  Tag,
  ChevronDown,
  Headphones,
  HelpCircle,
} from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
}

const categories: Category[] = [
  { id: "getting-started", name: "Getting started", icon: Rocket },
  { id: "renters", name: "Renters", icon: User },
  { id: "landlords", name: "Private Landlords", icon: Home },
  { id: "property-managers", name: "Property Managers", icon: Briefcase },
  { id: "matching-messaging", name: "Matching & Messaging", icon: MessageSquare },
  { id: "privacy-safety", name: "Privacy & Safety", icon: ShieldCheck },
  { id: "pricing-subscriptions", name: "Pricing & Subscriptions", icon: Tag },
];

const faqsData: FAQItem[] = [
  // Getting Started
  {
    id: "gs-1",
    category: "getting-started",
    question: "What is RentMatch?",
    answer:
      "RentMatch connects renters with private landlords and property managers based on their property and rental preferences. Instead of endless searching, RentMatch pairs tenant profiles with suitable landlords to streamline the renting experience.",
  },
  {
    id: "gs-2",
    category: "getting-started",
    question: "How does RentMatch work?",
    answer:
      "Renters create a verified profile specifying their budget, desired location, move-in date, and household preferences. Landlords and property managers can browse tenant profiles or list properties. Our smart matching engine highlights high-compatibility matches so both parties can chat and arrange property inspections directly.",
  },
  {
    id: "gs-3",
    category: "getting-started",
    question: "Who can use RentMatch?",
    answer:
      "Anyone looking to rent a residential property (Renters), homeowners listing rental units directly (Private Landlords), and professional Property Managers or Rental Agents managing multiple rental portfolios.",
  },
  {
    id: "gs-4",
    category: "getting-started",
    question: "Is RentMatch free for renters?",
    answer:
      "Yes! RentMatch is 100% free for renters to build profiles, explore rental properties, receive landlord matches, and message landlords.",
  },
  {
    id: "gs-5",
    category: "getting-started",
    question: "How are renters and properties matched?",
    answer:
      "RentMatch evaluates parameters such as target rental price, suburb/city preferences, lease duration, pet friendliness, parking requirements, and preferred move-in dates to score and recommend ideal matches.",
  },
  {
    id: "gs-6",
    category: "getting-started",
    question: "Does RentMatch guarantee a tenancy?",
    answer:
      "RentMatch facilitates direct introductions, verified profile matching, and inspection scheduling. Final tenancy agreements, formal application checks, and lease signing are completed between the landlord/property manager and tenant.",
  },

  // Renters
  {
    id: "renter-1",
    category: "renters",
    question: "How do I create a stand-out Renter Profile?",
    answer:
      "Include a friendly bio, state your employment status, specify income range, upload reference letters, and detail your preferred living arrangements (e.g., solo, couple, pets). Verified profiles receive up to 3x more landlord matches.",
  },
  {
    id: "renter-2",
    category: "renters",
    question: "Can I apply for multiple properties at once?",
    answer:
      "Yes! With your single RentMatch profile, you can express interest and connect with multiple landlords simultaneously without re-filling forms.",
  },
  {
    id: "renter-3",
    category: "renters",
    question: "How do property inspection requests work?",
    answer:
      "When viewing a property or chatting with a landlord, click 'Schedule Inspection'. Select an available time slot or request a private viewing. You'll receive instant calendar confirmation.",
  },

  // Private Landlords
  {
    id: "landlord-1",
    category: "landlords",
    question: "How do I list my rental property?",
    answer:
      "Sign up as a Private Landlord, click 'Post Property', upload property photos, specify rent amount, availability date, and amenities. Your listing will immediately match with active renters searching in your area.",
  },
  {
    id: "landlord-2",
    category: "landlords",
    question: "Can I screen prospective tenants before showing the property?",
    answer:
      "Absolutely. You can view prospective tenants' rental preferences, employment details, and pre-verified profile information before approving an inspection request or starting a conversation.",
  },
  {
    id: "landlord-3",
    category: "landlords",
    question: "Are there listing fees for landlords?",
    answer:
      "We offer free initial listing tiers as well as premium subscription options for multi-property owners looking for featured placement and instant SMS alerts.",
  },

  // Property Managers
  {
    id: "pm-1",
    category: "property-managers",
    question: "Can property managers handle multiple listings?",
    answer:
      "Yes, Property Manager accounts come with a dedicated management dashboard, bulk property listing uploads, team collaboration features, and lead management tools.",
  },
  {
    id: "pm-2",
    category: "property-managers",
    question: "How do I sync inspection calendars with my office calendar?",
    answer:
      "You can export scheduled property inspections directly to Google Calendar, Apple Calendar, or Outlook via `.ics` downloads or calendar feed links in your schedules dashboard.",
  },

  // Matching & Messaging
  {
    id: "mm-1",
    category: "matching-messaging",
    question: "Is instant messaging secure on RentMatch?",
    answer:
      "Yes! Our in-app messaging system allows safe communication without disclosing personal phone numbers until you feel comfortable sharing them.",
  },
  {
    id: "mm-2",
    category: "matching-messaging",
    question: "What does the match compatibility score mean?",
    answer:
      "The percentage match score indicates how closely a tenant's preferences (budget, pet needs, lease length, location) align with a property's specifications.",
  },

  // Privacy & Safety
  {
    id: "ps-1",
    category: "privacy-safety",
    question: "How is my personal information protected?",
    answer:
      "We strictly adhere to data protection regulations. Sensitive contact details are hidden until you initiate or accept a match request. You can read our full Privacy Policy anytime.",
  },
  {
    id: "ps-2",
    category: "privacy-safety",
    question: "How do I report suspicious users or fraudulent listings?",
    answer:
      "Click the flag/report icon on any chat screen, listing, or user profile. Our safety team reviews reported items within 24 hours to keep the community secure.",
  },

  // Pricing & Subscriptions
  {
    id: "sub-1",
    category: "pricing-subscriptions",
    question: "What subscription plans are available?",
    answer:
      "Renters can use the platform for free. Landlords and Property Managers can choose between Free, Pro, and Enterprise plans offering boosted property listings, unlimited messaging, and priority support.",
  },
  {
    id: "sub-2",
    category: "pricing-subscriptions",
    question: "Can I cancel or upgrade my subscription at any time?",
    answer:
      "Yes, you can upgrade, downgrade, or cancel your subscription at any time directly from your Account Settings page with no long-term lock-in contracts.",
  },
];

const Advice: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("getting-started");
  const [openFaqId, setOpenFaqId] = useState<string | null>("gs-1");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter FAQs based on active category or search query
  const filteredFaqs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      return faqsData.filter(
        (faq) =>
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query)
      );
    }
    return faqsData.filter((faq) => faq.category === selectedCategory);
  }, [searchQuery, selectedCategory]);

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  const activeCategoryObj = categories.find((c) => c.id === selectedCategory);

  return (
    <main className="min-h-screen bg-slate-50/60 py-10 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1280px] mx-auto space-y-10 md:space-y-14">
        {/* Header Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto pt-4">
          <p className="text-xs md:text-sm font-extrabold text-primary tracking-[0.25em] uppercase">
            HELP CENTRE
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            How can we help?
          </h1>
          <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed">
            Find quick answers about profiles, matching, privacy, subscriptions and using RentMatch.
          </p>

          {/* Search Bar */}
          <div className="pt-4 max-w-2xl mx-auto">
            <div className="relative flex items-center rounded-2xl bg-white border border-slate-200/90 shadow-md shadow-slate-200/50 p-1.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search frequently asked questions..."
                className="w-full h-12 pl-5 pr-4 text-slate-800 placeholder-slate-400 text-sm md:text-base bg-transparent border-0 focus:outline-none focus:ring-0"
              />
              <button
                type="button"
                className="w-12 h-12 bg-primary hover:bg-primary/90 text-white rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-sm cursor-pointer"
                title="Search FAQ"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Layout: Sidebar + FAQ List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Category Navigation Sidebar */}
          <aside className="lg:col-span-4 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 px-1">
              Browse by category
            </h2>

            <div className="space-y-2">
              {categories.map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = selectedCategory === cat.id && !searchQuery.trim();

                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setSearchQuery("");
                      // Open first FAQ of selected category
                      const firstCatFaq = faqsData.find((f) => f.category === cat.id);
                      if (firstCatFaq) setOpenFaqId(firstCatFaq.id);
                    }}
                    className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl border text-sm font-semibold transition-all duration-200 text-left cursor-pointer ${
                      isSelected
                        ? "bg-primary text-white border-primary shadow-md shadow-primary/20 scale-[1.01]"
                        : "bg-white text-slate-700 border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/80"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className="flex-1">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Right FAQ Accordion List & CTA */}
          <section className="lg:col-span-8 space-y-6">
            {/* Category Title Header */}
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 capitalize">
                {searchQuery.trim()
                  ? `Search results for "${searchQuery}"`
                  : activeCategoryObj?.name || "Frequently Asked Questions"}
              </h2>
              <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                {filteredFaqs.length} {filteredFaqs.length === 1 ? "Article" : "Articles"}
              </span>
            </div>

            {/* FAQ Accordion Cards */}
            {filteredFaqs.length > 0 ? (
              <div className="space-y-3.5">
                {filteredFaqs.map((faq) => {
                  const isOpen = openFaqId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className={`rounded-2xl border transition-all duration-200 overflow-hidden bg-white ${
                        isOpen
                          ? "border-primary/40 shadow-md ring-1 ring-primary/10"
                          : "border-slate-200/80 hover:border-slate-300 shadow-sm"
                      }`}
                    >
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 font-semibold text-slate-800 hover:text-primary text-base md:text-lg transition-colors cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                            isOpen
                              ? "bg-primary/10 text-primary rotate-180"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-6 pb-6 pt-2 text-slate-600 text-sm md:text-base leading-relaxed border-t border-slate-100/80 bg-slate-50/40">
                          <p>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 px-4 rounded-2xl bg-white border border-slate-200/80">
                <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800">No matching questions found</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Try searching with different keywords or select a category on the left.
                </p>
              </div>
            )}

            {/* Bottom Support CTA Card matching screenshot */}
            <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/90 via-indigo-50/40 to-blue-50/60 p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm mt-8">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-14 h-14 rounded-full bg-blue-100/90 border border-blue-200 flex items-center justify-center text-primary shrink-0 shadow-sm">
                  <Headphones className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Still need help?</h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Our team is here to answer your questions.
                  </p>
                </div>
              </div>

              <Link
                to="/#contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white text-slate-800 hover:text-primary font-semibold text-sm border border-slate-200 shadow-sm hover:shadow transition-all shrink-0 hover:border-primary/40"
              >
                Contact RentMatch
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Advice;
