<img width="440" alt="jawta-term" src="https://github.com/user-attachments/assets/80663797-a268-473d-90ac-35a0a31ccb5d" />
<img width="824" alt="jawta-term1" src="https://github.com/user-attachments/assets/d067a092-cabf-41ff-acee-608d8a3ab2c0" />

#
LIVE - http://fornevercollective.github.io/jawta/index.html DEMO
# jawta
<img width="1118" alt="jawta-intro" src="https://github.com/user-attachments/assets/2d4b0118-b637-400c-a14e-3d36a81acce6" />
<img width="200" alt="jawta_m-06" src="https://github.com/user-attachments/assets/3fccfe50-bc0d-4791-b02d-86181f12b8d9" />
#
<img width="600" alt="jawta_d-05" src="https://github.com/user-attachments/assets/276a6723-3dab-4302-b261-b9ed4ac62e30" />
#

# jawta - Signal Processing Application

A comprehensive signal processing and intelligence application built with React and TypeScript, featuring dark theme UI with neon gradient effects, mobile-first design, and advanced communication capabilities.

## Overview

**jawta** is a dual-interface signal processing application designed for both mobile walkie-talkie functionality and advanced desktop signal intelligence operations. The application supports text-to-audio conversion, Morse code processing, multi-band transmission, visual processing, and various communication protocols.

## Key Features

### &#x1F3AF; Core Functionality
- **Audio Processing**: Text-to-audio, Morse code, 32-band equalizer, multi-band transmission
- **Visual Processing**: ASCII art, steganography, image-to-waveform conversion
- **Communication**: Optical internet, RF device integration, RFID/NFC support
- **Radio Intelligence**: Broadcasting, podcasts, streaming services integration
- **Text Utilities**: Mobile text patterns, encryption/decryption, language translation

### &#x1F3A8; Design System
- **Dark Theme**: Black background with neon gradient effects
- **Mobile-First**: 80px touch targets optimized for gloved users
- **Responsive Design**: Dual interface (simple mobile, advanced desktop)
- **Navigation**: Two-click maximum with slide-down quick access panel

### &#x1F4F1; Interface Modes
- **Mobile**: Simplified walkie-talkie interface
- **Desktop**: Advanced signal intelligence dashboard with two-column layout
- **Emergency**: Quick access to critical communication functions

## Technical Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS v4.0
- **UI Components**: shadcn/ui component library
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Responsive**: Custom hooks for device detection

## File Structure & Code Metrics

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Root Files -->
  <url>
    <loc>/App.tsx</loc>
    <lastmod>2025-06-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <!-- Lines: ~280 -->
  </url>
  <url>
    <loc>/CHANGELOG.md</loc>
    <lastmod>2025-06-02</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
    <!-- Lines: ~85 -->
  </url>
  <url>
    <loc>/README.md</loc>
    <lastmod>2025-06-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <!-- Lines: ~200 -->
  </url>

  <!-- Signal Processing Components -->
  <url>
    <loc>/components/Signal/SignalConverter.tsx</loc>
    <lastmod>2025-06-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <!-- Lines: ~450 -->
  </url>
  <url>
    <loc>/components/Signal/OpticalCommunicationPanel.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <!-- Lines: ~320 -->
  </url>
  <url>
    <loc>/components/Signal/TextSignalConverterPanel.tsx</loc>
    <lastmod>2025-06-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <!-- Lines: ~240 -->
  </url>

  <!-- Control Components -->
  <url>
    <loc>/components/controls/QuickAccessPanel.tsx</loc>
    <lastmod>2025-06-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <!-- Lines: ~520 -->
  </url>
  <url>
    <loc>/components/controls/Equalizer.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <!-- Lines: ~180 -->
  </url>
  <url>
    <loc>/components/controls/CompactEqualizer.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <!-- Lines: ~120 -->
  </url>
  <url>
    <loc>/components/controls/FrequencyControls.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <!-- Lines: ~150 -->
  </url>
  <url>
    <loc>/components/controls/ImageSignalHandler.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
    <!-- Lines: ~200 -->
  </url>
  <url>
    <loc>/components/controls/MobileInputBar.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <!-- Lines: ~80 -->
  </url>
  <url>
    <loc>/components/controls/RelayChatSystem.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
    <!-- Lines: ~250 -->
  </url>
  <url>
    <loc>/components/controls/TestSignalControls.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
    <!-- Lines: ~140 -->
  </url>
  <url>
    <loc>/components/controls/TextInputPanel.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <!-- Lines: ~90 -->
  </url>
  <url>
    <loc>/components/controls/VolumeControl.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
    <!-- Lines: ~60 -->
  </url>

  <!-- Page Components -->
  <url>
    <loc>/components/pages/WalkieTalkiePage.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <!-- Lines: ~380 -->
  </url>
  <url>
    <loc>/components/pages/LiveRadioIntelPage.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <!-- Lines: ~420 -->
  </url>
  <url>
    <loc>/components/pages/StreamingControlCenterPage.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <!-- Lines: ~350 -->
  </url>
  <url>
    <loc>/components/pages/TextConversionPage.tsx</loc>
    <lastmod>2025-06-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <!-- Lines: ~720 -->
  </url>
  <url>
    <loc>/components/pages/BurstSettingsPage.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <!-- Lines: ~280 -->
  </url>
  <url>
    <loc>/components/pages/SpectrumTabView.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <!-- Lines: ~200 -->
  </url>

  <!-- Visualization Components -->
  <url>
    <loc>/components/visualization/MorseVisualizer.tsx</loc>
    <lastmod>2025-06-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <!-- Lines: ~295 -->
  </url>
  <url>
    <loc>/components/visualization/SpectrumAnalyzer.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <!-- Lines: ~320 -->
  </url>
  <url>
    <loc>/components/visualization/WaveformVisualizer.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <!-- Lines: ~180 -->
  </url>
  <url>
    <loc>/components/visualization/TextFeedVisualizer.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <!-- Lines: ~160 -->
  </url>
  <url>
    <loc>/components/visualization/MiniWaveformVisualizer.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
    <!-- Lines: ~120 -->
  </url>
  <url>
    <loc>/components/visualization/AsciiArtVisualizer.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
    <!-- Lines: ~140 -->
  </url>
  <url>
    <loc>/components/visualization/TerminalVisualizer.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
    <!-- Lines: ~200 -->
  </url>
  <url>
    <loc>/components/visualization/GeohashMap.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
    <!-- Lines: ~250 -->
  </url>
  <url>
    <loc>/components/visualization/H3MapVisualization.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
    <!-- Lines: ~180 -->
  </url>
  <url>
    <loc>/components/visualization/MetadataInspector.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
    <!-- Lines: ~160 -->
  </url>
  <url>
    <loc>/components/visualization/OpticalSpectrumAnalyzer.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
    <!-- Lines: ~220 -->
  </url>
  <url>
    <loc>/components/visualization/RadiofaxVisualizer.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
    <!-- Lines: ~180 -->
  </url>
  <url>
    <loc>/components/visualization/SatelliteDataVisualizer.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
    <!-- Lines: ~200 -->
  </url>
  <url>
    <loc>/components/visualization/SpatialComparisonMap.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
    <!-- Lines: ~190 -->
  </url>
  <url>
    <loc>/components/visualization/SpectrumAnalyzerContainer.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
    <!-- Lines: ~150 -->
  </url>
  <url>
    <loc>/components/visualization/SteganographyAnalyzer.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
    <!-- Lines: ~240 -->
  </url>
  <url>
    <loc>/components/visualization/WaveformArtVisualizer.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
    <!-- Lines: ~180 -->
  </url>

  <!-- Utility Files -->
  <url>
    <loc>/components/utils/textUtils.ts</loc>
    <lastmod>2025-06-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <!-- Lines: ~376 -->
  </url>
  <url>
    <loc>/components/utils/signalUtils.ts</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <!-- Lines: ~200 -->
  </url>
  <url>
    <loc>/components/utils/opticalUtils.ts</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
    <!-- Lines: ~180 -->
  </url>
  <url>
    <loc>/components/utils/asciiUtils.ts</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
    <!-- Lines: ~150 -->
  </url>
  <url>
    <loc>/components/utils/stegoUtils.ts</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
    <!-- Lines: ~120 -->
  </url>
  <url>
    <loc>/components/utils/metadataUtils.ts</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
    <!-- Lines: ~100 -->
  </url>
  <url>
    <loc>/components/utils/testSignalUtils.ts</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
    <!-- Lines: ~80 -->
  </url>

  <!-- UI Components (Selected Key Files) -->
  <url>
    <loc>/components/ui/button.tsx</loc>
    <lastmod>2025-04-20</lastmod>
    <changefreq>rarely</changefreq>
    <priority>0.6</priority>
    <!-- Lines: ~56 -->
  </url>
  <url>
    <loc>/components/ui/card.tsx</loc>
    <lastmod>2025-04-20</lastmod>
    <changefreq>rarely</changefreq>
    <priority>0.5</priority>
    <!-- Lines: ~80 -->
  </url>
  <url>
    <loc>/components/ui/tabs.tsx</loc>
    <lastmod>2025-04-20</lastmod>
    <changefreq>rarely</changefreq>
    <priority>0.5</priority>
    <!-- Lines: ~72 -->
  </url>
  <url>
    <loc>/components/ui/input.tsx</loc>
    <lastmod>2025-04-20</lastmod>
    <changefreq>rarely</changefreq>
    <priority>0.5</priority>
    <!-- Lines: ~25 -->
  </url>
  <url>
    <loc>/components/ui/textarea.tsx</loc>
    <lastmod>2025-04-20</lastmod>
    <changefreq>rarely</changefreq>
    <priority>0.4</priority>
    <!-- Lines: ~25 -->
  </url>
  <url>
    <loc>/components/ui/select.tsx</loc>
    <lastmod>2025-04-20</lastmod>
    <changefreq>rarely</changefreq>
    <priority>0.4</priority>
    <!-- Lines: ~155 -->
  </url>
  <url>
    <loc>/components/ui/theme-test.tsx</loc>
    <lastmod>2025-06-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.3</priority>
    <!-- Lines: ~120 -->
  </url>
  <url>
    <loc>/components/ui/sound-wave-logo.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>rarely</changefreq>
    <priority>0.4</priority>
    <!-- Lines: ~45 -->
  </url>
  <url>
    <loc>/components/ui/BackgroundPattern.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>rarely</changefreq>
    <priority>0.5</priority>
    <!-- Lines: ~60 -->
  </url>

  <!-- Streaming Components -->
  <url>
    <loc>/components/streaming/RadioStreamPlayer.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <!-- Lines: ~200 -->
  </url>
  <url>
    <loc>/components/streaming/RadioStationList.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
    <!-- Lines: ~150 -->
  </url>
  <url>
    <loc>/components/streaming/MusicStreaming.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
    <!-- Lines: ~180 -->
  </url>
  <url>
    <loc>/components/streaming/PodcastDirectory.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
    <!-- Lines: ~160 -->
  </url>
  <url>
    <loc>/components/streaming/StreamingService.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
    <!-- Lines: ~120 -->
  </url>
  <url>
    <loc>/components/streaming/StreamingCategoryTabs.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
    <!-- Lines: ~100 -->
  </url>

  <!-- Device Components -->
  <url>
    <loc>/components/devices/DevicesInterface.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <!-- Lines: ~250 -->
  </url>
  <url>
    <loc>/components/devices/RFDeviceEmulator.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
    <!-- Lines: ~180 -->
  </url>
  <url>
    <loc>/components/devices/DeviceProtocolAnalyzer.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
    <!-- Lines: ~200 -->
  </url>

  <!-- Context & Profile -->
  <url>
    <loc>/components/context/UserContext.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <!-- Lines: ~80 -->
  </url>
  <url>
    <loc>/components/profile/UserProfile.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
    <!-- Lines: ~120 -->
  </url>

  <!-- Vision Components -->
  <url>
    <loc>/components/vision/VisionProvider.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>rarely</changefreq>
    <priority>0.4</priority>
    <!-- Lines: ~90 -->
  </url>
  <url>
    <loc>/components/vision/VisionCard.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>rarely</changefreq>
    <priority>0.4</priority>
    <!-- Lines: ~60 -->
  </url>
  <url>
    <loc>/components/vision/VisionUIDetection.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>rarely</changefreq>
    <priority>0.3</priority>
    <!-- Lines: ~40 -->
  </url>
  <url>
    <loc>/components/vision/StatusToast.tsx</loc>
    <lastmod>2025-05-15</lastmod>
    <changefreq>rarely</changefreq>
    <priority>0.3</priority>
    <!-- Lines: ~50 -->
  </url>

  <!-- Styling -->
  <url>
    <loc>/styles/globals.css</loc>
    <lastmod>2025-06-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <!-- Lines: ~450 -->
  </url>
</urlset>
```

## Project Statistics

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
git clone https://github.com/fornevercollective/jawta.git
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
