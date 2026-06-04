/* ============================================
   Optical Toolkit — Physics & Math Utilities
   All optical formulas, unit conversions, constants
   ============================================ */

const OPTICS = (() => {

  // --- Physical Constants ---
  const C = 2.99792458e8;       // speed of light (m/s)
  const H = 6.62607015e-34;     // Planck constant (J·s)
  const K_B = 1.380649e-23;     // Boltzmann constant (J/K)
  const HBAR = H / (2 * Math.PI);
  const QE = 1.602176634e-19;   // elementary charge (C)

  // ============================================
  // 1. Thin Lens Calculator
  // ============================================

  /**
   * Thin lens equation: 1/f = 1/u + 1/v
   * @param {number} f - focal length (mm)
   * @param {number} u - object distance (mm, positive)
   * @returns {{ v: number, M: number, type: string, orientation: string, magnification: number, isMagnified: boolean, atFocalPoint: boolean }}
   */
  function thinLens(f, u) {
    // Guard: object at focal point → parallel output (v = infinity)
    const invV = 1 / f - 1 / u;
    if (Math.abs(invV) < 1e-12) {
      return {
        v: Infinity, M: -Infinity, type: 'parallel', orientation: 'inverted',
        magnification: Infinity, isMagnified: true, atFocalPoint: true
      };
    }

    const v = 1 / invV;
    const M = -v / u;

    return {
      v,
      M,
      type: v > 0 ? 'real' : 'virtual',
      orientation: M < 0 ? 'inverted' : 'upright',
      magnification: Math.abs(M),
      isMagnified: Math.abs(M) > 1,
      atFocalPoint: false
    };
  }

  /**
   * Combined lens system: two thin lenses separated by distance d
   * @param {number} f1 - first lens focal length (mm)
   * @param {number} f2 - second lens focal length (mm)
   * @param {number} d - separation (mm)
   * @returns {{ f_eq: number, isTelescopic: boolean }}
   */
  function combinedLens(f1, f2, d) {
    const invF = 1 / f1 + 1 / f2 - d / (f1 * f2);
    if (Math.abs(invF) < 1e-12) {
      return { f_eq: Infinity, isTelescopic: true };
    }
    return { f_eq: 1 / invF, isTelescopic: false };
  }

  /**
   * Lensmaker equation (for thick lens approximation)
   * 1/f = (n-1)[1/R1 - 1/R2 + (n-1)d/(nR1R2)]
   * @param {number} n - refractive index
   * @param {number} R1 - first surface radius (mm), Infinity for flat
   * @param {number} R2 - second surface radius (mm), Infinity for flat
   * @param {number} d - center thickness (mm)
   */
  function lensmaker(n, R1, R2, d = 0) {
    const invR1 = (R1 === 0 || !isFinite(R1)) ? 0 : 1 / R1;
    const invR2 = (R2 === 0 || !isFinite(R2)) ? 0 : 1 / R2;
    const invF = (n - 1) * (invR1 - invR2 + (n - 1) * d / (n * R1 * R2));
    if (Math.abs(invF) < 1e-15) return { f: Infinity };
    return { f: 1 / invF };
  }

  // ============================================
  // 2. Gaussian Beam Calculator
  // ============================================

  /**
   * Rayleigh range: zR = π * w0² / (M² * λ) (real beam Rayleigh range)
   * @param {number} w0 - real beam waist radius (μm)
   * @param {number} lambda - wavelength (nm)
   * @param {number} M2 - beam quality factor (default 1)
   * @returns {number} Rayleigh range (mm)
   */
  function rayleighRange(w0, lambda, M2 = 1) {
    if (w0 <= 0 || lambda <= 0 || M2 <= 0) return 0;
    const w0_m = w0 * 1e-6;
    const lambda_m = lambda * 1e-9;
    return (Math.PI * w0_m * w0_m / (M2 * lambda_m)) * 1e3; // convert to mm
  }

  /**
   * Beam radius at distance z: w(z) = w0 * sqrt(1 + (z/zR)²)
   * @param {number} w0 - real beam waist (μm)
   * @param {number} z - distance from waist (mm)
   * @param {number} lambda - wavelength (nm)
   * @param {number} M2 - beam quality factor (default 1)
   * @returns {number} beam radius at z (μm)
   */
  function beamRadius(w0, z, lambda, M2 = 1) {
    const zR = rayleighRange(w0, lambda, M2);
    if (zR === 0) return w0;
    return w0 * Math.sqrt(1 + (z / zR) ** 2);
  }

  /**
   * Far-field divergence half-angle: θ = m²λ / (π * w0)
   * @returns {number} divergence in mrad
   */
  function beamDivergence(w0, lambda, M2 = 1) {
    if (w0 <= 0 || lambda <= 0 || M2 <= 0) return 0;
    const lambda_m = lambda * 1e-9;
    const w0_m = w0 * 1e-6;
    return (M2 * lambda_m / (Math.PI * w0_m)) * 1e3; // mrad
  }

  /**
   * Radius of curvature: R(z) = z * [1 + (zR/z)²]
   * @returns {number} radius of curvature (mm), Infinity at z=0
   */
  function beamCurvature(w0, z, lambda, M2 = 1) {
    if (Math.abs(z) < 1e-6) return Infinity;
    const zR = rayleighRange(w0, lambda, M2);
    return z * (1 + (zR / z) ** 2);
  }

  /**
   * On-axis intensity ratio at distance z: I(z)/I₀ = (w₀/w(z))²
   * This is the peak intensity of the Gaussian at z relative to the peak at z=0
   * @returns {number} intensity ratio (0-1 for z>0)
   */
  function onAxisIntensityRatio(w0, z, lambda, M2 = 1) {
    const wz = beamRadius(w0, z, lambda, M2);
    if (wz === 0) return 0;
    return (w0 / wz) ** 2;
  }

  /**
   * Gaussian intensity profile: I(r) = I0 * exp(-2r²/w²)
   * @returns {number} normalized intensity (0-1)
   */
  function gaussianIntensity(r, w) {
    if (w === 0) return 0;
    return Math.exp(-2 * (r / w) ** 2);
  }

  /**
   * Generate beam profile data for charting
   * @returns {{ zData: Array, wData: Array, wNegData: Array, zR: number }}
   */
  function beamProfileData(w0, lambda, zRange, M2 = 1) {
    const zR = rayleighRange(w0, lambda, M2);
    const points = 200;
    const zMin = -zRange;
    const zMax = zRange;
    const step = (zMax - zMin) / points;

    const zData = [];
    const wData = [];
    const wNegData = [];

    for (let i = 0; i <= points; i++) {
      const z = zMin + i * step;
      const w = beamRadius(w0, z, lambda, M2);
      zData.push(z);
      wData.push(w);
      wNegData.push(-w);
    }

    return { zData, wData, wNegData, zR };
  }

  /**
   * Generate radial intensity data for charting
   */
  function radialIntensityData(w, rRange) {
    const points = 100;
    const step = rRange / points;
    const rData = [];
    const iData = [];

    for (let i = 0; i <= points; i++) {
      const r = i * step;
      rData.push(r);
      iData.push(gaussianIntensity(r, w));
    }

    return { rData, iData };
  }

  // ============================================
  // 3. Intensity / Spectrum Converter
  // ============================================

  /**
   * Point source illuminance: E = I / d²
   * @param {number} I - luminous intensity (cd)
   * @param {number} d - distance (m)
   * @returns {number} illuminance (lux)
   */
  function pointSourceLux(I, d) {
    if (d <= 0) return Infinity;
    return I / (d * d);
  }

  /**
   * Luminous efficacy K(λ) approximation
   * Gaussian approximation of CIE photopic V(λ) curve
   * Note: accurate for monochromatic sources only.
   * For broadband sources, use custom K value.
   */
  function luminousEfficacy(lambdaNm) {
    const x = (lambdaNm - 555) / 50;
    const V = Math.exp(-0.5 * x * x);
    return 683 * V; // lm/W
  }

  /**
   * Convert photon flux to irradiance
   * E = Φ * hc / λ
   */
  function photonFluxToIrradiance(photonFlux, lambdaNm) {
    const lambda_m = lambdaNm * 1e-9;
    return photonFlux * H * C / lambda_m;
  }

  /**
   * Convert irradiance to photon flux
   * Φ = E * λ / (hc)
   */
  function irradianceToPhotonFlux(irradiance, lambdaNm) {
    const lambda_m = lambdaNm * 1e-9;
    return irradiance * lambda_m / (H * C);
  }

  /**
   * PPFD to irradiance (for PAR, 400-700nm, uses lambdaNm, default 550nm)
   */
  function ppfdToIrradiance(ppfd, lambdaNm = 550) {
    return photonFluxToIrradiance(ppfd * 6.022e17, lambdaNm);
  }

  /**
   * Color temperature to RGB
   * Tanner Helland algorithm, valid 1000K-40000K
   */
  function colorTempToRGB(kelvin) {
    if (kelvin <= 0) return { r: 0, g: 0, b: 0, hex: '#000000' };
    const temp = Math.max(100, kelvin) / 100;
    let r, g, b;

    // Red
    if (temp <= 66) {
      r = 255;
    } else {
      r = temp - 60;
      r = 329.698727446 * Math.pow(r, -0.1332047592);
      r = Math.max(0, Math.min(255, r));
    }

    // Green
    if (temp <= 66) {
      g = Math.max(1, temp); // guard log(0)
      g = 99.4708025861 * Math.log(g) - 161.1195681661;
    } else {
      g = temp - 60;
      g = 288.1221695283 * Math.pow(g, -0.0755148492);
    }
    g = Math.max(0, Math.min(255, g));

    // Blue
    if (temp >= 66) {
      b = 255;
    } else if (temp <= 19) {
      b = 0;
    } else {
      b = temp - 10;
      b = 138.5177312231 * Math.log(b) - 305.0447927307;
      b = Math.max(0, Math.min(255, b));
    }

    return {
      r: Math.round(r),
      g: Math.round(g),
      b: Math.round(b),
      hex: `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`
    };
  }

  /**
   * Planck's blackbody spectral radiance
   * B(λ, T) = (2hc²/λ⁵) / (exp(hc/λkT) - 1)
   */
  function planckRadiance(lambdaNm, T) {
    if (T <= 0 || lambdaNm <= 0) return 0;
    const lambda = lambdaNm * 1e-9;
    const x = H * C / (lambda * K_B * T);
    if (x > 500) return 0;
    return (2 * H * C * C / Math.pow(lambda, 5)) / (Math.exp(x) - 1);
  }

  /**
   * Generate blackbody spectrum data
   * Dynamic lambda range based on Wien peak
   */
  function blackbodySpectrumData(T, lambdaMin, lambdaMax) {
    // Auto-calculate range to include Wien peak with margin
    const peakLambda = 2.898e6 / T; // Wien's displacement law (nm)
    if (lambdaMin === undefined) lambdaMin = Math.max(50, peakLambda * 0.1);
    if (lambdaMax === undefined) lambdaMax = peakLambda * 5;

    const points = 200;
    const step = (lambdaMax - lambdaMin) / points;
    const lambdaData = [];
    const radianceData = [];

    // Find peak for normalization
    let maxB = 0;
    for (let i = 0; i <= points; i++) {
      const lambda = lambdaMin + i * step;
      const B = planckRadiance(lambda, T);
      if (B > maxB) maxB = B;
    }

    for (let i = 0; i <= points; i++) {
      const lambda = lambdaMin + i * step;
      const B = planckRadiance(lambda, T);
      lambdaData.push(lambda);
      radianceData.push(maxB > 0 ? B / maxB : 0);
    }

    return { lambdaData, radianceData, peakLambda, maxRadiance: maxB };
  }

  // ============================================
  // 4. Wavelength ↔ Energy / Frequency / Wavenumber
  // ============================================

  function wavelengthToEnergyJ(lambdaNm) {
    if (lambdaNm <= 0) return Infinity;
    return H * C / (lambdaNm * 1e-9);
  }

  function wavelengthToEnergyEV(lambdaNm) {
    if (lambdaNm <= 0) return Infinity;
    return (H * C) / (lambdaNm * 1e-9 * QE);
  }

  function energyEVToWavelength(eV) {
    if (eV <= 0) return Infinity;
    return (H * C) / (eV * QE) * 1e9;
  }

  function wavelengthToFrequency(lambdaNm) {
    if (lambdaNm <= 0) return Infinity;
    return C / (lambdaNm * 1e-9);
  }

  function frequencyToWavelength(hz) {
    if (hz <= 0) return Infinity;
    return (C / hz) * 1e9;
  }

  function wavelengthToWavenumber(lambdaNm) {
    if (lambdaNm <= 0) return Infinity;
    return 1e7 / lambdaNm;
  }

  function wavenumberToWavelength(cmInv) {
    if (cmInv <= 0) return Infinity;
    return 1e7 / cmInv;
  }

  function wavelengthToAngularK(lambdaNm) {
    if (lambdaNm <= 0) return Infinity;
    return 2 * Math.PI / (lambdaNm * 1e-9);
  }

  function eVToJoules(eV) { return eV * QE; }
  function joulesToEV(J) { return J / QE; }
  function eVToKJMol(eV) { return eV * 96.485; }
  function eVToKcalMol(eV) { return eV * 23.061; }

  function wavelengthToColor(lambdaNm) {
    if (lambdaNm < 10) return { name: 'γ射线', color: '#440044' };
    if (lambdaNm < 1) return { name: 'X射线', color: '#660066' };
    if (lambdaNm < 380) return { name: '紫外 (UV)', color: '#8B00FF' };
    if (lambdaNm < 450) return { name: '紫光', color: '#7B00FF' };
    if (lambdaNm < 490) return { name: '蓝光', color: '#0066FF' };
    if (lambdaNm < 510) return { name: '青光', color: '#00CCCC' };
    if (lambdaNm < 560) return { name: '绿光', color: '#00CC00' };
    if (lambdaNm < 590) return { name: '黄光', color: '#CCCC00' };
    if (lambdaNm < 620) return { name: '橙光', color: '#FF8800' };
    if (lambdaNm <= 780) return { name: '红光', color: '#FF0000' };
    if (lambdaNm <= 1400) return { name: '近红外 (NIR)', color: '#880000' };
    if (lambdaNm <= 3000) return { name: '短波红外 (SWIR)', color: '#550000' };
    if (lambdaNm <= 50000) return { name: '中红外 (MWIR/LWIR)', color: '#330000' };
    return { name: '远红外 (FIR)', color: '#220000' };
  }

  function wavelengthAllParams(lambdaNm) {
    if (lambdaNm <= 0 || !isFinite(lambdaNm)) {
      return {
        lambda: lambdaNm, E_J: NaN, E_eV: NaN, E_kjmol: NaN, E_kcalmol: NaN,
        frequency: NaN, frequency_THz: NaN, frequency_GHz: NaN,
        wavenumber: NaN, angularK: NaN,
        color: { name: '无效', color: '#999' }
      };
    }
    const E_J = wavelengthToEnergyJ(lambdaNm);
    const E_eV = wavelengthToEnergyEV(lambdaNm);
    const freq = wavelengthToFrequency(lambdaNm);
    const wavenum = wavelengthToWavenumber(lambdaNm);
    const angK = wavelengthToAngularK(lambdaNm);
    const color = wavelengthToColor(lambdaNm);

    return {
      lambda: lambdaNm, E_J, E_eV,
      E_kjmol: eVToKJMol(E_eV), E_kcalmol: eVToKcalMol(E_eV),
      frequency: freq, frequency_THz: freq / 1e12, frequency_GHz: freq / 1e9,
      wavenumber: wavenum, angularK: angK, color
    };
  }

  // ============================================
  // 5. Laser & SHG Formulas
  // ============================================

  /**
   * Peak power: P_peak = P_avg / (f_rep × τ_pulse)
   * @param {number} pAvg_mW - average power (mW)
   * @param {number} fRep_kHz - repetition rate (kHz)
   * @param {number} tauPulse - pulse width in seconds
   * @returns {number} peak power in watts
   */
  function laserPeakPower(pAvg_mW, fRep_kHz, tauPulse) {
    if (fRep_kHz <= 0 || tauPulse <= 0) return Infinity;
    return (pAvg_mW * 1e-3) / (fRep_kHz * 1e3 * tauPulse);
  }

  /**
   * Single pulse energy: E = P_avg / f_rep
   * @returns {number} energy in joules
   */
  function laserPulseEnergy(pAvg_mW, fRep_kHz) {
    if (fRep_kHz <= 0) return Infinity;
    return (pAvg_mW * 1e-3) / (fRep_kHz * 1e3);
  }

  /**
   * Format peak power with auto unit selection
   */
  function formatPeakPower(watts) {
    if (!isFinite(watts) || watts <= 0) return { value: '—', unit: 'W' };
    if (watts >= 1e12) return { value: (watts / 1e12).toFixed(2), unit: 'TW' };
    if (watts >= 1e9) return { value: (watts / 1e9).toFixed(2), unit: 'GW' };
    if (watts >= 1e6) return { value: (watts / 1e6).toFixed(2), unit: 'MW' };
    if (watts >= 1e3) return { value: (watts / 1e3).toFixed(2), unit: 'kW' };
    return { value: watts.toFixed(2), unit: 'W' };
  }

  /**
   * Format pulse energy with auto unit selection
   */
  function formatPulseEnergy(joules) {
    if (!isFinite(joules) || joules <= 0) return { value: '—', unit: 'J' };
    if (joules >= 1) return { value: joules.toFixed(3), unit: 'J' };
    if (joules >= 1e-3) return { value: (joules * 1e3).toFixed(2), unit: 'mJ' };
    if (joules >= 1e-6) return { value: (joules * 1e6).toFixed(2), unit: 'μJ' };
    if (joules >= 1e-9) return { value: (joules * 1e9).toFixed(2), unit: 'nJ' };
    return { value: (joules * 1e12).toFixed(2), unit: 'pJ' };
  }

  /**
   * SHG wavelength: λ_SHG = λ_fund / 2
   */
  function shgWavelength(lambdaFund_nm) {
    return lambdaFund_nm / 2;
  }

  /**
   * SHG intensity (simplified): I_SHG ∝ |χ²|² × I²_ω
   * Returns relative SHG intensity for given fundamental intensity
   */
  function shgIntensity(I_fund, chi2 = 1) {
    return chi2 * chi2 * I_fund * I_fund;
  }

  /**
   * Polarization-resolved SHG patterns for different crystal symmetries
   * @param {number} theta - polarization angle (rad)
   * @param {string} symmetry - 'C3' (3-fold), 'C2' (2-fold), 'C1' (isotropic)
   * @returns {number} normalized SHG intensity
   */
  function shgPolarPattern(theta, symmetry) {
    switch (symmetry) {
      case 'C3': return Math.cos(3 * theta) ** 2;
      case 'C2': return Math.cos(2 * theta) ** 2;
      case 'C1': return 1;
      default: return Math.cos(3 * theta) ** 2;
    }
  }

  /**
   * Degree of Linear Polarization: DOLP = (I_max - I_min) / (I_max + I_min)
   */
  function dolp(I_max, I_min) {
    if (I_max + I_min === 0) return 0;
    return (I_max - I_min) / (I_max + I_min);
  }

  /**
   * Degree of Circular Polarization: DOCP = (Iσ+ - Iσ-) / (Iσ+ + Iσ-)
   */
  function docp(I_sigma_plus, I_sigma_minus) {
    const sum = I_sigma_plus + I_sigma_minus;
    if (sum === 0) return 0;
    return (I_sigma_plus - I_sigma_minus) / sum;
  }

  // ============================================
  // Utility Functions
  // ============================================

  /**
   * Format number with appropriate precision
   */
  function formatNum(val, precision = 4) {
    if (val === Infinity) return '∞';
    if (val === -Infinity) return '-∞';
    if (isNaN(val)) return '—';
    if (val === 0) return '0';

    const absVal = Math.abs(val);
    if (absVal >= 1e6) return val.toExponential(precision - 1);
    if (absVal >= 100) return val.toFixed(2);
    if (absVal >= 1) return val.toFixed(precision);
    if (absVal >= 0.01) return val.toFixed(Math.max(precision, 3));
    return val.toExponential(precision - 1);
  }

  /**
   * Debounce function
   */
  function debounce(fn, delay = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  /**
   * Scroll item into container view without scrolling global viewport
   */
  function scrollIntoViewSafe(container, item) {
    if (!container || !item) return;
    const containerRect = container.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    
    // Check if the item is already visible inside the container
    if (itemRect.top >= containerRect.top && itemRect.bottom <= containerRect.bottom) {
      return; // Already fully visible
    }
    
    // Scroll container programmatically
    const relativeTop = itemRect.top - containerRect.top;
    const targetScrollTop = container.scrollTop + relativeTop - (containerRect.height - itemRect.height) / 2;
    container.scrollTo({
      top: Math.max(0, targetScrollTop),
      behavior: 'smooth'
    });
  }

  // --- Public API ---
  return {
    C, H, K_B, HBAR, QE,

    thinLens, combinedLens, lensmaker,

    rayleighRange, beamRadius, beamDivergence, beamCurvature,
    onAxisIntensityRatio, gaussianIntensity, beamProfileData, radialIntensityData,

    pointSourceLux, luminousEfficacy,
    photonFluxToIrradiance, irradianceToPhotonFlux, ppfdToIrradiance,
    colorTempToRGB, planckRadiance, blackbodySpectrumData,

    wavelengthToEnergyJ, wavelengthToEnergyEV, energyEVToWavelength,
    wavelengthToFrequency, frequencyToWavelength,
    wavelengthToWavenumber, wavenumberToWavelength,
    wavelengthToAngularK, eVToJoules, joulesToEV,
    eVToKJMol, eVToKcalMol, wavelengthToColor,
    wavelengthAllParams,

    // Laser & SHG
    laserPeakPower, laserPulseEnergy, formatPeakPower, formatPulseEnergy,
    shgWavelength, shgIntensity, shgPolarPattern, dolp, docp,

    formatNum, debounce, scrollIntoViewSafe
  };
})();
