
/**
 * Optical communication utility functions
 * Provides helper functions for working with optical signals, WDM, and fiber optics
 */

// Wavelength to frequency conversion (in vacuum)
export const wavelengthToFrequency = (wavelengthNm: number): number => {
  const c = 299792458; // Speed of light in m/s
  const wavelengthM = wavelengthNm * 1e-9;
  const frequencyHz = c / wavelengthM;
  return frequencyHz / 1e12; // Return in THz
};

// Frequency to wavelength conversion (in vacuum)
export const frequencyToWavelength = (frequencyThz: number): number => {
  const c = 299792458; // Speed of light in m/s
  const frequencyHz = frequencyThz * 1e12;
  const wavelengthM = c / frequencyHz;
  return wavelengthM * 1e9; // Return in nm
};

// Get standard ITU-T G.694.1 DWDM grid channels for C-band
// Starting at 196.1 THz with 100 GHz spacing
export const getDWDMChannels = (startIdx = 1, count = 40): { id: number; wavelengthNm: number; frequencyThz: number; label: string; }[] => {
  const channels = [];
  const startFrequency = 196.1; // THz
  const spacing = 0.1; // THz (100 GHz spacing)
  
  for (let i = 0; i < count; i++) {
    const idx = startIdx + i;
    const frequency = startFrequency - (i * spacing);
    const wavelength = frequencyToWavelength(frequency);
    
    channels.push({
      id: idx,
      wavelengthNm: parseFloat(wavelength.toFixed(2)),
      frequencyThz: frequency,
      label: `CH${idx}`
    });
  }
  
  return channels;
};

// Calculate fiber attenuation based on type, length, and wavelength
export const calculateFiberAttenuation = (
  fiberType: 'Single-Mode' | 'Multi-Mode', 
  lengthKm: number, 
  wavelengthNm = 1550
): number => {
  // Approximate attenuation coefficients (dB/km)
  let attenuationCoefficient = 0;
  
  if (fiberType === 'Single-Mode') {
    // Single-mode fiber attenuation varies by wavelength
    if (wavelengthNm >= 1260 && wavelengthNm < 1360) {
      // O-band
      attenuationCoefficient = 0.35;
    } else if (wavelengthNm >= 1360 && wavelengthNm < 1460) {
      // E-band (high water peak)
      attenuationCoefficient = 0.5;
    } else if (wavelengthNm >= 1460 && wavelengthNm < 1530) {
      // S-band
      attenuationCoefficient = 0.3;
    } else if (wavelengthNm >= 1530 && wavelengthNm < 1565) {
      // C-band
      attenuationCoefficient = 0.2;
    } else if (wavelengthNm >= 1565 && wavelengthNm < 1625) {
      // L-band
      attenuationCoefficient = 0.22;
    } else {
      // Default
      attenuationCoefficient = 0.3;
    }
  } else {
    // Multi-mode fiber has higher attenuation
    if (wavelengthNm >= 800 && wavelengthNm < 900) {
      attenuationCoefficient = 2.5;
    } else {
      attenuationCoefficient = 3.0;
    }
  }
  
  return attenuationCoefficient * lengthKm;
};

// Calculate optical link budget
export interface LinkBudgetParams {
  txPowerDbm: number;
  fiberType: 'Single-Mode' | 'Multi-Mode';
  lengthKm: number;
  connectorCount: number;
  spliceCount: number;
  marginDb: number;
  wavelengthNm?: number;
}

export interface LinkBudgetResult {
  fiberLoss: number;
  connectorLoss: number;
  spliceLoss: number;
  marginLoss: number;
  totalLoss: number;
  receivedPower: number;
  isViable: boolean;
}

export const calculateLinkBudget = (params: LinkBudgetParams): LinkBudgetResult => {
  const {
    txPowerDbm,
    fiberType,
    lengthKm,
    connectorCount,
    spliceCount,
    marginDb,
    wavelengthNm = 1550
  } = params;
  
  // Standard loss values
  const connectorLossDb = 0.5; // dB per connector
  const spliceLossDb = 0.1; // dB per splice
  
  // Calculate individual losses
  const fiberLoss = calculateFiberAttenuation(fiberType, lengthKm, wavelengthNm);
  const connectorLoss = connectorLossDb * connectorCount;
  const spliceLoss = spliceLossDb * spliceCount;
  
  // Total loss and received power
  const totalLoss = fiberLoss + connectorLoss + spliceLoss + marginDb;
  const receivedPower = txPowerDbm - totalLoss;
  
  // Determine if link is viable (typical receiver sensitivity is -25 dBm)
  const isViable = receivedPower >= -25;
  
  return {
    fiberLoss,
    connectorLoss,
    spliceLoss,
    marginLoss: marginDb,
    totalLoss,
    receivedPower,
    isViable
  };
};

// Get optical band range in nanometers
export const getOpticalBandRange = (
  band: 'O-Band' | 'E-Band' | 'S-Band' | 'C-Band' | 'L-Band' | 'U-Band' | 'Full-Spectrum'
): { min: number; max: number } => {
  switch(band) {
    case 'O-Band': return { min: 1260, max: 1360 };
    case 'E-Band': return { min: 1360, max: 1460 };
    case 'S-Band': return { min: 1460, max: 1530 };
    case 'C-Band': return { min: 1530, max: 1565 };
    case 'L-Band': return { min: 1565, max: 1625 };
    case 'U-Band': return { min: 1625, max: 1675 };
    case 'Full-Spectrum': return { min: 1260, max: 1675 };
    default: return { min: 1530, max: 1565 }; // Default to C-Band
  }
};

// Convert dBm to mW
export const dBmToMw = (dBm: number): number => {
  return Math.pow(10, dBm / 10);
};

// Convert mW to dBm
export const mwToDBm = (mw: number): number => {
  return 10 * Math.log10(mw);
};

// Calculate chromatic dispersion
export const calculateChromaticDispersion = (
  wavelengthNm: number,
  fiberDispersionPs: number,
  lengthKm: number
): number => {
  // Typical dispersion parameter in ps/(nm·km)
  const dispersionParameter = fiberDispersionPs || 17; // Default for standard SMF at 1550nm
  
  // Reference wavelength
  const refWavelength = 1550; // nm
  
  // Calculate wavelength delta
  const deltaWavelength = Math.abs(wavelengthNm - refWavelength);
  
  // Calculate total dispersion in ps
  return dispersionParameter * deltaWavelength * lengthKm;
};

// Generate mock optical spectrum data
export const generateOpticalSpectrum = (
  startWavelength: number,
  endWavelength: number,
  pointCount: number,
  peakParams: { wavelength: number, power: number, width: number }[]
): { wavelength: number, power: number }[] => {
  const spectrum = [];
  const step = (endWavelength - startWavelength) / pointCount;
  
  for (let i = 0; i <= pointCount; i++) {
    const wavelength = startWavelength + (i * step);
    let power = -60; // Noise floor in dBm
    
    // Add peaks
    peakParams.forEach(peak => {
      const distance = Math.abs(wavelength - peak.wavelength);
      const gaussianFactor = Math.exp(-(Math.pow(distance, 2) / (2 * Math.pow(peak.width, 2))));
      power = Math.max(power, peak.power * gaussianFactor);
    });
    
    // Add some noise
    power += (Math.random() - 0.5) * 2;
    
    spectrum.push({ wavelength, power });
  }
  
  return spectrum;
};
