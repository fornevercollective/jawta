# Changelog

All notable changes to the "jawta" signal processing application will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- New features that haven't been released yet will be documented here

## [0.3.0] - 2025-06-02

### Added
- Comprehensive text conversion utilities
- ASCII art visualization capabilities
- Enhanced Morse code visualizer with sound and light pattern support
- Text-to-vibration and text-to-light pattern conversion
- Mobile phone keypad/T9 conversion utilities
- Multi-language support with custom language translations
- Encryption/decryption capabilities with multiple algorithms

### Fixed
- Resolved Button component import error in QuickAccessPanel.tsx
- Replaced non-existent SpeakerOff icon with VolumeX in MorseVisualizer.tsx
- Improved text visibility in dark theme with proper color contrast
- Fixed component nesting issues in the tabs system
- Resolved duplicate imports causing build errors

### Changed
- Reorganized text conversion system for better user experience
- Enhanced styling with CSS variables for consistent color scheme
- Updated component hierarchy for better maintainability

## [0.2.0] - 2025-05-15

### Added
- LiveRadioIntelPage with collapsible sidebar and grid view
- Streaming support for broadcast radio, podcasts, and streaming services
- Walkie-talkie mode with 5-band frequency selection
- Advanced signal intelligence dashboard for desktop view
- Mobile-first interface with 80px height touch targets for gloved users
- Two-click maximum navigation with slide-down quick access panel

### Changed
- Enhanced dark theme with neon gradient effects for interactive elements
- Improved responsive design for dual interface support

### Fixed
- Resolved issues with background pattern rendering on mobile devices
- Fixed responsive layout issues in the signal processing interface
- Corrected icon alignment in the quick access panel

## [0.1.0] - 2025-04-20

### Added
- Initial application framework
- Basic signal processing capabilities
- Dark theme implementation
- Responsive layout foundation
- Core navigation structure
- Audio processing with basic equalizer
- Morse code conversion (text to Morse)
- Simple radio functionality
- Preliminary optical internet capabilities
- Basic RF device integration

### Known Issues
- Limited mobile support
- Incomplete text conversion utilities
- Contrast issues in dark theme
- Missing audio playback for Morse code

[Unreleased]: https://github.com/yourusername/jawta/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/yourusername/jawta/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/yourusername/jawta/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/yourusername/jawta/releases/tag/v0.1.0