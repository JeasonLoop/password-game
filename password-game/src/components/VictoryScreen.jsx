export default function VictoryScreen({ result, onRestart }) {
  if (!result) return null;

  const { elapsedTime, difficulty, totalRules, attempts } = result;
  const m = Math.floor(elapsedTime / 60);
  const s = Math.floor(elapsedTime % 60);
  const timeStr = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  const score = Math.max(0, Math.floor(
    (10000 / Math.max(elapsedTime, 1)) * (difficulty + 1) * (totalRules / (attempts || 1)) * 10
  ));

  return (
    <div className="result-screen">
      <div className="result-card">
        <div className="result-icon victory-icon">&#x1F3C6;</div>
        <h2 className="result-title">密码正确</h2>
        <p className="result-subtitle">所有规则已通过</p>

        <div className="score-display">
          <span className="score-number">{score.toLocaleString()}</span>
          <span className="score-label">分</span>
        </div>

        <div className="result-stats">
          <div className="stat-row">
            <span className="stat-label">用时</span>
            <span className="stat-value">{timeStr}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">难度</span>
            <span className="stat-value">{difficulty} / 5</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">规则</span>
            <span className="stat-value">{totalRules} 条</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">尝试</span>
            <span className="stat-value">{attempts || 1} 次</span>
          </div>
        </div>

        <button className="restart-btn" onClick={onRestart}>
          再来一局 &rarr;
        </button>
      </div>
    </div>
  );
}
