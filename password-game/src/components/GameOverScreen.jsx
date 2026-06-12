export default function GameOverScreen({ result, onRestart }) {
  if (!result) return null;

  const { elapsedTime, difficulty, rulesPassed, totalRules } = result;
  const m = Math.floor(elapsedTime / 60);
  const s = Math.floor(elapsedTime % 60);
  const timeStr = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  return (
    <div className="result-screen game-over-screen">
      <div className="result-card">
        <div className="result-icon">&#x23F0;</div>
        <h2 className="result-title">时间到</h2>
        <p className="result-subtitle">未能在限定时间内满足所有规则</p>

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
            <span className="stat-label">通过</span>
            <span className="stat-value">
              {rulesPassed}/{totalRules}
            </span>
          </div>
        </div>

        <button className="restart-btn" onClick={onRestart}>
          再来一局 &rarr;
        </button>
      </div>
    </div>
  );
}
