// IndexedDB 存储模块 — 缓存规则池 + 游戏状态
const DB_NAME = 'passwordMasterDB';
const DB_VERSION = 1;

const STORES = {
  RULE_POOL: 'rulePool',     // 规则池缓存
  GAME_STATE: 'gameState',   // 游戏存档
  HISTORY: 'history',        // 历史记录
};

let _db = null;

/** 打开数据库（单例） */
function openDB() {
  if (_db) return Promise.resolve(_db);

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;

      if (!db.objectStoreNames.contains(STORES.RULE_POOL)) {
        db.createObjectStore(STORES.RULE_POOL, { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains(STORES.GAME_STATE)) {
        db.createObjectStore(STORES.GAME_STATE, { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains(STORES.HISTORY)) {
        const store = db.createObjectStore(STORES.HISTORY, { keyPath: 'id', autoIncrement: true });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };

    request.onsuccess = (e) => {
      _db = e.target.result;
      resolve(_db);
    };

    request.onerror = (e) => reject(e.target.error);
  });
}

/** 通用：写入单条记录 */
async function put(storeName, data) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).put(data);
    tx.oncomplete = () => resolve();
    tx.onerror = (e) => reject(e.target.error);
  });
}

/** 通用：读取单条记录 */
async function get(storeName, key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const req = tx.objectStore(storeName).get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = (e) => reject(e.target.error);
  });
}

/** 通用：读取所有记录 */
async function getAll(storeName) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const req = tx.objectStore(storeName).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = (e) => reject(e.target.error);
  });
}

/** 通用：计数 */
async function count(storeName) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const req = tx.objectStore(storeName).count();
    req.onsuccess = () => resolve(req.result);
    req.onerror = (e) => reject(e.target.error);
  });
}

/** 通用：清空 */
async function clear(storeName) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = (e) => reject(e.target.error);
  });
}

// ════════════════════════════════════════
// 规则池缓存
// ════════════════════════════════════════

/** 将规则池批量写入 IndexedDB */
export async function saveRulePool(rules) {
  await clear(STORES.RULE_POOL);
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.RULE_POOL, 'readwrite');
    const store = tx.objectStore(STORES.RULE_POOL);
    for (const rule of rules) {
      store.put({
        id: rule.id,
        category: rule.category,
        difficulty: rule.difficulty,
        description: rule.description,
        hint: rule.hint || null,
      });
    }
    tx.oncomplete = () => resolve();
    tx.onerror = (e) => reject(e.target.error);
  });
}

/** 从 IndexedDB 加载规则池元数据（不含 validate 函数） */
export async function loadRulePoolMeta() {
  const c = await count(STORES.RULE_POOL);
  if (c === 0) return null;
  return getAll(STORES.RULE_POOL);
}

/** 获取规则池缓存数量 */
export async function getRulePoolCount() {
  return count(STORES.RULE_POOL);
}

// ════════════════════════════════════════
// 游戏存档
// ════════════════════════════════════════

/** 保存当前游戏状态 */
export async function saveGame(game) {
  const data = {
    id: 'currentGame',
    difficulty: game.difficulty,
    ruleIds: game.allRules.map(r => r.id),
    baseRuleIds: game.baseRules.map(r => r.id),
    bonusRuleIds: game.bonusRules.map(r => r.id),
    revealedCount: game.revealedRules?.length || 0,
    revealStep: game.revealStep,
    currentPassword: game.currentPassword,
    startTime: game.startTime,
    elapsedTime: game.elapsedTime,
    isGameOver: game.isGameOver,
    isVictory: game.isVictory,
    savedAt: Date.now(),
  };
  await put(STORES.GAME_STATE, data);
}

/** 读取存档 */
export async function loadGame() {
  return get(STORES.GAME_STATE, 'currentGame');
}

/** 删除存档 */
export async function clearGame() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.GAME_STATE, 'readwrite');
    tx.objectStore(STORES.GAME_STATE).delete('currentGame');
    tx.oncomplete = () => resolve();
    tx.onerror = (e) => reject(e.target.error);
  });
}

// ════════════════════════════════════════
// 历史记录
// ════════════════════════════════════════

/** 记录一局游戏结果 */
export async function addHistory(entry) {
  const data = {
    difficulty: entry.difficulty,
    totalRules: entry.totalRules,
    elapsedTime: entry.elapsedTime,
    isVictory: entry.isVictory,
    finalPassword: entry.finalPassword || '',
    timestamp: Date.now(),
  };
  await put(STORES.HISTORY, data);
}

/** 获取历史记录（最近 N 条） */
export async function getHistory(limit = 20) {
  const all = await getAll(STORES.HISTORY);
  return all.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
}

/** 获取统计数据 */
export async function getStats() {
  const all = await getAll(STORES.HISTORY);
  const victories = all.filter(h => h.isVictory);
  return {
    totalGames: all.length,
    totalVictories: victories.length,
    winRate: all.length > 0 ? (victories.length / all.length * 100).toFixed(1) : '0',
    bestTime: victories.length > 0 ? Math.min(...victories.map(v => v.elapsedTime)) : null,
    avgTime: victories.length > 0
      ? Math.round(victories.reduce((s, v) => s + v.elapsedTime, 0) / victories.length)
      : null,
  };
}
