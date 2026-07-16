"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { ArrowsOut, CaretRight, Crown, GameController, MoonStars, Play, QrCode, SignOut, Sparkle, Trash, UsersThree, X } from "@phosphor-icons/react";
import { demoPlayers, games } from "../../game-data";
import { roomChannel } from "../../realtime";

type Phase = "lobby" | "question" | "answer" | "leaderboard" | "final";

export default function HostRoom() {
  const { room } = useParams<{ room: string }>();
  const [phase, setPhase] = useState<Phase>("lobby");
  const [gameIndex, setGameIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [players, setPlayers] = useState(demoPlayers);
  const [answers, setAnswers] = useState(0);
  const [fullQr, setFullQr] = useState(false);
  const [joinUrl, setJoinUrl] = useState(`/join/${room}`);
  const channel = useRef<ReturnType<typeof roomChannel> | null>(null);

  const game = games[gameIndex];
  const question = game.questions[questionIndex];
  const sorted = useMemo(() => [...players].sort((a, b) => b.score - a.score), [players]);

  useEffect(() => {
    setJoinUrl(`${window.location.origin}/join/${room}`);
  }, [room]);

  useEffect(() => {
    channel.current = roomChannel(room, (event) => {
      if (event.type === "join") {
        const name = String((event.payload as { name?: string })?.name || "Guest");
        setPlayers((current) => current.some((p) => p.name === name) ? current : [...current, { id: crypto.randomUUID(), name, score: 0 }]);
      }
      if (event.type === "answer") setAnswers((count) => Math.min(count + 1, 30));
    });
    return () => channel.current?.close();
  }, [room]);

  useEffect(() => {
    channel.current?.send("state", { phase, gameIndex, questionIndex });
  }, [phase, gameIndex, questionIndex]);

  const startGame = (index = gameIndex) => {
    setGameIndex(index); setQuestionIndex(0); setAnswers(0); setPhase("question");
  };

  const reveal = () => {
    setPhase("answer");
    setPlayers((current) => current.map((player, index) => ({ ...player, score: player.score + (index % 3 === 0 ? 100 : index % 3 === 1 ? 80 : 40) })));
  };

  const next = () => {
    if (questionIndex < game.questions.length - 1) {
      setQuestionIndex((q) => q + 1); setAnswers(0); setPhase("question");
    } else setPhase("leaderboard");
  };

  const nextGame = () => {
    if (gameIndex < games.length - 1) startGame(gameIndex + 1);
    else setPhase("final");
  };

  const reset = () => {
    setPhase("lobby"); setGameIndex(0); setQuestionIndex(0); setAnswers(0); setPlayers(demoPlayers);
  };

  return (
    <main className="host-shell">
      <header className="host-header">
        <a className="brand" href="/"><span className="brand-mark"><MoonStars weight="fill" /></span><span>Moon<br />&amp; Meadow</span></a>
        <div className="live-pill"><i /> {phase === "lobby" ? "Live lobby" : "Game in progress"}</div>
        <div className="host-steps"><span className={phase === "lobby" ? "active" : ""}>Lobby</span><b>•</b><span className={["question", "answer"].includes(phase) ? "active" : ""}>Game</span><b>•</b><span className={["leaderboard", "final"].includes(phase) ? "active" : ""}>Results</span></div>
      </header>

      {phase === "lobby" && (
        <section className="lobby-layout">
          <div className="lobby-main">
            <span className="eyebrow"><Sparkle weight="fill" /> Your room is ready</span>
            <h1>A little celebration<br />is about to begin</h1>
            <div className="room-label">Room code</div>
            <div className="room-code">{room.slice(0, 3)} {room.slice(3)}</div>
            <div className="guest-panel">
              <div className="guest-panel-head"><strong><UsersThree weight="fill" /> {players.length} guests are here</strong><button>Manage guests <CaretRight /></button></div>
              <div className="guest-list">
                {players.slice(0, 6).map((player, index) => <div className="guest" key={player.id}><div className={`guest-avatar tone-${index % 4}`}>{player.name[0]}</div><span>{player.name}</span><button aria-label={`Remove ${player.name}`} onClick={() => setPlayers((p) => p.filter((x) => x.id !== player.id))}><X /></button></div>)}
              </div>
            </div>
            <div className="host-actions">
              <button className="button button-primary button-large" onClick={() => startGame()}><Sparkle weight="fill" /> Start the First Game</button>
              <button className="button button-outline button-large" onClick={() => setFullQr(true)}><ArrowsOut /> Show Full-Screen QR</button>
            </div>
          </div>
          <aside className="qr-arch">
            <div className="qr-stars"><MoonStars weight="fill" /></div>
            <div className="qr-box"><QRCodeSVG value={joinUrl} size={240} bgColor="#fffaf0" fgColor="#102f28" level="H" /></div>
            <h2>Scan to join instantly</h2><p>No app or account needed</p>
          </aside>
        </section>
      )}

      {phase === "question" && (
        <section className="question-layout">
          <div className="question-main">
            <div className="question-meta"><span><GameController weight="fill" /> {game.title}</span><strong>Question {questionIndex + 1} of {game.questions.length}</strong></div>
            <h1>{question.prompt}</h1>
            {question.choices ? <div className="host-choices">{question.choices.map((choice, index) => <div key={choice.label}><span>{String.fromCharCode(65 + index)}</span>{choice.label}</div>)}</div> : <div className="open-answer"><Sparkle weight="fill" /><strong>Open answer</strong><span>Guests are typing their answers…</span></div>}
            <div className="response-progress"><div><strong>{answers || Math.min(players.length - 2, players.length)} of {players.length}</strong> answers are in</div><div className="progress-track"><i style={{ width: `${Math.max(8, ((answers || players.length - 2) / players.length) * 100)}%` }} /></div></div>
          </div>
          <aside className="host-control-panel">
            <span className="control-kicker">Host controls</span>
            <div className="timer-ring"><strong>18</strong><span>seconds</span></div>
            <button className="button button-primary button-large" onClick={reveal}><Play weight="fill" /> Reveal Answer</button>
            <button className="text-link" onClick={() => setPhase("leaderboard")}><Crown /> Show leaderboard</button>
          </aside>
        </section>
      )}

      {phase === "answer" && (
        <section className="answer-screen">
          <span className="eyebrow"><Sparkle weight="fill" /> Answer revealed</span>
          <h1>{question.prompt}</h1>
          <div className="correct-answer">{question.choices?.find((c) => c.correct)?.label || question.answer || "Every prediction is part of the fun!"}</div>
          <p>{question.kind === "prediction" ? "We’ll save every sweet answer for the parents-to-be." : "Guests with the correct answer earned 100 points."}</p>
          <div className="mini-leaderboard">{sorted.slice(0, 3).map((player, index) => <div key={player.id}><span>{index + 1}</span><strong>{player.name}</strong><b>{player.score} pts</b></div>)}</div>
          <button className="button button-primary button-large" onClick={next}>Next <CaretRight weight="bold" /></button>
        </section>
      )}

      {phase === "leaderboard" && <Leaderboard title={`${game.title} complete!`} players={sorted} actionLabel={gameIndex === games.length - 1 ? "See Final Results" : "Play Next Game"} onAction={nextGame} />}
      {phase === "final" && <Leaderboard title="A magical game night!" players={sorted} actionLabel="Play Again" onAction={reset} final />}

      <footer className="host-footer">
        <span><UsersThree weight="fill" /> {players.length} connected</span>
        <span>Room {room}</span>
        <button onClick={reset}><Trash /> Reset game</button>
        <a href="/"><SignOut /> Exit</a>
      </footer>

      {fullQr && <div className="qr-modal"><button className="modal-close" onClick={() => setFullQr(false)} aria-label="Close"><X /></button><span className="eyebrow"><QrCode /> Scan to join</span><QRCodeSVG value={joinUrl} size={420} bgColor="#fffaf0" fgColor="#102f28" level="H" /><div className="room-code">{room.slice(0, 3)} {room.slice(3)}</div><p>Open your camera. No app needed.</p></div>}
    </main>
  );
}

function Leaderboard({ title, players, actionLabel, onAction, final = false }: { title: string; players: typeof demoPlayers; actionLabel: string; onAction: () => void; final?: boolean }) {
  return <section className="leaderboard-screen"><span className="eyebrow"><Crown weight="fill" /> {final ? "Final results" : "Leaderboard"}</span><h1>{title}</h1><div className="podium">{players.slice(0, 3).map((player, index) => <div className={`podium-place place-${index + 1}`} key={player.id}><div className="crown-wrap">{index === 0 && <Crown weight="fill" />}</div><div className="podium-avatar">{player.name[0]}</div><span>#{index + 1}</span><strong>{player.name}</strong><b>{player.score} pts</b></div>)}</div><div className="rank-list">{players.slice(3, 7).map((player, index) => <div key={player.id}><span>{index + 4}</span><strong>{player.name}</strong><b>{player.score} pts</b></div>)}</div><button className="button button-primary button-large" onClick={onAction}>{actionLabel} <CaretRight weight="bold" /></button></section>;
}
