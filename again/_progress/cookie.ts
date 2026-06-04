const COOKIE_KEY = 'again_progress';
const EXPIRY_DAYS = 365;

function setCookie(value: string): void {
  const expires = new Date(Date.now() + EXPIRY_DAYS * 864e5).toUTCString();
  document.cookie = `${COOKIE_KEY}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(): string | null {
  const match = document.cookie
    .split(';')
    .map((s) => s.trim())
    .find((s) => s.startsWith(`${COOKIE_KEY}=`));
  return match ? decodeURIComponent(match.slice(COOKIE_KEY.length + 1)) : null;
}

export interface Progress {
  maxLevelPassed: number;
}

export function getProgress(): Progress {
  try {
    const raw = getCookie();
    if (!raw) return { maxLevelPassed: 0 };
    return JSON.parse(raw) as Progress;
  } catch {
    return { maxLevelPassed: 0 };
  }
}

export function setPassed(levelId: number): void {
  const current = getProgress();
  if (levelId > current.maxLevelPassed) {
    setCookie(JSON.stringify({ maxLevelPassed: levelId }));
  }
}

export function unlockedLevels(totalLevels: number): number[] {
  const { maxLevelPassed } = getProgress();
  const max = Math.min(maxLevelPassed + 1, totalLevels);
  return Array.from({ length: max }, (_, i) => i + 1);
}
