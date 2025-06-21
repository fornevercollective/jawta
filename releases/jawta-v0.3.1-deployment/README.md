<img width="440" alt="jawta-term" src="https://github.com/user-attachments/assets/80663797-a268-473d-90ac-35a0a31ccb5d" />
<img width="824" alt="jawta-term1" src="https://github.com/user-attachments/assets/d067a092-cabf-41ff-acee-608d8a3ab2c0" />

#
LIVE - http://fornevercollective.github.io/jawta/index.html DEMO
# jawta
<img width="1118" alt="jawta-intro" src="https://github.com/user-attachments/assets/2d4b0118-b637-400c-a14e-3d36a81acce6" />
> jawta+sigintel
> wip
#
<img width="200" alt="jawta_m-06" src="https://github.com/user-attachments/assets/3fccfe50-bc0d-4791-b02d-86181f12b8d9" />
#
<img width="600" alt="jawta_d-05" src="https://github.com/user-attachments/assets/276a6723-3dab-4302-b261-b9ed4ac62e30" />
#

# jawta - Signal Processing Application

## Overview



## Technical Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS v4.0
- **UI Components**: shadcn/ui component library
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Responsive**: Custom hooks for device detection


### &#x1F4CA; Code Metrics (Estimated)
- **Total Files**: ~115 TypeScript/JavaScript files
- **Total Lines**: ~13,500+ lines of code
- **Components**: ~85 React components
- **Utility Functions**: ~7 utility modules
- **UI Components**: ~50 shadcn/ui components
- **Pages**: 6 main application pages

### &#x1F4C1; Directory Breakdown
- **Components**: ~12,000 lines (85% of codebase)
- **Utilities**: ~1,200 lines (9% of codebase)
- **Styling**: ~450 lines (3% of codebase)
- **Configuration**: ~200 lines (1% of codebase)
- **Documentation**: ~400 lines (2% of codebase)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Modern web browser with ES2020+ support

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/jawta.git
cd jawta

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Generate Actual Line Counts

To generate real line counts for the project:

```bash
# Count lines in TypeScript/JavaScript files
find . -name "*.tsx" -o -name "*.ts" -o -name "*.js" -o -name "*.jsx" | xargs wc -l

# Count lines by directory
find ./components -name "*.tsx" -o -name "*.ts" | xargs wc -l
find ./styles -name "*.css" | xargs wc -l

# Total project lines (excluding node_modules)
find . -path ./node_modules -prune -o -name "*.tsx" -o -name "*.ts" -o -name "*.css" -o -name "*.md" | grep -v node_modules | xargs wc -l
```

## Usage Examples

### Basic Signal Processing
```typescript
import { SignalConverter } from './components/Signal/SignalConverter';

// Initialize with default settings
<SignalConverter 
  activeTab="signal"
  onTabChange={handleTabChange}
  isTransmitting={false}
  volume={75}
/>
```

### Text to Morse Conversion
```typescript
import { textToMorse } from './components/utils/textUtils';

const morse = textToMorse("HELLO WORLD");
// Output: ".... . .-.. .-.. --- / .-- --- .-. .-.. -.."
```

### Mobile Touch Interface
```typescript
// Touch targets automatically scaled to 80px minimum on mobile
<Button className="min-h-[80px] w-full">
  Emergency Transmission
</Button>
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes and version information.

---

**jawta** - Signal Processing & Intelligence Application  
© 2025 - Built with React, TypeScript, and Tailwind CSS
