// 游戏状态管理

import { generateAllRules, selectRulesForGame, validateAllRules } from './ruleEngine';
import { ALL_TEMPLATES } from './ruleTemplates';
import { saveRulePool, loadRulePoolMeta, saveGame, loadGame, clearGame, addHistory } from './gameDB';

// 懒加载：首次使用时生成全量规则池（3000+ 条），后续缓存
let _rulePool = null;
let _poolReady = false;

/**
 * 获取规则池（优先从 IndexedDB 加载元数据，内存缓存优先）
 * 首次启动时同步生成并异步存入 IndexedDB
 */
export function getRulePool() {
  if (!_rulePool) {
    _rulePool = generateAllRules(ALL_TEMPLATES);
    console.log(`[规则引擎] 已生成 ${_rulePool.length} 条规则`);
    // 异步缓存到 IndexedDB（不阻塞主流程）
    saveRulePool(_rulePool).then(() => {
      console.log(`[IndexedDB] 规则池已缓存 ${_rulePool.length} 条`);
    }).catch(err => {
      console.warn('[IndexedDB] 缓存规则池失败:', err);
    });
  }
  return _rulePool;
}

/** 异步获取规则池（确保 IndexedDB 写入完成） */
export async function getRulePoolAsync() {
  getRulePool(); // 确保内存中有
  return _rulePool;
}

/**
 * 创建一局新游戏
 * @param {number} difficulty - 难度 1-5
 */
export function createGame(difficulty) {
  const pool = getRulePool();
  const { baseRules, bonusRules } = selectRulesForGame(pool, difficulty);
  const allRules = [...baseRules, ...bonusRules];

  const game = {
    difficulty,
    baseRules,
    bonusRules,
    allRules,
    revealedRules: [],
    revealStep: 0,
    currentPassword: '',
    startTime: null,
    elapsedTime: 0,
    isGameOver: false,
    isVictory: false,
  };

  // 异步存档
  saveGame(game).catch(err => console.warn('[IndexedDB] 存档失败:', err));

  return game;
}

/**
 * 从 IndexedDB 恢复存档
 * @returns {Object|null} 游戏状态或 null
 */
export async function restoreGame() {
  const saved = await loadGame();
  if (!saved) return null;

  const pool = getRulePool();
  const ruleMap = new Map(pool.map(r => [r.id, r]));

  // 从存档的 ruleIds 恢复规则对象
  const allRules = (saved.ruleIds || []).map(id => ruleMap.get(id)).filter(Boolean);
  const baseRules = (saved.baseRuleIds || []).map(id => ruleMap.get(id)).filter(Boolean);
  const bonusRules = (saved.bonusRuleIds || []).map(id => ruleMap.get(id)).filter(Boolean);

  if (allRules.length === 0) {
    console.warn('[IndexedDB] 存档中的规则无法匹配，可能规则池已更新');
    await clearGame();
    return null;
  }

  return {
    difficulty: saved.difficulty,
    baseRules,
    bonusRules,
    allRules,
    revealedRules: allRules.slice(0, saved.revealedCount || 0),
    revealStep: saved.revealStep || 0,
    currentPassword: saved.currentPassword || '',
    startTime: saved.startTime,
    elapsedTime: saved.elapsedTime || 0,
    isGameOver: saved.isGameOver || false,
    isVictory: saved.isVictory || false,
  };
}

/**
 * 保存游戏进度
 */
export async function saveGameProgress(game) {
  await saveGame(game);
}

/**
 * 记录游戏结果
 */
export async function recordGameResult(game) {
  await addHistory({
    difficulty: game.difficulty,
    totalRules: game.allRules.length,
    elapsedTime: game.elapsedTime,
    isVictory: game.isVictory,
    finalPassword: game.currentPassword,
  });
  // 胜利或失败后清除存档
  if (game.isGameOver) await clearGame();
}

/**
 * 获取密码验证结果
 * @param {Array} [rules] 可选，指定要校验的规则子集；不传则校验全部
 */
export function checkPassword(game, password, rules) {
  const targetRules = rules || game.allRules;
  const results = validateAllRules(password, targetRules);
  const allPassed = results.every(r => r.passed);
  return { results, allPassed };
}

/**
 * 格式化时间为 MM:SS
 */
export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
