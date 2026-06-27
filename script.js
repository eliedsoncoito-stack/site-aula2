/* =========================================================
   CidadaniAI — Script Principal
   Navegação, Acessibilidade, Animações e Busca Interna
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Ano Automático no Footer ----------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Menu Mobile (Sanduíche) ----------
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  navToggle?.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
  });
  
  // Fecha o menu móvel automaticamente ao clicar em um link
  mainNav?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  // ---------- Indicador de Scroll + Botão de Voltar ao Topo ----------
  const progress = document.getElementById('scrollProgress');
  const toTop = document.getElementById('toTop');
  window.addEventListener('scroll', () => {
    const doc = document.documentElement;
    const pct = (doc.scrollTop / (doc.scrollHeight - doc.clientHeight)) * 100;
    if (progress) progress.style.width = pct + '%';
    if (toTop) toTop.classList.toggle('show', doc.scrollTop > 500);
  }, { passive: true });
  
  toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ---------- Gerenciamento de Temas (Alto Contraste / Modos) ----------
  const contrastBtn = document.getElementById('contrast-toggle');
  let currentMode = localStorage.getItem('siteMode') || 'dark'; // Padrão original escuro
  
  function applyMode(mode) {
    document.body.classList.remove('light', 'contrast');
    if (mode === 'light') document.body.classList.add('light');
    if (mode === 'contrast') document.body.classList.add('contrast');
    localStorage.setItem('siteMode', mode);
  }
  applyMode(currentMode);

  contrastBtn?.addEventListener('click', () => {
    if (document.body.classList.contains('light')) {
      applyMode('contrast');
    } else if (document.body.classList.contains('contrast')) {
      applyMode('dark');
    } else {
      applyMode('light');
    }
  });

  // ---------- Dimensionamento de Fontes (Acessibilidade) ----------
  let fontScale = parseFloat(localStorage.getItem('fontScale') || '1');
  function applyFont() {
    document.documentElement.style.fontSize = (16 * fontScale) + 'px';
    localStorage.setItem('fontScale', fontScale);
  }
  applyFont();

  document.getElementById('font-inc').onclick = () => { fontScale = Math.min(1.4, fontScale + 0.1); applyFont(); };
  document.getElementById('font-dec').onclick = () => { fontScale = Math.max(0.8, fontScale - 0.1); applyFont(); };
  document.getElementById('font-reset').onclick = () => { fontScale = 1; applyFont(); };

  // ---------- Sistema de Busca Interna Direta ----------
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const sections = [...document.querySelectorAll('section[id]')].map(s => ({
    id: s.id,
    title: s.querySelector('h2, h3')?.innerText || s.id,
    text: s.innerText.toLowerCase()
  }));

  searchInput?.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) { 
      searchResults.hidden = true; 
      searchResults.innerHTML = ''; 
      return; 
    }
    const found = sections.filter(s => s.text.includes(q)).slice(0, 6);
    if (found.length) {
      searchResults.hidden = false;
      searchResults.innerHTML = found.map(s => `<a href="#${s.id}">${s.title}</a>`).join('');
    } else {
      searchResults.hidden = false;
      searchResults.innerHTML = `<div style="padding:.5rem .7rem;color:var(--muted);font-size:.85rem">Nenhum resultado encontrado</div>`;
    }
  });

  // Ocultar resultados ao clicar fora da busca
  document.addEventListener('click', (e) => {
    if (!searchInput?.contains(e.target) && !searchResults?.contains(e.target)) {
      if (searchResults) searchResults.hidden = true;
    }
  });
});
/* =========================================================
   Quiz — 20 Perguntas sobre IA, Deepfakes e Cidadania Digital
   ========================================================= */
(function(){
  const QUESTIONS = [
    { q:"O que significa a sigla IA?", o:["Inteligência Artificial","Internet Avançada","Indústria Automatizada","Informação Ampliada"], a:0 },
    { q:"Em que década surgiu originalmente o termo 'Inteligência Artificial'?", o:["Anos 1940","Anos 1956 (Década de 50)","Anos 1970","Anos 1990"], a:1 },
    { q:"O que define essencialmente o Aprendizado de Máquina (Machine Learning)?", o:["Robôs construídos de metal físico","Sistemas que aprendem padrões a partir de dados","Programação manual linha por linha","Apenas hardware avançado de vídeo"], a:1 },
    { q:"Qual arquitetura de IA baseia a criação de deepfakes realistas?", o:["GANs (Redes Adversariais Gerativas)","Estruturas simples em HTML","Bancos de dados estruturados em SQL","Protocolos de rede Bluetooth"], a:0 },
    { q:"As Deepfakes são essencialmente:", o:["Vírus de computador destrutivos","Conteúdos em áudio/vídeo manipulados por IA","Páginas falsas de e-commerce","Jogos eletrônicos educativos"], a:1 },
    { q:"O termo correto para notícias intencionalmente falsificadas criadas para induzir ao erro é:", o:["Memes satíricos","Desinformação (Fake News)","Opinião editorial","Fatos alternativos"], a:1 },
    { q:"A desinformação difere da mera desatenção (misinformação) por:", o:["Possuir intenção deliberada de enganar e prejudicar","Ser sempre muito curta","Aparecer somente em mídias impressas","Ser gerada por órgãos oficiais públicos"], a:0 },
    { q:"No Brasil, a lei que protege o controle de dados pessoais dos usuários é a:", o:["Lei das Estradas Federais","LGPD (Lei Geral de Proteção de Dados)","Lei Geral das Empresas Estatais","Lei Eleitoral Vigente"], a:1 },
    { q:"Qual das seguintes ações configura uma excelente prática de segurança digital?", o:["Compartilhar links urgentes sem checar","Utilizar senhas fortes, exclusivas e MFA","Clicar em qualquer anexo promocional","Reutilizar a mesma credencial em todos os apps"], a:1 },
    { q:"Se um vídeo de figura pública exibe falhas labiais e piscadas raras, suspeita-se de:", o:["Problema de conexão lentidão","Manipulação via Deepfake","Gravação em alta definição cinematográfica","Falta de iluminação de estúdio"], a:1 },
    { q:"Qual das seguintes agências brasileiras é especializada em checar fatos?", o:["Agência Lupa","Anatel","Banco Central","Correios Federais"], a:0 },
    { q:"O Marco Civil da Internet atua primordialmente:", o:["Regulando a venda de computadores físicos","Estabelecendo direitos, deveres e princípios da rede no Brasil","Monitorando mensagens privadas de todos os cidadãos","Proibindo o uso de redes sociais por menores"], a:1 },
    { q:"A inteligência artificial generativa cria textos e mídias baseando-se em:", o:["Mágica randômica pura","Probabilidades computadas de conjuntos de dados massivos","Sentimentos conscientes da própria máquina","Ideias originais sem dados prévios"], a:1 },
    { q:"Compartilhar deepfakes íntimas sem consentimento configura:", o:["Apenas uma brincadeira de internet legal","Crime digital grave punível por lei","Exercício de liberdade artística irrestrita","Uso aceitável da tecnologia pública"], a:1 },
    { q:"Qual o melhor comportamento ao receber uma notícia alarmante e urgente?", o:["Repassar imediatamente a todos os contatos","Reter e verificar a veracidade em fontes seguras","Deletar o aplicativo de mensagens na hora","Acreditar totalmente se veio de parentes próximos"], a:1 },
    { q:"O que caracteriza os ataques de 'Phishing'?", o:["Instalação física de hardware roubado","Mensagens fraudulentas para roubar senhas e dados confidenciais","Aceleração forçada do processador da máquina","Criação de animações 3D de alta qualidade"], a:1 },
    { q:"Para que serve o recurso de Autenticação em Dois Fatores (MFA)?", o:["Deixar o login duas vezes mais rápido","Adicionar uma camada extra crucial de proteção além da senha","Permitir que dois usuários acessem a mesma conta simultaneamente","Limpar dados repetidos no celular"], a:1 },
    { q:"O que representa o termo 'Viés Algorítmico' em Inteligência Artificial?", o:["Um erro eletrônico insolúvel de hardware","Preconceitos humanos reproduzidos pela IA baseados em dados históricos tendenciosos","A velocidade máxima de processamento da rede","A paleta de cores padrão das telas"], a:1 },
    { q:"A raspagem maliciosa de dados (Data Scraping) sem autorização fere diretamente qual marco legal?", o:["O Código de Trânsito Brasileiro","A LGPD","A Lei de Responsabilidade Fiscal","O Estatuto do Torcedor"], a:1 },
    { q:"Como cidadãos digitais conscientes, nosso principal papel na rede é:", o:["Propagar boatos de engajamento rápido","Promover interações éticas, seguras e bem informadas","Ignorar qualquer regra de convívio social","Utilizar softwares sem licença legal"], a:1 }
  ];

  let idx = 0, score = 0, answered = false;
  const body = document.getElementById('quizBody');
  const progEl = document.getElementById('quizProgress');
  const scoreEl = document.getElementById('quizScore');
  const bar = document.getElementById('quizBar');

  if (!body) return;

  function render(){
    if (idx >= QUESTIONS.length) return finish();
    answered = false;
    const q = QUESTIONS[idx];
    
    // Atualizar UI de progresso
    progEl.textContent = `Pergunta ${idx + 1} / ${QUESTIONS.length}`;
    scoreEl.textContent = `Pontos: ${score}`;
    bar.style.width = ((idx + 1) / QUESTIONS.length * 100) + '%';

    body.innerHTML = `
      <div class="q-title">${q.q}</div>
      <div class="q-opts">
        ${q.o.map((opt, i) => `<button class="btn" data-i="${i}">${opt}</button>`).join('')}
      </div>
      <div class="q-feedback" id="qFb"></div>
    `;

    body.querySelectorAll('.q-opts button').forEach(btn => {
      btn.onclick = () => answer(+btn.dataset.i, btn);
    });
  }

  function answer(i, btn){
    if (answered) return;
    answered = true;
    const q = QUESTIONS[idx];
    const fb = document.getElementById('qFb');
    const buttons = body.querySelectorAll('.q-opts button');

    buttons.forEach((b, j) => {
      if (j === q.a) b.classList.add('correct');
      if (j === i && i !== q.a) b.classList.add('wrong');
      b.disabled = true;
    });

    if (i === q.a) { 
      score++; 
      fb.innerHTML = "<span style='color:#10b981; font-weight:bold;'>✅ Resposta correta!</span>"; 
    } else { 
      fb.innerHTML = `<span style='color:#ef4444; font-weight:bold;'>❌ Errou.</span> Resposta: <em>${q.o[q.a]}</em>`; 
    }
    
    scoreEl.textContent = `Pontos: ${score}`;
    setTimeout(() => { idx++; render(); }, 1800);
  }

  function finish(){
    bar.style.width = '100%';
    const pct = Math.round(score / QUESTIONS.length * 100);
    let msg = 'Continue estudando! As tecnologias mudam rápido e precisamos nos manter atentos. 📚';
    if (pct >= 80) msg = 'Excelente! Você demonstra ser um cidadão digital exemplar e muito bem informado! 🏆';
    else if (pct >= 60) msg = 'Muito bom! Você possui ótima base crítica e sabe rastrear riscos digitais. 💪';
    else if (pct >= 40) msg = 'Bom começo, mas vale a pena revisar conceitos para não cair em armadilhas digitais. 🚀';

    body.innerHTML = `
      <div class="quiz-result">
        <h3>Quiz Concluído!</h3>
        <div class="score">${score} / ${QUESTIONS.length}</div>
        <p style="margin:1rem 0; color:var(--muted)">Aproveitamento geral: <strong>${pct}%</strong></p>
        <p style="max-width:500px; margin:0 auto; line-height:1.5;">${msg}</p>
        <button class="btn btn-primary" style="margin-top:1.5rem" onclick="window.location.reload()">Refazer Quiz</button>
      </div>
    `;
  }

  render();
})();
/* =========================================================
   Caça às Deepfakes — Minijogo de Análise Situacional
   ========================================================= */
(function(){
  const root = document.getElementById('huntApp');
  if (!root) return;

  const CASES = [
    { desc:"Vídeo de um líder político declarando uma frase absurda e altamente polêmica. Reparando bem, a sincronia dos lábios falha e as piscadas são raras.", real:false, tip:"Sincronia labial imperfeita e ausência de piscadas naturais são indícios clássicos de Deepfakes de vídeo." },
    { desc:"Fotografia oficial de um novo plano público postada diretamente no site do governo federal, com metadados e assinaturas criptográficas verificáveis.", real:true, tip:"Canais governamentais oficiais protegidos por domínio (.gov.br) com chaves públicas e metadados válidos trazem credibilidade institucional." },
    { desc:"Áudio enviado via aplicativo de mensagens de uma celebridade famosa promovendo uma plataforma de criptomoedas com rendimento de 500% ao dia.", real:false, tip:"Promessas absurdas de lucros imediatos unidas a clonagem de voz por inteligência artificial configuram golpes financeiros comuns atuais." },
    { desc:"Reportagem de denúncia publicada simultaneamente em três veículos jornalísticos tradicionais de ampla circulação, citando documentos primários públicos.", real:true, tip:"A convergência jornalística profissional de fontes checadas de forma independente reduz drasticamente a chance de erro ou fraude." },
    { desc:"Imagem gerada circulando na web mostrando um suposto evento internacional histórico, porém as pessoas de fundo possuem mãos com 6 dedos e a iluminação geral é inconsistente.", real:false, tip:"Geradores de imagens de IA costumam falhar em anatomia fina (mãos, dentes, orelhas) e reflexos físicos de iluminação coerentes." },
    { desc:"Gravação rápida de vídeo capturada por uma testemunha comum no local exato de um incidente urbano, com horário, data e pontos geográficos confirmados por moradores.", real:true, tip:"O contexto de validação social local e coerência espaço-temporal imediata reforçam a autenticidade primária do fato." },
    { desc:"Rosto de uma estudante colado digitalmente sobre o corpo de uma modelo em um vídeo adulto circulando sem qualquer autorização prévia da mesma.", real:false, tip:"Deepfakes íntimas sem consentimento são crimes cibernéticos graves. Denuncie em delegacias especializadas imediatamente." },
    { desc:"Comunicado formal assinado digitalmente por uma grande empresa em seu domínio oficial informando atualizações técnicas de segurança.", real:true, tip:"Assinaturas digitais válidas vinculadas a domínios de internet de propriedade confirmada asseguram integridade e autoria da mensagem." }
  ];

  let i = 0, score = 0;

  function render(){
    if (i >= CASES.length) return finish();
    const c = CASES[i];
    root.innerHTML = `
      <div class="hunt-meta"><span>Caso ${i+1} / ${CASES.length}</span><span>Pontos: ${score}</span></div>
      <div class="hunt-img"><span>🖼️ ${c.desc}</span></div>
      <div class="hunt-actions">
        <button class="btn btn-primary" data-r="1">✅ Verdadeiro</button>
        <button class="btn btn-ghost" data-r="0">🎭 Deepfake</button>
      </div>
      <div class="hunt-feedback" id="huntFb"></div>
    `;
    
    root.querySelectorAll('button[data-r]').forEach(b => {
      b.onclick = () => choose(b.dataset.r === '1');
    });
  }

  function choose(guess){
    const c = CASES[i];
    const fb = document.getElementById('huntFb');
    const correct = (guess === c.real);
    if (correct) score++;
    
    fb.innerHTML = `${correct ? "<span style='color:#10b981;font-weight:bold'>✅ Acertou!</span>" : "<span style='color:#ef4444;font-weight:bold'>❌ Errou.</span>"} <br><small>${c.tip}</small>`;
    
    root.querySelectorAll('button[data-r]').forEach(b => b.disabled = true);
    setTimeout(() => { i++; render(); }, 2200);
  }

  function finish(){
    root.innerHTML = `
      <div class="quiz-result">
        <h4>Análise Concluída!</h4>
        <div class="score">${score}/${CASES.length}</div>
        <p style="font-size:0.9rem;color:var(--muted)">Treinar os olhos contra as falsificações é o primeiro passo da proteção online.</p>
        <button class="btn btn-ghost btn-sm" style="margin-top:1rem" onclick="window.location.reload()">Resetar Casos</button>
      </div>
    `;
  }

  render();
})();
/* =========================================================
   Caçador de Notícias — Jogo Interativo Baseado em Canvas (WASD)
   Coletar ✅ (Verdadeiras) | Evitar 🎭 (Deepfake) e ❌ (Fake News)
   ========================================================= */
(function(){
  const canvas = document.getElementById('wasdGame');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  const overlay = document.getElementById('gameOverlay');
  const oTitle = document.getElementById('overlayTitle');
  const oText = document.getElementById('overlayText');
  const startBtn = document.getElementById('gameStart');
  const hudScore = document.getElementById('hudScore');
  const hudLives = document.getElementById('hudLives');
  const hudTime = document.getElementById('hudTime');

  const W = canvas.width, H = canvas.height;
  const player = { x: W/2, y: H/2, r: 18, speed: 5 };
  const keys = {};
  let items = [];
  let score = 0, lives = 3, time = 60, running = false, last = 0, spawnT = 0, timerT = 0;
  const TARGET = 20;

  // Gerador de Som Sintético (Web Audio API) livre de dependências externas
  const AC = window.AudioContext || window.webkitAudioContext;
  let audio = null;
  function beep(freq=440, dur=0.1, type='sine', vol=0.1){
    try {
      if (!audio) audio = new AC();
      const o = audio.createOscillator(), g = audio.createGain();
      o.type = type; o.frequency.value = freq;
      g.gain.setValueAtTime(vol, audio.currentTime);
      g.gain.exponentialRampToValueAtTime(0.00001, audio.currentTime + dur);
      o.connect(g); g.connect(audio.destination);
      o.start(); o.stop(audio.currentTime + dur);
    } catch(e){}
  }

  window.addEventListener('keydown', e => { keys[e.key.toLowerCase()] = true; });
  window.addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });

  startBtn.onclick = () => {
    overlay.style.display = 'none';
    score = 0; lives = 3; time = 60; items = [];
    player.x = W/2; player.y = H/2;
    running = true; last = performance.now();
    spawnT = 0; timerT = 0;
    beep(523.25, 0.15, 'square'); // Som de início
    requestAnimationFrame(loop);
  };

  function spawn() {
    const types = [
      { text: '✅', good: true },
      { text: '❌', good: false },
      { text: '🎭', good: false }
    ];
    const t = types[Math.floor(Math.random() * types.length)];
    items.push({
      x: Math.random() * (W - 40) + 20,
      y: Math.random() * (H - 40) + 20,
      text: t.text,
      good: t.good,
      r: 14,
      life: 5000 // dura 5 segundos na tela
    });
  }

  function loop(now) {
    if (!running) return;
    const dt = now - last; last = now;

    // Movimentação do Jogador
    if (keys['w'] || keys['arrowup']) player.y = Math.max(player.r, player.y - player.speed);
    if (keys['s'] || keys['arrowdown']) player.y = Math.min(H - player.r, player.y + player.speed);
    if (keys['a'] || keys['arrowleft']) player.x = Math.max(player.r, player.x - player.speed);
    if (keys['d'] || keys['arrowright']) player.x = Math.min(W - player.r, player.x + player.speed);

    // Spawns temporizados
    spawnT += dt;
    if (spawnT > 1000) { spawn(); spawnT = 0; }

    // Cronômetro regressivo
    timerT += dt;
    if (timerT > 1000) { time--; timerT = 0; }

    if (time <= 0 || lives <= 0) { endGame(false); return; }

    // Atualização de elementos em tela
    for (let i = items.length - 1; i >= 0; i--) {
      const it = items[i];
      it.life -= dt;
      if (it.life <= 0) { items.splice(i, 1); continue; }

      // Verificação matemática de colisão circular
      const dist = Math.hypot(player.x - it.x, player.y - it.y);
      if (dist < player.r + it.r) {
        if (it.good) {
          score++; beep(659.25, 0.1, 'sine', 0.15); // Sucesso
          if (score >= TARGET) { endGame(true); return; }
        } else {
          lives--; beep(196, 0.25, 'sawtooth', 0.2); // Dano
        }
        items.splice(i, 1);
      }
    }

    draw();
    hudScore.textContent = `Pontos: ${score}/${TARGET}`;
    hudLives.textContent = '❤️'.repeat(Math.max(0, lives)) || '💀';
    hudTime.textContent = `⏱ ${time}s`;
    requestAnimationFrame(loop);
  }

  function draw() {
    ctx.fillStyle = '#0a0a14'; ctx.fillRect(0, 0, W, H);
    
    // Grid tecnológico de fundo
    ctx.strokeStyle = 'rgba(99,102,241,0.06)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // Renderização dos Itens (Emojis Noticiosos)
    ctx.font = '20px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    items.forEach(it => {
      ctx.fillStyle = 'rgba(255,255,255,'+(it.life > 1000 ? 1 : it.life/1000)+')';
      ctx.fillText(it.text, it.x, it.y);
    });

    // Renderização Estilizada do Jogador
    const grad = ctx.createRadialGradient(player.x, player.y, 2, player.x, player.y, player.r * 1.5);
    grad.addColorStop(0, '#a78bfa'); grad.addColorStop(1, '#3b82f6');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2); ctx.fill();
    ctx.font = '16px Arial'; ctx.fillStyle = '#fff';
    ctx.fillText('🧑', player.x, player.y);
  }

  function endGame(win) {
    running = false;
    overlay.style.display = 'flex';
    if (win) {
      oTitle.innerHTML = "🏆 Vitória!";
      oText.textContent = `Incrível! Você coletou todas as ${TARGET} notícias reais sem cair nas armadilhas de desinformação!`;
      beep(880, 0.4, 'sine');
    } else {
      oTitle.innerHTML = "💀 Game Over";
      oText.textContent = lives <= 0 ? "As fake news superaram sua defesa cibernética!" : "O tempo expirou antes que coletasse dados reais suficientes!";
      beep(110, 0.5, 'triangle');
    }
  }
})();
/* =========================================================
   Jogo da Memória — Pareamento de Conceitos e Emojis de IA
   ========================================================= */
(function(){
  const board = document.getElementById('memoryBoard');
  const movesEl = document.getElementById('memMoves');
  const resetBtn = document.getElementById('memReset');
  if (!board) return;

  // Símbolos representando: Robô, Cérebro, Rede Neural, Dados, Cadeado, Leis, Máscara (Fake), Lâmpada (Ideia)
  const PAIRS = ['🤖', '🧠', '🕸️', '📊', '🔒', '⚖️', '🎭', '💡'];
  let flipped = [], matched = 0, moves = 0, lock = false;

  // Algoritmo Fisher-Yates para embaralhamento profissional
  function shuffle(a) { 
    for(let i = a.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    } 
    return a; 
  }

  function build(){
    const deck = shuffle([...PAIRS, ...PAIRS]);
    matched = 0; moves = 0; flipped = []; lock = false;
    if (movesEl) movesEl.textContent = 'Jogadas: 0';
    
    board.innerHTML = deck.map((face, idx) =>
      `<div class="mem-card" data-face="${face}" data-i="${idx}"><span class="face">${face}</span></div>`
    ).join('');
    
    board.querySelectorAll('.mem-card').forEach(c => c.addEventListener('click', () => flip(c)));
  }

  function flip(card){
    if (lock || card.classList.contains('flipped') || card.classList.contains('matched')) return;
    
    card.classList.add('flipped');
    flipped.push(card);
    
    if (flipped.length === 2) {
      moves++;
      if (movesEl) movesEl.textContent = `Jogadas: ${moves}`;
      lock = true;
      
      const [a, b] = flipped;
      if (a.dataset.face === b.dataset.face) {
        a.classList.add('matched'); 
        b.classList.add('matched');
        matched += 2; 
        flipped = []; 
        lock = false;
        
        if (matched === PAIRS.length * 2) {
          setTimeout(() => alert(`Excelente! Você concluiu a memória em ${moves} jogadas! 🧠`), 400);
        }
      } else {
        // Se errar, as cartas viram de volta após 1 segundo
        setTimeout(() => {
          a.classList.remove('flipped');
          b.classList.remove('flipped');
          flipped = [];
          lock = false;
        }, 1000);
      }
    }
  }

  resetBtn.onclick = build;
  build();
})();
