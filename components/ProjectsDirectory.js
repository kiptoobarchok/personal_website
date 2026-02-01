// Creative Projects Directory Display for Glass-Terminal
// Each project is rendered as a directory with 3D glossy button and chrome accent
import React from 'react';
import styles from '../styles/glass-terminal.css';

const projects = [
  {
    name: 'matrix-portfolio',
    description: 'A portfolio site with Matrix-style data stream and CRT effects.'
  },
  {
    name: 'chrome-blog',
    description: 'A blog engine with chrome textures and liquid blobs.'
  },
  {
    name: 'terminal-chat',
    description: 'A real-time chat app in a draggable terminal window.'
  }
];

export default function ProjectsDirectory() {
  return (
    <div className="projects-dir">
      <h2 className="terminal-header">/projects</h2>
      <div className="projects-list">
        {projects.map(project => (
          <div key={project.name} className="project-entry">
            <button className="glossy-btn glitch-link">
              <span className="project-folder">{project.name}/</span>
            </button>
            <div className="project-desc">{project.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
