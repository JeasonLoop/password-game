import { useState, useRef, useEffect } from 'react';

export default function PasswordInput({ onSubmit, disabled, results }) {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    
    // 如果上一次提交有失败，触发抖动
    if (results && results.some(r => !r.passed)) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    
    onSubmit(trimmed);
  };

  const passedCount = results ? results.filter(r => r.passed).length : 0;
  const totalCount = results ? results.length : 0;

  return (
    <div className="password-input-wrapper">
      <form className={`password-input-form ${shake ? 'shake' : ''}`} onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            ref={inputRef}
            type="text"
            className="password-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="输入密码..."
            disabled={disabled}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          <button
            type="submit"
            className="submit-btn"
            disabled={disabled || !value.trim()}
          >
            Submit
          </button>
        </div>
      </form>
      {totalCount > 0 && (
        <div className="password-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(passedCount / totalCount) * 100}%` }}
            />
          </div>
          <span className="progress-text">
            {passedCount}/{totalCount} 通过
          </span>
        </div>
      )}
    </div>
  );
}
