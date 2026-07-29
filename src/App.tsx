import React, { useState, useEffect } from 'react';
import { IpodAppComponent } from './components/IpodAppComponent';
import './App.css';

const navigationItems = [
  { id: 'about', label: 'profile' },
  { id: 'work', label: 'work' },
  { id: 'projects', label: 'projects' },
  { id: 'resume', label: 'resume' }
];

const internships = [
  { id: 'work-crusoe', label: 'crusoe' },
  { id: 'work-zebra', label: 'zebra technologies' },
  { id: 'work-valsoft', label: 'valsoft corporation' }
];

const tagClass = 'text-xs text-gray-500 border border-gray-200 rounded-full px-2.5 py-0.5';

const catEmojis = ['😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🐱', '🐈', '🐈‍⬛'];

const crusoeTags = ['Go', 'Kubernetes', 'Terraform', 'gRPC', 'Helm', 'Prometheus', 'Grafana', 'GCP'];
const zebraTags = ['C#', 'Selenium', '.NET', 'CI/CD'];
const valsoftTags = ['Python', 'FastAPI', 'Java', 'RAG', 'Supabase', 'PostgreSQL', 'Redis'];

const instagramTags = ['Python'];
const roomiezTags = ['React Native', 'Expo', 'Express.js', 'Firebase'];
const ipodTags = ['React', 'TypeScript'];

const socialLinks = [
  { label: 'email', href: 'mailto:bradenwei00@gmail.com' },
  { label: 'github', href: 'https://github.com/bradenweii' },
  { label: 'linkedin', href: 'https://linkedin.com/in/bradenwei' }
];

function App() {
  const [showIpod, setShowIpod] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [visits, setVisits] = useState<number | null>(null);
  const [emojiIndex, setEmojiIndex] = useState(0);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetch('https://abacus.jasoncameron.dev/get/bradenweii-github-io/visits')
      .then((r) => r.json())
      .then((d) => setVisits(d.value ?? 0))
      .catch(() => setVisits(0));
  }, []);

  const addVisit = () => {
    setEmojiIndex((i) => (i + 1) % catEmojis.length);
    fetch('https://abacus.jasoncameron.dev/hit/bradenweii-github-io/visits')
      .then((r) => r.json())
      .then((d) => setVisits(d.value))
      .catch(() => {});
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    navigationItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-40 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-normal text-black">braden wei</h1>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="mt-4 pb-4">
            <nav className="flex flex-col space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    scrollToSection(item.id);
                  }}
                  className={`text-left py-2 px-3 rounded-md text-sm transition-colors ${
                    activeSection === item.id
                      ? 'bg-gray-100 text-black font-medium'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Mobile Social Links */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="md:flex">
      {/* iPod Modal */}
      {showIpod && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
          <div className="relative pointer-events-auto">
            <button
              onClick={() => setShowIpod(false)}
              className="absolute -top-4 -right-4 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors z-10"
            >
              ×
            </button>
            <IpodAppComponent />
          </div>
        </div>
      )}

        {/* Desktop Sidebar */}
        <div className="hidden md:flex w-64 p-8 flex-col md:sticky md:top-0 md:h-screen">
          {/* Name */}
          <div className="mb-12">
            <h1 className="text-3xl font-normal text-black mb-2">braden wei</h1>
          </div>

          {/* Navigation */}
          <nav className="mb-12">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`block w-full text-left py-1 mb-2 text-sm transition-colors ${
                  activeSection === item.id
                    ? 'text-black font-medium'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Social Links */}
          <div className="mt-auto">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block py-1 mb-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 md:p-8 md:pl-0">
          <div className="max-w-lg mx-auto md:max-w-5xl md:mx-0">

            {/* About Section */}
            <section id="about" className="min-h-screen pt-8 md:pt-20 snap-start scroll-mt-16 md:scroll-mt-0">

              <div className="mb-8 md:max-w-2xl">
                <p className="text-base leading-relaxed text-gray-700 mb-6">
                  Hi I'm Braden, a CS student at McGill with a passion for solving problems and building startups.
                </p>

                <p className="text-sm text-gray-500 mb-4">internships</p>
                <div className="space-y-4">
                  {internships.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="group block w-full text-left"
                    >
                      <span className="text-sm text-gray-400 mr-4">0{index + 1}</span>
                      <span className="text-lg text-black group-hover:text-gray-500 transition-colors">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="mt-12">
                  <p className="text-base leading-relaxed text-gray-700 mb-4">
                    Let's connect and create something amazing together.
                  </p>
                  <p className="text-base leading-relaxed text-gray-700">
                    Feel free to reach out via email or connect with me on social platforms.
                    I'm always interested in discussing new projects, opportunities, or just
                    having a conversation about technology and design.
                  </p>
                </div>
              </div>
            </section>

            {/* Work Section */}
            <section id="work" className="min-h-screen pt-8 md:pt-20 snap-start scroll-mt-16 md:scroll-mt-0 border-t border-gray-200">
              <p className="text-base leading-relaxed text-gray-700 mb-12 md:max-w-2xl">
                A deeper dive into my internships.
              </p>

              <div id="work-crusoe" className="mb-16 scroll-mt-8 md:scroll-mt-20 md:flex md:flex-row-reverse md:justify-between md:gap-12">
                <div className="mb-3 md:mb-0 md:w-40 md:flex-shrink-0 md:text-right md:pt-1">
                  <p className="text-sm text-black">2026</p>
                  <p className="text-sm text-gray-400 mt-0.5">San Francisco</p>
                  <p className="text-sm text-gray-400 mt-0.5">Software Engineering Intern</p>
                </div>
                <div className="md:flex-1 md:max-w-2xl">
                <h3 className="text-lg font-medium text-black mb-3">Crusoe</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {crusoeTags.map((t) => (
                    <span key={t} className={tagClass}>{t}</span>
                  ))}
                </div>
                <p className="text-base leading-relaxed text-gray-700 mb-6">
                  This summer I'm at{' '}
                  <a
                    href="https://www.crusoe.ai/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:no-underline"
                  >
                    Crusoe
                  </a>{' '}
                  in San Francisco, working on Crusoe Managed Kubernetes, the platform customers
                  use to run Kubernetes clusters on Crusoe's AI cloud.
                </p>

                <p className="text-base leading-relaxed text-gray-700 mb-6">
                  My main focus has been auto-scaling. My biggest project was making{' '}
                  <a
                    href="https://github.com/crusoecloud/k8s-autoscaler"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:no-underline"
                  >
                    Crusoe's fork of the Kubernetes cluster-autoscaler
                  </a>{' '}
                  handle node pool scale-up failures gracefully. GPU capacity is scarce everywhere
                  in the industry, and when a node pool couldn't scale up, the autoscaler used to
                  just sit and wait. I designed and shipped logic that lets it fall back to another
                  node pool and recover on its own instead of getting stuck.
                </p>

                <p className="text-base leading-relaxed text-gray-700">
                  Beyond the autoscaler, I've worked on auto-scaling configurations that made
                  customer node pool scale-ups more reliable, shipped platform changes across the
                  Crusoe CLI, Cloud APIs, and Terraform integrations, validated backend database
                  schema updates, and contributed to the rollout of a new customer-facing API for
                  better stability and observability.
                </p>
                </div>
              </div>

              <div id="work-zebra" className="mb-16 scroll-mt-8 md:scroll-mt-20 md:flex md:flex-row-reverse md:justify-between md:gap-12">
                <div className="mb-3 md:mb-0 md:w-40 md:flex-shrink-0 md:text-right md:pt-1">
                  <p className="text-sm text-black">2026</p>
                  <p className="text-sm text-gray-400 mt-0.5">Montreal</p>
                  <p className="text-sm text-gray-400 mt-0.5">Software Engineering Intern</p>
                </div>
                <div className="md:flex-1 md:max-w-2xl">
                <h3 className="text-lg font-medium text-black mb-3">Zebra Technologies</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {zebraTags.map((t) => (
                    <span key={t} className={tagClass}>{t}</span>
                  ))}
                </div>
                <p className="text-base leading-relaxed text-gray-700 mb-6">
                  In the winter I interned at{' '}
                  <a
                    href="https://www.zebra.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:no-underline"
                  >
                    Zebra Technologies
                  </a>{' '}
                  in Montreal on Aurora Design Assistant, their flowchart-based machine vision
                  IDE. I built automation tooling in C# with Selenium to test end-to-end workflows
                  across the product, including the web-based operator interfaces that projects
                  expose at runtime, and developed UI validation pipelines that simulated real
                  user interactions to catch regressions before they reached a production release.
                </p>

                <p className="text-base leading-relaxed text-gray-700">
                  I also worked on performance and resource profiling. I instrumented the
                  automated runs to sample memory over long acquisition sessions, which surfaced
                  growth in the live display path that only appeared after a few thousand frames
                  and would have been invisible in a short manual test. Because Design Assistant
                  is meant to run against a wide range of Zebra and third-party cameras, I also
                  benchmarked acquisition across camera models and interfaces (GigE Vision, USB3
                  Vision) to separate cases where the software was the bottleneck from cases where
                  the hardware was, tracking frame rate, dropped frames, and CPU/RAM cost per
                  stream across resolutions and pixel formats. That fed into a baseline the team
                  could compare future builds against.
                </p>
                </div>
              </div>

              <div id="work-valsoft" className="mb-16 scroll-mt-8 md:scroll-mt-20 md:flex md:flex-row-reverse md:justify-between md:gap-12">
                <div className="mb-3 md:mb-0 md:w-40 md:flex-shrink-0 md:text-right md:pt-1">
                  <p className="text-sm text-black">2025</p>
                  <p className="text-sm text-gray-400 mt-0.5">Montreal &amp; Toronto</p>
                  <p className="text-sm text-gray-400 mt-0.5">AI Engineer Intern</p>
                </div>
                <div className="md:flex-1 md:max-w-2xl">
                <h3 className="text-lg font-medium text-black mb-3">Valsoft Corporation</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {valsoftTags.map((t) => (
                    <span key={t} className={tagClass}>{t}</span>
                  ))}
                </div>
                <p className="text-base leading-relaxed text-gray-700 mb-6">
                  In summer 2025 I interned at{' '}
                  <a
                    href="https://www.valsoftcorp.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:no-underline"
                  >
                    Valsoft Corp
                  </a>{' '}
                  as an AI Developer, where I developed AI features
                  for portfolio company{' '}
                  <a
                    href="https://www.american-data.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:no-underline"
                  >
                    American Data
                  </a>
                  , an Electronic Health Record provider.
                </p>

                <p className="text-base leading-relaxed text-gray-700 mb-6">
                  During my internship, I designed from scratch a chatbot called MDS Assistant, that enables
                  clinicians and staff to run natural language queries over complex healthcare datasets, including medical manuanls, facility rules, and patient data.
                  The system helps them answer any questions regarding a
                  assesment called the {' '}
                  <a
                    href="https://www.cms.gov/medicare/quality/nursing-home-improvement/minimum-data-sets-swing-bed-providers"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:no-underline"
                  >
                    Minimum Data Set (MDS) {' '}
                  </a>

                  often used in long term care facilities.
                  As a result, resolution times dropped from several days of manual workflows to seconds, significantly improving clinical efficiency.{' '}

                </p>

                <p className="text-base leading-relaxed text-gray-700">
                  I built the MVP alone and presented it to the customers:{' '}
                  <a
                    href="https://lopsided-avenue-523.notion.site/MDS-Assistant-User-Guide-2371aa42c9c180298bc1d0922481d1e6#%232371aa42c9c1801dab54fceec86ba347"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:no-underline"
                  >
                    MDS Assistant{' '}
                  </a>
                  <br />
                  After that, I integrated the MDS Assistant into the American Data platform,
                  a legacy EHR system. Where the customers can now directly access the chatbot without having to navigate through a separate application.{' '}
                </p>

                <p className="text-base leading-relaxed text-gray-700">
                  <br />
                  I stayed on part time through the fall semester, where I upgraded the production
                  RAG backend with file-search tool calling and token optimization, cutting the
                  hallucination rate by 35% and improving response accuracy by 20%. I also built a
                  real-time management dashboard that pulls from 40+ EHR modules through a Java
                  REST API and Supabase webhooks, so the team can track usage, monitor adoption,
                  and predict churn.
                </p>
                </div>
              </div>
            </section>

            {/* Projects Section */}
            <section id="projects" className="min-h-screen pt-8 md:pt-20 snap-start scroll-mt-16 md:scroll-mt-0 border-t border-gray-200">
              <p className="text-base leading-relaxed text-gray-700 mb-8 md:max-w-2xl">
                Creative experiments and interactive experiences.
              </p>

              <div className="space-y-10 md:max-w-2xl">
                <div>
                  <h3 className="text-lg font-medium text-black mb-3">Instagram Business Automation</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {instagramTags.map((t) => (
                      <span key={t} className={tagClass}>{t}</span>
                    ))}
                  </div>
                  <p className="text-base text-gray-600 mb-3">
                    Automated order processing system for Instagram business accounts,
                    streamlining customer interactions and order management. You could call it a an AI Agent for business owners..
                  </p>
                  <a
                    href="https://github.com/bradenweii/Instagram-business-order-automation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-400 hover:text-gray-600 underline"
                  >
                    View on GitHub
                  </a>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-black mb-3">Roomiez</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {roomiezTags.map((t) => (
                      <span key={t} className={tagClass}>{t}</span>
                    ))}
                  </div>
                  <p className="text-base text-gray-600 mb-3">
                    A cross-platform mobile app that helps university students find compatible
                    roommates, with real-time matching and profiles.
                  </p>
                  <a
                    href="https://github.com/tektaxi/roomiez"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-400 hover:text-gray-600 underline"
                  >
                    View on GitHub
                  </a>
                </div>

                <div
                  onClick={() => setShowIpod(true)}
                  className="cursor-pointer group"
                >
                  <h3 className="text-lg font-medium text-black mb-3 group-hover:text-gray-600 transition-colors">
                    Interactive iPod
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {ipodTags.map((t) => (
                      <span key={t} className={tagClass}>{t}</span>
                    ))}
                  </div>
                  <p className="text-base text-gray-600 mb-3">
                    A fully functional iPod interface built with React, featuring music playback,
                    navigation, and authentic iPod interactions. Click to experience the nostalgia.
                  </p>
                  <span className="text-sm text-gray-400 hover:text-gray-600 underline">
                    Try it out
                  </span>
                </div>
              </div>
            </section>

            {/* Resume Section */}
            <section id="resume" className="min-h-screen pt-8 md:pt-20 snap-start scroll-mt-16 md:scroll-mt-0 border-t border-gray-200">
              <p className="text-base leading-relaxed text-gray-700 mb-8 md:max-w-2xl">
                Download or view my resume.
              </p>

              <div className="space-y-6 md:max-w-2xl">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-medium text-black mb-4">Resume</h3>
                  <p className="text-base text-gray-600 mb-4">
                    View my complete resume with education, experience, and skills.
                  </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href="/resume.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors text-sm font-medium"
                    >
                      View PDF
                    </a>
                    <a
                      href="/resume.pdf"
                      download="Braden_Wei_Resume.pdf"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      Download PDF
                    </a>
                  </div>
                </div>

                {/* Embedded PDF Viewer */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-medium text-black mb-4">Preview</h3>
                  <div className="w-full h-64 md:h-96 border border-gray-200 rounded-md overflow-hidden">
                    <iframe
                      src="/resume.pdf"
                      className="w-full h-full"
                      title="Resume Preview"
                    />
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>

      {/* Visit counter */}
      <button
        onClick={addVisit}
        title="tap to leave your mark"
        className="fixed bottom-4 right-4 z-40 flex items-center gap-2 bg-white border border-solid border-gray-200 rounded-full pl-2 pr-4 py-1.5 shadow-sm hover:shadow-md transition-shadow"
      >
        <span className="flex items-center justify-center w-8 h-8 text-lg">{catEmojis[emojiIndex]}</span>
        <span className="text-sm text-gray-600 tabular-nums">{visits === null ? '···' : visits.toLocaleString()}</span>
      </button>
    </div>
  );
}

export default App;
