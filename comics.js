// === Текстовые эффекты ===
const texts = document.querySelectorAll('.comic-text, .comic-text-dj');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    entry.target.classList.toggle('active', entry.isIntersecting);
  });
}, { threshold: 0.5 });
texts.forEach(text => observer.observe(text));

// === Музыка ===
const music = document.getElementById('discoMusic');
const scene1 = document.querySelectorAll('.container')[0];
const scene2 = document.getElementById('scene2');
const scene3 = document.querySelectorAll('.container')[2];
let isPlaying = false;
let userMuted = true;

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const track = audioContext.createMediaElementSource(music);
const filter = audioContext.createBiquadFilter();
filter.type = 'lowpass';
filter.frequency.value = 150; //чем ниже -> тем сильнее эффект дымки
track.connect(filter).connect(audioContext.destination);

/// кнопка включения/выключения
const btn = document.getElementById('startAudio');
let isMuted = true; // начальное состояние

btn.addEventListener('click', () => {
  audioContext.resume().then(() => {
    if (isMuted) {
      music.play().catch(() => {});
      btn.textContent = 'Turn off';
      isMuted = false;
    } else {
      music.pause();
      btn.textContent = 'Turn on';
      isMuted = true;
    }
  });
});



function getVisibleRatio(element) {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  return Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight + rect.height)));
}

function handleScroll() {
  if (isMuted) return;

  const ratio1 = getVisibleRatio(scene1);
  const ratio2 = getVisibleRatio(scene2);
  const ratio3 = getVisibleRatio(scene3);

  let volume, cutoff;

  if (ratio3 > 0) {
    // Третья сцена — громко и четко
    volume = 1;
    cutoff = 5000; // почти чистый звук
  } else if (ratio2 > 0 || ratio1 > 0) {
    // Сцены 1 и 2 — приглушённо
    volume = 0.3;           // тихо
    cutoff = 150;            // эффект "за стенкой"
  } else {
    // Когда ничего не видно
    volume = 0;
    cutoff = 100;
  }

  music.volume = volume;
  filter.frequency.setTargetAtTime(cutoff, audioContext.currentTime, 0.8); // плавность перехода
}



window.addEventListener('scroll', handleScroll);
window.addEventListener('load', handleScroll);
