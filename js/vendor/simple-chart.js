/* Lightweight local Chart.js-compatible adapter for extension/offline use. */
(() => {
  if (window.Chart) return;

  let chartSeq = 0;
  const instances = {};
  const canvasMap = new WeakMap();

  const toCanvas = (ctxOrCanvas) => ctxOrCanvas?.canvas || ctxOrCanvas;
  const css = (name, fallback) =>
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

  function asNumber(value) {
    if (typeof value === 'number') return value;
    if (value && typeof value === 'object' && 'y' in value) return Number(value.y);
    return Number(value);
  }

  function niceBounds(values, scale) {
    const finite = values.map(asNumber).filter(Number.isFinite);
    if (!finite.length) return { min: 0, max: 1 };
    if (scale?.type === 'logarithmic') {
      const positives = finite.filter((v) => v > 0);
      if (!positives.length) return { min: 1, max: 10, log: true };
      const min = Math.pow(10, Math.floor(Math.log10(Math.min(...positives))));
      const max = Math.pow(10, Math.ceil(Math.log10(Math.max(...positives))));
      return { min, max, log: true };
    }
    const explicitMin = Number.isFinite(scale?.min) ? scale.min : undefined;
    const explicitMax = Number.isFinite(scale?.max) ? scale.max : undefined;
    const minRaw = explicitMin ?? Math.min(...finite, 0);
    const maxRaw = explicitMax ?? Math.max(...finite, 1);
    const pad = Math.max((maxRaw - minRaw) * 0.08, 1e-9);
    return { min: explicitMin ?? minRaw - pad, max: explicitMax ?? maxRaw + pad };
  }

  class SimpleChart {
    constructor(ctxOrCanvas, config) {
      this.canvas = toCanvas(ctxOrCanvas);
      this.ctx = this.canvas.getContext('2d');
      this.config = config || {};
      this.data = this.config.data || { labels: [], datasets: [] };
      this.options = this.config.options || {};
      this.id = String(++chartSeq);
      instances[this.id] = this;
      canvasMap.set(this.canvas, this);
      this.resize();
      this.draw();
    }

    static getChart(ctxOrCanvas) {
      const canvas = toCanvas(ctxOrCanvas);
      return canvas ? canvasMap.get(canvas) || null : null;
    }

    static register() {}

    resize() {
      const rect = this.canvas.getBoundingClientRect();
      const width = Math.max(320, Math.round(rect.width || this.canvas.clientWidth || 640));
      const height = Math.max(220, Math.round(rect.height || this.canvas.clientHeight || 320));
      const dpr = window.devicePixelRatio || 1;
      if (this.canvas.width !== width * dpr || this.canvas.height !== height * dpr) {
        this.canvas.width = width * dpr;
        this.canvas.height = height * dpr;
      }
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.width = width;
      this.height = height;
    }

    update() {
      this.resize();
      this.draw();
    }

    destroy() {
      this.ctx.clearRect(0, 0, this.width, this.height);
      delete instances[this.id];
      canvasMap.delete(this.canvas);
    }

    draw() {
      this.ctx.clearRect(0, 0, this.width, this.height);
      if (this.config.type === 'radar') this.drawRadar();
      else this.drawLine();
    }

    drawLine() {
      const ctx = this.ctx;
      const labels = this.data.labels || [];
      const datasets = this.data.datasets || [];
      const allValues = datasets.flatMap((d) => d.data || []);
      const bounds = niceBounds(allValues, this.options.scales?.y);
      const m = { left: 54, right: 18, top: 26, bottom: 42 };
      const w = this.width - m.left - m.right;
      const h = this.height - m.top - m.bottom;
      const grid = 'rgba(142,142,147,0.18)';
      const text = css('--text-secondary', '#6E6E73');

      const yPos = (v) => {
        const n = Math.max(bounds.min, Math.min(bounds.max, asNumber(v)));
        if (bounds.log) {
          const lo = Math.log10(bounds.min);
          const hi = Math.log10(bounds.max);
          return m.top + h - ((Math.log10(Math.max(n, bounds.min)) - lo) / (hi - lo || 1)) * h;
        }
        return m.top + h - ((n - bounds.min) / (bounds.max - bounds.min || 1)) * h;
      };
      const xPos = (i) => m.left + (labels.length <= 1 ? w / 2 : (i / (labels.length - 1)) * w);

      ctx.save();
      ctx.strokeStyle = grid;
      ctx.fillStyle = text;
      ctx.font = '11px Inter, sans-serif';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = m.top + (i / 4) * h;
        ctx.beginPath();
        ctx.moveTo(m.left, y);
        ctx.lineTo(m.left + w, y);
        ctx.stroke();
        const value = bounds.max - (i / 4) * (bounds.max - bounds.min);
        ctx.fillText(formatTick(value, bounds.log), 8, y + 4);
      }
      for (let i = 0; i < labels.length; i += Math.max(1, Math.ceil(labels.length / 7))) {
        const x = xPos(i);
        ctx.beginPath();
        ctx.moveTo(x, m.top);
        ctx.lineTo(x, m.top + h);
        ctx.stroke();
        ctx.fillText(String(labels[i]).slice(0, 10), x - 14, this.height - 14);
      }

      datasets.forEach((d) => {
        const data = d.data || [];
        ctx.strokeStyle = d.borderColor || css('--accent', '#0071E3');
        ctx.lineWidth = d.borderWidth || 2;
        ctx.beginPath();
        data.forEach((value, i) => {
          const x = xPos(i);
          const y = yPos(value);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
      });
      ctx.restore();
    }

    drawRadar() {
      const ctx = this.ctx;
      const labels = this.data.labels || [];
      const datasets = this.data.datasets || [];
      const cx = this.width / 2;
      const cy = this.height / 2;
      const radius = Math.min(this.width, this.height) * 0.38;
      const count = Math.max(labels.length, 3);
      const grid = 'rgba(142,142,147,0.22)';
      const text = css('--text-secondary', '#6E6E73');

      ctx.save();
      ctx.translate(cx, cy);
      ctx.strokeStyle = grid;
      ctx.fillStyle = text;
      ctx.font = '11px Inter, sans-serif';
      for (let ring = 1; ring <= 4; ring++) {
        ctx.beginPath();
        for (let i = 0; i < count; i++) {
          const a = -Math.PI / 2 + (i / count) * Math.PI * 2;
          const r = radius * ring / 4;
          const x = Math.cos(a) * r;
          const y = Math.sin(a) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }
      for (let i = 0; i < count; i += Math.max(1, Math.floor(count / 8))) {
        const a = -Math.PI / 2 + (i / count) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * radius, Math.sin(a) * radius);
        ctx.stroke();
        ctx.fillText(String(labels[i] || ''), Math.cos(a) * (radius + 14) - 10, Math.sin(a) * (radius + 14) + 4);
      }
      datasets.forEach((d) => {
        const data = d.data || [];
        ctx.beginPath();
        data.forEach((value, i) => {
          const a = -Math.PI / 2 + (i / count) * Math.PI * 2;
          const r = radius * Math.max(0, Math.min(1, asNumber(value)));
          const x = Math.cos(a) * r;
          const y = Math.sin(a) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.strokeStyle = d.borderColor || css('--accent', '#0071E3');
        ctx.fillStyle = d.backgroundColor || 'rgba(0,113,227,0.08)';
        ctx.lineWidth = d.borderWidth || 2;
        ctx.fill();
        ctx.stroke();
      });
      ctx.restore();
    }
  }

  function formatTick(value, log) {
    if (log && value >= 1e9) return `${value / 1e9}G`;
    if (log && value >= 1e6) return `${value / 1e6}M`;
    if (log && value >= 1e3) return `${value / 1e3}k`;
    if (Math.abs(value) >= 1000) return value.toExponential(1);
    if (Math.abs(value) < 0.01 && value !== 0) return value.toExponential(1);
    return Number(value.toPrecision(3)).toString();
  }

  SimpleChart.instances = instances;
  window.Chart = SimpleChart;
})();
