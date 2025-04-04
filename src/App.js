import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { mainBody } from "./editable-stuff/config.js";
import "./App.css";
import resume from './editable-stuff/resume.pdf';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const projects = [
    {
      title: "Instagram Business Order Automation",
      website: null, // Add website link if available
      description: "This workflow automates order processing for Instagram business owners by scanning chats, identifying orders, generating receipts via ChatGPT, saving them to a csv(which the user can open in google sheets), and sending receipts to customers—streamlining order managements and improving efficiency.",
      github: "https://github.com/bradenweii/gumloop_challenge"
    },
    {
      title: "Roomiez",
      website: null, // Add website link if available
      description: "A roommate matching app for college students!",
      github: "https://github.com/tektaxi/roomiez"
    },
    {
      title: "sign recognition",
      website: null, // Add website link if available
      description: "Sign langue interpreter",
      github: "https://github.com/bradenweii/sign-recognition"

    },
  ];

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL + "/"}>
      <div className="site-container">
        <header>
          <div className="header-content">
            <h1 className="site-title">Braden Wei</h1>
            
            <div className="nav-container">
              <button 
                className="hamburger-menu"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle navigation menu"
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
              
              <nav className={`navigation ${isMenuOpen ? 'active' : ''}`}>
                <a href="#about" onClick={() => setIsMenuOpen(false)}>About Me</a>
                <a href="#projects" onClick={() => setIsMenuOpen(false)}>Projects</a>
                <a href="#blog" onClick={() => setIsMenuOpen(false)}>Blog</a>
                <a href={resume} target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)}>Resume</a>
              </nav>
            </div>
          </div>
        </header>
        
        <main>
          <section id="about">
            <h2>About Me</h2>
            <h4>Introduction</h4>
            <div className="content">
              <p>
              Hi I'm Braden, a CS & Stats student at McGill University with a passion for building startups. 
              
              <br></br>
              <br></br>Here's my <a href={resume} target="_blank" rel="noopener noreferrer">resume</a> with a detailed description of my experiences.<br></br>
<br></br>
I've worked with a range of technologies, from building full-stack web apps with React, Node.js, to applying machine learning with Python and OpenCV in projects.

Outside of school, I enjoy working on hackathon projects, exploring new technologies, and reading about startups, finance, and new innovations.

I believe in using software to solve real-world problems in simple, accessible ways. Recently I've built this workflow automation tools for small businesses on Instagram to automatically take orders though DMs. Check it out here: <a href="https://ig-business-order-automation.vercel.app" target="_blank" rel="noopener noreferrer">https://ig-business-order-automation.vercel.app</a>



              </p>
              {/* Add your about content here */}
            </div>
          </section>

          <section id="projects">
            <h2>Selected Projects</h2>
            <div className="projects-table">
              <table>
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Description</th>
                    <th>Link</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project, index) => (
                    <tr key={index}>
                      <td>{project.title}</td>
                      <td>{project.description}</td>
                      <td>
                        {project.website && (
                          <a href={project.website} target="_blank" rel="noopener noreferrer">
                            Website
                          </a>
                        )}
                        <a href={project.github} target="_blank" rel="noopener noreferrer">
                          Github
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>

        <footer>
          <div className="footer-content">
            <p>© 2024 Braden Wei. Built with React.</p>
            <div className="footer-links">
              <a href="https://github.com/bradenweii" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="https://www.linkedin.com/in/bradenwei/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href={resume} target="_blank" rel="noopener noreferrer">Resume</a>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
