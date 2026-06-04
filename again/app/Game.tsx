import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Phaser from 'phaser';
import { createGameConfig } from '../_game/config';
import { GAME_EVENTS } from '../_game/events';
import { PlatformerScene } from '../_game/PlatformerScene';
import { clearTextureCache } from '../_game/sprites';
import { LEVELS, TOTAL_LEVELS } from '../_levels/manifest';
import { setPassed } from '../_progress/cookie';
import { MIN_SCREEN_PX } from '../_engine/constants';
import WinPopup from './_components/WinPopup';
import SmallScreenOverlay from './_components/SmallScreenOverlay';
import Hud from './_components/Hud';

export default function Game() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const [showWin, setShowWin] = useState(false);
  const [smallScreen, setSmallScreen] = useState(
    window.innerWidth < MIN_SCREEN_PX
  );

  const levelId = parseInt(id ?? '1', 10);
  const entry = LEVELS.find((l) => l.id === levelId) ?? LEVELS[0];

  const destroyGame = useCallback(() => {
    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
    }
  }, []);

  const handleHome = useCallback(() => {
    destroyGame();
    navigate('/');
  }, [destroyGame, navigate]);

  const handleNext = useCallback(() => {
    setPassed(levelId);
    destroyGame();
    if (levelId >= TOTAL_LEVELS) {
      navigate('/');
    } else {
      navigate(`/play/${levelId + 1}`);
    }
  }, [levelId, destroyGame, navigate]);

  useEffect(() => {
    if (!containerRef.current) return;
    setShowWin(false);

    clearTextureCache();
    const game = new Phaser.Game(createGameConfig(containerRef.current));
    gameRef.current = game;

    game.events.on(GAME_EVENTS.WIN, () => {
      setPassed(levelId);
      setShowWin(true);
    });

    // Add and start the scene with entry data — must happen after boot so the
    // scene manager exists. scene[] is empty in config to prevent auto-start
    // with no init data (which would crash in preload with undefined key).
    game.events.once('ready', () => {
      game.scene.add('PlatformerScene', PlatformerScene, false);
      game.scene.start('PlatformerScene', { entry });
    });

    const handleResize = () =>
      setSmallScreen(window.innerWidth < MIN_SCREEN_PX);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [entry.key]); // restart when level key changes

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        background: '#0f0f1a',
        overflow: 'hidden',
      }}
    >
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      <Hud levelName={entry.name} onBack={handleHome} />
      <SmallScreenOverlay show={smallScreen} />
      {showWin && (
        <WinPopup
          levelId={levelId}
          totalLevels={TOTAL_LEVELS}
          onNext={handleNext}
          onHome={handleHome}
        />
      )}
    </div>
  );
}
