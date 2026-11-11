import React, { useState, useEffect } from 'react';
import { IpodAppComponent } from './components/IpodAppComponent';
import { AsciiDeathStar } from './components/AsciiDeathStar';
import { MeteorField } from './components/MeteorField';
import { CurrentLocation } from './components/CurrentLocation';
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

const tagClass = 'text-xs text-[#aab4bf] border border-[#353d48] rounded-full px-2.5 py-0.5';

const crusoeTags = ['Go', 'Kubernetes', 'Terraform', 'gRPC', 'Temporal', 'Helm', 'Prometheus', 'Grafana', 'GCP'];
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

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
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
    <div className="portfolio-space min-h-screen">
      <MeteorField />
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-40 bg-[#12171f] border-b border-[#353d48] px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-normal text-[#f2f4f5]">braden wei</h1>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-[#aab4bf] hover:text-white transition-colors"
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
                      ? 'bg-[#202833] text-[#f2f4f5] font-medium'
                      : 'text-[#aab4bf] hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Mobile Social Links */}
            <div className="mt-4 pt-4 border-t border-[#353d48]">
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#aab4bf] hover:text-white transition-colors"
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
              className="absolute -top-4 -right-4 bg-[#12171f] rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-[#28313d] transition-colors z-10"
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
            <h1 className="text-3xl font-normal text-[#f2f4f5] mb-2">braden wei</h1>
          </div>

          {/* Navigation */}
          <nav className="mb-12">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`block w-full text-left py-1 mb-2 text-sm transition-colors ${
                  activeSection === item.id
                    ? 'text-[#f2f4f5] font-medium'
                    : 'text-[#aab4bf] hover:text-white'
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
                className="block py-1 mb-2 text-sm text-[#aab4bf] hover:text-white transition-colors"
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
            <section id="about" className="min-h-screen pt-8 pb-8 md:pt-20 snap-start scroll-mt-16 md:scroll-mt-0 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] md:items-start md:gap-6 xl:gap-10">

              <div className="mb-8 md:max-w-2xl">
                <p className="text-base leading-relaxed text-[#c7cdd4] mb-6">
                  Hi I'm Braden, a CS student at McGill with a passion for solving problems and building startups.
                </p>

                <CurrentLocation />

                <p className="text-sm text-[#aab4bf] mb-4">internships</p>
                <div className="space-y-4">
                  {internships.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="group block w-full text-left"
                    >
                      <span className="text-sm text-[#aab4bf] mr-4">0{index + 1}</span>
                      <span className="text-lg text-[#f2f4f5] group-hover:text-white transition-colors">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="mt-12">
                  <p className="text-base leading-relaxed text-[#c7cdd4] mb-4">
                    Let's connect and create something amazing together.
                  </p>
                  <p className="text-base leading-relaxed text-[#c7cdd4]">
                    Feel free to reach out via email or connect with me on social platforms.
                    I'm always interested in discussing new projects, opportunities, or just
                    having a conversation about technology and design.
                  </p>
                </div>
              </div>
              <AsciiDeathStar />
            </section>

            {/* Work Section */}
            <section id="work" className="min-h-screen pt-8 md:pt-20 snap-start scroll-mt-16 md:scroll-mt-0 border-t border-[#353d48]">
              <p className="text-base leading-relaxed text-[#c7cdd4] mb-12 md:max-w-2xl">
                A deeper dive into my internships.
              </p>

              <div id="work-crusoe" className="mb-16 scroll-mt-8 md:scroll-mt-20 md:flex md:flex-row-reverse md:justify-between md:gap-12">
                <div className="mb-3 md:mb-0 md:w-40 md:flex-shrink-0 md:text-right md:pt-1">
                  <p className="text-sm text-[#f2f4f5]">Jun–Sep 2026</p>
                  <p className="text-sm text-[#aab4bf] mt-0.5">San Francisco</p>
                  <p className="text-sm text-[#aab4bf] mt-0.5">Software Engineering Intern</p>
                </div>
                <div className="md:flex-1 md:max-w-2xl">
                <h3 className="text-lg font-medium text-[#f2f4f5] mb-3">Crusoe</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {crusoeTags.map((t) => (
                    <span key={t} className={tagClass}>{t}</span>
                  ))}
                </div>
                <p className="text-base leading-relaxed text-[#c7cdd4] mb-6">
                  I interned on the managed Kubernetes data plane team at{' '}
                  <a
                    href="https://www.crusoe.ai/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:no-underline"
                  >
                    Crusoe
                  </a>{' '}
                  in San Francisco. I led the launch of node-pool autoscaling bounds across seven
                  repositories, from protobuf schemas and Go services through the client, CLI,
                  Terraform provider, and Cluster Autoscaler.
                </p>

                <p className="text-base leading-relaxed text-[#c7cdd4] mb-6">
                  I also built state-based scale-up fallback, cutting measured failover from
                  15 minutes to 41 seconds. For a new provisioning flow, I built VM and node-pool
                  quota enforcement in Go and Temporal, acquiring capacity permits before allocation
                  and surfacing quota failures in customer-facing health status.
                </p>

                <p className="text-base leading-relaxed text-[#c7cdd4]">
                  For the node-pool v2 rollout, I wrote the autoscaler compatibility design,
                  identified node deletion and rollout failure modes, and drove adoption of an API
                  for removing specific nodes.
                </p>

                <details className="mt-6 border-y border-[#353d48] py-4">
                  <summary className="cursor-pointer text-sm font-medium text-[#f2f4f5]">
                    Technical write-up: node-pool autoscaling and fallback
                  </summary>
                  <div className="mt-4 space-y-4 text-sm leading-relaxed text-[#c7cdd4]">
                    <p>
                      <strong>Scaling bounds.</strong> Minimum and maximum node counts used to live
                      in the autoscaler deployment flags. I moved them into the node-pool API so
                      customers could set limits through their existing provisioning tools and opt
                      into scale-to-zero. On CMK v2 with a supported autoscaler, the autoscaler reads
                      the bounds from <code>autoscaling_config</code>. Older builds still read{' '}
                      <code>--nodes</code>. Terraform can manage the bounds while ignoring changes
                      to <code>instance_count</code>, which the autoscaler adjusts at runtime.
                    </p>
                    <p>
                      <strong>Failed scale-ups.</strong> VM provisioning is asynchronous, so a
                      successful request can still end in a capacity failure. Waiting for the
                      operation would block the autoscaler loop. I used node-pool health to report
                      failed launches through the autoscaler's existing backoff mechanism. That lets
                      it defer the failed pool and try another eligible one while pods are pending.
                    </p>
                    <a
                      href="https://docs.crusoe.ai/orchestration/cmk/cmk-addons/index.html#node-pool-autoscaling-bounds"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block underline hover:no-underline"
                    >
                      Crusoe docs: Node pool autoscaling bounds
                    </a>
                  </div>
                </details>
                </div>
              </div>

              <div id="work-zebra" className="mb-16 scroll-mt-8 md:scroll-mt-20 md:flex md:flex-row-reverse md:justify-between md:gap-12">
                <div className="mb-3 md:mb-0 md:w-40 md:flex-shrink-0 md:text-right md:pt-1">
                  <p className="text-sm text-[#f2f4f5]">2026</p>
                  <p className="text-sm text-[#aab4bf] mt-0.5">Montreal</p>
                  <p className="text-sm text-[#aab4bf] mt-0.5">Software Engineering Intern</p>
                </div>
                <div className="md:flex-1 md:max-w-2xl">
                <h3 className="text-lg font-medium text-[#f2f4f5] mb-3">Zebra Technologies</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {zebraTags.map((t) => (
                    <span key={t} className={tagClass}>{t}</span>
                  ))}
                </div>
                <p className="text-base leading-relaxed text-[#c7cdd4] mb-6">
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

                <p className="text-base leading-relaxed text-[#c7cdd4]">
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
                  <p className="text-sm text-[#f2f4f5]">2025</p>
                  <p className="text-sm text-[#aab4bf] mt-0.5">Montreal &amp; Toronto</p>
                  <p className="text-sm text-[#aab4bf] mt-0.5">AI Engineer Intern</p>
                </div>
                <div className="md:flex-1 md:max-w-2xl">
                <h3 className="text-lg font-medium text-[#f2f4f5] mb-3">Valsoft Corporation</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {valsoftTags.map((t) => (
                    <span key={t} className={tagClass}>{t}</span>
                  ))}
                </div>
                <p className="text-base leading-relaxed text-[#c7cdd4] mb-6">
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

                <ul className="space-y-4 text-base leading-relaxed text-[#c7cdd4]">
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                    <span>Identified and built the highest-impact AI workflow for an acquired healthcare SaaS product, creating an MDS assistant that reduced manual support and form-completion errors by 60%.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                    <span>Designed a hybrid RAG system over a 900+ page regulatory manual to guide healthcare staff through complex MDS assessments with cited, context-specific answers.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                    <span>Built the production backend integrating Java EHR services with FastAPI inference, achieving sub-3-second response latency through caching and token optimization.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                    <span>Instrumented production usage and quality with Langfuse evals, tracing retrieval quality and hallucination rates across 10+ healthcare facilities.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                    <span>Returned part-time to productionize the MDS assistant, adding file-search tool calling and evaluation-driven retrieval improvements that reduced hallucinations by 35% and improved response accuracy by 20%.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                    <span>Built a real-time management dashboard across 40+ EHR modules using Java REST APIs and Supabase webhooks, enabling adoption and usage monitoring across customer deployments.</span>
                  </li>
                </ul>
                </div>
              </div>
            </section>

            {/* Projects Section */}
            <section id="projects" className="min-h-screen pt-8 md:pt-20 snap-start scroll-mt-16 md:scroll-mt-0 border-t border-[#353d48]">
              <p className="text-base leading-relaxed text-[#c7cdd4] mb-8 md:max-w-2xl">
                Creative experiments and interactive experiences.
              </p>

              <div className="space-y-10 md:max-w-2xl">
                <div>
                  <h3 className="text-lg font-medium text-[#f2f4f5] mb-3">Instagram Business Automation</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {instagramTags.map((t) => (
                      <span key={t} className={tagClass}>{t}</span>
                    ))}
                  </div>
                  <p className="text-base text-[#c7cdd4] mb-3">
                    Automated order processing system for Instagram business accounts,
                    streamlining customer interactions and order management. You could call it a an AI Agent for business owners..
                  </p>
                  <a
                    href="https://github.com/bradenweii/Instagram-business-order-automation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#aab4bf] hover:text-white underline"
                  >
                    View on GitHub
                  </a>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-[#f2f4f5] mb-3">Roomiez</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {roomiezTags.map((t) => (
                      <span key={t} className={tagClass}>{t}</span>
                    ))}
                  </div>
                  <p className="text-base text-[#c7cdd4] mb-3">
                    A cross-platform mobile app that helps university students find compatible
                    roommates, with real-time matching and profiles.
                  </p>
                  <a
                    href="https://github.com/tektaxi/roomiez"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#aab4bf] hover:text-white underline"
                  >
                    View on GitHub
                  </a>
                </div>

                <div
                  onClick={() => setShowIpod(true)}
                  className="cursor-pointer group"
                >
                  <h3 className="text-lg font-medium text-[#f2f4f5] mb-3 group-hover:text-white transition-colors">
                    Interactive iPod
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {ipodTags.map((t) => (
                      <span key={t} className={tagClass}>{t}</span>
                    ))}
                  </div>
                  <p className="text-base text-[#c7cdd4] mb-3">
                    A fully functional iPod interface built with React, featuring music playback,
                    navigation, and authentic iPod interactions. Click to experience the nostalgia.
                  </p>
                  <span className="text-sm text-[#aab4bf] hover:text-white underline">
                    Try it out
                  </span>
                </div>
              </div>
            </section>

            {/* Resume Section */}
            <section id="resume" className="min-h-screen pt-8 md:pt-20 snap-start scroll-mt-16 md:scroll-mt-0 border-t border-[#353d48]">
              <p className="text-base leading-relaxed text-[#c7cdd4] mb-8 md:max-w-2xl">
                Download or view my resume.
              </p>

              <div className="space-y-6 md:max-w-2xl">
                <div className="bg-[#12171f] rounded-lg p-6 shadow-sm border border-[#353d48]">
                  <h3 className="text-lg font-medium text-[#f2f4f5] mb-4">Resume</h3>
                  <p className="text-base text-[#c7cdd4] mb-4">
                    View my complete resume with education, experience, and skills.
                  </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href="/resume.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-[#27374a] text-white rounded-md hover:bg-[#344a64] transition-colors text-sm font-medium"
                    >
                      View PDF
                    </a>
                    <a
                      href="/resume.pdf"
                      download="Braden_Wei_Resume.pdf"
                      className="inline-flex items-center px-4 py-2 border border-[#4a5564] text-[#c7cdd4] rounded-md hover:bg-[#202833] transition-colors text-sm font-medium"
                    >
                      Download PDF
                    </a>
                  </div>
                </div>

                {/* Embedded PDF Viewer */}
                <div className="bg-[#12171f] rounded-lg p-6 shadow-sm border border-[#353d48]">
                  <h3 className="text-lg font-medium text-[#f2f4f5] mb-4">Preview</h3>
                  <div className="w-full h-64 md:h-96 border border-[#353d48] rounded-md overflow-hidden">
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

    </div>
  );
}

export default App;
