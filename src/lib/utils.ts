import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimecode(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const frames = Math.floor((seconds % 1) * 24);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}:${String(frames).padStart(2, "0")}`;
}

/**
 * Formats time in SMPTE timecode standard HH:MM:SS:FF at 24fps.
 * @param seconds - Elapsed time in seconds.
 * @param baseHour - Starting base hour (SMPTE Reel 1 default is 1, e.g. 01:00:00:00).
 * @param fps - Target frame rate (default 24 fps).
 */
export function formatSmpteTimecode(seconds: number, baseHour: number = 1, fps: number = 24): string {
  const safeSeconds = Math.max(0, Number.isFinite(seconds) ? seconds : 0);
  const totalFrames = Math.floor(safeSeconds * fps);
  const frames = totalFrames % fps;
  const totalSeconds = Math.floor(totalFrames / fps);
  const s = totalSeconds % 60;
  const m = Math.floor(totalSeconds / 60) % 60;
  const h = (baseHour + Math.floor(totalSeconds / 3600)) % 24;

  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}:${pad(frames)}`;
}

export function formatSeconds(seconds: number): string {
  const safeSeconds = Math.max(0, Number.isFinite(seconds) ? seconds : 0);
  const m = Math.floor(safeSeconds / 60);
  const s = (safeSeconds % 60).toFixed(1);
  return `${String(m).padStart(2, "0")}:${s.padStart(4, "0")}s`;
}
