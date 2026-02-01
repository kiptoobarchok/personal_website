
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchBio, fetchProjects } from './api';

const CRTOverlay = () => (
  <div style={{
    pointerEvents: 'none',
    position: 'fixed',
    inset: 0,
    zIndex: 50,
    mixBlendMode: 'overlay',
    opacity: 0.18,
    background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 2px, transparent 2px, transparent 4px)'
  }} />
);

function TerminalWindow({ children }: { children: React.ReactNode }) {
  return (
    <div className="glass-terminal flicker" style={{
      position: 'absolute',
      top: '10vh',
      left: '10vw',
      width: 600,
      minWidth: 320,
      minHeight: 300,
      maxWidth: '90vw',
      maxHeight: '80vh',
      zIndex: 10,
      borderRadius: 16,
      overflow: 'hidden',
      border: '2px solid #222',
      boxShadow: '0 8px 32px 0 rgba(0,0,0,0.7)',
      background: 'rgba(22,22,26,0.85)',
      backdropFilter: 'blur(12px)'
    }}>
      <div className="terminal-header" style={{
        fontFamily: 'Fira Mono, JetBrains Mono, monospace',
        fontSize: '1.05rem',
        fontWeight: 500,
        letterSpacing: '0.08em',
        background: 'linear-gradient(90deg, #e0e0e0 0%, #b0b0b0 100%)',
        color: '#222',
        padding: '0.75em 1em',
        borderBottom: '1px solid #444',
        userSelect: 'none',
        cursor: 'move',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
      }}>
        $ <span style={{fontFamily: 'Fira Mono, JetBrains Mono, monospace', fontWeight: 500, fontSize: '1.05rem', letterSpacing: '0.08em'}}>
          k1ptooc0des
        </span>
      </div>
      <div className="terminal-content" style={{
        padding: '1.5em 1em 1em 1em',
        fontSize: '1.1rem',
        minHeight: 200,
        color: '#00FF41',
        fontFamily: 'JetBrains Mono, monospace',
        zIndex: 3
      }}>
        {children}
      </div>
    </div>
  );
}

export default function Home() {
  const [bio, setBio] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [cwd, setCwd] = useState<'/' | '/projects'>('/');
  const [showSidebar, setShowSidebar] = useState(false);
  const [hovered, setHovered] = useState<string|null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragConstraints, setDragConstraints] = useState({ left: 0, top: 0, right: 0, bottom: 0 });

  // Sidebar items for ls
  const sidebarItems = [
    { name: 'bio.txt', type: 'file' },
    { name: 'projects', type: 'dir' },
    ...(
      cwd === '/projects'
        ? projects.map((project: any) => ({ name: project.title, type: 'file', project }))
        : []
    ),
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDragConstraints({
        left: 0,
        top: 0,
        right: window.innerWidth - 600,
        bottom: window.innerHeight - 300,
      });
    }
  }, []);

  useEffect(() => {
    fetchBio().then(data => setBio(data[0] || null));
    fetchProjects().then(setProjects);
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [output]);

  function handleCommand(cmd: string) {
    let out = '';
    if (cmd === 'help') {
      out = 'Available commands: help, ls, cat bio.txt, cd projects, cat [project], clear';
    } else if (cmd === 'clear') {
      setOutput([]);
      return;
    } else if (cmd === 'ls') {
      setShowSidebar(true);
      out = cwd === '/' ? 'bio.txt  projects/' : projects.map(p => p.title).join('  ');
    } else if (cmd === 'cat bio.txt') {
      out = bio ? `${bio.name}\n${bio.summary}` : 'No bio.';
    } else if (cmd === 'cd projects') {
      setCwd('/projects');
      out = projects.map(p => p.title).join('  ');
    } else if (cmd.startsWith('cat ') && cwd === '/projects') {
      const proj = projects.find(p => p.title === cmd.slice(4));
      out = proj ? `${proj.title}\n${proj.description}\n${proj.url}` : 'Project not found.';
    } else if (cmd === 'cd ..' || cmd === 'cd /') {
      setCwd('/');
      out = 'bio.txt  projects/';
    } else {
      out = 'Command not found.';
    }
    setOutput(o => [...o, `$ ${cmd}`, out]);
    if (cmd !== 'ls') setShowSidebar(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim()) {
      handleCommand(input.trim());
      setInput('');
    }
  }

  // --- UI Render ---
  return (
    <>
      <CRTOverlay />
      <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 10 }}>
        <motion.div
          style={{ position: 'absolute', left: 48, top: 48, zIndex: 20, cursor: 'grab', pointerEvents: 'auto' }}
          drag
          dragMomentum={false}
          dragElastic={0.18}
          dragConstraints={dragConstraints}
        >
          <TerminalWindow>
            <div style={{ minHeight: 180 }}>
              {output.map((line, i) => (
                <div key={i} style={{ whiteSpace: 'pre-wrap' }}>{line}</div>
              ))}
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', marginTop: 16 }}>
              <span style={{ color: '#00FF41', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#00FF41',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '1.1rem',
                  flex: 1,
                  marginLeft: 8
                }}
                autoFocus
                autoComplete="off"
              />
            </form>
          </TerminalWindow>
          {showSidebar && (
            <div
              className="hacker-sidebar"
              style={{
                width: 240,
                background: 'rgba(10,20,10,0.97)',
                borderLeft: '2px solid #00FF41',
                boxShadow: '-8px 0 32px #00FF4133',
                padding: '1.5em 0.5em',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                zIndex: 30,
                fontFamily: 'Fira Mono, JetBrains Mono, monospace',
                fontSize: '1.02rem',
                color: '#00FF41',
                position: 'absolute',
                left: 600,
                top: 0,
                height: '100%',
                borderTopRightRadius: 16,
                borderBottomRightRadius: 16,
                marginTop: 0,
                marginLeft: 0,
                minHeight: 320,
                transition: 'opacity 0.3s',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                pointerEvents: 'auto',
              }}
            >
              {sidebarItems.map((item, idx) => {
                return (
                  <div
                    key={item.name}
                    className="sidebar-item"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      cursor: 'pointer',
                      padding: '0.4em 0.7em',
                      borderRadius: 6,
                      background: hovered === item.name ? 'rgba(0,255,65,0.08)' : 'transparent',
                      border: hovered === item.name ? '1.5px solid #00FF41' : '1.5px solid transparent',
                      boxShadow: hovered === item.name ? '0 0 8px #00FF41' : 'none',
                      fontWeight: hovered === item.name ? 700 : 500,
                      letterSpacing: '0.04em',
                      position: 'relative',
                      transition: 'all 0.18s',
                    }}
                    onMouseEnter={() => setHovered(item.name)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => {
                      if (item.type === 'file' && item.name === 'bio.txt') {
                        setInput('cat bio.txt');
                        handleCommand('cat bio.txt');
                      } else if (item.type === 'dir' && item.name === 'projects') {
                        setInput('cd projects');
                        handleCommand('cd projects');
                      } else if (item.type === 'file' && (item as any).project) {
                        setInput(`cat ${(item as any).project.title}`);
                        handleCommand(`cat ${(item as any).project.title}`);
                      }
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: '1.1em', color: '#00FF41' }}>
                      {item.type === 'dir' ? <>&#128193;</> : <>&#128196;</>}
                    </span>
                    <span>{item.name}{item.type === 'dir' ? '/' : ''}</span>
                    {/* Bio preview on hover */}
                    {item.name === 'bio.txt' && hovered === 'bio.txt' && bio && (
                      <div
                        style={{
                          position: 'absolute',
                          left: '110%',
                          top: 0,
                          minWidth: 180,
                          background: 'rgba(22,22,26,0.98)',
                          color: '#00FF41',
                          border: '1.5px solid #00FF41',
                          borderRadius: 8,
                          boxShadow: '0 2px 16px #00FF41aa',
                          padding: '0.7em 1em',
                          zIndex: 99,
                          fontSize: '0.98em',
                          fontFamily: 'Fira Mono, JetBrains Mono, monospace',
                          pointerEvents: 'none',
                          whiteSpace: 'pre-line',
                        }}
                      >
                        <strong>{bio.name}</strong>
                        <br />
                        {bio.summary}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}