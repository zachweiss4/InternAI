'use client';

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import {
  ArrowDown,
  ArrowRight,
  Check,
  CircleDot,
  Cpu,
  Crosshair,
  Layers3,
  MapPin,
  Orbit,
  Radar,
  Search,
  Sparkles,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { AnimatedGradient } from '@/components/ui/animated-gradient';
import { LiquidMetalShader } from './liquid-metal-shader';

type ConceptId = 'aurora' | 'chrome' | 'neon' | 'cosmic' | 'brutal';

const CONCEPTS: Array<{ id: ConceptId; name: string; kind: string }> = [
  { id: 'aurora', name: 'Aurora Glass', kind: 'Glassmorphic' },
  { id: 'chrome', name: 'Liquid Chrome', kind: 'Shader + glass' },
  { id: 'neon', name: 'Neon Bounty', kind: 'Cyberpunk' },
  { id: 'cosmic', name: 'Cosmic Radar', kind: 'Orbital' },
  { id: 'brutal', name: 'Electric Brutal', kind: 'Kinetic brutalism' },
];

interface ConceptShellProps {
  id: ConceptId;
  index: number;
  eyebrow: string;
  title: string;
  description: string;
  className: string;
  selected: ConceptId | null;
  onSelect: (id: ConceptId) => void;
  children: ReactNode;
}

function ConceptShell({
  id,
  index,
  eyebrow,
  title,
  description,
  className,
  selected,
  onSelect,
  children,
}: ConceptShellProps) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const copyY = useTransform(scrollYProgress, [0, 0.5, 1], [reduceMotion ? 0 : 85, 0, -85]);
  const stageY = useTransform(scrollYProgress, [0, 1], [reduceMotion ? 0 : -62, 62]);
  const stageRotate = useTransform(scrollYProgress, [0, 0.5, 1], [-1.4, 0, 1.4]);
  const isSelected = selected === id;

  return (
    <section ref={ref} id={id} className={`design-concept ${className}`}>
      <div className="design-concept-number" aria-hidden="true">
        0{index + 1}
      </div>
      <div className="design-concept-grid">
        <motion.div className="design-concept-copy" style={{ y: copyY }}>
          <div className="design-concept-kicker">
            <span>{eyebrow}</span>
            <span aria-hidden="true">/</span>
            <span>Direction 0{index + 1}</span>
          </div>
          <h2>{title}</h2>
          <p>{description}</p>
          <button
            type="button"
            className="design-select-button"
            aria-pressed={isSelected}
            onClick={() => onSelect(id)}
          >
            <span>{isSelected ? 'Direction selected' : 'Choose this direction'}</span>
            {isSelected ? <Check aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
          </button>
        </motion.div>
        <motion.div
          className="design-concept-stage"
          style={{ y: stageY, rotate: reduceMotion ? 0 : stageRotate }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}

function AuroraGlassStage() {
  return (
    <div className="aurora-scene">
      <AnimatedGradient
        className="aurora-gradient-shader"
        config={{
          preset: 'custom',
          color1: '#1c0b4a',
          color2: '#6d4cff',
          color3: '#f45bc8',
          speed: 9,
          scale: 0.68,
          distortion: 32,
          swirl: 74,
          softness: 92,
          shape: 'Edge',
        }}
        noise={{ opacity: 0.16, scale: 0.72 }}
        radius="34px"
      />
      <div className="aurora-blob aurora-blob-a" />
      <div className="aurora-blob aurora-blob-b" />
      <div className="aurora-blob aurora-blob-c" />
      <div className="aurora-window">
        <div className="concept-window-bar">
          <span className="concept-mini-logo">
            <Orbit aria-hidden="true" />
          </span>
          <span>InternAI / Opportunity cloud</span>
          <span className="aurora-live">
            <i /> Live
          </span>
        </div>
        <div className="aurora-window-body">
          <div className="aurora-search">
            <Search aria-hidden="true" />
            <span>Creative technology internships in New York</span>
            <kbd>⌘ K</kbd>
          </div>
          <div className="aurora-grid">
            <div className="aurora-match-card aurora-card-primary">
              <span className="aurora-score">96%</span>
              <p>Design Engineer Intern</p>
              <small>Nothing · New York · 3h ago</small>
              <div className="aurora-card-line">
                <i />
                <i />
                <i />
              </div>
            </div>
            <div className="aurora-match-card">
              <span className="aurora-score">91%</span>
              <p>Creative Technologist</p>
              <small>Figma · Remote · 6h ago</small>
              <div className="aurora-card-line">
                <i />
                <i />
              </div>
            </div>
            <div className="aurora-insight">
              <Sparkles aria-hidden="true" />
              <div>
                <strong>Signal detected</strong>
                <small>12 roles before the crowd</small>
              </div>
            </div>
          </div>
        </div>
      </div>
      <motion.div
        className="aurora-float aurora-float-a"
        animate={{ y: [0, -14, 0], rotate: [-2, 2, -2] }}
        transition={{ duration: 5.4, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
      >
        <MapPin aria-hidden="true" /> Miami + remote
      </motion.div>
      <motion.div
        className="aurora-float aurora-float-b"
        animate={{ y: [0, 12, 0], rotate: [2, -2, 2] }}
        transition={{ duration: 6.2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
      >
        <Zap aria-hidden="true" /> Fresh match
      </motion.div>
    </div>
  );
}

function LiquidChromeStage() {
  return (
    <div className="chrome-scene">
      <LiquidMetalShader className="chrome-shader" />
      <div className="chrome-grain" />
      <div className="chrome-interface">
        <div className="chrome-topline">
          <span>INTERNAI® / LIQUID SIGNAL</span>
          <span>POINTER REACTIVE</span>
        </div>
        <div className="chrome-wordmark">
          FUTURE
          <br />
          FOUND.
        </div>
        <div className="chrome-search-panel">
          <CircleDot aria-hidden="true" />
          <div>
            <span>High-signal opportunity</span>
            <strong>AI Product Intern · Anthropic</strong>
          </div>
          <b>94</b>
        </div>
        <div className="chrome-orb" aria-hidden="true">
          <span />
        </div>
        <div className="chrome-caption">REAL-TIME CAREER INTELLIGENCE</div>
      </div>
    </div>
  );
}

function NeonStage() {
  const roles = [
    ['01', 'AI SYSTEMS INTERN', 'OPENAI / SF', '98'],
    ['02', 'CYBERSECURITY INTERN', 'CLOUDFLARE / REMOTE', '93'],
    ['03', 'ML RESEARCH INTERN', 'NVIDIA / SANTA CLARA', '89'],
  ];
  return (
    <div className="neon-scene">
      <div className="neon-grid-floor" />
      <div className="neon-scanline" />
      <div className="neon-hud-corners" />
      <div className="neon-header">
        <span>
          <Cpu aria-hidden="true" /> INTERNAI_OS
        </span>
        <span className="neon-blink">● NETWORK ACTIVE</span>
      </div>
      <div className="neon-glitch" data-text="HUNT THE SIGNAL">
        HUNT THE SIGNAL
      </div>
      <div className="neon-command">
        <Crosshair aria-hidden="true" /> TARGET: SUMMER 2027 / AI / REMOTE
      </div>
      <div className="neon-results">
        {roles.map(([id, title, meta, score]) => (
          <div className="neon-result" key={id}>
            <span>{id}</span>
            <div>
              <strong>{title}</strong>
              <small>{meta}</small>
            </div>
            <b>{score}%</b>
          </div>
        ))}
      </div>
      <div className="neon-ticker">
        <span>
          NEW SIGNAL +++ VERIFIED SOURCE +++ MATCH VECTOR LOCKED +++ APPLY WINDOW OPEN +++{' '}
        </span>
      </div>
    </div>
  );
}

function CosmicStage() {
  return (
    <div className="cosmic-scene">
      <div className="cosmic-stars" />
      <div className="cosmic-radar">
        <div className="cosmic-ring cosmic-ring-one">
          <span className="cosmic-chip">Design</span>
        </div>
        <div className="cosmic-ring cosmic-ring-two">
          <span className="cosmic-chip">AI</span>
        </div>
        <div className="cosmic-ring cosmic-ring-three">
          <span className="cosmic-chip">Product</span>
        </div>
        <div className="cosmic-core">
          <Radar aria-hidden="true" />
          <strong>YOU</strong>
        </div>
        <div className="cosmic-sweep" />
      </div>
      <div className="cosmic-console">
        <span>ORBITAL MATCH 7A</span>
        <strong>Product Design Intern</strong>
        <small>Linear · Remote / New York</small>
        <div>
          <i style={{ width: '94%' }} />
          <b>94% ALIGNMENT</b>
        </div>
      </div>
      <div className="cosmic-coordinate">40.7128° N / OPPORTUNITY VECTOR: LOCKED</div>
    </div>
  );
}

function BrutalStage() {
  return (
    <div className="brutal-scene">
      <div className="brutal-marquee">
        <span>GET THE ROLE ★ GET THE ROLE ★ GET THE ROLE ★ </span>
      </div>
      <div className="brutal-main">
        <div className="brutal-title">
          ZERO
          <br />
          BORING
          <br />
          JOBS.
        </div>
        <div className="brutal-sticker">
          <Sparkles aria-hidden="true" /> AI RANKED
        </div>
        <div className="brutal-card">
          <span>TOP MATCH / 001</span>
          <strong>
            BRAND DESIGN
            <br />
            INTERN
          </strong>
          <small>NIKE — PORTLAND, OR</small>
          <button type="button">
            OPEN ROLE <ArrowRight aria-hidden="true" />
          </button>
        </div>
        <div className="brutal-score">
          97
          <br />
          <small>MATCH</small>
        </div>
        <div className="brutal-arrow" aria-hidden="true">
          ↘
        </div>
      </div>
      <div className="brutal-footer-line">
        <span>NO GHOST LISTINGS.</span>
        <span>NO GENERIC RANKING.</span>
        <span>NO BEIGE CAREERS.</span>
      </div>
    </div>
  );
}

export function DesignLab() {
  const [selected, setSelected] = useState<ConceptId | null>(null);
  const [showSaved, setShowSaved] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.25 });

  useEffect(() => {
    const saved = window.localStorage.getItem('internai-design-direction') as ConceptId | null;
    if (CONCEPTS.some((concept) => concept.id === saved)) setSelected(saved);
  }, []);

  const chooseDirection = (id: ConceptId) => {
    setSelected(id);
    window.localStorage.setItem('internai-design-direction', id);
    setShowSaved(true);
    window.setTimeout(() => setShowSaved(false), 2200);
  };

  const selectedConcept = CONCEPTS.find((concept) => concept.id === selected);

  return (
    <main className="design-lab">
      <motion.div className="design-lab-progress" style={{ scaleX: progress }} />
      <AnimatePresence>
        {showSaved && selectedConcept && (
          <motion.div
            className="design-saved-toast"
            initial={{ opacity: 0, y: -18, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
          >
            <Check aria-hidden="true" /> {selectedConcept.name} saved as your direction
          </motion.div>
        )}
      </AnimatePresence>

      <section className="design-lab-intro">
        <div className="design-intro-orbit design-intro-orbit-a" />
        <div className="design-intro-orbit design-intro-orbit-b" />
        <div className="design-intro-grid" />
        <div className="design-intro-inner">
          <motion.div
            className="design-lab-label"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Layers3 aria-hidden="true" /> InternAI experimental design lab / 2027
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.08 }}
          >
            Five futures.
            <br />
            <span>Pick your reality.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18 }}
          >
            Scroll through five deliberately extreme visual systems. Every direction moves, reacts,
            and reimagines how finding an internship could feel.
          </motion.p>
          <motion.div
            className="design-intro-actions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <a href="#aurora">
              <ArrowDown aria-hidden="true" /> Enter the lab
            </a>
            {selectedConcept && (
              <span>
                <Check aria-hidden="true" /> Selected: {selectedConcept.name}
              </span>
            )}
          </motion.div>
          <div className="design-intro-index">
            {CONCEPTS.map((concept, index) => (
              <a href={`#${concept.id}`} key={concept.id}>
                <span>0{index + 1}</span>
                <strong>{concept.name}</strong>
                <small>{concept.kind}</small>
              </a>
            ))}
          </div>
        </div>
      </section>

      <ConceptShell
        id="aurora"
        index={0}
        eyebrow="Glassmorphic / luminous / calm"
        title="Aurora Glass"
        description="Soft depth, refracted color, and floating opportunity cards make the search feel intelligent and almost weightless. Premium, futuristic, and still highly usable."
        className="concept-aurora"
        selected={selected}
        onSelect={chooseDirection}
      >
        <AuroraGlassStage />
      </ConceptShell>

      <ConceptShell
        id="chrome"
        index={1}
        eyebrow="Liquid metal / live shader / luxury tech"
        title="Liquid Chrome"
        description="A pointer-reactive WebGL shader creates flowing metal in real time while crisp glass typography floats above it. This is the cinematic, high-fashion future of InternAI."
        className="concept-chrome"
        selected={selected}
        onSelect={chooseDirection}
      >
        <LiquidChromeStage />
      </ConceptShell>

      <ConceptShell
        id="neon"
        index={2}
        eyebrow="Cyberpunk / tactical / electric"
        title="Neon Bounty"
        description="Internships become live targets in a high-speed intelligence system—glitch typography, scanning grids, signal locks, and a relentless neon HUD."
        className="concept-neon"
        selected={selected}
        onSelect={chooseDirection}
      >
        <NeonStage />
      </ConceptShell>

      <ConceptShell
        id="cosmic"
        index={3}
        eyebrow="Orbital / dimensional / exploratory"
        title="Cosmic Radar"
        description="Roles orbit around your profile like a living solar system. Scroll-linked parallax and rotating match vectors turn the search into an explorable career universe."
        className="concept-cosmic"
        selected={selected}
        onSelect={chooseDirection}
      >
        <CosmicStage />
      </ConceptShell>

      <ConceptShell
        id="brutal"
        index={4}
        eyebrow="Kinetic brutalism / loud / unforgettable"
        title="Electric Brutal"
        description="Oversized type, violent color, hard shadows, and kinetic tickers reject every predictable career-site convention. Maximum attitude, maximum memorability."
        className="concept-brutal"
        selected={selected}
        onSelect={chooseDirection}
      >
        <BrutalStage />
      </ConceptShell>

      <section className="design-lab-outro">
        <span>END OF EXPERIMENT / START OF THE NEXT VERSION</span>
        <h2>
          {selectedConcept
            ? `${selectedConcept.name} is your frontrunner.`
            : 'Which future feels like InternAI?'}
        </h2>
        <p>
          Your choice is saved on this device, so you can compare everything and come back to it.
        </p>
        <div>
          <a href="#aurora">
            <ArrowDown aria-hidden="true" className="rotate-180" /> Review concepts
          </a>
          <Link href="/search">
            Try the current search <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
