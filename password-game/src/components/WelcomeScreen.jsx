import { useState } from 'react';

const DIFFICULTIES = [
  { level: 1, label: '简单', desc: '3 + 20', icon: '1' },
  { level: 2, label: '普通', desc: '3 + 25', icon: '2' },
  { level: 3, label: '困难', desc: '3 + 30', icon: '3' },
  { level: 4, label: '地狱', desc: '3 + 35', icon: '4' },
  { level: 5, label: '噩梦', desc: '3 + 40', icon: '5' },
];

export default function WelcomeScreen({ onStart }) {
  const [selected, setSelected] = useState(1);

  return (
    <div className="welcome-screen">
      <div className="welcome-header">
        <div className="welcome-icon">&#x1F510;</div>
        <h1 className="welcome-title">密码大师</h1>
        <p className="welcome-subtitle">Password Master</p>
        <p className="welcome-desc">
          从 3000+ 条规则库中随机抽取，每局都是一个全新的密码谜题。
        </p>
      </div>

      <div className="difficulty-section">
        <p className="difficulty-label">难度</p>
        <div className="difficulty-grid">
          {DIFFICULTIES.map((d) => (
            <button
              key={d.level}
              className={`difficulty-card ${selected === d.level ? 'selected' : ''}`}
              onClick={() => setSelected(d.level)}
            >
              <span className="diff-label">{d.label}</span>
              <span className="diff-desc">{d.desc} 规则</span>
            </button>
          ))}
        </div>
      </div>

      <button className="start-btn" onClick={() => onStart(selected)}>
        开始游戏&ensp;&rarr;
      </button>

      <div className="welcome-footer">
        输入第一条密码后，揭示基础规则
      </div>
    </div>
  );
}
