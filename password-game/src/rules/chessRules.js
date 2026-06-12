// 国际象棋规则 (~200 条组合)
export const chessTemplates = [
  {
    id: 'chess_contains_piece',
    category: '象棋',
    difficulty: 1,
    description: '密码中必须包含棋子符号 "{piece}"',
    hint: '♔王 ♕后 ♖车 ♗象 ♘马 ♙兵（白方）\n♚王 ♛后 ♜车 ♝象 ♞马 ♟兵（黑方）',
    params: { piece: ['♔','♕','♖','♗','♘','♙','♚','♛','♜','♝','♞','♟'] },
    validate: (pwd, { piece }) => pwd.includes(piece)
  },
  {
    id: 'chess_contains_white_piece',
    category: '象棋',
    difficulty: 1,
    description: '密码中必须包含一个白色棋子',
    hint: '白方棋子：♔王 ♕后 ♖车 ♗象 ♘马 ♙兵',
    params: {},
    validate: (pwd) => /[♔♕♖♗♘♙]/.test(pwd)
  },
  {
    id: 'chess_contains_black_piece',
    category: '象棋',
    difficulty: 1,
    description: '密码中必须包含一个黑色棋子',
    hint: '黑方棋子：♚王 ♛后 ♜车 ♝象 ♞马 ♟兵',
    params: {},
    validate: (pwd) => /[♚♛♜♝♞♟]/.test(pwd)
  },
  {
    id: 'chess_valid_move',
    category: '象棋',
    difficulty: 3,
    description: '密码中必须包含一个合法的国际象棋记谱',
    hint: '例：e4（兵到e4）Nf3（马到f3）0-0（短易位）\n0-0-0（长易位）exd5（e线兵吃d5）e8=Q（升变为后）',
    params: {},
    validate: (pwd) => {
      const patterns = [
        /[a-h][1-8]/,           // e4
        /[KQRBN][a-h]?[1-8]/,   // Nf3, Qh5
        /[a-h]x[a-h][1-8]/,     // exd5
        /0-0/,                    // 王车短易位
        /0-0-0/,                  // 王车长易位
        /[a-h][1-8]=[QRBN]/,     // e8=Q
      ];
      return patterns.some(p => p.test(pwd));
    }
  },
  {
    id: 'chess_opening_name',
    category: '象棋',
    difficulty: 2,
    description: '密码中必须包含一个国际象棋开局名称',
    params: {},
    validate: (pwd) => {
      const openings = [
        'sicilian','ruy lopez','italian','french','caro','pirc','modern','scandinavian',
        'alekhine','nimzo','kings indian','queens gambit','english','reti','catalan',
        'benoni','dutch','grunfeld','philidor','petrov','scotch','vienna','evans',
        'giuoco piano','two knights','four knights','ponziani','bird','grobs',
      ];
      return openings.some(o => pwd.toLowerCase().includes(o));
    }
  },
  {
    id: 'chess_grandmaster',
    category: '象棋',
    difficulty: 2,
    description: '密码中必须包含一位国际象棋特级大师的姓氏',
    params: {},
    validate: (pwd) => {
      const gms = [
        'carlsen','nakamura','caruana','firouzja','ding','nepomniachtchi',
        'anand','kasparov','karpov','fischer','tal','botvinnik','capablanca',
        'alekhine','morphy','lasker','petrosian','spassky','smyslov','eresig',
        'kramnik','topalov','aronian','giri','so','wesley','hikaru','gukesh',
      ];
      return gms.some(g => pwd.toLowerCase().includes(g));
    }
  },
  {
    id: 'chess_checkmate_pattern',
    category: '象棋',
    difficulty: 3,
    description: '密码中必须包含将杀模式的名称',
    params: {},
    validate: (pwd) => {
      const mates = [
        'scholars','fools','smothered','back rank','anastasia','boden',
        'morphy','anderssen','legal','arabian','hook','opera','dovetail',
        'swallowtail','corridor','epaulette','lolli','blackburne',
      ];
      return mates.some(m => pwd.toLowerCase().includes(m));
    }
  },
  {
    id: 'chess_square_color',
    category: '象棋',
    difficulty: 2,
    description: '密码中必须包含一个 {color} 格子的坐标',
    hint: '棋盘坐标如 a1 h8 e4 d5\n白格/浅格：a1 b2 c3 d4... 黑格/深格：a2 b1 h1...',
    params: { color: ['white','black','light','dark'] },
    validate: (pwd, { color }) => {
      const match = pwd.match(/[a-h][1-8]/i);
      if (!match) return false;
      const sq = match[0].toLowerCase();
      const isDark = (sq.charCodeAt(0) - 97 + parseInt(sq[1])) % 2 === 0;
      if (color === 'dark' || color === 'black') return isDark;
      return !isDark;
    }
  },
  {
    id: 'chess_piece_value',
    category: '象棋',
    difficulty: 2,
    description: '密码中棋子符号代表的子力价值之和必须 ≥ {value}',
    hint: '兵=1 马=3 象=3 车=5 后=9（不区分黑白）',
    params: { value: [5,9,10,15] },
    validate: (pwd, { value }) => {
      const values = { '♙':1,'♟':1,'♘':3,'♞':3,'♗':3,'♝':3,'♖':5,'♜':5,'♕':9,'♛':9,'♔':999,'♚':999 };
      let sum = 0;
      for (const c of pwd) {
        if (values[c] && values[c] < 999) sum += values[c];
      }
      return sum >= value;
    }
  },
  {
    id: 'chess_knight_fork',
    category: '象棋',
    difficulty: 3,
    description: '密码中必须包含马可以攻击到的两个格子坐标（如 e4 和 d6 或 f6）',
    params: {},
    validate: (pwd) => {
      const squares = pwd.match(/[a-h][1-8]/gi) || [];
      for (let i = 0; i < squares.length; i++) {
        for (let j = i + 1; j < squares.length; j++) {
          const fileDiff = Math.abs(squares[i].charCodeAt(0) - squares[j].charCodeAt(0));
          const rankDiff = Math.abs(parseInt(squares[i][1]) - parseInt(squares[j][1]));
          if ((fileDiff === 1 && rankDiff === 2) || (fileDiff === 2 && rankDiff === 1)) {
            return true;
          }
        }
      }
      return false;
    }
  },

  // ━━━ 新增规则：扩展象棋分类 ━━━

  {
    id: 'chess_both_colors_pieces',
    category: '象棋',
    difficulty: 2,
    description: '密码中必须同时包含白色和黑色棋子',
    hint: '白方：♔♕♖♗♘♙ 黑方：♚♛♜♝♞♟',
    params: {},
    validate: (pwd) => /[♔♕♖♗♘♙]/.test(pwd) && /[♚♛♜♝♞♟]/.test(pwd)
  },
  {
    id: 'chess_contains_tactic',
    category: '象棋',
    difficulty: 2,
    description: '密码中必须包含一个国际象棋战术术语',
    params: {},
    validate: (pwd) => {
      const tactics = [
        'fork','pin','skewer','discovered','double check','zugzwang','zwischenzug',
        'deflection','decoy','interference','overloading','undermining','x-ray',
        'windmill','perpetual','stalemate','sacrifice','blunder','brilliancy',
      ];
      return tactics.some(t => pwd.toLowerCase().includes(t));
    }
  },
  {
    id: 'chess_contains_pgn_sequence',
    category: '象棋',
    difficulty: 3,
    description: '密码中必须包含一段连续的棋步记谱（如 "e4 e5 Nf3"）',
    hint: 'PGN记谱示例：1.e4 e5 2.Nf3 Nc6',
    params: {},
    validate: (pwd) => {
      return /\b\d+\.\s*[a-h][1-8]\s+[a-h][1-8]/.test(pwd) ||
             /\b[KQRBN]?[a-h]?[1-8]?\s+[KQRBN]?[a-h]?[1-8]/.test(pwd);
    }
  },
  {
    id: 'chess_fianchetto',
    category: '象棋',
    difficulty: 2,
    description: '密码中必须包含翼侧展开的坐标（b2/g2/b7/g7）',
    hint: '翼侧展开(fianchetto)是将象放在b2、g2、b7或g7',
    params: {},
    validate: (pwd) => {
      const squares = pwd.match(/[a-h][1-8]/gi) || [];
      const fianchetto = ['b2','g2','b7','g7'];
      return squares.some(sq => fianchetto.includes(sq.toLowerCase()));
    }
  },
  {
    id: 'chess_contains_castling_side',
    category: '象棋',
    difficulty: 2,
    description: '密码中必须包含 {side} 易位记谱',
    hint: '短易位: 0-0, 长易位: 0-0-0',
    params: { side: ['short','long'] },
    validate: (pwd, { side }) => {
      if (side === 'short') return /0-0(?!-0)/.test(pwd);
      return /0-0-0/.test(pwd);
    }
  },
  {
    id: 'chess_piece_count',
    category: '象棋',
    difficulty: 1,
    description: '密码中必须包含至少 {n} 个棋子符号',
    params: { n: [2, 3, 4] },
    validate: (pwd, { n }) => {
      const pieces = (pwd.match(/[♔♕♖♗♘♙♚♛♜♝♞♟]/g) || []);
      return pieces.length >= n;
    }
  },
  {
    id: 'chess_adjacent_squares',
    category: '象棋',
    difficulty: 3,
    description: '密码中必须包含两个棋盘上相邻的格子坐标',
    hint: '相邻格子：如 e4 和 e5，或 e4 和 d5（对角线也算）',
    params: {},
    validate: (pwd) => {
      const squares = pwd.match(/[a-h][1-8]/gi) || [];
      for (let i = 0; i < squares.length; i++) {
        for (let j = i + 1; j < squares.length; j++) {
          const fd = Math.abs(squares[i].charCodeAt(0) - squares[j].charCodeAt(0));
          const rd = Math.abs(parseInt(squares[i][1]) - parseInt(squares[j][1]));
          if (fd <= 1 && rd <= 1 && (fd + rd) > 0) return true;
        }
      }
      return false;
    }
  },
  {
    id: 'chess_opening_moves',
    category: '象棋',
    difficulty: 2,
    description: '密码中必须包含一个经典开局的起始步法 "{moves}"',
    params: { moves: [
      'e4','d4','c4','Nf3','e4 e5','d4 d5','e4 c5','d4 Nf6','e4 e6','c4 Nf6',
    ] },
    validate: (pwd, { moves }) => pwd.toLowerCase().includes(moves.toLowerCase())
  },
  {
    id: 'chess_notation_pair',
    category: '象棋',
    difficulty: 2,
    description: '密码中必须包含一对颜色相同的棋子符号',
    hint: '白方对：如 ♔♕、♖♗、♘♙ 等 黑方对：如 ♚♛、♜♝ 等',
    params: {},
    validate: (pwd) => {
      const white = (pwd.match(/[♔♕♖♗♘♙]/g) || []);
      const black = (pwd.match(/[♚♛♜♝♞♟]/g) || []);
      return white.length >= 2 || black.length >= 2;
    }
  },
  {
    id: 'chess_endgame_term',
    category: '象棋',
    difficulty: 2,
    description: '密码中必须包含一个残局术语',
    params: {},
    validate: (pwd) => {
      const terms = [
        'endgame','promotion','opposition','triangulation','key square',
        'passed pawn','pawn structure','zugzwang','fortress','perpetual',
        'rook endgame','king and pawn','queen endgame','bishop endgame',
        'knight endgame','lucena','philidor','vancura',
      ];
      return terms.some(t => pwd.toLowerCase().includes(t));
    }
  },
  {
    id: 'chess_promotion',
    category: '象棋',
    difficulty: 2,
    description: '密码中必须包含升变记谱（如 "e8=Q" 或 "a1=R"）',
    hint: '升变：兵到达第1或第8横线时变为其他棋子，如 e8=Q',
    params: {},
    validate: (pwd) => /[a-h][18]=[QRBN]/i.test(pwd)
  },
  {
    id: 'chess_king_safety',
    category: '象棋',
    difficulty: 3,
    description: '密码中必须同时包含一个王（♔或♚）和一个合法棋步坐标',
    params: {},
    validate: (pwd) => {
      return /[♔♚]/.test(pwd) && /[a-h][1-8]/i.test(pwd);
    }
  },
  {
    id: 'chess_control_center',
    category: '象棋',
    difficulty: 2,
    description: '密码中必须包含至少一个中心格子坐标（d4/d5/e4/e5）',
    hint: '棋盘中心4格：d4, d5, e4, e5',
    params: {},
    validate: (pwd) => {
      const squares = pwd.match(/[a-h][1-8]/gi) || [];
      const center = ['d4','d5','e4','e5'];
      return squares.some(sq => center.includes(sq.toLowerCase()));
    }
  },
];
