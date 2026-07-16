"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle, CaretRight, MoonStars, PaperPlaneTilt, ShieldCheck, Sparkle, Trophy, User } from "@phosphor-icons/react";
import { games, Player } from "../../game-data";
import { roomChannel } from "../../realtime";
import { SavedResponse, supabase } from "../../supabase";

type PlayerPhase = "join" | "waiting" | "question" | "saved" | "answer" | "results";

export default function JoinRoom() {
  const { room } = useParams<{ room: string }>();
  const [phase, setPhase] = useState<PlayerPhase>("join");
  const [name, setName] = useState("");
  const [gameIndex, setGameIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [textAnswer, setTextAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [rank, setRank] = useState<number | null>(null);
  const channel = useRef<ReturnType<typeof roomChannel> | null>(null);

  const game = games[gameIndex];
  const question = game.questions[questionIndex];

  useEffect(() => {
    channel.current = roomChannel(room, (event) => {
      if (event.type === "state") {
        const state = event.payload as { phase?: string; gameIndex?: number; questionIndex?: number };
        if (typeof state.gameIndex === "number") setGameIndex(state.gameIndex);
        if (typeof state.questionIndex === "number") setQuestionIndex(state.questionIndex);
        if (phase !== "join") {
          if (state.phase === "question") { setSelected(""); setTextAnswer(""); setPhase("question"); }
          if (state.phase === "answer") setPhase("answer");
          if (state.phase === "leaderboard" || state.phase === "final") setPhase("results");
          if (state.phase === "lobby") setPhase("waiting");
        }
      }
      if (event.type === "scoreboard") {
        const scoreboard = [...((event.payload as { players?: Player[] })?.players || [])].sort((a, b) => b.score - a.score);
        const playerIndex = scoreboard.findIndex((player) => player.name === name.trim());
        if (playerIndex >= 0) { setScore(scoreboard[playerIndex].score); setRank(playerIndex + 1); }
      }
      if (event.type === "removed" && (event.payload as { name?: string })?.name === name) setPhase("join");
    });
    if (phase !== "join") channel.current.send("scoreboard-request", { name: name.trim() });
    return () => channel.current?.close();
  }, [room, phase, name]);

  const join = (e: FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim(); if (!cleanName) return;
    localStorage.setItem(`mm-player-${room}`, cleanName);
    channel.current?.send("join", { name: cleanName });
    setPhase("waiting");
    if (supabase) void supabase.from("room_players").insert({ room_code: room, name: cleanName, score: 0 });
  };

  const submit = () => {
    if (!selected && !textAnswer.trim()) return;
    const correctChoice = question.choices?.find((choice) => choice.correct)?.label;
    const correct = correctChoice
      ? selected === correctChoice
      : Boolean(question.answer && textAnswer.trim().toUpperCase() === question.answer.trim().toUpperCase());
    const points = correct ? 100 : 0;
    const response: SavedResponse = { room_code: room, player_name: name.trim(), game_id: game.id, question_index: questionIndex, question_prompt: question.prompt, answer: selected || textAnswer.trim(), is_correct: question.kind === "prediction" ? null : Boolean(correct), points };
    channel.current?.send("answer", response);
    setPhase("saved");
    if (supabase) void supabase.from("game_responses").insert(response);
  };

  const place = rank ? `${rank}${rank % 10 === 1 && rank % 100 !== 11 ? "st" : rank % 10 === 2 && rank % 100 !== 12 ? "nd" : rank % 10 === 3 && rank % 100 !== 13 ? "rd" : "th"} place` : "Ranking…";

  return <main className="player-shell">
    <header className="player-header"><a className="brand" href="/"><span className="brand-mark"><MoonStars weight="fill" /></span><span>Wondreams<br />Baby Shower Games</span></a><span className="player-room">Room {room}</span></header>
    <section className="player-card">
      {phase === "join" && <form onSubmit={join} className="join-form"><div className="mobile-arch-art"><MoonStars weight="fill" /><Sparkle weight="fill" /><Sparkle weight="fill" /></div><span className="eyebrow">Welcome, little star</span><h1>Join the celebration</h1><p>Enter your name so everyone knows who&apos;s playing.</p><label>Your name<div className="input-wrap"><User /><input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ava" maxLength={24} autoFocus /></div></label><button className="button button-primary button-large" type="submit">Join Game <CaretRight weight="bold" /></button><small><ShieldCheck weight="fill" /> No account or download needed</small></form>}

      {phase === "waiting" && <div className="waiting-state"><div className="mobile-arch-art large"><MoonStars weight="fill" /><Sparkle weight="fill" /><Sparkle weight="fill" /></div><span className="eyebrow">You&apos;re in!</span><h1>Welcome, {name || "Guest"}.</h1><p>Waiting for the host to start the first game…</p><div className="waiting-pulse"><i /><span>Connected to room {room}</span></div></div>}

      {phase === "question" && <div className="player-question"><div className="player-progress"><span>{game.title}</span><strong>{questionIndex + 1} / {game.questions.length}</strong></div><div className="progress-track"><i style={{ width: `${((questionIndex + 1) / game.questions.length) * 100}%` }} /></div><h1>{question.prompt}</h1>{question.choices ? <div className="player-choices">{question.choices.map((choice, index) => <button className={selected === choice.label ? "selected" : ""} key={choice.label} onClick={() => setSelected(choice.label)}><span>{String.fromCharCode(65 + index)}</span>{choice.label}{selected === choice.label && <CheckCircle weight="fill" />}</button>)}</div> : <textarea value={textAnswer} onChange={(e) => setTextAnswer(e.target.value)} placeholder={question.kind === "prediction" ? "Type your sweet prediction…" : "Type your answer…"} maxLength={120} />}<button className="button button-primary button-large" onClick={submit} disabled={!selected && !textAnswer.trim()}><PaperPlaneTilt weight="fill" /> Send Answer</button><div className="player-rank"><Trophy weight="fill" /><span>{place}</span><b>{score} pts</b></div></div>}

      {phase === "saved" && <div className="saved-state"><CheckCircle weight="fill" /><span className="eyebrow">Answer saved</span><h1>Locked in!</h1><p>Your answer is saved and visible to the host.</p><div className="player-rank"><Trophy weight="fill" /><span>{place}</span><b>{score} pts</b></div></div>}

      {phase === "answer" && <div className="saved-state"><Sparkle weight="fill" /><span className="eyebrow">Correct answer</span><h1>{question.choices?.find((c) => c.correct)?.label || question.answer || "A wish from the heart"}</h1><p>{question.choices?.find((c) => c.label === selected)?.correct || (question.answer && textAnswer.toUpperCase() === question.answer) ? "Beautiful! You earned 100 points." : "So close — the next question is yours."}</p><div className="player-rank"><Trophy weight="fill" /><span>{place}</span><b>{score} pts</b></div></div>}

      {phase === "results" && <div className="saved-state"><Trophy weight="fill" /><span className="eyebrow">Game complete</span><h1>You&apos;re a little star!</h1><p>You finished in {place}.</p><div className="big-score">{score}<small>total points</small></div><button className="button button-primary button-large" onClick={() => setPhase("waiting")}>Back to lobby</button></div>}
    </section>
  </main>;
}
