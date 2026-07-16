"use client";

import { useEffect, useState } from "react";
import { Baby, Crown, GameController, MoonStars, QrCode, Sparkle } from "@phosphor-icons/react";

const GAMES = [
  ["Baby Animal Match", "Match each little one to its animal name."],
  ["Baby Trivia", "Sweet facts, surprising answers."],
  ["Nursery Rhyme Quiz", "Complete the classic nursery rhymes."],
  ["Baby Word Scramble", "Unscramble adorable baby words."],
  ["Emoji Baby Phrases", "Decode each tiny picture puzzle."],
  ["Baby Predictions", "Share your wishes for the little one."],
];

function makeCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const createRoom = () => {
    const code = makeCode();
    localStorage.setItem("mm-last-room", code);
    window.location.href = `/host/${code}`;
  };

  return (
    <main className="welcome-shell">
      <div className="ambient-stars" aria-hidden="true">
        <Sparkle weight="fill" /><Sparkle weight="fill" /><Sparkle weight="fill" />
      </div>
      <nav className="welcome-nav">
        <a className="brand" href="/" aria-label="Moon and Meadow home">
          <span className="brand-mark"><MoonStars weight="fill" /></span>
          <span>Moon<br />&amp; Meadow</span>
        </a>
        <span className="nav-kicker">Interactive Baby Shower Games</span>
      </nav>

      <section className="welcome-hero">
        <div className="welcome-copy">
          <div className="eyebrow"><Sparkle weight="fill" /> A little magic for your celebration</div>
          <h1>Play, laugh and make <em>little memories.</em></h1>
          <p>Six interactive baby shower games everyone can join from their phone. No apps, no accounts, just scan and play.</p>
          <div className="welcome-actions">
            <button className="button button-primary button-large" onClick={createRoom} disabled={!mounted}>
              <Crown weight="fill" /> Create a Game Room
            </button>
            <span className="text-link"><QrCode /> Guests join with the room QR</span>
          </div>
          <div className="trust-row">
            <span>30+ players</span><span>6 games included</span><span>Works on any phone</span>
          </div>
        </div>

        <div className="hero-arch">
          <div className="hero-arch-inner">
            <MoonStars weight="fill" className="hero-moon" />
            <div className="cloud-copy">
              <span>Tonight&apos;s plan</span>
              <strong>Scan. Play. Celebrate.</strong>
            </div>
            <div className="mini-score-card">
              <span><Crown weight="fill" /> Live game</span>
              <strong>24 guests ready</strong>
              <div className="avatar-stack"><i>A</i><i>N</i><i>L</i><i>+21</i></div>
            </div>
          </div>
        </div>
      </section>

      <section className="game-preview" aria-label="Included games">
        <div className="section-heading">
          <span className="eyebrow"><GameController weight="fill" /> Six games, one joyful night</span>
          <h2>Everything you need to keep the party playing.</h2>
        </div>
        <div className="game-grid">
          {GAMES.map(([title, copy], index) => (
            <article className="game-tile" key={title}>
              <span className="game-number">0{index + 1}</span>
              <Baby weight="duotone" />
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
