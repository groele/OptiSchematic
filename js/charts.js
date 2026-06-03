/* ============================================
   Optical Toolkit — Chart.js Wrappers
   Reusable chart configurations
   ============================================ */

const Charts = (() => {

  const COLORS = {
    blue: '#0071E3',
    orange: '#FF6B35',
    green: '#34C759',
    red: '#FF3B30',
    yellow: '#FF9500',
    purple: '#AF52DE',
    gray: '#8E8E93',
    lightBlue: 'rgba(0, 113, 227, 0.1)',
    lightOrange: 'rgba(255, 107, 53, 0.1)',
  };

  const isDarkTheme = () => {
    return document.documentElement.classList.contains('dark-theme') || 
           (!document.documentElement.classList.contains('light-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  };

  const getGridColor = () => isDarkTheme() ? 'rgba(255, 255, 255, 0.08)' : '#F2F2F7';
  const getTextColor = () => isDarkTheme() ? '#8E8E93' : '#6E6E73';
  const getTickColor = () => isDarkTheme() ? '#6E6E73' : '#AEAEB2';

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 300 },
    plugins: {
      legend: {
        display: false,
        labels: {
          font: { family: 'Inter, sans-serif', size: 12 },
          color: getTextColor,
          usePointStyle: true,
          pointStyleWidth: 8,
          boxHeight: 6,
        }
      },
      tooltip: {
        backgroundColor: '#1D1D1F',
        titleFont: { family: 'Inter, sans-serif', size: 13 },
        bodyFont: { family: 'SF Mono, Consolas, monospace', size: 12 },
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
      }
    },
    scales: {
      x: {
        grid: { color: getGridColor, drawBorder: false },
        ticks: {
          font: { family: 'Inter, sans-serif', size: 11 },
          color: getTickColor,
          maxTicksLimit: 8,
        }
      },
      y: {
        grid: { color: getGridColor, drawBorder: false },
        ticks: {
          font: { family: 'SF Mono, Consolas, monospace', size: 11 },
          color: getTickColor,
          maxTicksLimit: 6,
        }
      }
    }
  };

  /**
   * Create or update a chart
   */
  function createChart(canvasId, config) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;

    // Destroy existing chart
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();

    const ctx = canvas.getContext('2d');
    return new Chart(ctx, config);
  }

  /**
   * Deep merge options
   */
  function mergeOptions(target, source) {
    const result = { ...target };
    for (const key of Object.keys(source)) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = mergeOptions(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }

  /**
   * Beam profile chart (w(z) envelope)
   */
  function beamProfile(canvasId, zData, wData, wNegData, zR, currentZ) {
    const annotations = {};
    if (zR) {
      annotations.zRplus = {
        type: 'line', xMin: zR, xMax: zR,
        borderColor: COLORS.green, borderWidth: 1, borderDash: [4, 4],
        label: { display: true, content: `zR`, position: 'start', backgroundColor: COLORS.green, font: { size: 10 } }
      };
      annotations.zRminus = {
        type: 'line', xMin: -zR, xMax: -zR,
        borderColor: COLORS.green, borderWidth: 1, borderDash: [4, 4],
      };
    }
    if (currentZ !== undefined) {
      annotations.currentZ = {
        type: 'line', xMin: currentZ, xMax: currentZ,
        borderColor: COLORS.red, borderWidth: 1.5,
        label: { display: true, content: `z=${OPTICS.formatNum(currentZ)}`, position: 'start', backgroundColor: COLORS.red, font: { size: 10 } }
      };
    }

    return createChart(canvasId, {
      type: 'line',
      data: {
        labels: zData.map(z => OPTICS.formatNum(z, 1)),
        datasets: [
          {
            label: 'w(z)',
            data: wData,
            borderColor: COLORS.blue,
            backgroundColor: COLORS.lightBlue,
            fill: '+1',
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.4,
          },
          {
            label: '-w(z)',
            data: wNegData,
            borderColor: COLORS.blue,
            backgroundColor: 'transparent',
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.4,
          }
        ]
      },
      options: mergeOptions(defaultOptions, {
        plugins: {
          legend: { display: false },
          annotation: { annotations },
          tooltip: {
            callbacks: {
              title: (items) => `z = ${items[0].label} mm`,
              label: (item) => `w = ${OPTICS.formatNum(Math.abs(item.raw))} μm`
            }
          }
        },
        scales: {
          x: {
            title: { display: true, text: 'z (mm)', font: { size: 12, family: 'Inter' }, color: getTextColor },
            grid: { color: getGridColor },
          },
          y: {
            title: { display: true, text: 'w (μm)', font: { size: 12, family: 'Inter' }, color: getTextColor },
            grid: { color: getGridColor },
          }
        }
      })
    });
  }

  /**
   * Radial intensity chart
   */
  function radialIntensity(canvasId, rData, iData, w) {
    return createChart(canvasId, {
      type: 'line',
      data: {
        labels: rData.map(r => OPTICS.formatNum(r, 1)),
        datasets: [{
          label: 'I(r)',
          data: iData,
          borderColor: COLORS.orange,
          backgroundColor: COLORS.lightOrange,
          fill: true,
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.4,
        }]
      },
      options: mergeOptions(defaultOptions, {
        plugins: {
          annotation: {
            annotations: {
              waist: {
                type: 'line', xMin: w, xMax: w,
                borderColor: COLORS.gray, borderWidth: 1, borderDash: [4, 4],
                label: { display: true, content: `w=${OPTICS.formatNum(w)}μm`, position: 'start', backgroundColor: COLORS.gray, font: { size: 10 } }
              }
            }
          },
          tooltip: {
            callbacks: {
              title: (items) => `r = ${items[0].label} μm`,
              label: (item) => `I/I₀ = ${OPTICS.formatNum(item.raw, 3)}`
            }
          }
        },
        scales: {
          x: {
            title: { display: true, text: 'r (μm)', font: { size: 12, family: 'Inter' }, color: getTextColor },
          },
          y: {
            title: { display: true, text: 'I / I₀', font: { size: 12, family: 'Inter' }, color: getTextColor },
            min: 0, max: 1.05,
          }
        }
      })
    });
  }

  /**
   * Blackbody spectrum chart
   */
  function blackbodySpectrum(canvasId, datasets) {
    // datasets: [{ T, lambdaData, radianceData, color }]
    const chartDatasets = datasets.map((d, i) => ({
      label: `${d.T}K`,
      data: d.radianceData,
      borderColor: d.color || Object.values(COLORS)[i % 6],
      backgroundColor: 'transparent',
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.4,
    }));

    return createChart(canvasId, {
      type: 'line',
      data: {
        labels: datasets[0].lambdaData.map(l => Math.round(l)),
        datasets: chartDatasets,
      },
      options: mergeOptions(defaultOptions, {
        plugins: {
          legend: { display: true, position: 'top', labels: { color: getTextColor } },
          tooltip: {
            callbacks: {
              title: (items) => `λ = ${items[0].label} nm`,
              label: (item) => `${item.dataset.label}: ${(item.raw * 100).toFixed(1)}%`
            }
          }
        },
        scales: {
          x: {
            title: { display: true, text: '波长 λ (nm)', font: { size: 12, family: 'Inter' }, color: getTextColor },
          },
          y: {
            title: { display: true, text: '归一化辐射强度', font: { size: 12, family: 'Inter' }, color: getTextColor },
            min: 0,
          }
        }
      })
    });
  }

  return {
    COLORS, createChart, beamProfile, radialIntensity, blackbodySpectrum
  };
})();
