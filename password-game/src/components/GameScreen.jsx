import { useState, useEffect, useRef, useCallback } from 'react';
import { createGame, checkPassword } from '../engine/gameState';
import Timer from './Timer';
import RuleList from './RuleList';
import PasswordInput from './PasswordInput';

const TOTAL_TIME = 300;
const TIME_BONUS = 15;

export default function GameScreen({ difficulty, onGameOver, onVictory }) {
  const [game, setGame] = useState(() => createGame(difficulty));
  const [results, setResults] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [phase, setPhase] = useState('input'); // input | playing
  const [revealedCount, setRevealedCount] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [messages, setMessages] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [newRuleIdx, setNewRuleIdx] = useState(-1);

  const timerRef = useRef(null);

  // 计时器
  useEffect(() => {
    if (phase === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            onGameOver({
              elapsedTime: TOTAL_TIME,
              difficulty,
              rulesPassed: results ? results.filter(r => r.passed).length : 0,
              totalRules: game.allRules.length,
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const revealNext = useCallback(() => {
    setRevealedCount(prev => {
      const next = prev + 1;
      setNewRuleIdx(next - 1);
      setTimeout(() => setNewRuleIdx(-1), 800);
      return next;
    });
    setTimeLeft(prev => Math.min(prev + TIME_BONUS, TOTAL_TIME));
  }, []);

  const handleSubmit = useCallback((password) => {
    if (isTransitioning) return;
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    // 第一轮：揭示第 1 条基础规则
    if (phase === 'input') {
      setIsTransitioning(true);
      setTimeout(() => {
        revealNext();
        setPhase('playing');
        setIsTransitioning(false);
        addMessage('第 1 条规则已揭示');
      }, 500);
      return;
    }

    // 游戏阶段：逐条验证
    const visibleRules = game.allRules.slice(0, revealedCount);
    const { results: newResults, allPassed } = checkPassword(game, password, visibleRules);
    setResults(newResults);

    if (allPassed) {
      // 全部揭示且通过 → 胜利
      if (revealedCount >= game.allRules.length) {
        clearInterval(timerRef.current);
        addMessage('全部通过！');
        setTimeout(() => {
          onVictory({
            elapsedTime: TOTAL_TIME - timeLeft,
            difficulty,
            totalRules: game.allRules.length,
            attempts: newAttempts,
            streak,
          });
        }, 500);
        return;
      }

      // 通过当前规则，揭示下一条
      setStreak(s => s + 1);
      setIsTransitioning(true);
      const nextCount = revealedCount + 1;
      const isBase = nextCount <= 3;
      addMessage(isBase
        ? `基础规则通过 — 揭示第 ${nextCount} 条 +${TIME_BONUS}s`
        : `全部通过 — 揭示第 ${nextCount}/${game.allRules.length} 条 +${TIME_BONUS}s`);

      setTimeout(() => {
        revealNext();
        setResults(null);
        setIsTransitioning(false);
      }, 900);
      return;
    }

    // 未通过
    setStreak(0);
    const failed = newResults.filter(r => !r.passed);
    if (newRuleIdx >= 0 && !newResults[newRuleIdx]?.passed) {
      addMessage(`新规则未通过 — 剩 ${failed.length} 条`);
    } else if (failed.length <= 2) {
      addMessage(`差 ${failed.length} 条：${failed.map(f => f.rule.description).join('；')}`);
    } else {
      addMessage(`${failed.length}/${newResults.length} 条未通过`);
    }
  }, [phase, game, revealedCount, attempts, timeLeft, isTransitioning, streak, newRuleIdx, difficulty, onGameOver, onVictory, revealNext]);

  const addMessage = (text) => {
    setMessages(prev => [...prev.slice(-3), { id: Date.now(), text }]);
  };

  const elapsed = TOTAL_TIME - timeLeft;
  const isWarning = timeLeft <= 60;
  const isDanger = timeLeft <= 20;
  const visibleRules = game.allRules.slice(0, revealedCount);

  return (
    <div className="game-screen">
      <div className="game-header">
        <div className="game-level">
          <span className="level-label">难度 {difficulty} / 5</span>
        </div>
        {phase === 'playing' && (
          <Timer seconds={elapsed} isWarning={isWarning} isDanger={isDanger} />
        )}
        {phase === 'input' && (
          <div className="timer timer-idle">
            <span className="timer-text">--:--</span>
          </div>
        )}
        <div className="game-stats">
          <div className="stat-item">
            <span className="stat-label">规则</span>
            <span className="stat-value">{revealedCount}/{game.allRules.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">连击</span>
            <span className={`stat-value ${streak >= 3 ? 'streak-hot' : ''}`}>×{streak}</span>
          </div>
        </div>
      </div>

      <div className="game-messages">
        {messages.map(msg => (
          <div key={msg.id} className="game-message">{msg.text}</div>
        ))}
        {phase === 'input' && messages.length === 0 && (
          <div className="game-message hint-message">输入任意密码开始</div>
        )}
      </div>

      <div className="reveal-progress">
        <div className="reveal-bar">
          <div className="reveal-fill" style={{ width: `${(revealedCount / Math.max(game.allRules.length, 1)) * 100}%` }} />
        </div>
        <span className="reveal-label">{revealedCount}/{game.allRules.length} 条</span>
      </div>

      <RuleList
        rules={visibleRules}
        results={results}
        revealed={revealedCount}
        newRuleIdx={newRuleIdx}
        allPassed={results && results.length > 0 && results.every(r => r.passed)}
      />

      <PasswordInput
        onSubmit={handleSubmit}
        disabled={isTransitioning}
        results={results}
      />

      {phase === 'input' && (
        <div className="phase-indicator">
          <div className="phase-step active">Input</div>
          <div className="phase-arrow">→</div>
          <div className="phase-step">1 Rule</div>
          <div className="phase-arrow">→</div>
          <div className="phase-step">×{game.allRules.length}</div>
        </div>
      )}
    </div>
  );
}
