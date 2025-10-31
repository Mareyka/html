// Текстовые эффекты 
const texts = document.querySelectorAll('.comic-text, .comic-text-dj, .comic-text-start, .comic-text-dance, .comic-text-noman');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    entry.target.classList.toggle('active', entry.isIntersecting);
  });
}, { threshold: 0.5 });
texts.forEach(text => observer.observe(text));

// Музыка 
const music = document.getElementById('discoMusic');
const scene1 = document.querySelectorAll('.container')[0];
const scene2 = document.getElementById('scene2');
const scene3 = document.querySelectorAll('.container')[2];
let isPlaying = false;
let userMuted = true;

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const track = audioContext.createMediaElementSource(music);
const filter = audioContext.createBiquadFilter(); // создаю фильтр
filter.type = 'lowpass'; // Тип фильтра - пропускает только низкие частоты
filter.frequency.value = 150; //чем ниже -> тем сильнее эффект дымки
track.connect(filter).connect(audioContext.destination);

// кнопка включения/выключения
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

// Скролл при нажатии на кнопки "Lets play" и "Go away"
document.querySelector('.comic-text-dj:first-child').addEventListener('click', () => {
  document.getElementById('scene6').scrollIntoView({ behavior: 'smooth' });
});

document.querySelector('.comic-text-dj:last-child').addEventListener('click', () => {
  document.getElementById('scene7').scrollIntoView({ behavior: 'smooth' });
});
// Скролл при нажатии на кнопку "Go away" на сцене 6
document.querySelector('.comic-text-dj-away').addEventListener('click', () => {
  document.getElementById('scene7').scrollIntoView({ behavior: 'smooth' });
});

//Эффекты громкости и фильтра при скролле
function getVisibleRatio(element) {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  return Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight + rect.height)));
}

//сцена 8
const scene8 = document.getElementById('scene8');

function handleScroll() {
  if (isMuted) return;

  const ratio1 = getVisibleRatio(scene1);
  const ratio2 = getVisibleRatio(scene2);
  const ratio3 = getVisibleRatio(scene3);
  const ratio8 = getVisibleRatio(scene8);

  let volume, cutoff;

  if (ratio8 > 0) {
    // Сцена 8 — приглушённо
    volume = 0.2;
    cutoff = 150;
  } else if (ratio3 > 0) {
    // Третья сцена — громко и четко
    volume = 1;
    cutoff = 5000;
  } else if (ratio2 > 0 || ratio1 > 0) {
    // Сцены 1 и 2 — приглушённо
    volume = 0.3;
    cutoff = 150;
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

//переключение треков
const prevBtn = document.querySelector('.btn-prev');
const nextBtn = document.querySelector('.btn-next');

// список треков
const tracks = [
  'music/Soichi Terada - Grand Senshuraku (Record Club Edit).wav',
  'music/acid up1.mp3',
  'music/Zombie Zombie - Rocket Number 9 (Gesaffelstein Remix).mp3',
  'music/Dj Vini - Run.mp3',
  'music/Ivan Dorn - Groovy Shit.mp3'
];

let current = 0;

// предыдущий трек
prevBtn.onclick = () => {
  current = (current - 1 + tracks.length) % tracks.length;
  music.src = tracks[current];
  music.play();
};

// следующий трек
nextBtn.onclick = () => {
  current = (current + 1) % tracks.length;
  music.src = tracks[current];
  music.play();
};

// смена фона во второй сцене 
const bgImages = document.querySelectorAll('.background');
let lastScroll = window.scrollY;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  const speed = Math.abs(currentScroll - lastScroll); // скорость скролла
  lastScroll = currentScroll;

  bgImages.forEach(div => {
    if (speed < 1) {
      // если почти не двигаемся — оригинальный цвет
      div.style.filter = 'hue-rotate(0deg) saturate(100%) brightness(1)';
    } else if (speed <= 5) {
      div.style.filter = 'hue-rotate(330deg) saturate(150%) brightness(1)'; // розовый
    } else if (speed <= 15) {
      div.style.filter = 'hue-rotate(280deg) saturate(150%) brightness(1)'; // фиолетовый
    } else {
      div.style.filter = 'hue-rotate(200deg) saturate(150%) brightness(1)'; // синий
    }
  });
});



