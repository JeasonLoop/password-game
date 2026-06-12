import { useState, useEffect, useRef } from 'react';

const CATEGORY_ICONS = {
  '数学': '🔢',
  '字符串': '🔤',
  '罗马数字': '🏛️',
  '热梗': '🌐',
  '图案': '🎨',
  'Emoji': '😀',
  '密码学': '🔐',
  '象棋': '♟️',
  '科学': '🔬',
  '文字游戏': '📝',
};

const CATEGORY_COLORS = {
  '数学': '#60a5fa',
  '字符串': '#f472b6',
  '罗马数字': '#c084fc',
  '热梗': '#fb923c',
  '图案': '#4ade80',
  'Emoji': '#facc15',
  '密码学': '#38bdf8',
  '象棋': '#a78bfa',
  '科学': '#34d399',
  '文字游戏': '#fbbf24',
};

export default function RuleList({ rules, results, revealed, newRuleIdx, allPassed }) {
  return (
    <div className={`rule-list ${allPassed ? 'all-clear' : ''}`}>
      {rules.map((rule, idx) => {
        const isRevealed = revealed > idx || revealed === -1;
        const result = results ? results[idx] : null;
        return (
          <RuleCard
            key={rule.id}
            rule={rule}
            index={idx}
            isRevealed={isRevealed}
            passed={result?.passed ?? null}
            detail={result?.detail ?? null}
            isNew={idx === newRuleIdx}
          />
        );
      })}
    </div>
  );
}

function RuleCard({ rule, index, isRevealed, passed, detail, isNew }) {
  const [animState, setAnimState] = useState('idle');
  const [showHint, setShowHint] = useState(false);
  const prevPassed = useRef(passed);
  const cardRef = useRef(null);

  useEffect(() => {
    if (passed !== prevPassed.current && passed !== null) {
      setAnimState(passed ? 'pass' : 'fail');
      const t = setTimeout(() => setAnimState('idle'), 600);
      prevPassed.current = passed;
      return () => clearTimeout(t);
    }
  }, [passed]);

  const icon = CATEGORY_ICONS[rule.category] || '📋';
  const color = CATEGORY_COLORS[rule.category] || '#888';

  if (!isRevealed) {
    return (
      <div className="rule-card rule-card-locked">
        <div className="rule-card-inner">
          <span className="rule-lock-text">—</span>
        </div>
      </div>
    );
  }

  const statusClass = passed === true ? 'is-pass' : passed === false ? 'is-fail' : '';

  return (
    <div
      ref={cardRef}
      className={`rule-card rule-card-revealed ${animState} ${statusClass} ${isNew ? 'rule-card-new' : ''}`}
      style={{ '--accent': color }}
    >
      <div className="rule-card-inner">
        <div className="rule-card-header">
          <span className="rule-number">#{index + 1}</span>
          <span className="rule-category" style={{ color }}>
            {icon} {rule.category}
          </span>
          {rule.hint && (
            <button
              className={`hint-toggle ${showHint ? 'active' : ''}`}
              onClick={(e) => { e.stopPropagation(); setShowHint(!showHint); }}
              title="查看提示"
            >
              ?
            </button>
          )}
          {passed === true && <span className="rule-status rule-pass">Pass</span>}
          {passed === false && <span className="rule-status rule-fail">Fail</span>}
          {passed === null && <span className="rule-status rule-pending">—</span>}
        </div>
        <p className="rule-description">{rule.description}</p>
        {passed === false && detail && (
          <div className="rule-detail">{detail}</div>
        )}
        {showHint && rule.hint && (
          <div className="rule-hint">
            {rule.hint.split('\n').map((line, i) => (
              <span key={i}>{line}{i < rule.hint.split('\n').length - 1 && <br />}</span>
            ))}
          </div>
        )}
        <div className="rule-difficulty">
          {Array.from({ length: rule.difficulty }, (_, i) => (
            <span key={i} className="diff-dot filled" />
          ))}
          {Array.from({ length: 5 - rule.difficulty }, (_, i) => (
            <span key={i} className="diff-dot" />
          ))}
        </div>
      </div>
    </div>
  );
}
