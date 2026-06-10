// ============================================================
// IIQE 刷题系统 - 主逻辑
// ============================================================

let state = {
  currentPaper: null,
  currentQuestions: [],
  currentIndex: 0,
  userAnswers: [],       // { questionId, selected, correct, answered }
  wrongQuestions: [], // 错题列表
  startTime: null,
  mode: 'practice',      // practice | exam | wrong
  timerInterval: null,
  settings: {
    autoNext: true,
    autoSave: true,
    showExplain: true,
    fontSize: 14,
    night: false,
    count: 20
  },
  stats: {} // 各卷统计数据
};

// ─── 初始化 ───
document.addEventListener('DOMContentLoaded', function() {
  loadSettings();
  loadStats();
  renderHome();
  updateHomeStats();
  // 检查考试日期倒计时
  checkExamCountdown();
});

function loadSettings() {
  const saved = localStorage.getItem('quiz_settings');
  if (saved) {
    try { state.settings = JSON.parse(saved); } catch(e) {}
  }
  applySettings();
}

function saveSettings() {
  localStorage.setItem('quiz_settings', JSON.stringify(state.settings));
}

function loadStats() {
  const saved = localStorage.getItem('quiz_stats');
  if (saved) {
    try { state.stats = JSON.parse(saved); } catch(e) {}
  }
  const savedWrong = localStorage.getItem('quiz_wrong');
  if (savedWrong) {
    try { state.wrongQuestions = JSON.parse(savedWrong); } catch(e) {}
  }
}

function saveStats() {
  localStorage.setItem('quiz_stats', JSON.stringify(state.stats));
  localStorage.setItem('quiz_wrong', JSON.stringify(state.wrongQuestions));
}

function applySettings() {
  document.getElementById('setting-count').value = state.settings.count || 20;
  document.getElementById('setting-auto').checked = state.settings.autoNext !== false;
  document.getElementById('setting-save').checked = state.settings.autoSave !== false;
  document.getElementById('setting-explain').checked = state.settings.showExplain !== false;
  document.getElementById('setting-fontsize').value = state.settings.fontSize || 14;
  if (state.settings.night) document.body.classList.add('night');
  if (state.settings.examDate) document.getElementById('setting-examdate').value = state.settings.examDate;
}

// ─── 首页渲染 ───
function renderHome() {
  const paperKeys = ['paper1','paper2','paper3','paper4','paper5'];
  paperKeys.forEach(key => {
    const el = document.getElementById('stat-' + key);
    if (!el) return;
    const stats = state.stats[key] || {};
    if (stats.total > 0) {
      const rate = stats.correct > 0 ? Math.round(stats.correct / stats.total * 100) : 0;
      el.textContent = `已练习 ${stats.total} 题 · 正确率 ${rate}%`;
    } else {
      el.textContent = '点击开始练习 →';
    }
  });
  //错题数
  const wEl = document.getElementById('stat-wrong');
  if (wEl) wEl.textContent = state.wrongQuestions.length > 0 ? `共 ${state.wrongQuestions.length} 道错题 →` : '暂无错题记录 →';
}

function updateHomeStats() { renderHome(); }

// ─── 开始做题 ───
function startQuiz(paperKey) {
  state.currentPaper = paperKey;
  state.mode = 'practice';
  const bank = QUESTION_BANKS[paperKey];
  if (!bank || !bank.questions || bank.questions.length === 0) {
    alert('该卷暂无题目，敬请期待更新！');
    return;
  }

  const count = parseInt(document.getElementById('setting-count').value) || bank.questions.length;
  let questions = [...bank.questions];
  if (count > 0 && count < questions.length) {
    questions = shuffleArray(questions).slice(0, count);
  } else {
    questions = shuffleArray(questions);
  }

  state.currentQuestions = questions;
  state.currentIndex = 0;
  state.userAnswers = [];
  state.startTime = Date.now();

  for (let i = 0; i < questions.length; i++) {
    state.userAnswers.push({ questionId: questions[i].id, selected: null, correct: false, answered: false });
  }

  showScreen('screen-quiz');
  renderQuestion();
  startTimer();
}

function startTimer() {
  if (state.timerInterval) clearInterval(state.timerInterval);
  state.timerInterval = setInterval(() => {
    if (!state.startTime) return;
    const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
    const min = Math.floor(elapsed / 60);
    const sec = elapsed % 60;
    const timerEl = document.getElementById('quiz-timer');
    if (timerEl) {
      timerEl.textContent = `⏱ ${min}:${String(sec).padStart(2,'0')}`;
      if (min >= 30) timerEl.classList.add('warning');
    }
  }, 1000);
}

// ─── 渲染题目 ───
function renderQuestion() {
  const idx = state.currentIndex;
  const q = state.currentQuestions[idx];
  const total = state.currentQuestions.length;
  const ans = state.userAnswers[idx];

  // 进度
  document.getElementById('quiz-num').textContent = idx + 1;
  document.getElementById('quiz-total').textContent = total;
  document.getElementById('quiz-progress').style.width = ((idx + 1) / total * 100) + '%';

  // 题目标签
  const paperName = QUESTION_BANKS[state.currentPaper]?.name || state.currentPaper;
  const typeTag = q.type === 'multiple' ? '<span class="q-type-tag">多选</span>' : '';
  document.getElementById('q-meta').innerHTML = `${paperName} · 第${idx + 1}题 ${typeTag}`;

  // 题目文字
  document.getElementById('q-text').textContent = q.text;
  document.getElementById('q-text').style.fontSize = (state.settings.fontSize || 14) + 'px';

  // 选项
  const optionsEl = document.getElementById('q-options');
  optionsEl.innerHTML = '';

  const letters = ['A','B','C','D','E','F'];
  q.options.forEach((opt, i) => {
    const letter = letters[i];
    const optEl = document.createElement('div');
    optEl.className = 'option';
    if (ans.selected === letter) optEl.classList.add('selected');
    optEl.innerHTML = `<span class="option-letter">${letter}</span><span>${opt}</span>`;
    optEl.onclick = () => selectOption(letter);
    optionsEl.appendChild(optEl);
  });

  // 反馈区
  const feedbackEl = document.getElementById('q-feedback');
  feedbackEl.className = 'answer-feedback';
  feedbackEl.style.display = 'none';

  // 按钮状态
  const nextBtn = document.getElementById('btn-next');
  nextBtn.disabled = !ans.selected;
  nextBtn.textContent = ans.answered ? (idx< total - 1 ? '下一题 →' : '查看结果') : '提交答案 →';

  const prevBtn = document.getElementById('btn-prev');
  prevBtn.disabled = idx === 0;
}

// ─── 选择选项 ───
function selectOption(letter) {
  const ans = state.userAnswers[state.currentIndex];
  if (ans.answered) return;
  // 如果是多选题，可以切换
  if (QUESTION_BANKS[state.currentPaper].questions[0].type === 'multiple') {
    // 多选暂用单选逻辑，简化处理
    if (ans.selected === letter) {
      ans.selected = null;
    } else {
      ans.selected = letter;
    }
  } else {
    ans.selected = letter;
  }
  document.getElementById('btn-next').disabled = !ans.selected;
  // 更新选项样式
  document.querySelectorAll('.option').forEach((el, i) => {
    const letters = ['A','B','C','D','E','F'];
    el.classList.toggle('selected', el.querySelector('.option-letter').textContent === ans.selected);
  });
}

// ─── 提交答案 ───
function submitAnswer() {
  const idx = state.currentIndex;
  const q = state.currentQuestions[idx];
  const ans = state.userAnswers[idx];
  if (!ans.selected) return;

  ans.answered = true;
  const correct = ans.selected === q.answer;
  ans.correct = correct;

  // 标记选项
  document.querySelectorAll('.option').forEach(el => {
    const letter = el.querySelector('.option-letter').textContent;
    if (letter === q.answer) el.classList.add('correct');
    if (letter === ans.selected && !correct) el.classList.add('wrong');
  });

  // 反馈
  const feedbackEl = document.getElementById('q-feedback');
  if (state.settings.showExplain !== false) {
    feedbackEl.innerHTML = `<strong>${correct ? '✅ 回答正确！' : '❌ 回答错误'}</strong><br>${q.explanation || ''}`;
    feedbackEl.className = `answer-feedback show ${correct ? 'correct' : 'wrong'}`;
  }

  // 记录错题
  if (!correct) {
    const alreadyIn = state.wrongQuestions.some(w => w.id === q.id);
    if (!alreadyIn) {
      state.wrongQuestions.push({ ...q });
    }
  }

  // 记录历史（用于统计）
  const paperKey = state.currentPaper;
  if (!state.stats[paperKey]) state.stats[paperKey] = { total: 0, correct: 0 };
  state.stats[paperKey].total++;
  if (correct) state.stats[paperKey].correct++;
  saveStats();

  // 按钮文字
  const nextBtn = document.getElementById('btn-next');
  nextBtn.textContent = idx < state.currentQuestions.length - 1 ? '下一题 →' : '查看结果';
  nextBtn.disabled = false;
  nextBtn.onclick = nextQuestion;
}

// ─── 下一题 ───
function nextQuestion() {
  const idx = state.currentIndex;
  const ans = state.userAnswers[idx];

  if (!ans.answered) {
    //还没提交，先提交
    submitAnswer();
    return;
  }

  if (idx < state.currentQuestions.length - 1) {
    state.currentIndex++;
    renderQuestion();
  } else {
    showResult();
  }
}

// ─── 上一题 ───
function prevQuestion() {
  if (state.currentIndex > 0) {
    state.currentIndex--;
    renderQuestion();
  }
}

// ─── 结果页 ───
function showResult() {
  if (state.timerInterval) clearInterval(state.timerInterval);

  const rightCount = state.userAnswers.filter(a => a.correct).length;
  const wrongCount = state.userAnswers.filter(a => a.answered && !a.correct).length;
  const skipCount = state.userAnswers.filter(a => !a.answered).length;
  const total = state.currentQuestions.length;
  const rate = total > 0 ? Math.round(rightCount / total * 100) : 0;

  document.getElementById('result-score').textContent = rightCount + '/' + total;
  document.getElementById('result-percent').textContent = `正确率 ${rate}%`;
  document.getElementById('result-right').textContent = rightCount;
  document.getElementById('result-wrong').textContent = wrongCount;
  document.getElementById('result-skip').textContent = skipCount;

  showScreen('screen-result');
  renderHome();
}

function restartQuiz() {
  if (state.currentPaper) startQuiz(state.currentPaper);
}

function retryWrongOnly() {
  if (state.wrongQuestions.length === 0) {
    alert('暂无错题记录！');
    return;
  }
  state.currentPaper = 'wrong';
  state.mode = 'wrong';
  state.currentQuestions = [...state.wrongQuestions];
  state.currentIndex = 0;
  state.userAnswers = [];
  state.startTime = Date.now();

  for (let i = 0; i < state.wrongQuestions.length; i++) {
    state.userAnswers.push({ questionId: state.wrongQuestions[i].id, selected: null, correct: false, answered: false });
  }

  showScreen('screen-quiz');
  renderQuestion();
  startTimer();
}

// ─── 题目列表 ───
function showQuestionList() {
  showScreen('screen-list');
  renderQuestionList();
}

function renderQuestionList() {
  const container = document.getElementById('qlist-container');
  const questions = state.currentQuestions;
  const answers = state.userAnswers;

  let html = '';
  questions.forEach((q, i) => {
    const ans = answers[i];
    const statusClass = !ans.answered ? 'done-skip' : (ans.correct ? 'done-right' : 'done-wrong');
    html += `<div class="question-list-item" onclick="jumpToQuestion(${i})">
      <div class="q-num ${statusClass}">${i + 1}</div>
      <div>
        <div class="q-preview">${q.text.substring(0, 60)}${q.text.length > 60 ? '...' : ''}</div>
        <div class="q-status">${!ans.answered ? '未答' : (ans.correct ? '正确' : '错误')}</div>
      </div>
    </div>`;
  });
  container.innerHTML = html;
}

function jumpToQuestion(index) {
  state.currentIndex = index;
  showScreen('screen-quiz');
  renderQuestion();
}

// ─── 错题页 ───
function showWrongScreen() {
  showScreen('screen-wrong');
  renderWrongScreen();
}

function renderWrongScreen() {
  const container = document.getElementById('wrong-list');
  if (state.wrongQuestions.length === 0) {
    container.innerHTML = '<p style="color:var(--text2);text-align:center;padding:40px 0;">暂无错题记录🎉<br>继续加油！</p>';
    return;
  }
  let html = '';
  state.wrongQuestions.forEach((q, i) => {
    html += `<div class="question-list-item" onclick="tryWrongQuestion('${q.id}')">
      <div class="q-num done-wrong">${i + 1}</div>
      <div>
        <div class="q-preview">${q.text.substring(0, 60)}${q.text.length > 60 ? '...' : ''}</div>
        <div class="q-status">查看解析</div>
      </div>
    </div>`;
  });
  container.innerHTML = html;
}

function tryWrongQuestion(qId) {
  const q = state.wrongQuestions.find(w => w.id === qId);
  if (!q) return;
  state.currentPaper = 'wrong';
  state.mode = 'wrong';
  state.currentQuestions = [q];
  state.currentIndex = 0;
  state.userAnswers = [{ questionId: q.id, selected: null, correct: false, answered: false }];
  state.startTime = Date.now();
  showScreen('screen-quiz');
  renderQuestion();
  startTimer();
}

// ─── 设置相关 ───
function changeFontSize(size) {
  state.settings.fontSize = parseInt(size);
  document.getElementById('q-text').style.fontSize = size + 'px';
  saveSettings();
}

function toggleNight() {
  state.settings.night = !state.settings.night;
  document.body.classList.toggle('night', state.settings.night);
  saveSettings();
}

function confirmExit() {
  if (confirm('确定要退出练习吗？本次进度将保存。')) {
    if (state.timerInterval) clearInterval(state.timerInterval);
    showScreen('screen-home');
    renderHome();
  }
}

function clearAllRecords() {
  if (!confirm('确定清空所有做题记录和错题？此操作不可恢复。')) return;
  localStorage.removeItem('quiz_stats');
  localStorage.removeItem('quiz_wrong');
  state.stats = {};
  state.wrongQuestions = [];
  renderHome();
}

function checkExamCountdown() {
  const examDate = document.getElementById('setting-examdate').value;
  if (!examDate) return;
  state.settings.examDate = examDate;
  saveSettings();
  const target = new Date(examDate + 'T00:00:00');
  const now = new Date();
  const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  if (diff > 0) {
    document.getElementById('quiz-info') && (document.getElementById('quiz-info').textContent += ` | 距考试还有 ${diff} 天`);
  }
}

// ─── 屏幕切换 ───
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId)?.classList.add('active');
}

// ─── 工具函数 ───
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── 按钮点击事件绑定（动态） ───
document.getElementById('btn-next')?.addEventListener('click', function() {
  const ans = state.userAnswers[state.currentIndex];
  if (!ans.answered) {
    submitAnswer();
  } else {
    nextQuestion();
  }
});

document.getElementById('setting-count')?.addEventListener('change', function() {
  state.settings.count = parseInt(this.value) || 0;
  saveSettings();
});

document.getElementById('setting-auto')?.addEventListener('change', function() {
  state.settings.autoNext = this.checked;
  saveSettings();
});

document.getElementById('setting-save')?.addEventListener('change', function() {
  state.settings.autoSave = this.checked;
  saveSettings();
});

document.getElementById('setting-explain')?.addEventListener('change', function() {
  state.settings.showExplain = this.checked;
  saveSettings();
});

document.getElementById('setting-examdate')?.addEventListener('change', function() {
  state.settings.examDate = this.value;
  saveSettings();
  checkExamCountdown();
});