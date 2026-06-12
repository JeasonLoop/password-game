export default function Timer({ seconds, isWarning, isDanger }) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const display = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  return (
    <div className={`timer ${isDanger ? 'timer-danger' : ''} ${isWarning ? 'timer-warning' : ''}`}>
      <span className="timer-text">{display}</span>
    </div>
  );
}
