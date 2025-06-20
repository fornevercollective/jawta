import React from 'react';

export function ThemeTest() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Heading Level 1</h1>
        <h2 className="text-2xl font-bold">Heading Level 2</h2>
        <h3 className="text-xl font-bold">Heading Level 3</h3>
        <h4 className="text-lg font-semibold">Heading Level 4</h4>
        <h5 className="text-base font-semibold">Heading Level 5</h5>
        <h6 className="text-sm font-semibold">Heading Level 6</h6>
      </div>

      <div className="space-y-2">
        <p className="text-base">Standard paragraph text looks like this. It should be clearly visible against the dark background.</p>
        <p className="text-muted-foreground">This is muted text that should still be legible but less prominent.</p>
        <p><a href="#" className="underline">This is a link that should have the primary color</a></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-border/30 rounded-md p-4">
          <p>Standard card with border</p>
        </div>
        <div className="bg-black/50 border border-border/30 rounded-md p-4">
          <p>Semi-transparent card</p>
        </div>
        <div className="bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border border-white/10 rounded-md p-4">
          <p>Gradient card</p>
        </div>
      </div>

      <div className="space-x-2">
        <span className="signal-indicator signal-strong"></span>
        <span className="signal-indicator signal-medium"></span>
        <span className="signal-indicator signal-weak"></span>
        <span className="signal-indicator signal-poor"></span>
        <span>Signal indicators</span>
      </div>

      <div>
        <span className="gradient-text text-xl">Gradient Text Example</span>
      </div>
    </div>
  );
}