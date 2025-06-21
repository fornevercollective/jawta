// JAWTA Terminal JavaScript - Modern Figma-inspired Interface
// Connected to jawta+term folder structure

class JAWTATerminal {
    constructor() {
        this.terminal = null;
        this.isInitialized = false;
        this.commandHistory = [];
        this.currentHistoryIndex = -1;
        this.currentPath = '~/jawta';
        this.systemStatus = {
            cpu: 12,
            memory: 256,
            network: 'online'
        };
        
        this.initializeTerminal();
        this.setupEventListeners();
        this.startSystemMonitoring();
    }
    
    initializeTerminal() {
        // Initialize XTerm.js with custom theme
        this.terminal = new Terminal({
            cursorBlink: true,
            cursorStyle: 'block',
            fontSize: 14,
            fontFamily: 'JetBrains Mono, Source Code Pro, Consolas, Monaco, monospace',
            theme: {
                background: '#0f0f0f',
                foreground: '#ffffff',
                cursor: '#06b6d4',
                cursorAccent: '#ffffff',
                selection: 'rgba(6, 182, 212, 0.3)',
                black: '#000000',
                red: '#ef4444',
                green: '#10b981',
                yellow: '#f59e0b',
                blue: '#06b6d4',
                magenta: '#8b5cf6',
                cyan: '#06b6d4',
                white: '#ffffff',
                brightBlack: '#374151',
                brightRed: '#f87171',
                brightGreen: '#34d399',
                brightYellow: '#fbbf24',
                brightBlue: '#38bdf8',
                brightMagenta: '#a78bfa',
                brightCyan: '#22d3ee',
                brightWhite: '#ffffff'
            },
            cols: 80,
            rows: 24,
            scrollback: 1000
        });
        
        // Mount terminal to DOM
        const terminalElement = document.getElementById('terminal');
        if (terminalElement) {
            this.terminal.open(terminalElement);
            this.isInitialized = true;
            this.showWelcomeMessage();
            this.showPrompt();
        }
    }
    
    setupEventListeners() {
        // Terminal data handler
        if (this.terminal) {
            this.terminal.onData(data => this.handleTerminalInput(data));
        }
        
        // Command palette
        const commandPaletteBtn = document.getElementById('command-palette-btn');
        const commandPalette = document.getElementById('command-palette');
        const paletteOverlay = document.getElementById('palette-overlay');
        const commandInput = document.getElementById('command-input');
        
        if (commandPaletteBtn && commandPalette) {
            commandPaletteBtn.addEventListener('click', () => this.toggleCommandPalette());
            
            // Keyboard shortcut (Cmd/Ctrl + K)
            document.addEventListener('keydown', (e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                    e.preventDefault();
                    this.toggleCommandPalette();
                }
                
                if (e.key === 'Escape') {
                    this.hideCommandPalette();
                }
            });
            
            if (paletteOverlay) {
                paletteOverlay.addEventListener('click', () => this.hideCommandPalette());
            }
            
            if (commandInput) {
                commandInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        const command = commandInput.value.trim();
                        if (command) {
                            this.executeCommand(command);
                            this.hideCommandPalette();
                            commandInput.value = '';
                        }
                    }
                });
            }
        }
        
        // Launch terminal button
        const launchBtn = document.getElementById('launch-terminal-btn');
        if (launchBtn) {
            launchBtn.addEventListener('click', () => {
                this.focusTerminal();
                this.executeCommand('jawta help');
            });
        }
        
        // Quick command buttons
        window.runQuickCommand = (command) => this.executeCommand(`jawta ${command}`);
        window.executeFromPalette = (command) => {
            this.executeCommand(command);
            this.hideCommandPalette();
        };
    }
    
    showWelcomeMessage() {
        if (!this.terminal) return;
        
        const welcome = [
            '\\x1b[36m╔══════════════════════════════════════════════════════════════════════════════╗\\x1b[0m',
            '\\x1b[36m║\\x1b[0m                              \\x1b[1;36mJAWTA TERMINAL v0.3.0\\x1b[0m                              \\x1b[36m║\\x1b[0m',
            '\\x1b[36m║\\x1b[0m                    \\x1b[2mAdvanced Signal Processing & Intelligence CLI\\x1b[0m                    \\x1b[36m║\\x1b[0m',
            '\\x1b[36m╚══════════════════════════════════════════════════════════════════════════════╝\\x1b[0m',
            '',
            '\\x1b[32m✓\\x1b[0m Signal processing modules loaded',
            '\\x1b[32m✓\\x1b[0m Encryption utilities ready',
            '\\x1b[32m✓\\x1b[0m Communication protocols active',
            '\\x1b[32m✓\\x1b[0m RF analysis tools available',
            '',
            '\\x1b[1;33mType \\x1b[36mjawta help\\x1b[33m to get started or \\x1b[36mjawta examples\\x1b[33m to see usage examples.\\x1b[0m',
            ''
        ];
        
        welcome.forEach(line => {
            this.terminal.writeln(line);
        });
    }
    
    showPrompt() {
        if (!this.terminal) return;
        this.terminal.write(`\\x1b[1;32mjawta@terminal\\x1b[0m:\\x1b[1;34m${this.currentPath}\\x1b[0m$ `);
    }
    
    handleTerminalInput(data) {
        if (!this.terminal) return;
        
        const code = data.charCodeAt(0);
        
        // Handle special keys
        if (code === 13) { // Enter
            this.terminal.writeln('');
            const command = this.currentCommand || '';
            this.currentCommand = '';
            this.processCommand(command.trim());
        } else if (code === 127) { // Backspace
            if (this.currentCommand && this.currentCommand.length > 0) {
                this.currentCommand = this.currentCommand.slice(0, -1);
                this.terminal.write('\\x1b[D \\x1b[D');
            }
        } else if (code === 27) { // ESC sequences (arrow keys, etc.)
            // Handle arrow keys for command history
            return;
        } else if (code >= 32 && code <= 126) { // Printable characters
            this.currentCommand = (this.currentCommand || '') + data;
            this.terminal.write(data);
        }
    }
    
    processCommand(command) {
        if (!command) {
            this.showPrompt();
            return;
        }
        
        this.commandHistory.push(command);
        this.currentHistoryIndex = this.commandHistory.length;
        
        this.executeCommand(command);
    }
    
    executeCommand(command) {
        if (!this.terminal) return;
        
        const args = command.split(' ');
        const mainCommand = args[0];
        
        // Handle jawta commands
        if (mainCommand === 'jawta') {
            this.handleJawtaCommand(args.slice(1));
        } else if (mainCommand === 'clear') {
            this.terminal.clear();
        } else if (mainCommand === 'help') {
            this.showHelp();
        } else if (mainCommand === 'exit') {
            this.terminal.writeln('\\x1b[33mGoodbye! Terminal session ended.\\x1b[0m');
        } else {
            this.terminal.writeln(`\\x1b[31mCommand not found: ${command}\\x1b[0m`);
            this.terminal.writeln('\\x1b[33mTry "jawta help" for available commands.\\x1b[0m');
        }
        
        this.showPrompt();
    }
    
    handleJawtaCommand(args) {
        const subCommand = args[0];
        
        switch (subCommand) {
            case 'help':
                this.showJawtaHelp();
                break;
            case 'version':
                this.showVersion();
                break;
            case 'examples':
                this.showExamples();
                break;
            case 'text':
                this.handleTextCommand(args.slice(1));
                break;
            case 'crypto':
                this.handleCryptoCommand(args.slice(1));
                break;
            case 'signal':
                this.handleSignalCommand(args.slice(1));
                break;
            case 'status':
                this.showSystemStatus();
                break;
            default:
                this.terminal.writeln(`\\x1b[31mUnknown jawta command: ${subCommand}\\x1b[0m`);
                this.terminal.writeln('\\x1b[33mUse "jawta help" to see available commands.\\x1b[0m');
        }
    }
    
    handleTextCommand(args) {
        const operation = args[0];
        const text = args.slice(1).join(' ').replace(/['"]/g, '');
        
        switch (operation) {
            case 'morse':
                if (text) {
                    const morse = this.textToMorse(text);
                    this.terminal.writeln(`\\x1b[36mMorse Code:\\x1b[0m ${morse}`);
                } else {
                    this.terminal.writeln('\\x1b[31mUsage: jawta text morse "your text"\\x1b[0m');
                }
                break;
            case 'ascii':
                if (text) {
                    this.showAsciiArt(text);
                } else {
                    this.terminal.writeln('\\x1b[31mUsage: jawta text ascii "your text"\\x1b[0m');
                }
                break;
            case 'binary':
                if (text) {
                    const binary = this.textToBinary(text);
                    this.terminal.writeln(`\\x1b[36mBinary:\\x1b[0m ${binary}`);
                } else {
                    this.terminal.writeln('\\x1b[31mUsage: jawta text binary "your text"\\x1b[0m');
                }
                break;
            default:
                this.terminal.writeln(`\\x1b[31mUnknown text operation: ${operation}\\x1b[0m`);
                this.terminal.writeln('\\x1b[33mAvailable: morse, ascii, binary\\x1b[0m');
        }
    }
    
    handleCryptoCommand(args) {
        const operation = args[0];
        const text = args.slice(1).join(' ').replace(/['"]/g, '');
        
        switch (operation) {
            case 'encrypt':
                if (text) {
                    const encrypted = btoa(text); // Simple base64 encoding for demo
                    this.terminal.writeln(`\\x1b[36mEncrypted (Base64):\\x1b[0m ${encrypted}`);
                } else {
                    this.terminal.writeln('\\x1b[31mUsage: jawta crypto encrypt "your text"\\x1b[0m');
                }
                break;
            case 'decrypt':
                if (text) {
                    try {
                        const decrypted = atob(text);
                        this.terminal.writeln(`\\x1b[36mDecrypted:\\x1b[0m ${decrypted}`);
                    } catch (e) {
                        this.terminal.writeln('\\x1b[31mError: Invalid base64 input\\x1b[0m');
                    }
                } else {
                    this.terminal.writeln('\\x1b[31mUsage: jawta crypto decrypt "encrypted_text"\\x1b[0m');
                }
                break;
            default:
                this.terminal.writeln(`\\x1b[31mUnknown crypto operation: ${operation}\\x1b[0m`);
                this.terminal.writeln('\\x1b[33mAvailable: encrypt, decrypt\\x1b[0m');
        }
    }
    
    handleSignalCommand(args) {
        const operation = args[0];
        
        switch (operation) {
            case 'generate':
                this.terminal.writeln('\\x1b[32m✓\\x1b[0m Generating test signal...');
                this.terminal.writeln('\\x1b[36mSignal Type:\\x1b[0m Sine Wave');
                this.terminal.writeln('\\x1b[36mFrequency:\\x1b[0m 1000 Hz');
                this.terminal.writeln('\\x1b[36mAmplitude:\\x1b[0m 1.0');
                this.terminal.writeln('\\x1b[36mDuration:\\x1b[0m 5 seconds');
                break;
            case 'analyze':
                this.terminal.writeln('\\x1b[32m✓\\x1b[0m Starting signal analysis...');
                this.terminal.writeln('\\x1b[36mFFT Size:\\x1b[0m 4096');
                this.terminal.writeln('\\x1b[36mSample Rate:\\x1b[0m 44.1 kHz');
                this.terminal.writeln('\\x1b[36mWindow:\\x1b[0m Hamming');
                break;
            default:
                this.terminal.writeln(`\\x1b[31mUnknown signal operation: ${operation}\\x1b[0m`);
                this.terminal.writeln('\\x1b[33mAvailable: generate, analyze\\x1b[0m');
        }
    }
    
    showJawtaHelp() {
        const help = [
            '\\x1b[1;36mJAWTA Terminal Commands:\\x1b[0m',
            '',
            '\\x1b[1;33mText Processing:\\x1b[0m',
            '  \\x1b[32mjawta text morse "text"\\x1b[0m     - Convert text to Morse code',
            '  \\x1b[32mjawta text ascii "text"\\x1b[0m     - Generate ASCII art',
            '  \\x1b[32mjawta text binary "text"\\x1b[0m    - Convert text to binary',
            '',
            '\\x1b[1;33mCryptography:\\x1b[0m',
            '  \\x1b[32mjawta crypto encrypt "text"\\x1b[0m - Encrypt text data',
            '  \\x1b[32mjawta crypto decrypt "data"\\x1b[0m - Decrypt encoded data',
            '',
            '\\x1b[1;33mSignal Processing:\\x1b[0m',
            '  \\x1b[32mjawta signal generate\\x1b[0m       - Generate test signals',
            '  \\x1b[32mjawta signal analyze\\x1b[0m        - Analyze signal patterns',
            '',
            '\\x1b[1;33mSystem:\\x1b[0m',
            '  \\x1b[32mjawta version\\x1b[0m              - Show version information',
            '  \\x1b[32mjawta status\\x1b[0m               - Show system status',
            '  \\x1b[32mjawta examples\\x1b[0m             - Show usage examples',
            ''
        ];
        
        help.forEach(line => this.terminal.writeln(line));
    }
    
    showExamples() {
        const examples = [
            '\\x1b[1;36mJAWTA Usage Examples:\\x1b[0m',
            '',
            '\\x1b[33m# Convert text to Morse code\\x1b[0m',
            '\\x1b[32mjawta text morse "HELLO WORLD"\\x1b[0m',
            '\\x1b[2m.... . .-.. .-.. --- / .-- --- .-. .-.. -..\\x1b[0m',
            '',
            '\\x1b[33m# Encrypt sensitive data\\x1b[0m',
            '\\x1b[32mjawta crypto encrypt "secret message"\\x1b[0m',
            '\\x1b[2mc2VjcmV0IG1lc3NhZ2U=\\x1b[0m',
            '',
            '\\x1b[33m# Generate ASCII art\\x1b[0m',
            '\\x1b[32mjawta text ascii "JAWTA"\\x1b[0m',
            '',
            '\\x1b[33m# Analyze signal patterns\\x1b[0m',
            '\\x1b[32mjawta signal analyze\\x1b[0m',
            ''
        ];
        
        examples.forEach(line => this.terminal.writeln(line));
    }
    
    showVersion() {
        this.terminal.writeln('\\x1b[1;36mJAWTA Terminal v0.3.0\\x1b[0m');
        this.terminal.writeln('\\x1b[2mAdvanced Signal Processing & Intelligence CLI\\x1b[0m');
        this.terminal.writeln('');
        this.terminal.writeln('\\x1b[33mBuild:\\x1b[0m 2025.06.20');
        this.terminal.writeln('\\x1b[33mPlatform:\\x1b[0m Web Terminal');
        this.terminal.writeln('\\x1b[33mLicense:\\x1b[0m MIT');
    }
    
    showSystemStatus() {
        this.terminal.writeln('\\x1b[1;36mSystem Status:\\x1b[0m');
        this.terminal.writeln('');
        this.terminal.writeln(`\\x1b[33mCPU Usage:\\x1b[0m ${this.systemStatus.cpu}%`);
        this.terminal.writeln(`\\x1b[33mMemory:\\x1b[0m ${this.systemStatus.memory}MB`);
        this.terminal.writeln(`\\x1b[33mNetwork:\\x1b[0m ${this.systemStatus.network}`);
        this.terminal.writeln(`\\x1b[33mModules:\\x1b[0m \\x1b[32mAll systems operational\\x1b[0m`);
    }
    
    textToMorse(text) {
        const morseCode = {
            'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
            'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
            'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
            'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
            'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
            '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
            '8': '---..', '9': '----.', ' ': '/'
        };
        
        return text.toUpperCase().split('').map(char => morseCode[char] || '?').join(' ');
    }
    
    textToBinary(text) {
        return text.split('').map(char => 
            char.charCodeAt(0).toString(2).padStart(8, '0')
        ).join(' ');
    }
    
    showAsciiArt(text) {
        // Simple ASCII art generator
        this.terminal.writeln('\\x1b[36mASCII Art:\\x1b[0m');
        this.terminal.writeln('');
        
        const art = text.toUpperCase().split('').map(char => {
            switch(char) {
                case 'J': return ['  ██  ', ' ███  ', '  ██  ', '  ██  ', '████  '];
                case 'A': return [' ████ ', '██  ██', '██████', '██  ██', '██  ██'];
                case 'W': return ['██   ██', '██ █ ██', '██ █ ██', '██████ ', '██   ██'];
                case 'T': return ['██████', '  ██  ', '  ██  ', '  ██  ', '  ██  '];
                default: return ['      ', '      ', '      ', '      ', '      '];
            }
        });
        
        for (let i = 0; i < 5; i++) {
            const line = art.map(charArt => charArt[i]).join(' ');
            this.terminal.writeln(`\\x1b[36m${line}\\x1b[0m`);
        }
    }
    
    toggleCommandPalette() {
        const palette = document.getElementById('command-palette');
        const overlay = document.getElementById('palette-overlay');
        const input = document.getElementById('command-input');
        
        if (palette && overlay) {
            const isActive = palette.classList.contains('active');
            
            if (isActive) {
                this.hideCommandPalette();
            } else {
                palette.classList.add('active');
                overlay.classList.add('opacity-100', 'visible');
                overlay.classList.remove('opacity-0', 'invisible');
                if (input) input.focus();
            }
        }
    }
    
    hideCommandPalette() {
        const palette = document.getElementById('command-palette');
        const overlay = document.getElementById('palette-overlay');
        
        if (palette && overlay) {
            palette.classList.remove('active');
            overlay.classList.add('opacity-0', 'invisible');
            overlay.classList.remove('opacity-100', 'visible');
        }
    }
    
    focusTerminal() {
        if (this.terminal) {
            this.terminal.focus();
        }
    }
    
    startSystemMonitoring() {
        // Simulate system monitoring
        setInterval(() => {
            this.systemStatus.cpu = Math.floor(Math.random() * 30) + 10;
            this.systemStatus.memory = Math.floor(Math.random() * 200) + 200;
            
            // Update UI indicators
            this.updateSystemStatusUI();
        }, 5000);
    }
    
    updateSystemStatusUI() {
        // Update the sidebar system status if visible
        const cpuElement = document.querySelector('[data-status="cpu"]');
        const memoryElement = document.querySelector('[data-status="memory"]');
        
        if (cpuElement) {
            cpuElement.textContent = `${this.systemStatus.cpu}%`;
        }
        
        if (memoryElement) {
            memoryElement.textContent = `${this.systemStatus.memory}MB`;
        }
    }
}

// Initialize terminal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add some delay to ensure XTerm.js is loaded
    setTimeout(() => {
        window.jawtaTerminal = new JAWTATerminal();
    }, 100);
});

// Export for jawta+term folder integration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JAWTATerminal;
}
