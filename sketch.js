let bubbles = [];
let bubbleSpawnTimer = 0;

let ambience;
let bubbleSound;

let violin;
let violinEnvelope;

let scubaLayer;
let glowColor = [190, 170, 255];
let glowStart = 0;

const noteGlowDuration = 1550;

let audioStarted = false;

const notes = {
  q: 130.81, w: 146.83, e: 164.81, r: 196, t: 220,
  y: 261.63, 7: 293.66, i: 329.63, o: 392, p: 440,

  a: 261.63, s: 293.66, 6: 329.63, f: 392,
  g: 440, h: 523.25, j: 587.33, k: 659.25, l: 783.99,

  z: 523.25, x: 587.33, c: 659.25, v: 783.99,
  b: 880, n: 1046.5, m: 1174.66,

  3: 157.2,
  5: 790,
  8: 660.71
};

const bubbleKeys = ["d", "o", "9", "0", "u", "2", "1", "4"];

function preload() {
  ambience = loadSound("freesound_community-underwater-ambience-6201.mp3");
  scubaLayer = loadSound("274491__timsc__under-water-sounds-while-scuba-diving.flac");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Create background bubbles
  for (let i = 0; i < 35; i++) {
    bubbles.push({
      x: random(width),
      y: random(height),
      size: random(7, 23),
      speed: random(0.3, 1.2)
    });
  }

  bubbleSound = new Audio("liecio-water-bubbles-257594.mp3");
  bubbleSound.volume = 0.7;

  violin = new p5.Oscillator("sine");
  violinEnvelope = new p5.Envelope();

  violinEnvelope.setADSR(0.3, 0.4, 0.2, 0.65);
  violinEnvelope.setRange(0.05, 0);

  violin.amp(violinEnvelope);
  violin.start();
}

function draw() {
  background(2, 28, 65);

bubbleSpawnTimer++;

if (bubbleSpawnTimer >= 12) {
  bubbles.push({
    x: random(width),
    y: height + 20,
    size: random(7, 23),
    speed: random(0.3, 1.2)
  });

  bubbleSpawnTimer = 0;
}

  let elapsed = millis() - glowStart;

  let progress = constrain(elapsed / noteGlowDuration, 0, 1);

  let glow = 1 - (progress * progress * (3 - 2 * progress));

  for (let b of bubbles) {

    let size = b.size;

    let variation = map(size, 7, 23, 0.7, 1.2);

    let intensity = glow * variation;

    drawingContext.shadowBlur = 35 * intensity;
    drawingContext.shadowColor =
      `rgba(${glowColor[0]}, ${glowColor[1]}, ${glowColor[2]}, ${intensity})`;

    noStroke();

    fill(
      glowColor[0],
      glowColor[1],
      glowColor[2],
      12 * intensity
    );

    circle(b.x, b.y, size * 2.4);

    drawingContext.shadowBlur = 20 * intensity;

    fill(
      glowColor[0],
      glowColor[1],
      glowColor[2],
      30 * intensity
    );

    circle(b.x, b.y, size * 1.5);

    drawingContext.shadowBlur = 12 * intensity;

    fill(25, 45, 112, 100);

    stroke(
      lerp(170, glowColor[0], intensity),
      lerp(225, glowColor[1], intensity),
      lerp(245, glowColor[2], intensity),
      lerp(130, 240, intensity)
    );

    strokeWeight(1.3 + intensity * 0.6);

    circle(b.x, b.y, size);

    drawingContext.shadowBlur = 0;

    noStroke();

    fill(240, 250, 255, 160);

    circle(
      b.x - size * 0.2,
      b.y - size * 0.2,
      2.5
    );

    b.y -= b.speed;

    if (b.y < -30) {
  b.remove = true;
bubbles = bubbles.filter(b => !b.remove);
}
  }

  drawingContext.shadowBlur = 0;
}
const glowPalette = [
  [255, 160, 205], // Blush pink
  [190, 155, 255], // Lavender
  [130, 195, 255], // Powder blue
  [255, 185, 165], // Peach
  [155, 215, 245], // Ice blue
  [220, 170, 245], // Lilac
  [255, 195, 220], // Rose pink
  [145, 225, 235], // Soft turquoise
  [205, 185, 255], // Periwinkle
  [245, 175, 195]  // Dusty pink
];

function startOcean() {
  userStartAudio();

  if (!audioStarted && ambience && ambience.isLoaded()) {
    ambience.setVolume(0.65);
    ambience.loop();

    if (scubaLayer && scubaLayer.isLoaded()) {
      scubaLayer.setVolume(0.18);
      scubaLayer.loop();
    }

    audioStarted = true;
  }
}

function keyPressed() {
  startOcean();

  let pressedKey = key.toLowerCase();
if (/^[a-z0-9]$/.test(pressedKey)) {

  let index = pressedKey.charCodeAt(0) % glowPalette.length;

  glowColor = glowPalette[index];

  glowStart = millis();
}

  if (bubbleKeys.includes(pressedKey)) {
    playShortBubble();
    return false;
  }

  if (notes[pressedKey]) {
    violin.freq(notes[pressedKey]);
    violinEnvelope.play();
  }

  return false;
}

function playShortBubble() {
  if (!bubbleSound) return;

  bubbleSound.pause();
  bubbleSound.currentTime = 0;

  bubbleSound.play().catch(() => {});

  setTimeout(() => {
    bubbleSound.pause();
    bubbleSound.currentTime = 0;
  }, 650);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

if (/^[a-z0-9]$/.test(pressedKey)) {
  let hue = (pressedKey.charCodeAt(0) * 137.5) % 360;

  glowColor = `hsl(${hue}, 100%, 70%)`;

  glowUntil = millis() + 650;
}
