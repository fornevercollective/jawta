![jawta](https://github.com/user-attachments/assets/a745471a-d184-4c99-a925-9251b9007a9d)
#
LIVE - http://fornevercollective.github.io/jawta/index.html DEMO
# jawta
<img width="1118" alt="jawta-intro" src="https://github.com/user-attachments/assets/2d4b0118-b637-400c-a14e-3d36a81acce6" />
> jawta+sigintel
> wip
#
<img width="200" alt="jawta_m-06" src="https://github.com/user-attachments/assets/3fccfe50-bc0d-4791-b02d-86181f12b8d9" />
<img width="200" alt="jawta_m-05" src="https://github.com/user-attachments/assets/d79508ab-538b-44a1-b235-5872c4ddae2a" />
<img width="200" alt="jawta_m-04" src="https://github.com/user-attachments/assets/06538cef-3141-4c74-9c0c-1b96f52ce08f" />
<img width="200" alt="jawta_m-03" src="https://github.com/user-attachments/assets/bff1977b-9eb4-49f9-ac0c-34ca2014e8c0" />
<img width="200" alt="jawta_m-02" src="https://github.com/user-attachments/assets/f42ac402-082a-41c0-8066-af3266fd7277" />
<img width="200" alt="jawta_m-01" src="https://github.com/user-attachments/assets/64aa27a9-74f7-4e1f-8400-f0eb534d8a51" />
#
-
#
<img width="600" alt="jawta_d-07" src="https://github.com/user-attachments/assets/c0bb770f-7fad-45e7-a4d2-ccc96064397e" />
<img width="600" alt="jawta_d-06" src="https://github.com/user-attachments/assets/9487867b-7f20-4e39-97b1-a82bcd4537cb" />
<img width="600" alt="jawta_d-05" src="https://github.com/user-attachments/assets/276a6723-3dab-4302-b261-b9ed4ac62e30" />
<img width="600" alt="jawta_d-04" src="https://github.com/user-attachments/assets/dbf7bf75-61c2-45e0-8afc-5f15b5bdcfc8" />
<img width="600" alt="jawta_d-03" src="https://github.com/user-attachments/assets/9eec202e-a9ac-4ab2-80af-5268e573c181" />
<img width="600" alt="jawta_d-02" src="https://github.com/user-attachments/assets/8e813629-e0f5-4bda-bea2-6652b86402b3" />
<img width="600" alt="jawta_d-01" src="https://github.com/user-attachments/assets/48d34c4b-1917-40fb-9b99-f645316a6882" />
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
