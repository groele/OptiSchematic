/* ============================================
   Optical Toolkit — Diagram Utilities
   Shared SVG components, icons, and export tools
   ============================================ */

const DIAGRAMS = (() => {

  const COLORS = {
    laser: '#FF3B30',
    shg: '#34C759',
    pump: '#FF9500',
    uv: '#8B00FF',
    ir: '#880000',
    accent: '#0071E3',
    crystal: '#AF52DE',
    optics: '#0071E3',
    mechanical: '#7F8C8D',
    dark: '#1D1D1F',
  };

  /**
   * Shared SVG Component Box with physical vector icons
   */
  function componentBox(x, y, w, h, label1, color, label2, tooltipId) {
    const hover = tooltipId ? `class="svg-hover-box" data-tip="${tooltipId}"` : '';
    const cursor = tooltipId ? 'cursor:pointer' : '';
    const cleanColor = color ? color.split(',')[0] : '#0071E3';
    
    const lowerId = (tooltipId || '').toLowerCase();
    const lbl1 = (label1 || '').toLowerCase();
    const lbl2 = (label2 || '').toLowerCase();
    
    let cx, cy;
    if (w >= 85) {
      cx = x + 24;
      cy = y + h / 2;
    } else {
      cx = x + w / 2;
      cy = y + h / 2 - 12;
    }

    let iconSvg = '';
    if (lowerId.includes('laser') || lbl1.includes('激光') || lbl1.includes('激发') || lbl1.includes('泵浦') || lbl2.includes('laser')) {
      iconSvg = `
        <rect x="${cx-14}" y="${cy-10}" width="28" height="20" rx="2.5" fill="#1B2631" stroke="#2C3E50" stroke-width="1"/>
        <line x1="${cx-9}" y1="${cy-6}" x2="${cx-9}" y2="${cy+6}" stroke="#7F8C8D" stroke-width="1"/>
        <line x1="${cx-5}" y1="${cy-6}" x2="${cx-5}" y2="${cy+6}" stroke="#7F8C8D" stroke-width="1"/>
        <line x1="${cx-1}" y1="${cy-6}" x2="${cx-1}" y2="${cy+6}" stroke="#7F8C8D" stroke-width="1"/>
        <line x1="${cx+3}" y1="${cy-6}" x2="${cx+3}" y2="${cy+6}" stroke="#7F8C8D" stroke-width="1"/>
        <rect x="${cx+12}" y="${cy-6}" width="4" height="12" rx="0.8" fill="#D4AC0D"/>
        <circle cx="${cx+14}" cy="${cy}" r="1.5" fill="${cleanColor}"/>
        <polygon points="${cx-11},${cy+6} ${cx-7},${cy+6} ${cx-9},${cy+2}" fill="#E74C3C"/>
      `;
    } else if (lowerId.includes('polarizer') || lowerId.includes('analyzer') || lbl1.includes('起偏') || lbl1.includes('检偏') || lbl2.includes('polarizer') || lbl2.includes('analyzer')) {
      iconSvg = `
        <circle cx="${cx}" cy="${cy}" r="14" fill="#2E4053" stroke="#212F3D" stroke-width="1.5"/>
        <circle cx="${cx}" cy="${cy}" r="10" fill="none" stroke="#BDC3C7" stroke-width="1" stroke-dasharray="1.5,1.5"/>
        <line x1="${cx-7}" y1="${cy}" x2="${cx+7}" y2="${cy}" stroke="#ECF0F1" stroke-width="1" opacity="0.6"/>
        <line x1="${cx-5}" y1="${cy-5}" x2="${cx+5}" y2="${cy-5}" stroke="#ECF0F1" stroke-width="1" opacity="0.6"/>
        <line x1="${cx-5}" y1="${cy+5}" x2="${cx+5}" y2="${cy+5}" stroke="#ECF0F1" stroke-width="1" opacity="0.6"/>
        <line x1="${cx}" y1="${cy}" x2="${cx+10}" y2="${cy-6}" stroke="#E74C3C" stroke-width="1.8" stroke-linecap="round"/>
      `;
    } else if (lowerId.includes('hwp') || lowerId.includes('qwp') || lowerId.includes('waveplate') || lbl1.includes('波片') || lbl2.includes('hwp') || lbl2.includes('qwp')) {
      iconSvg = `
        <circle cx="${cx}" cy="${cy}" r="14" fill="#2E4053" stroke="#212F3D" stroke-width="1.5"/>
        <circle cx="${cx}" cy="${cy}" r="10" fill="rgba(155, 89, 182, 0.4)" stroke="#9B59B6" stroke-width="1"/>
        <line x1="${cx-7}" y1="${cy-7}" x2="${cx+7}" y2="${cy+7}" stroke="#ECF0F1" stroke-width="1.5" stroke-dasharray="2,2"/>
        <line x1="${cx-7}" y1="${cy+7}" x2="${cx+7}" y2="${cy-7}" stroke="#ECF0F1" stroke-width="0.8" opacity="0.5"/>
      `;
    } else if (lowerId.includes('dm') || lowerId.includes('splitter') || lbl1.includes('二向') || lbl1.includes('分束') || lbl2.includes('dm') || lbl2.includes('bs')) {
      iconSvg = `
        <path d="M ${cx-12} ${cy+12} L ${cx-8} ${cy+12} L ${cx-8} ${cy-10} L ${cx+6} ${cy-10}" fill="none" stroke="#95A5A6" stroke-width="2"/>
        <circle cx="${cx-10}" cy="${cy-4}" r="1.8" fill="#7F8C8D"/>
        <circle cx="${cx-10}" cy="${cy+8}" r="1.8" fill="#7F8C8D"/>
        <line x1="${cx-8}" y1="${cy+8}" x2="${cx+8}" y2="${cy-8}" stroke="${cleanColor}" stroke-width="4.5" stroke-linecap="round"/>
        <line x1="${cx-6}" y1="${cy+6}" x2="${cx+6}" y2="${cy-6}" stroke="#FFFFFF" stroke-width="1" stroke-linecap="round" opacity="0.7"/>
      `;
    } else if (lowerId.includes('mirror') || lowerId.includes('hr') || lowerId.includes('oc') || lbl1.includes('镜') || lbl2.includes('mirror')) {
      iconSvg = `
        <path d="M ${cx-12} ${cy+12} L ${cx-8} ${cy+12} L ${cx-8} ${cy-10} L ${cx+6} ${cy-10}" fill="none" stroke="#95A5A6" stroke-width="2"/>
        <line x1="${cx-7}" y1="${cy+8}" x2="${cx+7}" y2="${cy-6}" stroke="#3498DB" stroke-width="3.5" stroke-linecap="round"/>
        <line x1="${cx-5}" y1="${cy+6}" x2="${cx+5}" y2="${cy-4}" stroke="#FFFFFF" stroke-width="1.2" stroke-linecap="round" opacity="0.8"/>
      `;
    } else if (lowerId.includes('obj') || lbl1.includes('物镜') || lbl2.includes('obj')) {
      iconSvg = `
        <rect x="${cx-5}" y="${cy-14}" width="10" height="3" fill="#D35400" rx="0.5"/>
        <rect x="${cx-7}" y="${cy-11}" width="14" height="9" fill="#7F8C8D" stroke="#2C3E50" stroke-width="0.8"/>
        <path d="M ${cx-7} ${cy-2} L ${cx-4} ${cy+10} L ${cx+4} ${cy+10} L ${cx+7} ${cy-2} Z" fill="#2E4053" stroke="#2C3E50" stroke-width="0.8"/>
        <rect x="${cx-5}" y="${cy}" width="10" height="2" fill="#ECC94B"/>
        <rect x="${cx-2.5}" y="${cy+10}" width="5" height="1.8" fill="#E2E8F0" rx="0.3"/>
      `;
    } else if (lowerId.includes('sample') || lbl1.includes('样品') || lbl1.includes('器件') || lbl2.includes('sample')) {
      iconSvg = `
        <rect x="${cx-13}" y="${cy-4}" width="26" height="8" rx="1.2" fill="#212F3D" stroke="#17202A" stroke-width="0.8"/>
        <rect x="${cx+13}" y="${cy-2}" width="3" height="4" fill="#7F8C8D" rx="0.3"/>
        <rect x="${cx-16}" y="${cy-2}" width="3" height="4" fill="#7F8C8D" rx="0.3"/>
        <polygon points="${cx-9},${cy-4} ${cx+9},${cy-4} ${cx+6},${cy-10} ${cx-6},${cy-10}" fill="rgba(46, 134, 193, 0.4)" stroke="#2980B9" stroke-width="0.8"/>
        <circle cx="${cx}" cy="${cy-7}" r="2.5" fill="${cleanColor}" filter="url(#pl-glow)"/>
      `;
    } else if (lowerId.includes('spectro') || lbl1.includes('光谱') || lbl2.includes('spectro')) {
      iconSvg = `
        <rect x="${cx-15}" y="${cy-12}" width="30" height="24" rx="2.5" fill="#1C2833" stroke="#2C3E50" stroke-width="1.2"/>
        <line x1="${cx-10}" y1="${cy-7}" x2="${cx-10}" y2="${cy+7}" stroke="#273746" stroke-width="1"/>
        <line x1="${cx-7}" y1="${cy-7}" x2="${cx-7}" y2="${cy+7}" stroke="#273746" stroke-width="1"/>
        <line x1="${cx-4}" y1="${cy-7}" x2="${cx-4}" y2="${cy+7}" stroke="#273746" stroke-width="1"/>
        <rect x="${cx-19}" y="${cy-4}" width="4" height="8" fill="#95A5A6" rx="0.5"/>
        <circle cx="${cx+9}" cy="${cy+6}" r="1.5" fill="#2ECC71" filter="url(#pl-glow)"/>
      `;
    } else if (lowerId.includes('filter') || lbl1.includes('滤波') || lbl2.includes('filter') || lbl1.includes('长通') || lbl1.includes('带通') || lbl1.includes('陷波') || lbl1.includes('边缘')) {
      iconSvg = `
        <rect x="${cx-11}" y="${cy-13}" width="22" height="26" rx="1.5" fill="#2E4053" stroke="#212F3D" stroke-width="1"/>
        <circle cx="${cx}" cy="${cy}" r="7" fill="${cleanColor}" opacity="0.65" stroke="${cleanColor}" stroke-width="0.8"/>
        <path d="M ${cx-4} ${cy-4} Q ${cx} ${cy-6} ${cx+4} ${cy-4}" fill="none" stroke="#FFFFFF" stroke-width="0.8" opacity="0.6"/>
      `;
    } else if (lowerId.includes('collect') || lowerId.includes('focusing') || lowerId.includes('collimator') || lbl1.includes('透镜') || lbl1.includes('镜') || lbl2.includes('collect') || lbl2.includes('lens')) {
      if (lbl1.includes('反射') || lbl1.includes('准直') || lbl1.includes('聚焦') && (lbl2.includes('反射') || lowerId.includes('collimator') || lowerId.includes('focusing'))) {
        iconSvg = `
          <path d="M ${cx-6} ${cy-13} Q ${cx+4} ${cy} ${cx-6} ${cy+13}" fill="none" stroke="#7F8C8D" stroke-width="4.5" stroke-linecap="round"/>
          <path d="M ${cx-4} ${cy-11} Q ${cx+5} ${cy} ${cx-4} ${cy+11}" fill="none" stroke="#3498DB" stroke-width="1.5" stroke-linecap="round"/>
        `;
      } else {
        iconSvg = `
          <rect x="${cx-5}" y="${cy-13}" width="10" height="26" rx="0.8" fill="#2E4053"/>
          <path d="M ${cx} ${cy-11} Q ${cx+7} ${cy} ${cx} ${cy+11} Q ${cx-7} ${cy} ${cx} ${cy-11} Z" fill="rgba(174, 213, 250, 0.45)" stroke="#2980B9" stroke-width="0.8"/>
          <path d="M ${cx-2} ${cy-5} L ${cx+3} ${cy+5}" stroke="#FFFFFF" stroke-width="0.6" opacity="0.6"/>
        `;
      }
    } else if (lowerId.includes('crystal') || lowerId.includes('nlc') || lbl1.includes('晶体') || lbl1.includes('棱镜') || lbl2.includes('crystal')) {
      iconSvg = `
        <polygon points="${cx-9},${cy+9} ${cx+9},${cy+9} ${cx+13},${cy-9} ${cx-5},${cy-9}" fill="rgba(142, 68, 173, 0.25)" stroke="#8E44AD" stroke-width="1.2"/>
        <line x1="${cx-9}" y1="${cy+9}" x2="${cx-5}" y2="${cy-9}" stroke="#D7BDE2" stroke-width="1.2"/>
        <line x1="${cx-3}" y1="${cy}" x2="${cx+7}" y2="${cy}" stroke="${cleanColor}" stroke-width="1.5" stroke-dasharray="1.5,1.5"/>
      `;
    } else if (lowerId.includes('slit') || lowerId.includes('pinhole') || lowerId.includes('aperture') || lbl1.includes('狭缝') || lbl1.includes('针孔')) {
      iconSvg = `
        <rect x="${cx-9}" y="${cy-13}" width="18" height="26" rx="1.5" fill="#212F3D" stroke="#17202A" stroke-width="1"/>
        <line x1="${cx}" y1="${cy-9}" x2="${cx}" y2="${cy+9}" stroke="#D35400" stroke-width="1.8"/>
        <circle cx="${cx}" cy="${cy}" r="2" fill="#17202A"/>
        <circle cx="${cx}" cy="${cy}" r="0.6" fill="#FFFFFF"/>
      `;
    } else if (lowerId.includes('chopper') || lbl1.includes('斩波')) {
      iconSvg = `
        <rect x="${cx-8}" y="${cy-11}" width="16" height="22" rx="1.5" fill="#34495E"/>
        <circle cx="${cx+10}" cy="${cy}" r="11" fill="none" stroke="#2C3E50" stroke-width="2.5" stroke-dasharray="4,2"/>
        <circle cx="${cx+10}" cy="${cy}" r="2" fill="#BDC3C7"/>
      `;
    } else if (lowerId.includes('detector') || lowerId.includes('lockin') || lowerId.includes('sourcemeter') || lowerId.includes('smu') || lowerId.includes('tcspc') || lbl1.includes('探测器') || lbl1.includes('接收') || lbl1.includes('锁相') || lbl1.includes('源表') || lbl1.includes('tcspc')) {
      iconSvg = `
        <rect x="${cx-14}" y="${cy-11}" width="28" height="22" rx="2" fill="#2C3E50" stroke="#7F8C8D" stroke-width="1"/>
        <rect x="${cx-10}" y="${cy-7}" width="14" height="6" rx="0.5" fill="#1A252F"/>
        <circle cx="${cx-8}" cy="${cy-4}" r="1" fill="#2ECC71"/>
        <circle cx="${cx+8}" cy="${cy+4}" r="1.5" fill="#E74C3C"/>
        <circle cx="${cx+2}" cy="${cy+4}" r="1.5" fill="#1A252F"/>
      `;
    } else {
      iconSvg = `
        <rect x="${cx-1.5}" y="${cy}" width="3" height="12" fill="#BDC3C7"/>
        <rect x="${cx-3}" y="${cy+10}" width="6" height="3" fill="#7F8C8D" rx="0.5"/>
        <rect x="${cx-8}" y="${cy-10}" width="16" height="10" rx="1.5" fill="#34495E" stroke="#2C3E50" stroke-width="0.8"/>
        <circle cx="${cx}" cy="${cy-5}" r="2" fill="${cleanColor}"/>
      `;
    }

    let labelHtml = '';
    if (w >= 85) {
      labelHtml = `
        <text x="${x + 46}" y="${y + h/2 - (label2 ? 5 : -4)}" font-size="12" fill="var(--text-primary)" font-weight="700" text-anchor="start">${label1}</text>
        ${label2 ? `<text x="${x + 46}" y="${y + h/2 + 13}" font-size="9.5" fill="var(--text-secondary)" text-anchor="start">${label2}</text>` : ''}
      `;
    } else {
      labelHtml = `
        <text x="${x + w/2}" y="${y + h - 18}" font-size="11.5" fill="var(--text-primary)" font-weight="700" text-anchor="middle">${label1}</text>
        ${label2 ? `<text x="${x + w/2}" y="${y + h - 6}" font-size="9" fill="var(--text-secondary)" text-anchor="middle">${label2}</text>` : ''}
      `;
    }

    return `
      <g ${hover} style="${cursor}">
        <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="var(--bg-card)" stroke="var(--border)" stroke-width="1.5"
          style="filter:drop-shadow(0 2px 8px rgba(0,0,0,0.04)); transition:all 0.2s"/>
        <path d="M ${x+1} ${y+1} L ${x+w-1} ${y+1} L ${x+w-1} ${y+h/2} L ${x+1} ${y+h/3} Z" fill="rgba(255,255,255,0.15)" opacity="0.6"/>
        ${w >= 85 ? `<rect x="${x}" y="${y}" width="5" height="${h}" rx="2.5" fill="${cleanColor}"/>` : ''}
        <circle cx="${x + w - 6}" cy="${y + 6}" r="1.5" fill="#AEAEB2" opacity="0.6"/>
        <circle cx="${x + w - 6}" cy="${y + h - 6}" r="1.5" fill="#AEAEB2" opacity="0.6"/>
        ${iconSvg}
        ${labelHtml}
      </g>`;
  }

  /**
   * Common SVG Definitions (Glows, Markers)
   */
  function commonDefs() {
    return `
      <defs>
        <marker id="arr-r" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#FF3B30"/></marker>
        <marker id="arr-g" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#34C759"/></marker>
        <marker id="arr-b" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#0071E3"/></marker>
        <marker id="arr-o" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#FF9500"/></marker>
        <filter id="pl-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <filter id="shg-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <pattern id="breadboard-grid" width="25" height="25" patternUnits="userSpaceOnUse">
          <circle cx="12.5" cy="12.5" r="1.2" fill="var(--text-tertiary)" opacity="0.15"/>
        </pattern>
      </defs>
    `;
  }

  /**
   * Tooltip Attachment Utility
   */
  function attachTooltips(container, tooltipEl, tooltipData) {
    if (!tooltipEl) return;
    container.querySelectorAll('.svg-hover-box').forEach(el => {
      el.addEventListener('mouseenter', () => {
        const id = el.dataset.tip;
        const text = tooltipData[id];
        if (!text) return;
        tooltipEl.textContent = text;
        tooltipEl.style.opacity = '1';
      });
      el.addEventListener('mouseleave', () => {
        tooltipEl.style.opacity = '0';
      });
    });
  }

  /**
   * Export SVG to File
   */
  function exportSVG(svgElement, filename = 'optical-diagram.svg') {
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return { COLORS, componentBox, commonDefs, attachTooltips, exportSVG };
})();
