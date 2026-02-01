// Command-line input handler for Glass-Terminal
// Supports: help, ls, cat bio.txt, projects as directories

const fileSystem = {
  'bio.txt': 'Caleb Kiptoo - Full-Stack Creative Developer. Specializing in Cyber-Y2K and Terminal-Core aesthetics. I build digital experiences that feel like hacking into the future.',
  'projects': {
    'matrix-portfolio': 'A portfolio site with Matrix-style data stream and CRT effects.',
    'chrome-blog': 'A blog engine with chrome textures and liquid blobs.',
    'terminal-chat': 'A real-time chat app in a draggable terminal window.'
  }
};

function parseCommand(input) {
  const cmd = input.trim().split(' ');
  switch (cmd[0]) {
    case 'help':
      return `Available commands:\nhelp\nls\ncat [file]\ncd [dir]\n`;
    case 'ls':
      return Object.keys(fileSystem).map(k => {
        if (typeof fileSystem[k] === 'object') return k + '/';
        return k;
      }).join('  ');
    case 'cat':
      if (cmd[1] === 'bio.txt') return fileSystem['bio.txt'];
      if (cmd[1] && fileSystem['projects'] && fileSystem['projects'][cmd[1]]) {
        return fileSystem['projects'][cmd[1]];
      }
      return 'File not found.';
    case 'cd':
      if (cmd[1] === 'projects') {
        return Object.keys(fileSystem['projects']).map(p => p + '/').join('  ');
      }
      return 'Directory not found.';
    default:
      return `Command not found: ${cmd[0]}`;
  }
}

export default parseCommand;
