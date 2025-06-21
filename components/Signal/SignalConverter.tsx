import React, { useState } from 'react';
import { OpticalCommunicationPanel } from './OpticalCommunicationPanel';
import { TextSignalConverterPanel } from './TextSignalConverterPanel';
import { SystemTerminalPanel } from './SystemTerminalPanel';
// Import additional components as needed

interface SignalConverterProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isTransmitting: boolean;
  onTransmissionChange: (isTransmitting: boolean) => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  onEmergency?: (type: string) => void;
}

export function SignalConverter({
  activeTab,
  onTabChange,
  isTransmitting,
  onTransmissionChange,
  volume,
  onVolumeChange,
  onEmergency
}: SignalConverterProps) {
  // Render the appropriate panel based on the active tab
  const renderPanel = () => {
    switch (activeTab) {
      case 'optical':
        return <OpticalCommunicationPanel />;
      case 'morse':
      case 'text':
        return <TextSignalConverterPanel onEmergency={onEmergency} />;
      case 'terminal':
        return <SystemTerminalPanel onEmergency={onEmergency} />;
      // Add additional cases for other tabs
      default:
        return (
          <div className="p-6 text-center">
            <p className="text-muted-foreground">Select a tab from the sidebar to continue</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      {renderPanel()}
    </div>
  );
}