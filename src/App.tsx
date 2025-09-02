import React, { useState } from 'react';
import { IpodAppComponent } from './components/IpodAppComponent';
import './App.css';

function App() {
  const [showIpod, setShowIpod] = useState(false);
  const [activeSection, setActiveSection] = useState('about');

  const navigationItems = [
    { id: 'about', label: 'profile' },
    { id: 'work', label: 'work' },
    { id: 'projects', label: 'projects' },
    { id: 'resume', label: 'resume' },
    { id: 'contact', label: 'contact' }
  ];

  const socialLinks = [
    { label: 'email', href: 'mailto:bradenwei00@gmail.com' },
    { label: 'github', href: 'https://github.com/bradenweii' },
    { label: 'linkedin', href: 'https://linkedin.com/in/bradenwei' },
    { label: 'instagram', href: 'https://instagram.com/braden_wei' }
  ];

  return (
    <div className="min-h-screen bg-white flex">
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

      {/* Left Sidebar */}
      <div className="w-64 min-h-screen p-8 flex flex-col">
        {/* Name */}
        <div className="mb-12">
          <h1 className="text-3xl font-normal text-black mb-2">braden wei</h1>
        </div>

        {/* Navigation */}
        <nav className="mb-12">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
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
      <div className="flex-1 p-8 pl-0">
        <div className="max-w-2xl">
          
          {/* About Section */}
          {activeSection === 'about' && (
            <div className="pt-20">
              
              <div className="mb-8">
                                <p className="text-base leading-relaxed text-gray-700 mb-6">
                  Hi I'm Braden, a CS student at McGill with a passion for solving problems and building startups.
                  I recently finished interning at{' '}
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
                  I'm continuning to work part time at my current internship through the fall semester, exploring and building more interesting AI features that might be useful for the healthcare industry.
                </p>
              </div>
            </div>
          )}

          {/* Work Section */}
          {activeSection === 'work' && (
            <div className="pt-20">
              <p className="text-base leading-relaxed text-gray-700 mb-8">
                A selection of recent work and ongoing projects.
              </p>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-black mb-2">Instagram Business Automation</h3>
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
                  <h3 className="text-lg font-medium text-black mb-2">Roomiez</h3>
                  <p className="text-base text-gray-600 mb-3">
                    A platform connecting people looking for roommates and shared living spaces, 
                    built with modern web technologies.
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

                <div>
                  <h3 className="text-lg font-medium text-black mb-2">Sign Recognition</h3>
                  <p className="text-base text-gray-600 mb-3">
                    Machine learning project for recognizing and interpreting various signs 
                    using computer vision techniques.
                  </p>
                  <a 
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-400 hover:text-gray-600 underline"
                  >
                    View on GitHub
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Projects Section */}
          {activeSection === 'projects' && (
            <div className="pt-20">
              <p className="text-base leading-relaxed text-gray-700 mb-8">
                Creative experiments and interactive experiences.
              </p>
              
              <div className="space-y-8">
                <div 
                  onClick={() => setShowIpod(true)}
                  className="cursor-pointer group"
                >
                  <h3 className="text-lg font-medium text-black mb-2 group-hover:text-gray-600 transition-colors">
                    Interactive iPod
                  </h3>
                  <p className="text-base text-gray-600 mb-3">
                    A fully functional iPod interface built with React, featuring music playback, 
                    navigation, and authentic iPod interactions. Click to experience the nostalgia.
                  </p>
                  <span className="text-sm text-gray-400 hover:text-gray-600 underline">
                    Try it out
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-black mb-2">Portfolio Website</h3>
                  <p className="text-base text-gray-600 mb-3">
                    This very website you're looking at - a clean, minimalistic portfolio 
                    built with React and Tailwind CSS, inspired by great design.
                  </p>
                  <span className="text-sm text-gray-400">
                    You're here now
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Resume Section */}
          {activeSection === 'resume' && (
            <div className="pt-20">
              <p className="text-base leading-relaxed text-gray-700 mb-8">
                Download or view my resume.
              </p>
              
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-medium text-black mb-4">Resume</h3>
                  <p className="text-base text-gray-600 mb-4">
                    View my complete resume with education, experience, and skills.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a 
                      href="/cv__Copy_.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors text-sm font-medium"
                    >
                      View PDF
                    </a>
                    <a 
                      href="/cv__Copy_.pdf"
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
                  <div className="w-full h-96 border border-gray-200 rounded-md overflow-hidden">
                    <iframe
                      src="/cv__Copy_.pdf"
                      className="w-full h-full"
                      title="Resume Preview"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contact Section */}
          {activeSection === 'contact' && (
            <div className="pt-20">
              <p className="text-base leading-relaxed text-gray-700 mb-8">
                Let's connect and create something amazing together.
              </p>
              
              <div className="space-y-4">
                <p className="text-base text-gray-700">
                  Feel free to reach out via email or connect with me on social platforms. 
                  I'm always interested in discussing new projects, opportunities, or just 
                  having a conversation about technology and design.
                </p>
                
                <div className="pt-4">
                  <p className="text-sm text-gray-500 mb-2">Get in touch:</p>
                  <div className="space-y-1">
                    {socialLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-base text-gray-700 hover:text-gray-900 underline"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default App; 