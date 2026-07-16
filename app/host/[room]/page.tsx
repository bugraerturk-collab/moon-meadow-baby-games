"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { ArrowsOut, CaretRight, Crown, GameController, MoonStars, Play, QrCode, SignOut, Sparkle, Trash, UsersThree, X } from "@phosphor-icons/react";
import { games, Player } from "../../game-data";
import { roomChannel } from "../../realtime";
import { SavedResponse } from "../../supabase";

type Phase = "lobby" | "question" | "answer" | "leaderboard" | "final";

export default function HostRoom() {
  const { room } = useParams<{ room: string }>();
  const [phase, setPhase] = useState<Phase>("lobby");
  const [gameIndex, setGameIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [players, setPlayers] = useState<Player[]>([]);
  const [responses, setResponses] = useState<SavedResponse[]>([]);
  const [fullQr, setFullQr] = useState(false);
  const [joinUrl, setJoinUrl] = useState(`/join/${room}`);
  const channel = useRef<ReturnType<typeof roomChannel> | null>(null);
  const game = games[gameIndex];
  const question = game.questions[questionIndex];
  const sorted = useMemo(() => [...players].sort((a, b) => b.score - a.score), [players]);

  useEffect(() => setJoinUrl(`${window.location.origin}/join/${room}`), [room]);
  useEffect(() => {
    channel.current = roomChannel(room, (event) => {
      if (event.type === "join") {
        const name = String((event.payload as { name?: string })?.name || "Guest");
        setPlayers((current) => current.some((p) => p.name === name) ? current : [...current, { id: crypto.randomUUID(), name, score: 0 }]);
      }
      if (event.type === "answer") {
        const response = event.payload as SavedResponse;
        setResponses((current) => [...current.filter((item) => !(item.player_name === response.player_name && item.game_id === response.game_id && item.question_index === response.question_index)), response]);
        if (response.points) setPlayers((current) => current.map((player) => player.name === response.player_name ? { ...player, score: player.score + response.points } : player));
      }
    });
    return () => channel.current?.close();
  }, [room]);
  useEffect(() => { channel.current?.send("state", { phase, gameIndex, questionIndex }); }, [phase, gameIndex, questionIndex]);

  const startGame = (index = gameIndex) => { setGameIndex(index); setQuestionIndex(0); setResponses([]); setPhase("question"); };
  const next = () => questionIndex < game.questions.length - 1 ? (setQuestionIndex((q) => q + 1), setResponses([]), setPhase("question")) : setPhase("leaderboard");
  const nextGame = () => gameIndex < games.length - 1 ? startGame(gameIndex + 1) : setPhase("final");
  const reset = async () => {
    setPhase("lobby"); setGameIndex(0); setQuestionIndex(0); setResponses([]); setPlayers((current) => current.map((p) => ({ ...p, score: 0 })));
  };
  const removePlayer = (player: Player) => { setPlayers((current) => current.filter((p) => p.id !== player.id)); channel.current?.send("removed", { name: player.name }); };

  return <main className="host-shell">
    <header className="host-header"><a className="brand" href="/"><span className="brand-mark"><MoonStars weight="fill" /></span><span>Moon<br />&amp; Meadow</span></a><div className="live-pill"><i /> {phase === "lobby" ? "Live lobby" : "Game in progress"}</div><div className="host-steps"><span className={phase === "lobby" ? "active" : ""}>Lobby</span><b>•</b><span className={["question", "answer"].includes(phase) ? "active" : ""}>Game</span><b>•</b><span className={["leaderboard", "final"].includes(phase) ? "active" : ""}>Results</span></div></header>
    {phase === "lobby" && <section className="lobby-layout"><div className="lobby-main"><span className="eyebrow"><Sparkle weight="fill" /> Your room is ready</span><h1>A little celebration<br />is about to begin</h1><div className="room-label">Room code</div><div className="room-code">{room.slice(0, 3)} {room.slice(3)}</div><div className="guest-panel"><div className="guest-panel-head"><strong><UsersThree weight="fill" /> {players.length} guests are here</strong><span>Real guests only</span></div><div className="guest-list">{players.length === 0 && <p className="empty-guests">Waiting for guests to scan the QR code…</p>}{players.slice(0, 30).map((player, index) => <div className="guest" key={player.id}><div className={`guest-avatar tone-${index % 4}`}>{player.name[0]}</div><span>{player.name}</span><button aria-label={`Remove ${player.name}`} onClick={() => void removePlayer(player)}><X /></button></div>)}</div></div><div className="host-actions"><button className="button button-primary button-large" onClick={() => startGame()} disabled={!players.length}><Sparkle weight="fill" /> Start the First Game</button><button className="button button-outline button-large" onClick={() => setFullQr(true)}><ArrowsOut /> Show Full-Screen QR</button></div></div><aside className="qr-arch"><div className="qr-stars"><MoonStars weight="fill" /></div><div className="qr-box"><QRCodeSVG value={joinUrl} size={240} bgColor="#fffaf0" fgColor="#102f28" level="H" /></div><h2>Scan to join instantly</h2><p>No app or account needed</p></aside></section>}
    {phase === "question" && <section className="question-layout"><div className="question-main"><div className="question-meta"><span><GameController weight="fill" /> {game.title}</span><strong>Question {questionIndex + 1} of {game.questions.length}</strong></div><h1>{question.prompt}</h1>{question.choices ? <div className="host-choices">{question.choices.map((choice, index) => <div key={choice.label}><span>{String.fromCharCode(65 + index)}</span>{choice.label}</div>)}</div> : <div className="live-answer-list"><div className="open-answer"><Sparkle weight="fill" /><strong>Live written answers</strong><span>{responses.length ? `${responses.length} received` : "Guests are typing…"}</span></div>{responses.map((r) => <div className="written-answer" key={`${r.player_name}-${r.answer}`}><strong>{r.player_name}</strong><span>{r.answer}</span></div>)}</div>}<div className="response-progress"><div><strong>{responses.length} of {players.length}</strong> answers are in</div><div className="progress-track"><i style={{ width: `${players.length ? responses.length / players.length * 100 : 0}%` }} /></div></div></div><aside className="host-control-panel"><span className="control-kicker">Host controls</span><div className="timer-ring"><strong>{responses.length}</strong><span>answers</span></div><button className="button button-primary button-large" onClick={() => setPhase("answer")}><Play weight="fill" /> Reveal Answer</button><button className="text-link" onClick={() => setPhase("leaderboard")}><Crown /> Show leaderboard</button></aside></section>}
    {phase === "answer" && <section className="answer-screen"><span className="eyebrow"><Sparkle weight="fill" /> Answer revealed</span><h1>{question.prompt}</h1><div className="correct-answer">{question.choices?.find((c) => c.correct)?.label || question.answer || "Every prediction is part of the fun!"}</div><p>{question.kind === "prediction" ? "Every sweet answer has been saved." : "Guests with the correct answer earned 100 points."}</p>{!question.choices && <div className="revealed-responses">{responses.map((r) => <div key={`${r.player_name}-${r.answer}`}><strong>{r.player_name}</strong><span>{r.answer}</span></div>)}</div>}<div className="mini-leaderboard">{sorted.slice(0, 3).map((player, index) => <div key={player.id}><span>{index + 1}</span><strong>{player.name}</strong><b>{player.score} pts</b></div>)}</div><button className="button button-primary button-large" onClick={next}>Next <CaretRight weight="bold" /></button></section>}
    {phase === "leaderboard" && <Leaderboard title={`${game.title} complete!`} players={sorted} actionLabel={gameIndex === games.length - 1 ? "See Final Results" : "Play Next Game"} onAction={nextGame} />}{phase === "final" && <Leaderboard title="A magical game night!" players={sorted} actionLabel="Play Again" onAction={() => void reset()} final />}
    <footer className="host-footer"><span><UsersThree weight="fill" /> {players.length} connected</span><span>Room {room}</span><button onClick={() => void reset()}><Trash /> Reset game</button><a href="/"><SignOut /> Exit</a></footer>
    {fullQr && <div className="qr-modal"><button className="modal-close" onClick={() => setFullQr(false)} aria-label="Close"><X /></button><span className="eyebrow"><QrCode /> Scan to join</span><QRCodeSVG value={joinUrl} size={420} bgColor="#fffaf0" fgColor="#102f28" level="H" /><div className="room-code">{room.slice(0, 3)} {room.slice(3)}</div><p>Open your camera. No app needed.</p></div>}
  </main>;
}

function Leaderboard({ title, players, actionLabel, onAction, final = false }: { title: string; players: Player[]; actionLabel: string; onAction: () => void; final?: boolean }) {
  return <section className="leaderboard-screen"><span className="eyebrow"><Crown weight="fill" /> {final ? "Final results" : "Leaderboard"}</span><h1>{title}</h1><div className="podium">{players.slice(0, 3).map((player, index) => <div className={`podium-place place-${index + 1}`} key={player.id}><div className="crown-wrap">{index === 0 && <Crown weight="fill" />}</div><div className="podium-avatar">{player.name[0]}</div><span>#{index + 1}</span><strong>{player.name}</strong><b>{player.score} pts</b></div>)}</div><div className="rank-list">{players.slice(3, 7).map((player, index) => <div key={player.id}><span>{index + 4}</span><strong>{player.name}</strong><b>{player.score} pts</b></div>)}</div><button className="button button-primary button-large" onClick={onAction}>{actionLabel} <CaretRight weight="bold" /></button></section>;
}
