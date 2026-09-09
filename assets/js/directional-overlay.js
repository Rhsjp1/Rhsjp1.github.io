/**
 * RHS Directional Overlay Library
 * Lightweight SVG-based spatial overlay system for property tools
 * Version 1.0.0 — Vanilla JS, zero dependencies
 * 
 * Usage:
 *   const overlay = new DirectionalOverlay('container-id', {
 *     width: 400,
 *     height: 300,
 *     type: 'compass' | 'sunpath' | 'roofpitch' | 'siteplan'
 *   });
 *   overlay.setDirection(135); // degrees
 */
class DirectionalOverlay {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.width = options.width || 400;
    this.height = options.height || 300;
    this.type = options.type || 'compass';
    this.direction = options.direction || 0;
    this.secondaryDirection = options.secondaryDirection || null;
    this.labels = options.labels || {};
    this.colors = {
      primary: '#D97706',
      secondary: '#3B82F6',
      accent: '#10B981',
      text: '#F3F4F6',
      grid: '#374151',
      background: '#1F2937',
      ...options.colors
    };
    this.svgNS = 'http://www.w3.org/2000/svg';
    this.init();
  }

  init() {
    this.svg = document.createElementNS(this.svgNS, 'svg');
    this.svg.setAttribute('width', '100%');
    this.svg.setAttribute('height', '100%');
    this.svg.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`);
    this.svg.style.display = 'block';
    this.svg.style.borderRadius = '8px';
    this.svg.style.background = this.colors.background;
    this.container.innerHTML = '';
    this.container.appendChild(this.svg);
    this.render();
  }

  render() {
    this.svg.innerHTML = '';
    switch(this.type) {
      case 'compass': this.renderCompass(); break;
      case 'sunpath': this.renderSunPath(); break;
      case 'roofpitch': this.renderRoofPitch(); break;
      case 'siteplan': this.renderSitePlan(); break;
      case 'slope': this.renderSlopeIndicator(); break;
      case 'thermal': this.renderThermalGrid(); break;
      default: this.renderCompass();
    }
  }

  setDirection(deg) {
    this.direction = deg;
    this.render();
  }

  setSecondaryDirection(deg) {
    this.secondaryDirection = deg;
    this.render();
  }

  /* ─── Compass Rose with Direction Vector ─── */
  renderCompass() {
    const cx = this.width / 2;
    const cy = this.height / 2;
    const r = Math.min(cx, cy) - 30;

    // Background circles
    [r, r * 0.6, r * 0.3].forEach((radius, i) => {
      const circle = document.createElementNS(this.svgNS, 'circle');
      circle.setAttribute('cx', cx);
      circle.setAttribute('cy', cy);
      circle.setAttribute('r', radius);
      circle.setAttribute('fill', 'none');
      circle.setAttribute('stroke', this.colors.grid);
      circle.setAttribute('stroke-width', '1');
      if (i === 0) circle.setAttribute('stroke-dasharray', '4,4');
      this.svg.appendChild(circle);
    });

    // Cardinal markers
    const cardinals = [
      { label: 'N', angle: 0 },
      { label: 'E', angle: 90 },
      { label: 'S', angle: 180 },
      { label: 'W', angle: 270 },
      { label: 'NE', angle: 45 },
      { label: 'SE', angle: 135 },
      { label: 'SW', angle: 225 },
      { label: 'NW', angle: 315 }
    ];
    cardinals.forEach(c => {
      const rad = (c.angle - 90) * Math.PI / 180;
      const x = cx + (r + 15) * Math.cos(rad);
      const y = cy + (r + 15) * Math.sin(rad);
      const text = document.createElementNS(this.svgNS, 'text');
      text.setAttribute('x', x);
      text.setAttribute('y', y);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'middle');
      text.setAttribute('fill', c.label.length === 1 ? this.colors.text : this.colors.grid);
      text.setAttribute('font-size', c.label.length === 1 ? '12' : '9');
      text.setAttribute('font-weight', c.label.length === 1 ? 'bold' : 'normal');
      text.textContent = c.label;
      this.svg.appendChild(text);
    });

    // Direction vector
    const dirRad = (this.direction - 90) * Math.PI / 180;
    const endX = cx + r * 0.85 * Math.cos(dirRad);
    const endY = cy + r * 0.85 * Math.sin(dirRad);
    
    const line = document.createElementNS(this.svgNS, 'line');
    line.setAttribute('x1', cx);
    line.setAttribute('y1', cy);
    line.setAttribute('x2', endX);
    line.setAttribute('y2', endY);
    line.setAttribute('stroke', this.colors.primary);
    line.setAttribute('stroke-width', '3');
    line.setAttribute('stroke-linecap', 'round');
    this.svg.appendChild(line);

    // Arrowhead
    const arrowSize = 10;
    const arrowAngle = Math.atan2(endY - cy, endX - cx);
    const arrow1X = endX - arrowSize * Math.cos(arrowAngle - Math.PI / 6);
    const arrow1Y = endY - arrowSize * Math.sin(arrowAngle - Math.PI / 6);
    const arrow2X = endX - arrowSize * Math.cos(arrowAngle + Math.PI / 6);
    const arrow2Y = endY - arrowSize * Math.sin(arrowAngle + Math.PI / 6);
    
    const arrow = document.createElementNS(this.svgNS, 'polygon');
    arrow.setAttribute('points', `${endX},${endY} ${arrow1X},${arrow1Y} ${arrow2X},${arrow2Y}`);
    arrow.setAttribute('fill', this.colors.primary);
    this.svg.appendChild(arrow);

    // Center dot
    const dot = document.createElementNS(this.svgNS, 'circle');
    dot.setAttribute('cx', cx);
    dot.setAttribute('cy', cy);
    dot.setAttribute('r', '4');
    dot.setAttribute('fill', this.colors.primary);
    this.svg.appendChild(dot);

    // Label
    const label = this.labels.direction || 'Flow Direction';
    const text = document.createElementNS(this.svgNS, 'text');
    text.setAttribute('x', cx);
    text.setAttribute('y', this.height - 10);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', this.colors.primary);
    text.setAttribute('font-size', '11');
    text.setAttribute('font-weight', 'bold');
    text.textContent = `${label}: ${this.direction}°`;
    this.svg.appendChild(text);
  }

  /* ─── Sun Path Arc ─── */
  renderSunPath() {
    const cx = this.width / 2;
    const cy = this.height - 20;
    const r = Math.min(this.width, this.height) - 40;

    // Sun path arc (East to West)
    const arcStart = 180;
    const arcEnd = 360;
    const startRad = arcStart * Math.PI / 180;
    const endRad = arcEnd * Math.PI / 180;
    const startX = cx + r * Math.cos(startRad);
    const startY = cy + r * Math.sin(startRad);
    const endX = cx + r * Math.cos(endRad);
    const endY = cy + r * Math.sin(endRad);

    const arcPath = document.createElementNS(this.svgNS, 'path');
    arcPath.setAttribute('d', `M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`);
    arcPath.setAttribute('fill', 'none');
    arcPath.setAttribute('stroke', this.colors.grid);
    arcPath.setAttribute('stroke-width', '1');
    arcPath.setAttribute('stroke-dasharray', '4,4');
    this.svg.appendChild(arcPath);

    // Horizon line
    const horizon = document.createElementNS(this.svgNS, 'line');
    horizon.setAttribute('x1', cx - r - 10);
    horizon.setAttribute('y1', cy);
    horizon.setAttribute('x2', cx + r + 10);
    horizon.setAttribute('y2', cy);
    horizon.setAttribute('stroke', this.colors.grid);
    horizon.setAttribute('stroke-width', '1');
    this.svg.appendChild(horizon);

    // East/West labels
    ['E', 'S', 'W'].forEach((label, i) => {
      const angle = (i * 90 + 180) * Math.PI / 180;
      const x = cx + (r + 15) * Math.cos(angle);
      const y = cy + (r + 15) * Math.sin(angle);
      const text = document.createElementNS(this.svgNS, 'text');
      text.setAttribute('x', x);
      text.setAttribute('y', y);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'middle');
      text.setAttribute('fill', this.colors.text);
      text.setAttribute('font-size', '10');
      text.textContent = label;
      this.svg.appendChild(text);
    });

    // Sun position based on direction (time of day)
    const sunAngleRad = (this.direction - 90) * Math.PI / 180;
    const sunX = cx + r * 0.8 * Math.cos(sunAngleRad);
    const sunY = cy + r * 0.8 * Math.sin(sunAngleRad);

    // Sun glow
    const glow = document.createElementNS(this.svgNS, 'circle');
    glow.setAttribute('cx', sunX);
    glow.setAttribute('cy', sunY);
    glow.setAttribute('r', '18');
    glow.setAttribute('fill', this.colors.primary);
    glow.setAttribute('opacity', '0.2');
    this.svg.appendChild(glow);

    // Sun
    const sun = document.createElementNS(this.svgNS, 'circle');
    sun.setAttribute('cx', sunX);
    sun.setAttribute('cy', sunY);
    sun.setAttribute('r', '10');
    sun.setAttribute('fill', this.colors.primary);
    this.svg.appendChild(sun);

    // Sun rays
    for (let i = 0; i < 8; i++) {
      const rayAngle = i * Math.PI / 4;
      const ray = document.createElementNS(this.svgNS, 'line');
      ray.setAttribute('x1', sunX + 12 * Math.cos(rayAngle));
      ray.setAttribute('y1', sunY + 12 * Math.sin(rayAngle));
      ray.setAttribute('x2', sunX + 16 * Math.cos(rayAngle));
      ray.setAttribute('y2', sunY + 16 * Math.sin(rayAngle));
      ray.setAttribute('stroke', this.colors.primary);
      ray.setAttribute('stroke-width', '2');
      ray.setAttribute('stroke-linecap', 'round');
      this.svg.appendChild(ray);
    }

    // Shadow vector (opposite sun direction)
    const shadowAngleRad = sunAngleRad + Math.PI;
    const shadowLen = 30;
    const shadow = document.createElementNS(this.svgNS, 'line');
    shadow.setAttribute('x1', cx);
    shadow.setAttribute('y1', cy);
    shadow.setAttribute('x2', cx + shadowLen * Math.cos(shadowAngleRad));
    shadow.setAttribute('y2', cy + shadowLen * Math.sin(shadowAngleRad));
    shadow.setAttribute('stroke', this.colors.secondary);
    shadow.setAttribute('stroke-width', '2');
    shadow.setAttribute('stroke-dasharray', '4,2');
    this.svg.appendChild(shadow);

    // Label
    const label = this.labels.sunAngle || 'Sun Angle';
    const text = document.createElementNS(this.svgNS, 'text');
    text.setAttribute('x', cx);
    text.setAttribute('y', 15);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', this.colors.primary);
    text.setAttribute('font-size', '11');
    text.setAttribute('font-weight', 'bold');
    text.textContent = `${label}: ${this.direction}°`;
    this.svg.appendChild(text);
  }

  /* ─── Roof Pitch Diagram ─── */
  renderRoofPitch() {
    const slopeAngle = this.direction; // 0-90 degrees
    const pitchRatio = Math.tan(slopeAngle * Math.PI / 180) * 12;
    
    // Roof triangle
    const baseY = this.height - 40;
    const peakY = 40;
    const baseLeft = 30;
    const baseRight = this.width - 30;
    const peakX = this.width / 2;

    // Roof outline
    const roof = document.createElementNS(this.svgNS, 'polygon');
    roof.setAttribute('points', `${baseLeft},${baseY} ${peakX},${peakY} ${baseRight},${baseY}`);
    roof.setAttribute('fill', this.colors.background);
    roof.setAttribute('stroke', this.colors.text);
    roof.setAttribute('stroke-width', '2');
    this.svg.appendChild(roof);

    // Fill gradient based on pitch
    const fillHeight = baseY - peakY;
    const fillRect = document.createElementNS(this.svgNS, 'rect');
    fillRect.setAttribute('x', baseLeft + 2);
    fillRect.setAttribute('y', peakY + 2);
    fillRect.setAttribute('width', baseRight - baseLeft - 4);
    fillRect.setAttribute('height', fillHeight - 4);
    fillRect.setAttribute('fill', this.colors.primary);
    fillRect.setAttribute('opacity', '0.1');
    this.svg.appendChild(fillRect);

    // Pitch angle arc
    const arcRadius = 40;
    const arcStartX = peakX + arcRadius;
    const arcStartY = baseY;
    const arcEndX = peakX + arcRadius * Math.cos(slopeAngle * Math.PI / 180);
    const arcEndY = baseY - arcRadius * Math.sin(slopeAngle * Math.PI / 180);

    const arcPath = document.createElementNS(this.svgNS, 'path');
    arcPath.setAttribute('d', `M ${arcStartX} ${arcStartY} A ${arcRadius} ${arcRadius} 0 0 0 ${arcEndX} ${arcEndY}`);
    arcPath.setAttribute('fill', 'none');
    arcPath.setAttribute('stroke', this.colors.primary);
    arcPath.setAttribute('stroke-width', '1.5');
    this.svg.appendChild(arcPath);

    // Pitch label
    const pitchText = document.createElementNS(this.svgNS, 'text');
    pitchText.setAttribute('x', peakX + 50);
    pitchText.setAttribute('y', baseY - 15);
    pitchText.setAttribute('fill', this.colors.primary);
    pitchText.setAttribute('font-size', '10');
    pitchText.setAttribute('font-weight', 'bold');
    pitchText.textContent = `${slopeAngle}° (${pitchRatio.toFixed(1)}:12)`;
    this.svg.appendChild(pitchText);

    // "Run" label
    const runText = document.createElementNS(this.svgNS, 'text');
    runText.setAttribute('x', peakX);
    runText.setAttribute('y', baseY + 15);
    runText.setAttribute('text-anchor', 'middle');
    runText.setAttribute('fill', this.colors.grid);
    runText.setAttribute('font-size', '9');
    runText.textContent = 'Run (12")';
    this.svg.appendChild(runText);

    // "Rise" label
    const riseText = document.createElementNS(this.svgNS, 'text');
    riseText.setAttribute('x', peakX - 35);
    riseText.setAttribute('y', peakY + fillHeight / 2);
    riseText.setAttribute('fill', this.colors.grid);
    riseText.setAttribute('font-size', '9');
    riseText.setAttribute('transform', `rotate(-90, ${peakX - 35}, ${peakY + fillHeight / 2})`);
    riseText.textContent = `${pitchRatio.toFixed(1)}"`;
    this.svg.appendChild(riseText);

    // Catchment efficiency indicator
    const efficiency = Math.min(100, Math.round(70 + (slopeAngle / 90) * 30));
    const effLabel = document.createElementNS(this.svgNS, 'text');
    effLabel.setAttribute('x', this.width / 2);
    effLabel.setAttribute('y', 15);
    effLabel.setAttribute('text-anchor', 'middle');
    effLabel.setAttribute('fill', this.colors.primary);
    effLabel.setAttribute('font-size', '11');
    effLabel.setAttribute('font-weight', 'bold');
    effLabel.textContent = `Catchment Efficiency: ${efficiency}%`;
    this.svg.appendChild(effLabel);
  }

  /* ─── Slope Indicator ─── */
  renderSlopeIndicator() {
    const slopeAngle = this.direction;
    const cx = this.width / 2;
    const cy = this.height / 2;
    const len = Math.min(this.width, this.height) / 2 - 20;

    // Ground line
    const ground = document.createElementNS(this.svgNS, 'line');
    ground.setAttribute('x1', cx - len);
    ground.setAttribute('y1', cy + len * Math.tan(slopeAngle * Math.PI / 180));
    ground.setAttribute('x2', cx + len);
    ground.setAttribute('y2', cy - len * Math.tan(slopeAngle * Math.PI / 180));
    ground.setAttribute('stroke', this.colors.grid);
    ground.setAttribute('stroke-width', '2');
    this.svg.appendChild(ground);

    // Horizontal reference
    const horizontal = document.createElementNS(this.svgNS, 'line');
    horizontal.setAttribute('x1', cx - len);
    horizontal.setAttribute('y1', cy);
    horizontal.setAttribute('x2', cx + len);
    horizontal.setAttribute('y2', cy);
    horizontal.setAttribute('stroke', this.colors.grid);
    horizontal.setAttribute('stroke-width', '1');
    horizontal.setAttribute('stroke-dasharray', '4,4');
    this.svg.appendChild(horizontal);

    // Slope arrow
    const slopeDir = this.secondaryDirection || 0;
    const arrowRad = (slopeDir - 90) * Math.PI / 180;
    const arrowLen = len * 0.6;
    const arrowX = cx + arrowLen * Math.cos(arrowRad);
    const arrowY = cy + arrowLen * Math.sin(arrowRad);

    const arrow = document.createElementNS(this.svgNS, 'line');
    arrow.setAttribute('x1', cx);
    arrow.setAttribute('y1', cy);
    arrow.setAttribute('x2', arrowX);
    arrow.setAttribute('y2', arrowY);
    arrow.setAttribute('stroke', this.colors.primary);
    arrow.setAttribute('stroke-width', '3');
    arrow.setAttribute('stroke-linecap', 'round');
    this.svg.appendChild(arrow);

    // Arrowhead
    const headSize = 8;
    const headAngle = Math.atan2(arrowY - cy, arrowX - cx);
    const head = document.createElementNS(this.svgNS, 'polygon');
    head.setAttribute('points', `${arrowX},${arrowY} ${arrowX - headSize * Math.cos(headAngle - Math.PI / 6)},${arrowY - headSize * Math.sin(headAngle - Math.PI / 6)} ${arrowX - headSize * Math.cos(headAngle + Math.PI / 6)},${arrowY - headSize * Math.sin(headAngle + Math.PI / 6)}`);
    head.setAttribute('fill', this.colors.primary);
    this.svg.appendChild(head);

    // Angle label
    const label = document.createElementNS(this.svgNS, 'text');
    label.setAttribute('x', cx);
    label.setAttribute('y', this.height - 10);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('fill', this.colors.primary);
    label.setAttribute('font-size', '11');
    label.setAttribute('font-weight', 'bold');
    label.textContent = `Slope: ${slopeAngle}° | Flow: ${slopeDir}°`;
    this.svg.appendChild(label);
  }

  /* ─── Thermal Grid ─── */
  renderThermalGrid() {
    const cellSize = 30;
    const cols = Math.floor(this.width / cellSize);
    const rows = Math.floor(this.height / cellSize);
    const offsetX = (this.width - cols * cellSize) / 2;
    const offsetY = (this.height - rows * cellSize) / 2;

    // Generate thermal values based on sun angle
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Distance from "hot spot" (sun-facing side)
        const distFromSun = Math.sqrt(
          Math.pow(c - cols * (this.direction / 360), 2) + 
          Math.pow(r - rows / 2, 2)
        );
        const maxDist = Math.sqrt(Math.pow(cols, 2) + Math.pow(rows, 2));
        const heat = Math.max(0, 1 - distFromSun / maxDist);

        const rect = document.createElementNS(this.svgNS, 'rect');
        rect.setAttribute('x', offsetX + c * cellSize);
        rect.setAttribute('y', offsetY + r * cellSize);
        rect.setAttribute('width', cellSize - 1);
        rect.setAttribute('height', cellSize - 1);
        rect.setAttribute('rx', '2');
        
        // Color interpolation: blue (cool) → amber (warm) → red (hot)
        const heatColor = heat > 0.6 ? '#EF4444' : heat > 0.3 ? this.colors.primary : this.colors.secondary;
        rect.setAttribute('fill', heatColor);
        rect.setAttribute('opacity', 0.2 + heat * 0.6);
        this.svg.appendChild(rect);
      }
    }

    // Sun direction indicator
    const sunRad = (this.direction - 90) * Math.PI / 180;
    const sunX = this.width / 2 + 50 * Math.cos(sunRad);
    const sunY = this.height / 2 + 50 * Math.sin(sunRad);
    const sun = document.createElementNS(this.svgNS, 'circle');
    sun.setAttribute('cx', sunX);
    sun.setAttribute('cy', sunY);
    sun.setAttribute('r', '8');
    sun.setAttribute('fill', this.colors.primary);
    this.svg.appendChild(sun);

    // Legend
    const legendY = this.height - 10;
    [{ color: this.colors.secondary, label: 'Cool' }, { color: this.colors.primary, label: 'Warm' }, { color: '#EF4444', label: 'Hot' }].forEach((item, i) => {
      const rect = document.createElementNS(this.svgNS, 'rect');
      rect.setAttribute('x', offsetX + i * 70);
      rect.setAttribute('y', legendY - 8);
      rect.setAttribute('width', '12');
      rect.setAttribute('height', '12');
      rect.setAttribute('rx', '2');
      rect.setAttribute('fill', item.color);
      this.svg.appendChild(rect);
      
      const text = document.createElementNS(this.svgNS, 'text');
      text.setAttribute('x', offsetX + i * 70 + 16);
      text.setAttribute('y', legendY + 2);
      text.setAttribute('fill', this.colors.text);
      text.setAttribute('font-size', '9');
      text.textContent = item.label;
      this.svg.appendChild(text);
    });
  }

  /* ─── Site Plan Wireframe ─── */
  renderSitePlan() {
    const margin = 30;
    const planWidth = this.width - margin * 2;
    const planHeight = this.height - margin * 2;

    // Property boundary
    const boundary = document.createElementNS(this.svgNS, 'rect');
    boundary.setAttribute('x', margin);
    boundary.setAttribute('y', margin);
    boundary.setAttribute('width', planWidth);
    boundary.setAttribute('height', planHeight);
    boundary.setAttribute('fill', this.colors.background);
    boundary.setAttribute('stroke', this.colors.grid);
    boundary.setAttribute('stroke-width', '1');
    boundary.setAttribute('stroke-dasharray', '4,4');
    this.svg.appendChild(boundary);

    // Compass rose (top-right)
    const compassR = 20;
    const compassCx = this.width - margin - compassR - 5;
    const compassCy = margin + compassR + 5;
    
    const compassCircle = document.createElementNS(this.svgNS, 'circle');
    compassCircle.setAttribute('cx', compassCx);
    compassCircle.setAttribute('cy', compassCy);
    compassCircle.setAttribute('r', compassR);
    compassCircle.setAttribute('fill', 'none');
    compassCircle.setAttribute('stroke', this.colors.grid);
    compassCircle.setAttribute('stroke-width', '1');
    this.svg.appendChild(compassCircle);

    // N/E/S/W arrows
    [{ label: 'N', angle: 0 }, { label: 'E', angle: 90 }, { label: 'S', angle: 180 }, { label: 'W', angle: 270 }].forEach(c => {
      const rad = (c.angle - 90) * Math.PI / 180;
      const x = compassCx + (compassR - 5) * Math.cos(rad);
      const y = compassCy + (compassR - 5) * Math.sin(rad);
      const text = document.createElementNS(this.svgNS, 'text');
      text.setAttribute('x', x);
      text.setAttribute('y', y);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'middle');
      text.setAttribute('fill', c.label === 'N' ? this.colors.primary : this.colors.grid);
      text.setAttribute('font-size', '7');
      text.setAttribute('font-weight', c.label === 'N' ? 'bold' : 'normal');
      text.textContent = c.label;
      this.svg.appendChild(text);
    });

    // House (center)
    const houseW = planWidth * 0.3;
    const houseH = planHeight * 0.25;
    const houseX = (this.width - houseW) / 2;
    const houseY = (this.height - houseH) / 2;
    
    const house = document.createElementNS(this.svgNS, 'rect');
    house.setAttribute('x', houseX);
    house.setAttribute('y', houseY);
    house.setAttribute('width', houseW);
    house.setAttribute('height', houseH);
    house.setAttribute('fill', 'none');
    house.setAttribute('stroke', this.colors.text);
    house.setAttribute('stroke-width', '2');
    this.svg.appendChild(house);

    // House label
    const houseLabel = document.createElementNS(this.svgNS, 'text');
    houseLabel.setAttribute('x', houseX + houseW / 2);
    houseLabel.setAttribute('y', houseY + houseH / 2);
    houseLabel.setAttribute('text-anchor', 'middle');
    houseLabel.setAttribute('dominant-baseline', 'middle');
    houseLabel.setAttribute('fill', this.colors.text);
    houseLabel.setAttribute('font-size', '10');
    houseLabel.textContent = 'HOUSE';
    this.svg.appendChild(houseLabel);

    // Foundation protection zone
    const zoneMargin = 10;
    const zone = document.createElementNS(this.svgNS, 'rect');
    zone.setAttribute('x', houseX - zoneMargin);
    zone.setAttribute('y', houseY - zoneMargin);
    zone.setAttribute('width', houseW + zoneMargin * 2);
    zone.setAttribute('height', houseH + zoneMargin * 2);
    zone.setAttribute('fill', this.colors.accent);
    zone.setAttribute('opacity', '0.1');
    zone.setAttribute('stroke', this.colors.accent);
    zone.setAttribute('stroke-width', '1');
    zone.setAttribute('stroke-dasharray', '3,3');
    this.svg.appendChild(zone);

    // Swale (directional)
    const swaleStartX = houseX + houseW + 20;
    const swaleY = houseY + houseH + 15;
    const swaleEndX = margin + planWidth - 10;
    
    const swale = document.createElementNS(this.svgNS, 'line');
    swale.setAttribute('x1', swaleStartX);
    swale.setAttribute('y1', swaleY);
    swale.setAttribute('x2', swaleEndX);
    swale.setAttribute('y2', swaleY);
    swale.setAttribute('stroke', this.colors.secondary);
    swale.setAttribute('stroke-width', '4');
    swale.setAttribute('stroke-linecap', 'round');
    this.svg.appendChild(swale);

    // Swale label
    const swaleLabel = document.createElementNS(this.svgNS, 'text');
    swaleLabel.setAttribute('x', (swaleStartX + swaleEndX) / 2);
    swaleLabel.setAttribute('y', swaleY - 8);
    swaleLabel.setAttribute('text-anchor', 'middle');
    swaleLabel.setAttribute('fill', this.colors.secondary);
    swaleLabel.setAttribute('font-size', '8');
    swaleLabel.textContent = 'SWALE';
    this.svg.appendChild(swaleLabel);

    // Drainage arrow
    const arrowRad = 0; // flowing right
    const arrowX = swaleStartX + 30;
    const arrowY = swaleY;
    const arrow = document.createElementNS(this.svgNS, 'polygon');
    arrow.setAttribute('points', `${arrowX + 8},${arrowY} ${arrowX - 4},${arrowY - 4} ${arrowX - 4},${arrowY + 4}`);
    arrow.setAttribute('fill', this.colors.secondary);
    this.svg.appendChild(arrow);

    // Zone markers
    const zones = [
      { x: margin + 10, y: margin + 10, label: 'A', color: this.colors.primary },
      { x: margin + planWidth - 30, y: margin + planHeight - 20, label: 'B', color: this.colors.secondary },
      { x: margin + planWidth - 30, y: margin + 10, label: 'C', color: this.colors.accent }
    ];
    zones.forEach(z => {
      const zoneMark = document.createElementNS(this.svgNS, 'circle');
      zoneMark.setAttribute('cx', z.x);
      zoneMark.setAttribute('cy', z.y);
      zoneMark.setAttribute('r', '10');
      zoneMark.setAttribute('fill', z.color);
      zoneMark.setAttribute('opacity', '0.2');
      this.svg.appendChild(zoneMark);
      
      const zoneLabel = document.createElementNS(this.svgNS, 'text');
      zoneLabel.setAttribute('x', z.x);
      zoneLabel.setAttribute('y', z.y);
      zoneLabel.setAttribute('text-anchor', 'middle');
      zoneLabel.setAttribute('dominant-baseline', 'middle');
      zoneLabel.setAttribute('fill', z.color);
      zoneLabel.setAttribute('font-size', '8');
      zoneLabel.setAttribute('font-weight', 'bold');
      zoneLabel.textContent = z.label;
      this.svg.appendChild(zoneLabel);
    });

    // Title
    const title = document.createElementNS(this.svgNS, 'text');
    title.setAttribute('x', this.width / 2);
    title.setAttribute('y', 15);
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('fill', this.colors.primary);
    title.setAttribute('font-size', '11');
    title.setAttribute('font-weight', 'bold');
    title.textContent = 'SITE PLAN OVERLAY';
    this.svg.appendChild(title);
  }
}

// Export for use in tools
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DirectionalOverlay;
}
