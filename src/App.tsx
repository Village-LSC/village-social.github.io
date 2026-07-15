import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe,
  Send,
  Youtube,
  MessageSquare,
  FolderGit2,
  Coins,
  Heart,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Music,
  X,
  ExternalLink,
  Sparkles,
  Check,
  Copy
} from 'lucide-react';

type Language = 'ru' | 'en';

interface SocialLink {
  id: string;
  nameRu: string;
  nameEn: string;
  icon: React.ReactNode;
  url: string;
  color: string;
  hoverColor: string;
  glowColor: string;
  descriptionRu: string;
  descriptionEn: string;
}

interface PriceCategory {
  nameRu: string;
  nameEn: string;
  basePrice: string;
  detailsRu: string;
  detailsEn: string;
}

export default function App() {
  const [lang, setLang] = useState<Language>('ru');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [discordCopied, setDiscordCopied] = useState(false);
  const [activeMobileId, setActiveMobileId] = useState<string | null>(null);

  // Click outside listener to collapse active link description on mobile/tablet
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.clickable-link')) {
        setActiveMobileId(null);
        setHoveredIdx(null);
      }
    };
    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  // Background Canvas Starfield with Gravity Fields
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let shimmerPhase = 0;

    // Smoothly animated properties for firefly clustering
    let currentCX = window.innerWidth / 2;
    let currentCY = window.innerHeight / 2;
    let currentRadius = Math.sqrt(currentCX * currentCX + currentCY * currentCY) * 0.85;
    let currentIntensity = 0.0;
    let currentAvatarIntensity = 0.0;

    let scale = 8;

    interface Star {
      x: number;
      y: number;
      phase: number;
      speed: number;
      maxOpacity: number;
    }
    const stars: Star[] = [];
    const numStars = 40;

    const generateStars = (width: number, height: number) => {
      stars.length = 0;
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.floor(Math.random() * width),
          y: Math.floor(Math.random() * height),
          phase: Math.random() * Math.PI * 2,
          speed: 0.03 + Math.random() * 0.05,
          maxOpacity: 0.3 + Math.random() * 0.7
        });
      }
    };

    const resizeCanvas = () => {
      scale = 8;
      canvas.width = Math.ceil(window.innerWidth / scale);
      canvas.height = Math.ceil(window.innerHeight / scale);

      currentCX = window.innerWidth / 2;
      currentCY = window.innerHeight / 2;
      currentRadius = Math.sqrt(currentCX * currentCX + currentCY * currentCY) * 0.85;

      generateStars(canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const bayer = [
      [0 / 16, 8 / 16, 2 / 16, 10 / 16],
      [12 / 16, 4 / 16, 14 / 16, 6 / 16],
      [3 / 16, 11 / 16, 1 / 16, 9 / 16],
      [15 / 16, 7 / 16, 13 / 16, 5 / 16]
    ];

    let isHovered = false;
    let isAvatarHovered = false;
    let hoveredRect: DOMRect | null = null;

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const interactive = target.closest('button, a, .clickable, .avatar-black-hole');
      if (interactive) {
        hoveredRect = interactive.getBoundingClientRect();
        isHovered = true;
        isAvatarHovered = !!interactive.closest('.avatar-black-hole') || interactive.classList.contains('avatar-black-hole');
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const interactive = target.closest('button, a, .clickable, .avatar-black-hole');
      if (interactive) {
        const related = e.relatedTarget as HTMLElement;
        const nextInteractive = related ? related.closest('button, a, .clickable, .avatar-black-hole') : null;
        if (!nextInteractive) {
          hoveredRect = null;
          isHovered = false;
          isAvatarHovered = false;
        } else {
          isAvatarHovered = !!nextInteractive.closest('.avatar-black-hole') || nextInteractive.classList.contains('avatar-black-hole');
        }
      }
    };

    window.addEventListener('mouseover', onMouseOver);
    window.addEventListener('mouseout', onMouseOut);

    const draw = () => {
      const cols = canvas.width;
      const rows = canvas.height;

      let targetCX = window.innerWidth / 2;
      let targetCY = window.innerHeight / 2;
      const maxDist = Math.sqrt(targetCX * targetCX + targetCY * targetCY);
      let targetRadius = maxDist * 0.85;
      let targetIntensity = 0.0;

      if (isHovered && hoveredRect) {
        const elCX = hoveredRect.left + hoveredRect.width / 2;
        const elCY = hoveredRect.top + hoveredRect.height / 2;

        targetCX = elCX;
        targetCY = elCY;
        targetRadius = Math.max(130, Math.min(hoveredRect.width, hoveredRect.height) * 1.5);
        targetIntensity = 1.0;
      }

      currentCX += (targetCX - currentCX) * 0.08;
      currentCY += (targetCY - currentCY) * 0.08;
      currentRadius += (targetRadius - currentRadius) * 0.08;
      currentIntensity += (targetIntensity - currentIntensity) * 0.08;

      let targetAvatarIntensity = isAvatarHovered ? 1.0 : 0.0;
      currentAvatarIntensity += (targetAvatarIntensity - currentAvatarIntensity) * 0.08;

      shimmerPhase += 0.008 + (0.012 * currentIntensity) + (0.02 * currentAvatarIntensity);

      ctx.fillStyle = '#020714';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        star.phase += star.speed;

        if (Math.sin(star.phase) < -0.98) {
          star.x = Math.floor(Math.random() * canvas.width);
          star.y = Math.floor(Math.random() * canvas.height);
          star.speed = 0.03 + Math.random() * 0.05;
          star.maxOpacity = 0.3 + Math.random() * 0.7;
          star.phase = -Math.PI / 2 + 0.3;
        }

        const opacity = Math.max(0.0, star.maxOpacity * (0.5 + 0.5 * Math.sin(star.phase)));
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fillRect(star.x, star.y, 1, 1);
      });

      const jitterX = Math.sin(shimmerPhase * 2.2) * (15 * currentIntensity);
      const jitterY = Math.cos(shimmerPhase * 1.6) * (15 * currentIntensity);

      const activeCX = (currentCX + jitterX) / scale;
      const activeCY = (currentCY + jitterY) / scale;
      const currentRadiusScaled = currentRadius / scale;

      const maxDistToCalculateRadialSq = (currentRadiusScaled * 1.15) * (currentRadiusScaled * 1.15);

      for (let r = 0; r < rows; r++) {
        const y = r;
        const bayerRow = bayer[r % 4];
        const isRowEven = r % 2 === 0;
        const dy = y - activeCY;
        const dySq = dy * dy;

        for (let c = 0; c < cols; c++) {
          const x = c;
          const dx = x - activeCX;
          const distSq = dx * dx + dySq;

          const threshold = bayerRow[c % 4];
          const texture = (isRowEven ? 0.03 : 0) + ((c & 1) === 0 ? 0.03 : 0);

          const isOutside = distSq > maxDistToCalculateRadialSq;

          if (isOutside && threshold >= 0.18) {
            continue;
          }

          let dist = 0;
          let radialVal = 0;
          if (!isOutside) {
            const absX = dx < 0 ? -dx : dx;
            const absY = dy < 0 ? -dy : dy;
            dist = absX > absY ? absX + 0.4 * absY : absY + 0.4 * absX;
            radialVal = Math.max(0, Math.min(1.1, 1.15 - (dist / currentRadiusScaled)));
          }

          const diagonalIndex = c - r;
          const wave = Math.sin(diagonalIndex * 0.045 - shimmerPhase) * 0.12;

          const val = Math.max(0, Math.min(1, radialVal + wave));

          if (val + texture > threshold) {
            const hoverInfluence = isOutside ? 0 : currentIntensity * Math.max(0, 1 - dist / (currentRadiusScaled * 1.2));
            const avatarInfluence = isOutside ? 0 : currentAvatarIntensity * Math.max(0, 1 - dist / (currentRadiusScaled * 1.1));
            let aVal = 0.07 + (0.22 - 0.07) * currentIntensity;

            let rVal = 25;
            let gVal = 80;
            let bVal = 200;

            if (hoverInfluence > 0) {
              if ((c + r) % 2 === 0) {
                rVal = Math.round(6 * hoverInfluence + 25 * (1 - hoverInfluence));
                gVal = Math.round(182 * hoverInfluence + 80 * (1 - hoverInfluence));
                bVal = Math.round(212 * hoverInfluence + 200 * (1 - hoverInfluence));
              } else {
                rVal = Math.round(147 * hoverInfluence + 25 * (1 - hoverInfluence));
                gVal = Math.round(197 * hoverInfluence + 80 * (1 - hoverInfluence));
                bVal = Math.round(253 * hoverInfluence + 200 * (1 - hoverInfluence));
              }
            }

            if (avatarInfluence > 0) {
              const blackHoleCycle = Math.sin(shimmerPhase * 2.5);
              const blackHoleBlend = 0.5 + 0.5 * blackHoleCycle;

              const holeR = Math.round(34 * blackHoleBlend + 5 * (1 - blackHoleBlend));
              const holeG = Math.round(211 * blackHoleBlend + 15 * (1 - blackHoleBlend));
              const holeB = Math.round(238 * blackHoleBlend + 50 * (1 - blackHoleBlend));

              rVal = Math.round(holeR * avatarInfluence + rVal * (1 - avatarInfluence));
              gVal = Math.round(holeG * avatarInfluence + gVal * (1 - avatarInfluence));
              bVal = Math.round(holeB * avatarInfluence + bVal * (1 - avatarInfluence));

              const targetA = 0.12 + 0.45 * blackHoleBlend;
              aVal = aVal * (1 - avatarInfluence) + targetA * avatarInfluence;
            }

            ctx.fillStyle = `rgba(${rVal}, ${gVal}, ${bVal}, ${aVal})`;
            ctx.fillRect(x, y, 1, 1);
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mouseout', onMouseOut);
    };
  }, []);

  // Audio Player State & Playlist
  const PLAYLIST = useMemo(() => [
    {
      title: 'lobby',
      url: '/lobby.mp3'
    }
  ], []);

  const [currentTrackIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(0.20);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const volumeRef = useRef(volume);
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    const audio = new Audio(PLAYLIST[currentTrackIdx].url);
    audio.loop = true;
    audio.volume = volumeRef.current;
    audioRef.current = audio;

    let fallbackToRemote = false;

    const useRemoteFallback = () => {
      if (fallbackToRemote) return;
      fallbackToRemote = true;
      console.log('Local lobby.mp3 is empty or unplayable. Switching to remote ambient stream.');
      audio.src = 'https://archive.org/download/minecraft_ost/08%20-%20Sweden.mp3';
      if (isPlayingRef.current) {
        audio.play().catch(err => {
          console.log('Playback error on remote fallback stream:', err);
        });
      }
    };

    audio.addEventListener('error', useRemoteFallback);

    const tryPlay = () => {
      if (!audioRef.current) return;
      if (!isPlayingRef.current) return;
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          cleanupListeners();
        })
        .catch(err => {
          console.log('Autoplay blocked initially or empty file:', err);
        });
    };

    tryPlay();

    const handleUserInteraction = () => {
      tryPlay();
    };

    const cleanupListeners = () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('mousedown', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
    };

    window.addEventListener('click', handleUserInteraction, { passive: true });
    window.addEventListener('keydown', handleUserInteraction, { passive: true });
    window.addEventListener('touchstart', handleUserInteraction, { passive: true });
    window.addEventListener('mousedown', handleUserInteraction, { passive: true });
    document.addEventListener('click', handleUserInteraction, { passive: true });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audio.removeEventListener('error', useRemoteFallback);
      cleanupListeners();
      audioRef.current = null;
    };
  }, [currentTrackIdx]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.volume = volume;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.log('Playback error:', err);
      });
    }
  };

  // Social Links Definition
  const socialLinks: SocialLink[] = useMemo(() => [
    {
      id: 'telegram',
      nameRu: 'Телеграм',
      nameEn: 'Telegram',
      icon: <Send className="w-5 h-5" />,
      url: 'https://t.me/Village_Village',
      color: 'border-sky-500/25 text-sky-400 bg-[#061430]/75 hover:bg-[#0c2452]/90 hover:border-sky-400/55',
      hoverColor: 'hover:text-sky-300',
      glowColor: 'shadow-[0_0_20px_rgba(56,189,248,0.25)]',
      descriptionRu: 'Мой официальный канал: эксклюзивные анонсы, процессы рисования (WIP) и живое общение с аудиторией.',
      descriptionEn: 'My official channel: exclusive announcements, work-in-progress (WIP) previews, and casual community chat.'
    },
    {
      id: 'youtube',
      nameRu: 'Ютуб',
      nameEn: 'YouTube',
      icon: <Youtube className="w-5 h-5" />,
      url: 'https://www.youtube.com/@VillageLSC',
      color: 'border-rose-500/25 text-rose-400 bg-[#061430]/75 hover:bg-[#0c2452]/90 hover:border-rose-400/55',
      hoverColor: 'hover:text-rose-300',
      glowColor: 'shadow-[0_0_20px_rgba(244,63,94,0.25)]',
      descriptionRu: 'Таймлапсы создания пиксель-арта, анимации и демонстрации готовых инди-проектов.',
      descriptionEn: 'Pixel art and animation timelapses, speedpaints, and indie game showcases.'
    },
    {
      id: 'discord',
      nameRu: 'Дискорд',
      nameEn: 'Discord',
      icon: <MessageSquare className="w-5 h-5" />,
      url: '#discord',
      color: 'border-indigo-500/25 text-indigo-400 bg-[#061430]/75 hover:bg-[#0c2452]/90 hover:border-indigo-400/55',
      hoverColor: 'hover:text-indigo-300',
      glowColor: 'shadow-[0_0_20px_rgba(99,102,241,0.25)]',
      descriptionRu: 'Мой личный Discord-аккаунт: villagelsc_. Нажмите на кнопку, чтобы мгновенно скопировать никнейм.',
      descriptionEn: 'My personal Discord account: villagelsc_. Click the button to instantly copy the username.'
    },
    {
      id: 'portfolio',
      nameRu: 'Портфолио',
      nameEn: 'Portfolio',
      icon: <FolderGit2 className="w-5 h-5" />,
      url: 'https://www.artstation.com/artwork/rlwkDm',
      color: 'border-blue-500/25 text-blue-400 bg-[#061430]/75 hover:bg-[#0c2452]/90 hover:border-blue-400/55',
      hoverColor: 'hover:text-blue-300',
      glowColor: 'shadow-[0_0_20px_rgba(59,130,246,0.25)]',
      descriptionRu: 'Полноформатная галерея моих лучших работ: завершенные ассеты, трехмерные текстуры, фоны и комплексная анимация.',
      descriptionEn: 'Full-scale gallery of my finest work: completed game assets, low-poly 3D textures, backgrounds, and animations.'
    },
    {
      id: 'pricelist',
      nameRu: 'Прайслист',
      nameEn: 'Price List',
      icon: <Coins className="w-5 h-5" />,
      url: 'https://village-lsc.github.io/',
      color: 'border-cyan-500/25 text-cyan-400 bg-[#061430]/75 hover:bg-[#0c2452]/90 hover:border-cyan-400/55',
      hoverColor: 'hover:text-cyan-300',
      glowColor: 'shadow-[0_0_20px_rgba(34,211,238,0.25)]',
      descriptionRu: 'Мой официальный интерактивный прайслист с актуальными ценами и подробными тарифами.',
      descriptionEn: 'My official interactive price list with up-to-date base prices and service tiers.'
    },
    {
      id: 'donation',
      nameRu: 'Поддержать',
      nameEn: 'Donate',
      icon: <Heart className="w-5 h-5 text-rose-400 animate-pulse" />,
      url: 'https://pay.cloudtips.ru/p/4e44edcb',
      color: 'border-rose-500/25 text-rose-400 bg-[#061430]/75 hover:bg-[#0c2452]/90 hover:border-rose-400/55',
      hoverColor: 'hover:text-rose-300',
      glowColor: 'shadow-[0_0_20px_rgba(244,63,94,0.25)]',
      descriptionRu: 'Пожертвование на развитие творчества, создание артов и будущих игровых проектов.',
      descriptionEn: 'Support my art creation, pixel-art guides, and future indie game development.'
    }
  ], []);

  // Price List Categories
  const priceCategories: PriceCategory[] = [
    {
      nameRu: 'Предметы / Тайлы / Окружение',
      nameEn: 'Items / Tiles / Environment',
      basePrice: 'от 150 ₽ / from $3',
      detailsRu: 'Оружие, броня, расходные материалы, квестовые предметы, блоки поверхностей, мелкий декор локаций.',
      detailsEn: 'Weapons, armor, consumables, quest assets, surface blocks, small scenery and level props.'
    },
    {
      nameRu: 'Текстурирование 3D моделей',
      nameEn: 'Model Texturing',
      basePrice: 'от 400 ₽ / from $7',
      detailsRu: 'Пиксельные текстуры для низкополигональных (Low-Poly) 3D моделей, развертки Blockbench.',
      detailsEn: 'Pixel-art texture maps for low-poly three-dimensional objects, Blockbench mappings.'
    },
    {
      nameRu: 'UI: Базовые элементы',
      nameEn: 'UI: Basic Elements',
      basePrice: 'от 250 ₽ / from $4',
      detailsRu: 'Кнопки интерфейсов, иконки скиллов и активных баффов, бары здоровья (HP / MP) и стамины.',
      detailsEn: 'Menu controls, skill badges, status buff badges, health/mana indicators, stamina bars.'
    },
    {
      nameRu: 'UI: Окна, шрифты, статичные фоны',
      nameEn: 'UI: Windows & Fonts',
      basePrice: 'от 500 ₽ / from $8',
      detailsRu: 'Макеты инвентарей, окна крафта, разработка пиксельных шрифтов, подложки главного меню.',
      detailsEn: 'Inventory layouts, crafting panels, custom pixel typography, simple menu backplates.'
    },
    {
      nameRu: 'UI: Сложные фоны и логотипы',
      nameEn: 'UI: Complex Landscapes & Logos',
      basePrice: 'от 800 ₽ / from $12',
      detailsRu: 'Сложные титульные логотипы игр с глубоким текстурированием, детализированные панорамы и задники.',
      detailsEn: 'Highly styled game title logos, detailed landscape panoramas, atmospheric loading screens.'
    },
    {
      nameRu: 'Портреты / Диалоги',
      nameEn: 'Portraits & Dialogues',
      basePrice: 'от 600 ₽ / from $10',
      detailsRu: 'Диалоговые портреты персонажей, аватарки NPC, квестовые лица, профили героев.',
      detailsEn: 'Dialogue screen avatars, quest giver face plates, profile portraits, hero cards.'
    },
    {
      nameRu: 'Minecraft-скины',
      nameEn: 'Minecraft Skins',
      basePrice: 'от 400 ₽ / from $7',
      detailsRu: 'Кастомные скины игроков (64x64 или HD 128x128). Качественная проработка слоев.',
      detailsEn: 'Bespoke player skins (64x64 or HD 128x128). Advanced layering and shading.'
    },
    {
      nameRu: 'Нестандартные арт-задачи',
      nameEn: 'Non-standard & Other Art',
      basePrice: 'Индивидуально / Custom pricing',
      detailsRu: 'Картины высокого разрешения, эффекты частиц, концепт-арт, уникальные анимационные циклы.',
      detailsEn: 'High-res pixel canvases, custom particle sheets, initial pixel concept designs, complex animations.'
    }
  ];

  return (
    <div className="relative min-h-screen text-stone-100 flex flex-col justify-between overflow-x-hidden font-sans selection:bg-cyan-950/80 selection:text-cyan-200">
      {/* Dynamic Starfield Canvas Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0 w-full h-full"
        style={{ imageRendering: 'pixelated' }}
      />

      {/* Decorative Grid Mesh Overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(14,116,144,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(14,116,144,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />

      {/* Header Controls (Language & Music toggles) */}
      <header className="relative w-full max-w-md sm:max-w-xl mx-auto px-4 pt-6 flex justify-end items-center gap-2 z-10">
        <button
          onClick={togglePlay}
          className="clickable flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-cyan-500/20 bg-[#061430]/60 hover:bg-[#0c2452]/80 text-cyan-300 hover:text-white transition-all text-xs sm:text-sm font-mono font-bold cursor-pointer shadow-lg backdrop-blur-md"
          title={isPlaying ? (lang === 'ru' ? 'Выключить эмбиент' : 'Turn BGM Off') : (lang === 'ru' ? 'Включить эмбиент' : 'Turn BGM On')}
        >
          {isPlaying ? (
            <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse shrink-0" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          )}
          <span className="hidden sm:inline">{isPlaying ? (lang === 'ru' ? 'ЗВУК: ВКЛ' : 'AUDIO: ON') : (lang === 'ru' ? 'ЗВУК: ВЫКЛ' : 'AUDIO: OFF')}</span>
        </button>

        <button
          onClick={() => setLang(prev => prev === 'ru' ? 'en' : 'ru')}
          className="clickable flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-cyan-500/20 bg-[#061430]/60 hover:bg-[#0c2452]/80 text-cyan-300 hover:text-white transition-all text-xs sm:text-sm font-mono font-bold cursor-pointer shadow-lg backdrop-blur-md"
          title={lang === 'ru' ? 'Сменить язык' : 'Change Language'}
        >
          <Globe className="w-3.5 h-3.5 shrink-0" />
          <span>{lang === 'ru' ? 'EN' : 'RU'}</span>
        </button>
      </header>

      {/* Main Central Profile & Links Section */}
      <main className="relative w-full max-w-md sm:max-w-xl mx-auto px-4 py-8 flex-grow flex flex-col justify-center items-center z-10">
        
        {/* Avatar & Bio Section (Now floating directly in the nebula space) */}
        <div className="flex flex-col items-center mb-10 relative w-full text-center">
          <motion.div 
            animate={{
              y: [0, -6, 0]
            }}
            whileHover={{
              scale: 1.1
            }}
            whileTap={{
              scale: 0.95
            }}
            transition={{
              y: {
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              },
              scale: {
                duration: 0.3,
                ease: "easeOut"
              }
            }}
            className="avatar-black-hole clickable relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-cyan-500/25 bg-[#08122c] shadow-[0_0_20px_rgba(56,189,248,0.25)] flex items-center justify-center cursor-pointer group mb-4"
            title={lang === 'ru' ? 'Художник Village_' : 'Artist Village_'}
          >
            {/* Actual Avatar Image */}
            <img
              src="/images/avatar.jpg"
              alt="Village_"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          
          {/* Title & Nickname */}
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white drop-shadow-[0_2px_12px_rgba(34,211,238,0.4)] tracking-wider">
            Village_
          </h1>
          
          {/* Minimal Pixel Tag */}
          <div className="mt-2 bg-[#09183c] text-cyan-300 px-3 py-1 rounded-md font-mono text-[10px] sm:text-xs tracking-widest uppercase border border-[#1b326d]/60 shadow-md">
            {lang === 'ru' ? 'Пиксельный Художник' : 'Pixel Artist'}
          </div>

          {/* Profile Bio Description */}
          <p className="mt-4 text-stone-300 text-xs sm:text-sm font-sans font-medium max-w-sm sm:max-w-md leading-relaxed border-t border-cyan-500/10 pt-4 drop-shadow-md">
            {lang === 'ru' ? (
              'Опыт работы более 5 лет. Создаю графику для инди-игр, кастомные текстуры и сочные спрайты. Предпочитаю детальный, цветной и насыщенный пиксель-арт стиль.'
            ) : (
              '5+ years of experience. Crafting graphic assets for indie games, custom models, and vibrant sprites. Specializing in detailed, colorful, and rich pixel art.'
            )}
          </p>
        </div>

        {/* Levitating Social Networks List */}
        <div className="space-y-4 w-full">
          {socialLinks.map((item, idx) => {
            const isHovered = hoveredIdx === idx;
            
            return (
              <motion.div 
                key={item.id} 
                className="relative"
                animate={{
                  y: [0, -5, 0]
                }}
                transition={{
                  duration: 4 + idx * 0.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: idx * 0.15
                }}
              >
                {/* Button Wrapper with smooth grow animation */}
                <a
                  href={item.url}
                  onClick={(e) => {
                    const isMobileOrTablet = window.innerWidth < 1024;
                    if (isMobileOrTablet) {
                      if (activeMobileId !== item.id) {
                        e.preventDefault();
                        setActiveMobileId(item.id);
                        setHoveredIdx(idx);
                        return;
                      }
                    }

                    if (item.id === 'discord') {
                      e.preventDefault();
                      navigator.clipboard.writeText('villagelsc_');
                      setDiscordCopied(true);
                      setTimeout(() => setDiscordCopied(false), 2000);
                    }
                  }}
                  target={item.id !== 'discord' ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  onMouseEnter={() => {
                    if (window.innerWidth >= 1024) {
                      setHoveredIdx(idx);
                    }
                  }}
                  onMouseLeave={() => {
                    if (window.innerWidth >= 1024) {
                      setHoveredIdx(null);
                    }
                  }}
                  className={`clickable-link clickable flex flex-col w-full rounded-2xl border ${item.color} font-mono text-xs sm:text-sm font-bold uppercase tracking-wider shadow-2xl transition-all duration-300 transform active:scale-98 cursor-pointer ${
                    isHovered ? `scale-[1.03] ${item.glowColor}` : 'scale-100'
                  } overflow-hidden backdrop-blur-md`}
                >
                  {/* Button Content Row */}
                  <div className="flex items-center justify-between w-full p-3.5 sm:p-4">
                    <div className="flex items-center gap-3">
                      <span className="shrink-0 transition-transform duration-300 group-hover:scale-110">
                        {item.icon}
                      </span>
                      <span>{lang === 'ru' ? item.nameRu : item.nameEn}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] opacity-80">
                      {item.id === 'discord' ? (
                        <>
                          <span>
                            {discordCopied 
                              ? (lang === 'ru' ? 'Скопировано!' : 'Copied!') 
                              : (lang === 'ru' ? 'Никнейм' : 'Username')}
                          </span>
                          {discordCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3 h-3 text-cyan-400" />}
                        </>
                      ) : (
                        <>
                          <span>{lang === 'ru' ? 'Перейти' : 'Visit'}</span>
                          <ExternalLink className="w-3 h-3 text-cyan-400" />
                        </>
                      )}
                    </div>
                  </div>

                  {/* Expandable Description grows downwards inside the button itself */}
                  <motion.div
                    initial={false}
                    animate={{
                      height: isHovered ? 'auto' : 0,
                      opacity: isHovered ? 1 : 0
                    }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden w-full text-left"
                  >
                    <div className="px-4 pb-4 pt-1.5 border-t border-cyan-500/10 text-[11px] sm:text-xs text-cyan-200/90 font-sans normal-case leading-relaxed font-semibold">
                      {lang === 'ru' ? item.descriptionRu : item.descriptionEn}
                    </div>
                  </motion.div>
                </a>
              </motion.div>
            );
          })}
        </div>

      </main>

      {/* Global Interactive Price List Modal */}
      <AnimatePresence>
        {isPriceModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPriceModalOpen(false)}
              className="absolute inset-0 bg-[#020714]/90 backdrop-blur-md"
            />
            
            {/* Modal Content Box */}
            <motion.div
              initial={{ scale: 0.9, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 15, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-2xl bg-[#08122c] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[85vh]"
            >
              
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-cyan-500/10 bg-[#0c1a3e]">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-base sm:text-lg font-display font-black uppercase tracking-wider text-cyan-300">
                    {lang === 'ru' ? 'Базовый Прайслист' : 'Base Price List'}
                  </h2>
                </div>
                <button
                  onClick={() => setIsPriceModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-cyan-500/15 text-stone-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body (Scrollable category list) */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-grow custom-scrollbar">
                
                {/* Guidelines Short Notice */}
                <div className="p-3.5 rounded-xl bg-cyan-500/5 border border-cyan-500/10 text-xs text-cyan-300 leading-normal font-sans">
                  {lang === 'ru' ? (
                    '💡 Указаны ориентировочные базовые цены за одиночные статичные оригиналы. Итоговый расчет зависит от линейных размеров (разрешения), количества дополнительных вариаций/подвидов и наличия покадровой анимации.'
                  ) : (
                    '💡 General starting prices are for single static originals. Final quotes depend on pixel dimensions, amount of asset recolors/variations, and complexity of custom frame-by-frame animations.'
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {priceCategories.map((cat, i) => (
                    <div 
                      key={i}
                      className="p-4 rounded-xl border border-cyan-500/5 bg-[#0a1533]/60 hover:border-cyan-500/20 hover:bg-[#0d1d45]/80 transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="font-sans font-black text-xs sm:text-sm text-cyan-300 group-hover:text-white transition-colors mb-1">
                          {lang === 'ru' ? cat.nameRu : cat.nameEn}
                        </div>
                        <p className="text-[11px] text-stone-400 font-sans leading-relaxed mb-3">
                          {lang === 'ru' ? cat.detailsRu : cat.detailsEn}
                        </p>
                      </div>
                      <div className="font-mono text-xs font-black text-emerald-400 bg-emerald-950/20 px-2.5 py-1.5 rounded-lg border border-emerald-500/10 self-start">
                        {cat.basePrice}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cooperation Rules */}
                <div className="border-t border-[#1b326d]/30 pt-4 space-y-2 text-xs text-stone-400 font-sans">
                  <div className="font-bold text-cyan-300 uppercase tracking-wider">
                    {lang === 'ru' ? 'Правила сотрудничества:' : 'Cooperation Guidelines:'}
                  </div>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>{lang === 'ru' ? 'Бесплатные правки на этапе наброска и подбора палитры.' : 'Free adjustments during sketch and palette phases.'}</li>
                    <li>{lang === 'ru' ? 'Предоплата 50% перед началом чистовой отрисовки.' : '50% upfront payment before final render starts.'}</li>
                    <li>{lang === 'ru' ? 'Не рисую: NSFW контент, кровь, современную военную тематику.' : 'No NSFW, gore, or modern military themes.'}</li>
                  </ul>
                </div>

              </div>

              {/* Footer */}
              <div className="p-4 bg-[#061026] border-t border-cyan-500/10 flex justify-end">
                <button
                  onClick={() => setIsPriceModalOpen(false)}
                  className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white font-mono text-xs font-black uppercase tracking-wider rounded-xl border border-cyan-300/20 transition-all cursor-pointer shadow-lg active:scale-95"
                >
                  {lang === 'ru' ? 'Закрыть прайслист' : 'Close Price List'}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Small bottom spacing */}
      <div className="pb-8 z-10" />
    </div>
  );
}
