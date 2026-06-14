const materials = {
  silver: {
    name: "银",
    color: "#b8c3d0",
    data: {
      0: { diskRpm: 0, idle: 0.0008, net: 0.0000, total: 0.0008, torque: null, sliding: null },
      400: { diskRpm: 20, idle: 0.2406, net: 0.1042, total: 0.3448, torque: 0.02083, sliding: 0.0125 },
      800: { diskRpm: 40, idle: 0.4805, net: 0.1025, total: 0.5830, torque: 0.02050, sliding: 0.0123 },
      1200: { diskRpm: 60, idle: 0.7203, net: 0.1008, total: 0.8212, torque: 0.02017, sliding: 0.0121 },
      1600: { diskRpm: 80, idle: 0.9602, net: 0.0992, total: 1.0593, torque: 0.01983, sliding: 0.0119 },
      2000: { diskRpm: 100, idle: 1.2000, net: 0.1000, total: 1.3000, torque: 0.02000, sliding: 0.0120 }
    },
    film: "纳米水膜稳定"
  },
  copper: {
    name: "铜",
    color: "#d28a2d",
    data: {
      0: { diskRpm: 0, idle: 0.0008, net: 0.0000, total: 0.0008, torque: null, sliding: null },
      400: { diskRpm: 20, idle: 0.2406, net: 0.1817, total: 0.4223, torque: 0.03633, sliding: 0.0218 },
      800: { diskRpm: 40, idle: 0.4805, net: 0.1783, total: 0.6588, torque: 0.03567, sliding: 0.0214 },
      1200: { diskRpm: 60, idle: 0.7203, net: 0.1758, total: 0.8962, torque: 0.03517, sliding: 0.0211 },
      1600: { diskRpm: 80, idle: 0.9602, net: 0.1733, total: 1.1335, torque: 0.03467, sliding: 0.0208 },
      2000: { diskRpm: 100, idle: 1.2000, net: 0.1758, total: 1.3758, torque: 0.03517, sliding: 0.0211 }
    },
    film: "水膜稳定性中等"
  },
  iron: {
    name: "铁",
    color: "#54606c",
    data: {
      0: { diskRpm: 0, idle: 0.0008, net: 0.0000, total: 0.0008, torque: null, sliding: null },
      400: { diskRpm: 20, idle: 0.2406, net: 0.3025, total: 0.5431, torque: 0.06050, sliding: 0.0363 },
      800: { diskRpm: 40, idle: 0.4805, net: 0.2983, total: 0.7788, torque: 0.05967, sliding: 0.0358 },
      1200: { diskRpm: 60, idle: 0.7203, net: 0.2942, total: 1.0145, torque: 0.05883, sliding: 0.0353 },
      1600: { diskRpm: 80, idle: 0.9602, net: 0.2933, total: 1.2535, torque: 0.05867, sliding: 0.0352 },
      2000: { diskRpm: 100, idle: 1.2000, net: 0.2908, total: 1.4908, torque: 0.05817, sliding: 0.0349 }
    },
    film: "界面波动增强"
  }
};

const REDUCTION_RATIO = 20;
const STAGE_SECONDS = 3.5;
const FORMATION_SERIES = {
  silver: {
    mu: { 0: 0.0162, 2: 0.0145, 4: 0.0132, 6: 0.0126, 8: 0.0122, 10: 0.0121, 15: 0.0120 },
    net: { 0: 0.1215, 2: 0.1089, 4: 0.0992, 6: 0.0943, 8: 0.0918, 10: 0.0909, 15: 0.0906 }
  },
  copper: {
    mu: { 0: 0.0285, 2: 0.0252, 4: 0.0230, 6: 0.0219, 8: 0.0213, 10: 0.0211, 15: 0.0211 },
    net: { 0: 0.2140, 2: 0.1893, 4: 0.1728, 6: 0.1645, 8: 0.1601, 10: 0.1585, 15: 0.1577 }
  },
  iron: {
    mu: { 0: 0.0510, 2: 0.0452, 4: 0.0405, 6: 0.0377, 8: 0.0362, 10: 0.0353, 15: 0.0350 },
    net: { 0: 0.3820, 2: 0.3384, 4: 0.3036, 6: 0.2827, 8: 0.2714, 10: 0.2645, 15: 0.2622 }
  }
};

const materialSkins = {
  silver: ["#f7fafc", "#d7dee5", "#9aa8b4", "#edf2f6"],
  copper: ["#ffd88a", "#d99a35", "#b86f1f", "#f0b14b"],
  iron: ["#f7fafc", "#d7dee5", "#9aa8b4", "#edf2f6"]
};

const state = {
  running: false,
  material: "silver",
  rpm: 1200,
  temp: 0,
  load: 50,
  gain: 10,
  time: 0,
  samples: [],
  records: []
};

const els = {
  navBtns: document.querySelectorAll(".nav-btn"),
  views: document.querySelectorAll(".view"),
  materialBtns: document.querySelectorAll("#materialPicker button"),
  rpmInput: document.querySelector("#rpmInput"),
  tempInput: document.querySelector("#tempInput"),
  loadInput: document.querySelector("#loadInput"),
  gainInput: document.querySelector("#gainInput"),
  rpmValue: document.querySelector("#rpmValue"),
  tempValue: document.querySelector("#tempValue"),
  loadValue: document.querySelector("#loadValue"),
  runBtn: document.querySelector("#runBtn"),
  resetBtn: document.querySelector("#resetBtn"),
  systemState: document.querySelector("#systemState"),
  pulse: document.querySelector(".pulse"),
  idleVoltage: document.querySelector("#idleVoltage"),
  netVoltage: document.querySelector("#netVoltage"),
  torqueValue: document.querySelector("#torqueValue"),
  slidingMu: document.querySelector("#slidingMu"),
  sampleCount: document.querySelector("#sampleCount"),
  sceneLabel: document.querySelector("#sceneLabel"),
  waterFilm: document.querySelector("#waterFilm"),
  simCanvas: document.querySelector("#simCanvas"),
  chartCanvas: document.querySelector("#chartCanvas"),
  dataBody: document.querySelector("#dataBody"),
  addPointBtn: document.querySelector("#addPointBtn"),
  clearDataBtn: document.querySelector("#clearDataBtn"),
  csvBtn: document.querySelector("#csvBtn"),
  jsonBtn: document.querySelector("#jsonBtn"),
  reportBtn: document.querySelector("#reportBtn"),
  reportText: document.querySelector("#reportText")
};

const simCtx = els.simCanvas.getContext("2d");
const chartCtx = els.chartCanvas.getContext("2d");

function calculations() {
  const material = materials[state.material];
  const data = material.data[state.rpm] || material.data[1200];
  return { material, ...data };
}

function interpolateTimeSeries(table, time) {
  const points = Object.keys(table).map(Number).sort((a, b) => a - b);
  if (time <= points[0]) return table[points[0]];
  if (time >= points[points.length - 1]) return table[points[points.length - 1]];
  for (let i = 0; i < points.length - 1; i++) {
    const left = points[i];
    const right = points[i + 1];
    if (time >= left && time <= right) {
      const ratio = (time - left) / (right - left);
      return table[left] + (table[right] - table[left]) * ratio;
    }
  }
  return table[points[0]];
}

function liveCalculations() {
  const c = calculations();
  if (!state.running || c.sliding == null) return c;
  const formation = FORMATION_SERIES[state.material];
  const useFormation = state.rpm === 1200 && formation;
  const baseNet = useFormation ? interpolateTimeSeries(formation.net, state.time) : c.net;
  const baseSliding = useFormation ? interpolateTimeSeries(formation.mu, state.time) : c.sliding;
  const ripple = 1 + Math.sin(state.time * 5.3) * 0.006 + Math.sin(state.time * 11.7) * 0.0025;
  const net = baseNet * ripple;
  const sliding = baseSliding * (1 + Math.sin(state.time * 4.7 + 0.9) * 0.004);
  const torque = net / (state.gain * 0.5);
  return { ...c, net, total: c.idle + net, torque, sliding };
}

function updateReadouts() {
  const c = liveCalculations();
  els.rpmValue.textContent = `${state.rpm} rpm`;
  els.tempValue.textContent = `${state.temp.toFixed(1)} ℃`;
  els.loadValue.textContent = `${state.load} N`;
  els.idleVoltage.textContent = `${c.idle.toFixed(4)} V`;
  els.netVoltage.textContent = `${c.net.toFixed(3)} V`;
  els.torqueValue.textContent = c.torque == null ? "—" : `${c.torque.toFixed(5)} N·m`;
  els.slidingMu.textContent = c.sliding == null ? "—" : c.sliding.toFixed(4);
  els.sceneLabel.textContent = `${c.material.name}质空心圆柱 / 底部接触端旋转`;
  els.waterFilm.textContent = c.material.film;
  els.systemState.textContent = state.running ? "采集中" : "待机";
  els.pulse.classList.toggle("running", state.running);
  els.runBtn.textContent = state.running ? "暂停采集" : "启动采集";
}

function drawSimulation() {
  const c = calculations();
  const ctx = simCtx;
  const w = els.simCanvas.width;
  const h = els.simCanvas.height;
  ctx.clearRect(0, 0, w, h);

  ctx.fillStyle = "#f8fdff";
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "rgba(19,120,209,.12)";
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 42) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 140, h);
    ctx.stroke();
  }

  const cx = w * 0.43;
  const iceY = h * 0.75;
  const spin = state.time * state.rpm / 120;
  const stage = Math.min(1, state.time / (STAGE_SECONDS * 4));
  const activeStage = Math.min(3, Math.floor(state.time / STAGE_SECONDS));

  const iceGradient = ctx.createLinearGradient(0, iceY - 18, 0, h);
  iceGradient.addColorStop(0, "#dff4ff");
  iceGradient.addColorStop(1, "#f7fcff");
  ctx.fillStyle = iceGradient;
  roundRect(ctx, cx - 260, iceY - 18, 520, 86, 16);
  ctx.fill();
  ctx.strokeStyle = "#9dd8f5";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.strokeStyle = "rgba(10,79,158,.25)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 236, iceY + 14);
  for (let x = -236; x <= 236; x += 16) {
    const rough = Math.sin(x / 12 + state.time * 0.5) * (5 - stage * 4);
    ctx.lineTo(cx + x, iceY + 14 + rough);
  }
  ctx.stroke();

  const filmAlpha = 0.25 + stage * 0.55;
  ctx.fillStyle = `rgba(27, 184, 231, ${filmAlpha})`;
  ctx.beginPath();
  ctx.ellipse(cx, iceY + 2, 94 + stage * 34, 14 + stage * 7, 0, 0, Math.PI * 2);
  ctx.fill();

  for (let i = 0; i < 18; i++) {
    const angle = spin * 1.3 + i * Math.PI * 2 / 18;
    const rx = 72 + stage * 42;
    const ry = 13 + stage * 8;
    ctx.fillStyle = `rgba(27, 184, 231, ${0.18 + stage * 0.35})`;
    ctx.beginPath();
    ctx.arc(cx + Math.cos(angle) * rx, iceY + 2 + Math.sin(angle) * ry, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  drawDevice(ctx, cx, iceY, c.material.color, spin);

  ctx.strokeStyle = "#d51920";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx + 138, iceY - 134);
  ctx.lineTo(cx + 138, iceY - 40);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 138, iceY - 40);
  ctx.lineTo(cx + 126, iceY - 60);
  ctx.lineTo(cx + 150, iceY - 60);
  ctx.closePath();
  ctx.fillStyle = "#d51920";
  ctx.fill();
  ctx.fillStyle = "#24496d";
  ctx.font = "15px Microsoft YaHei";
  ctx.fillText(`Load ${state.load} N`, cx + 154, iceY - 82);

  drawContactZoom(ctx, cx - 286, iceY + 34, c.material.color, stage);
  drawStageLegend(ctx, w - 250, 58, activeStage);

  ctx.fillStyle = "#0a4f9e";
  ctx.font = "16px Microsoft YaHei";
  ctx.fillText(`扭矩 ${c.torque.toFixed(5)} N·m`, 34, 48);
  ctx.fillText(`总电压 ${c.total.toFixed(3)} V`, 34, 76);
  ctx.fillText(`μs ${c.sliding.toFixed(4)}`, 34, 104);
  ctx.fillText(`底部旋转 ${state.rpm} rpm`, 34, 132);
}

function drawDevice(ctx, cx, iceY, color, spin) {
  const motorY = 58;
  const sensorY = 150;
  const shaftTop = 182;
  const cylinderTop = iceY - 128;
  const cylinderBottom = iceY + 4;

  const motor = ctx.createLinearGradient(cx - 80, motorY, cx + 80, motorY + 78);
  motor.addColorStop(0, "#f8fbff");
  motor.addColorStop(0.5, "#b9c7d3");
  motor.addColorStop(1, "#eef4f8");
  ctx.fillStyle = motor;
  roundRect(ctx, cx - 70, motorY, 140, 68, 10);
  ctx.fill();
  ctx.strokeStyle = "#6f8395";
  ctx.stroke();
  for (let x = -52; x <= 52; x += 13) {
    ctx.strokeStyle = "rgba(70,90,110,.45)";
    ctx.beginPath();
    ctx.moveTo(cx + x, motorY + 8);
    ctx.lineTo(cx + x, motorY + 60);
    ctx.stroke();
  }
  ctx.fillStyle = "#24496d";
  ctx.font = "14px Microsoft YaHei";
  ctx.fillText("电机", cx - 112, motorY + 38);
  dashedLine(ctx, cx - 76, motorY + 34, cx - 12, motorY + 34);

  const sensor = ctx.createLinearGradient(cx - 48, sensorY, cx + 48, sensorY + 48);
  sensor.addColorStop(0, "#eaf7ff");
  sensor.addColorStop(0.5, "#1378d1");
  sensor.addColorStop(1, "#0a4f9e");
  ctx.fillStyle = sensor;
  roundRect(ctx, cx - 44, sensorY, 88, 42, 8);
  ctx.fill();
  ctx.strokeStyle = "#073d7d";
  ctx.stroke();
  ctx.fillStyle = "#24496d";
  ctx.fillText("扭矩传感器", cx - 150, sensorY + 28);
  dashedLine(ctx, cx - 56, sensorY + 22, cx - 14, sensorY + 22);

  const shaft = ctx.createLinearGradient(cx - 18, shaftTop, cx + 18, shaftTop);
  shaft.addColorStop(0, "#eef3f8");
  shaft.addColorStop(0.5, "#8494a3");
  shaft.addColorStop(1, "#f9fbfd");
  ctx.fillStyle = shaft;
  ctx.fillRect(cx - 16, shaftTop, 32, cylinderTop - shaftTop + 12);
  ctx.strokeStyle = "#64788a";
  ctx.strokeRect(cx - 16, shaftTop, 32, cylinderTop - shaftTop + 12);

  const skin = materialSkins[state.material] || materialSkins.silver;
  const body = ctx.createLinearGradient(cx - 74, cylinderTop, cx + 74, cylinderTop);
  body.addColorStop(0, skin[0]);
  body.addColorStop(0.18, skin[1]);
  body.addColorStop(0.55, skin[2]);
  body.addColorStop(0.82, skin[1]);
  body.addColorStop(1, skin[3]);
  ctx.fillStyle = body;
  roundRect(ctx, cx - 74, cylinderTop, 148, cylinderBottom - cylinderTop, 12);
  ctx.fill();
  ctx.strokeStyle = "#657989";
  ctx.lineWidth = 2;
  ctx.stroke();
  drawRotatingCylinderSkin(ctx, cx, cylinderTop, cylinderBottom, spin);

  const topFace = ctx.createRadialGradient(cx - 18, cylinderTop + 2, 8, cx, cylinderTop + 6, 78);
  topFace.addColorStop(0, skin[0]);
  topFace.addColorStop(0.45, skin[1]);
  topFace.addColorStop(1, skin[2]);
  ctx.fillStyle = topFace;
  ctx.beginPath();
  ctx.ellipse(cx, cylinderTop + 6, 74, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  const innerFace = ctx.createLinearGradient(cx - 34, cylinderTop, cx + 34, cylinderTop + 12);
  innerFace.addColorStop(0, skin[2]);
  innerFace.addColorStop(0.55, skin[0]);
  innerFace.addColorStop(1, skin[1]);
  ctx.fillStyle = innerFace;
  ctx.beginPath();
  ctx.ellipse(cx, cylinderTop + 6, 34, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = "#d51920";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(cx, cylinderBottom, 74, 16, 0, 0, Math.PI * 2);
  ctx.stroke();
  drawBottomRotation(ctx, cx, cylinderBottom, spin);

  ctx.fillStyle = "#24496d";
  ctx.font = "14px Microsoft YaHei";
  ctx.fillText("金属空心圆柱", cx - 166, cylinderTop + 70);
  dashedLine(ctx, cx - 62, cylinderTop + 64, cx - 18, cylinderTop + 64);
  ctx.fillText("冰样", cx - 306, iceY + 14);
  dashedLine(ctx, cx - 264, iceY + 8, cx - 174, iceY + 8);
}

function drawRotatingCylinderSkin(ctx, cx, top, bottom, spin) {
  const left = cx - 70;
  const width = 140;
  const height = bottom - top;
  const offset = (spin * 18) % 34;
  ctx.save();
  ctx.beginPath();
  roundRect(ctx, left, top + 2, width, height - 4, 10);
  ctx.clip();

  for (let x = left - 34 + offset; x < left + width + 34; x += 34) {
    const centerRatio = 1 - Math.min(1, Math.abs(x - cx) / 72);
    const stripe = state.material === "copper" ? "150, 82, 18" : "80, 118, 150";
    ctx.strokeStyle = `rgba(${stripe}, ${0.18 + centerRatio * 0.32})`;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(x - 18, top + 10);
    ctx.bezierCurveTo(x + 16, top + 34, x - 14, bottom - 42, x + 20, bottom - 10);
    ctx.stroke();
  }

  const shineX = left + ((offset * 1.7) % width);
  const shine = ctx.createLinearGradient(shineX - 18, top, shineX + 24, top);
  shine.addColorStop(0, "rgba(255,255,255,0)");
  shine.addColorStop(0.5, "rgba(255,255,255,.55)");
  shine.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = shine;
  ctx.fillRect(shineX - 18, top + 5, 42, height - 10);
  ctx.restore();
}

function drawBottomRotation(ctx, cx, bottomY, spin) {
  const phase = (spin * 18) % 42;
  ctx.save();
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#0a67b7";
  ctx.fillStyle = "#0a67b7";

  ctx.beginPath();
  ctx.ellipse(cx, bottomY + 8, 88, 22, 0, 0.12 * Math.PI, 0.88 * Math.PI, true);
  ctx.stroke();

  for (let i = 0; i < 5; i++) {
    const x = cx - 82 + ((i * 42 + phase) % 170);
    const normalized = (x - cx) / 82;
    const y = bottomY + 19 + Math.sqrt(Math.max(0, 1 - normalized * normalized)) * 13;
    drawRightArrow(ctx, x - 18, y, x + 18, y);
  }

  ctx.restore();
}

function drawRightArrow(ctx, x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - 12, y2 - 7);
  ctx.lineTo(x2 - 12, y2 + 7);
  ctx.closePath();
  ctx.fill();
}

function drawContactZoom(ctx, x, y, color, stage) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = "#8aa8c5";
  ctx.setLineDash([5, 4]);
  ctx.strokeRect(0, 0, 230, 64);
  ctx.setLineDash([]);
  ctx.fillStyle = "#eef8ff";
  ctx.fillRect(1, 32, 228, 31);
  ctx.fillStyle = color;
  ctx.fillRect(1, 1, 228, 24);
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(1, 25);
  for (let i = 0; i <= 228; i += 9) {
    const rough = Math.sin(i / 8) * (6 - stage * 5);
    ctx.lineTo(1 + i, 27 + rough);
  }
  ctx.stroke();
  ctx.fillStyle = `rgba(27,184,231,${0.25 + stage * 0.55})`;
  ctx.beginPath();
  ctx.moveTo(1, 29);
  for (let i = 0; i <= 228; i += 10) {
    ctx.lineTo(1 + i, 31 + Math.sin(i / 12 + state.time) * (2 + stage * 3));
  }
  ctx.lineTo(229, 38);
  ctx.lineTo(1, 38);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#24496d";
  ctx.font = "13px Microsoft YaHei";
  ctx.fillText("金属", 8, 18);
  ctx.fillText("冰", 8, 56);
  ctx.restore();
}

function drawStageLegend(ctx, x, y, activeStage) {
  const labels = [
    ["I", "初始接触", "粗糙固-固接触"],
    ["II", "成核阶段", "局部熔融水点"],
    ["III", "并合阶段", "水膜扩展并合"],
    ["IV", "稳定阶段", "连续润滑水膜"]
  ];
  ctx.fillStyle = "#24496d";
  ctx.font = "14px Microsoft YaHei";
  ctx.fillText("界面演化阶段", x, y);
  labels.forEach((item, index) => {
    const active = index <= activeStage;
    const yy = y + 30 + index * 46;
    ctx.fillStyle = active ? "#1378d1" : "#b7c7d8";
    ctx.beginPath();
    ctx.arc(x + 9, yy - 5, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = active ? "#153b61" : "#7c91a5";
    ctx.font = "13px Microsoft YaHei";
    ctx.fillText(`${item[0]}. ${item[1]}`, x + 26, yy);
    ctx.fillStyle = "#60758f";
    ctx.fillText(item[2], x + 26, yy + 18);
  });
}

function dashedLine(ctx, x1, y1, x2, y2) {
  ctx.save();
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = "#6b8daf";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.restore();
}

function drawChart() {
  const ctx = chartCtx;
  const w = els.chartCanvas.width;
  const h = els.chartCanvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);

  const left = 70;
  const right = w - 28;
  const top = 34;
  const bottom = h - 52;
  const plotW = right - left;
  const plotH = bottom - top;

  ctx.strokeStyle = "#e3eef8";
  ctx.lineWidth = 1;
  ctx.font = "12px Microsoft YaHei";
  ctx.fillStyle = "#6c8198";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (let i = 0; i <= 5; i++) {
    const y = top + i * (plotH / 5);
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(right, y);
    ctx.stroke();
    ctx.fillText((100 - i * 20).toString(), left - 10, y);
  }

  ctx.strokeStyle = "#7894ad";
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(left, top);
  ctx.lineTo(left, bottom);
  ctx.lineTo(right, bottom);
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  for (let i = 0; i <= 6; i++) {
    const x = left + i * (plotW / 6);
    ctx.strokeStyle = "#c9dceb";
    ctx.beginPath();
    ctx.moveTo(x, bottom);
    ctx.lineTo(x, bottom + 5);
    ctx.stroke();
    ctx.fillStyle = "#6c8198";
    ctx.fillText(`${i * 5}`, x, bottom + 10);
  }

  ctx.save();
  ctx.translate(18, top + plotH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = "#31506f";
  ctx.font = "13px Microsoft YaHei";
  ctx.textAlign = "center";
  ctx.fillText("归一化幅值 / %", 0, 0);
  ctx.restore();

  ctx.fillStyle = "#31506f";
  ctx.font = "13px Microsoft YaHei";
  ctx.textAlign = "center";
  ctx.fillText("时间 / s", left + plotW / 2, h - 19);

  drawSeries("total", "#1378d1", 0.08, { left, right, top, bottom });
  drawSeries("sliding", "#1bb8e7", 0.006, { left, right, top, bottom });

  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = "14px Microsoft YaHei";
  drawLegendItem(ctx, left + 12, top - 16, "#1378d1", "总电压 V");
  drawLegendItem(ctx, left + 130, top - 16, "#1bb8e7", "滑动摩擦 μs");
}

function drawLegendItem(ctx, x, y, color, label) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 26, y);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x + 13, y, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#31506f";
  ctx.font = "13px Microsoft YaHei";
  ctx.fillText(label, x + 34, y);
}

function drawSeries(key, color, range, box) {
  const ctx = chartCtx;
  const samples = state.samples.slice(-90);
  if (!samples.length) return;
  const { left, right, top, bottom } = box;
  const plotW = right - left;
  const plotH = bottom - top;
  const center = samples.reduce((sum, sample) => sum + sample[key], 0) / samples.length;
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  samples.forEach((sample, index) => {
    const x = left + (index / Math.max(1, samples.length - 1)) * plotW;
    const offset = (sample[key] - center) / range;
    const y = top + plotH / 2 - offset * plotH * 0.42;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
}

function addSample() {
  const c = calculations();
  const totalRipple = 1 + Math.sin(state.time * 3.2) * 0.012 + Math.sin(state.time * 9.1) * 0.004;
  const muRipple = 1 + Math.sin(state.time * 2.8 + 1.2) * 0.010 + Math.sin(state.time * 8.3) * 0.003;
  const formation = FORMATION_SERIES[state.material];
  const useFormation = state.rpm === 1200 && formation;
  const net = useFormation ? interpolateTimeSeries(formation.net, state.time) : c.net;
  const sliding = useFormation ? interpolateTimeSeries(formation.mu, state.time) : (c.sliding ?? 0);
  state.samples.push({
    time: state.time,
    total: (c.idle + net) * totalRipple,
    sliding: sliding * muRipple
  });
  if (state.samples.length > 180) state.samples.shift();
  els.sampleCount.textContent = `${state.time.toFixed(1)} s / ${state.samples.length} samples`;
}

function recordCurrent() {
  const c = calculations();
  const record = {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    time: new Date().toLocaleTimeString(),
    material: c.material.name,
    rpm: state.rpm,
    diskRpm: c.diskRpm.toFixed(0),
    temp: state.temp.toFixed(1),
    idle: c.idle.toFixed(4),
    net: c.net.toFixed(4),
    total: c.total.toFixed(4),
    torque: c.torque == null ? "—" : c.torque.toFixed(5),
    sliding: c.sliding == null ? "—" : c.sliding.toFixed(4)
  };
  state.records.unshift(record);
  renderTable();
  generateReport();
}

function renderTable() {
  els.dataBody.innerHTML = state.records.map((r) => `
    <tr>
      <td>${r.time}</td>
      <td>${r.material}</td>
      <td>${r.rpm}</td>
      <td>${r.diskRpm}</td>
      <td>${r.temp}</td>
      <td>${r.idle}</td>
      <td>${r.net}</td>
      <td>${r.total}</td>
      <td>${r.torque}</td>
      <td>${r.sliding}</td>
      <td><button class="row-delete" data-id="${r.id}">删除</button></td>
    </tr>
  `).join("");
}

function seedRecords() {
  const combos = [
    ["silver", 0], ["silver", 400], ["silver", 800], ["silver", 1200], ["silver", 1600], ["silver", 2000],
    ["copper", 0], ["copper", 400], ["copper", 800], ["copper", 1200], ["copper", 1600], ["copper", 2000],
    ["iron", 0], ["iron", 400], ["iron", 800], ["iron", 1200], ["iron", 1600], ["iron", 2000]
  ];
  const old = { ...state };
  state.records = [];
  combos.forEach(([material, rpm]) => {
    state.material = material;
    state.rpm = rpm;
    state.temp = 0;
    state.load = 50;
    recordCurrent();
  });
  state.material = old.material;
  state.rpm = old.rpm;
  state.temp = old.temp;
  state.load = old.load;
}

function download(name, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

function exportCsv() {
  const header = ["时间", "材料", "电机转速rpm", "圆盘转速rpm", "温度C", "空载电压V", "净电压V", "总电压V", "摩擦力矩N·m", "滑动摩擦μs"];
  const rows = state.records.map((r) => [r.time, r.material, r.rpm, r.diskRpm, r.temp, r.idle, r.net, r.total, r.torque, r.sliding]);
  const csv = [header, ...rows].map((row) => row.join(",")).join("\n");
  download("ice_metal_friction_data.csv", "\ufeff" + csv, "text/csv;charset=utf-8");
}

function exportJson() {
  const rows = state.records.map(({ id, ...record }) => record);
  download("ice_metal_friction_data.json", JSON.stringify(rows, null, 2), "application/json;charset=utf-8");
}

function generateReport() {
  const grouped = {};
  state.records.forEach((r) => {
    if (r.sliding === "—") return;
    grouped[r.material] ??= [];
    grouped[r.material].push(Number(r.sliding));
  });
  const lines = Object.entries(grouped).map(([material, values]) => {
    const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
    return `${material}: 平均滑动摩擦系数 μs = ${avg.toFixed(4)}`;
  });
  els.reportText.value = [
    "冰-金属摩擦系数测量实验摘要",
    `数据条数: ${state.records.length}`,
    `工况: 0 ℃恒温冰面, 电机0/400/800/1200/1600/2000 rpm, 20:1减速后圆盘0-100 rpm, 标准载荷50 N`,
    ...lines,
    "规律: 稳定平台段满足 μ冰-银 < μ冰-铜 < μ冰-铁；中低转速主要影响水膜形成速度和空载电压, 对平台段滑动摩擦系数影响较小。",
    "模型: 旋转圆盘法直接采集滑动摩擦力矩, 由 μs = 3T / (2NR) 直接积分求解滑动摩擦系数。"
  ].join("\n");
}

function bindEvents() {
  els.navBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      els.navBtns.forEach((item) => item.classList.remove("active"));
      els.views.forEach((view) => view.classList.remove("active"));
      btn.classList.add("active");
      document.querySelector(`#${btn.dataset.target}`).classList.add("active");
      if (btn.dataset.target === "export") generateReport();
    });
  });

  els.materialBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      els.materialBtns.forEach((item) => item.classList.remove("selected"));
      btn.classList.add("selected");
      state.material = btn.dataset.material;
      updateReadouts();
    });
  });

  els.rpmInput.addEventListener("input", () => {
    state.rpm = Number(els.rpmInput.value);
    updateReadouts();
  });
  els.tempInput.addEventListener("input", () => {
    state.temp = Number(els.tempInput.value);
    updateReadouts();
  });
  els.loadInput.addEventListener("input", () => {
    state.load = Number(els.loadInput.value);
    updateReadouts();
  });
  els.gainInput.addEventListener("change", () => {
    state.gain = Number(els.gainInput.value);
    updateReadouts();
  });

  els.runBtn.addEventListener("click", () => {
    state.running = !state.running;
    updateReadouts();
  });
  els.resetBtn.addEventListener("click", () => {
    state.running = false;
    state.time = 0;
    state.samples = [];
    updateReadouts();
    drawChart();
  });
  els.addPointBtn.addEventListener("click", recordCurrent);
  els.clearDataBtn.addEventListener("click", () => {
    if (!confirm("确认清空全部实验数据？")) return;
    state.records = [];
    renderTable();
    generateReport();
  });
  els.dataBody.addEventListener("click", (event) => {
    const button = event.target.closest(".row-delete");
    if (!button) return;
    state.records = state.records.filter((record) => record.id !== button.dataset.id);
    renderTable();
    generateReport();
  });
  els.csvBtn.addEventListener("click", exportCsv);
  els.jsonBtn.addEventListener("click", exportJson);
  els.reportBtn.addEventListener("click", generateReport);
}

function loop() {
  if (state.running) {
    state.time += 0.033;
    addSample();
  }
  updateReadouts();
  drawSimulation();
  drawChart();
  requestAnimationFrame(loop);
}

bindEvents();
seedRecords();
generateReport();
updateReadouts();
loop();
