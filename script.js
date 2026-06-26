/* ==========================================================================
   ESTADO GLOBAL DA PLATAFORMA
   ========================================================================== */
const appState = {
    user: {
        xp: 0,
        level: 1,
        quizzesDone: 0,
        gamesDone: 0,
        medals: [],
        unlockedModules: [0]
    },
    currentTheme: 'dark',
    currentModuleIndex: 0
};

// Variáveis do Jogo de Escopo Dinâmico (Inicializadas com segurança no DOM)
let canvas = null;
let ctx = null;
let gameInterval = null;
let gameActive = false;
let gameScore = 0;
let lives = 3;
let player = { x: 50, y: 180, size: 25, speed: 5 };
let collectibles = [];
let hazards = [];

const keys = { w: false, a: false, s: false, d: false };

// Recuperar progresso local localmente se houver
if(localStorage.getItem('cidadania_digital_state')) {
    try {
        Object.assign(appState.user, JSON.parse(localStorage.getItem('cidadania_digital_state')));
    } catch(e) { console.error(e); }
}

function saveToStorage() {
    localStorage.setItem('cidadania_digital_state', JSON.stringify(appState.user));
    updateProfileUI();
}

/* ==========================================================================
   ORQUESTRADOR DE INICIALIZAÇÃO SEGURA (FAIL-SAFE)
   ========================================================================== */
window.addEventListener('DOMContentLoaded', () => {
    
    // 1. Desliga o Loading de qualquer forma (Prevenção de travamento)
    setTimeout(() => {
        const loader = document.getElementById('loading-screen');
        if(loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 400);
        }
    }, 800);

    // 2. Vincula com segurança os componentes do Canvas do jogo
    canvas = document.getElementById('gameCanvas');
    if(canvas) ctx = canvas.getContext('2d');

    // 3. Executa as sub-inicializações de forma isolada
    try { initRouter(); } catch(e) { console.error(e); }
    try { initTheme(); } catch(e) { console.error(e); }
    try { initStatsAnimator(); } catch(e) { console.error(e); }
    try { renderModulesMenu(); } catch(e) { console.error(e); }
    try { loadModule(0); } catch(e) { console.error(e); }
    try { initQuizEngine(); } catch(e) { console.error(e); }
    try { initSortingGame(); } catch(e) { console.error(e); }
    try { initMemoryGame(); } catch(e) { console.error(e); }
    try { updateProfileUI(); } catch(e) { console.error(e); }
    try { initBackToTop(); } catch(e) { console.error(e); }
    try { initGlobalSearch(); } catch(e) { console.error(e); }
    try { initKeyboardListeners(); } catch(e) { console.error(e); }
});

/* --- ROTEADOR INTERNO (SPA) --- */
function initRouter() {
    const links = document.querySelectorAll('.nav-link, [data-target]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('data-target');
            if(target) switchTab(target);
        });
    });

    const toggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.nav-menu');
    if(toggle && menu) {
        toggle.addEventListener('click', () => menu.classList.toggle('mobile-active'));
    }
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    
    const activeTab = document.getElementById(tabId);
    if(activeTab) activeTab.classList.add('active');
    
    const activeLink = document.querySelector(`.nav-link[data-target="${tabId}"]`);
    if(activeLink) activeLink.classList.add('active');
    
    const menu = document.querySelector('.nav-menu');
    if(menu) menu.classList.remove('mobile-active');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* --- ALTERNAÇÃO DE TEMA --- */
function initTheme() {
    const btn = document.getElementById('theme-toggle');
    if(!btn) return;
    btn.addEventListener('click', () => {
        const html = document.documentElement;
        if(html.getAttribute('data-theme') === 'dark') {
            html.setAttribute('data-theme', 'light');
            btn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        } else {
            html.setAttribute('data-theme', 'dark');
            btn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        }
    });
}

/* --- ANIMAÇÃO DE NÚMEROS DE ESTATÍSTICA --- */
function initStatsAnimator() {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = +stat.getAttribute('data-target');
        let current = 0;
        const increment = target / 50;
        const updateCount = () => {
            if(current < target) {
                current += increment;
                stat.innerText = Math.ceil(current);
                setTimeout(updateCount, 25);
            } else {
                stat.innerText = target;
            }
        };
        updateCount();
    });
}

/* --- SISTEMA DE RECOMPENSAS (XP & NÍVEL) --- */
function gainXP(amount) {
    appState.user.xp += amount;
    let nextLevelXp = appState.user.level * 150;
    if(appState.user.xp >= nextLevelXp) {
        appState.user.level++;
        alert(`🎉 Sensacional! Você evoluiu para o Nível ${appState.user.level}! Seu conhecimento crítico aumentou.`);
    }
    checkMedals();
    saveToStorage();
}

function checkMedals() {
    if(appState.user.xp > 0 && !appState.user.medals.includes('medal-1')) appState.user.medals.push('medal-1');
    if(appState.user.quizzesDone >= 1 && !appState.user.medals.includes('medal-2')) appState.user.medals.push('medal-2');
    if(appState.user.gamesDone >= 1 && !appState.user.medals.includes('medal-3')) appState.user.medals.push('medal-3');
    if(appState.user.level >= 2 && !appState.user.medals.includes('medal-4')) appState.user.medals.push('medal-4');
}

function updateProfileUI() {
    const nLvl = document.getElementById('nav-level');
    if(nLvl) nLvl.innerText = appState.user.level;
    
    if(document.getElementById('profile-level-txt')) {
        document.getElementById('profile-level-txt').innerText = `Nível ${appState.user.level}`;
        document.getElementById('profile-xp').innerText = appState.user.xp;
        document.getElementById('profile-quizzes').innerText = appState.user.quizzesDone;
        document.getElementById('profile-games').innerText = appState.user.gamesDone;
        
        let targetXp = appState.user.level * 150;
        let pct = (appState.user.xp / targetXp) * 100;
        document.getElementById('profile-xp-progress').style.width = `${Math.min(pct, 100)}%`;
    }

    appState.user.medals.forEach(mId => {
        const element = document.getElementById(mId);
        if(element) element.classList.remove('locked');
    });
}

/* ==========================================================================
   CONTEÚDO DOS MÓDULOS EDUCACIONAIS
   ========================================================================== */
const eduModules = [
    {
        title: "1. Inteligência Artificial e Sociedade",
        content: `<h2>O que é Inteligência Artificial e Como Funciona?</h2>
                  <p>A Inteligência Artificial (IA) refere-se a sistemas ou máquinas que simulam a inteligência humana para executar tarefas e podem se aprimorar iterativamente com base nas informações que coletam. Longe de ser apenas robótica de ficção científica, a IA opera processando volumes gigantescos de dados através de redes neurais artificiais.</p>
                  <div class="highlight-box">
                    <strong>Curiosidade Clave:</strong> Algoritmos de Machine Learning analisam padrões em fotos, vozes e textos cotidianos para aprender de forma autônoma.
                  </div>
                  <h3>Algoritmos e as Bolhas Digitais</h3>
                  <p>Nas redes sociais, algoritmos controlam o que você vê para manter sua atenção ativa. Isso cria as chamadas <strong>Bolhas Digitais</strong>, onde o usuário recebe apenas opiniões similares às suas, reduzindo a exposição ao contraditório e impulsionando a polarização extrema e a proliferação rápida de Fake News.</p>`
    },
    {
        title: "2. Deepfakes e Manipulação de Mídia",
        content: `<h2>O Fenômeno das Deepfakes</h2>
                  <p>Deepfakes são vídeos, áudios ou imagens gerados por algoritmos de aprendizado profundo (Deep Learning) que sobrepõem rostos ou sintetizam vozes de forma ultra-realista. Utilizando técnicas conhecidas como GANs (Redes Adversárias Generativas), um computador consegue fazer uma figura pública ou privada dizer ou fazer coisas que nunca aconteceram.</p>
                  <div class="highlight-box">
                    <strong>Como Identificar Vídeos Falsos:</strong> Preste atenção ao piscar dos olhos (frequentemente ausente ou anormal), sombras inconsistentes na face, distorções na borda das orelhas e sincronia labial desalinhada.
                  </div>
                  <h3>O Impacto Avassalador na Política e Sociedade</h3>
                  <p>A desinformação gerada por IA pode desestabilizar eleições inteiras através de declarações fabricadas de candidatos em momentos decisivos. Além disso, causa impactos psicológicos severos e golpes de engenharia social altamente refinados.</p>`
    },
    {
        title: "3. Segurança Digital, Phishing e LGPD",
        content: `<h2>Segurança Avançada e Privacidade</h2>
                  <p>O ambiente moderno exige posturas rígidas de defesa digital. Engenharia social e ataques de <strong>Phishing</strong> utilizam identidades forjadas (e-mails falsos, clonagem de voz por IA) para roubar dados confidenciais dos usuários.</p>
                  <h3>Melhores Práticas de Proteção</h3>
                  <ul>
                    <li><strong>Senhas Fortes:</strong> Uso obrigatório de gerenciadores com caracteres especiais mistos.</li>
                    <li><strong>Autenticação em Duplo Fator (2FA):</strong> Camada secundária crucial que impede o acesso mesmo com a senha exposta.</li>
                    <li><strong>Conhecimento da LGPD:</strong> A Lei Geral de Proteção de Dados garante que você tem direito absoluto de saber como empresas gerenciam e armazenam suas informações coletadas na rede.</li>
                  </ul>`
    }
];

function renderModulesMenu() {
    const list = document.getElementById('module-list');
    if(!list) return;
    list.innerHTML = '';
    eduModules.forEach((mod, idx) => {
        const li = document.createElement('li');
        li.innerText = mod.title;
        li.addEventListener('click', () => loadModule(idx));
        list.appendChild(li);
    });
}

function loadModule(index) {
    appState.currentModuleIndex = index;
    const items = document.querySelectorAll('#module-list li');
    items.forEach((item, idx) => {
        if(idx === index) item.classList.add('active');
        else item.classList.remove('active');
    });
    const viewer = document.getElementById('module-viewer');
    if(viewer) viewer.innerHTML = eduModules[index].content;
}

/* ==========================================================================
   SISTEMA DE QUIZ TÉCNICO
   ========================================================================== */
const quizQuestions = [
    { q: "Qual tecnologia principal é usada para criar deepfakes realistas?", o: ["Redes Adversárias Generativas (GANs)", "Planilhas de cálculo comuns", "Bancos de dados relacionais estáticos", "Conexão Bluetooth local"], a: 0, e: "As GANs colocam duas redes neurais para competir entre si, gerando mídias sintéticas ultra-realistas." },
    { q: "O que caracteriza uma 'bolha digital' nas mídias sociais?", o: ["Uma lentidão generalizada na rede", "Algoritmos exibindo apenas conteúdos alinhados ao que você já concorda", "Um antivírus escolar", "Ambiente totalmente seguro contra golpes"], a: 1, e: "Os algoritmos de engajamento priorizam a retenção do usuário exibindo mídias que reforçam suas próprias crenças." },
    { q: "Qual a melhor postura ao receber um link suspeito prometendo prêmios?", o: ["Compartilhar com amigos para testar", "Clicar imediatamente", "Ignorar e consultar os canais oficiais ou portais de checagem", "Fornecer os dados da LGPD"], a: 2, e: "Cidadãos digitais conscientes desconfiam de ofertas alarmantes e cruzam informações em fontes confiáveis." }
];

let currentQuizIndex = 0;
let quizTimer = null;
let timeLeft = 25;

function initQuizEngine() {
    const btnNext = document.getElementById('btn-next-question');
    if(btnNext) btnNext.addEventListener('click', nextQuizQuestion);
    loadQuizQuestion();
}

function loadQuizQuestion() {
    clearInterval(quizTimer);
    timeLeft = 25;
    
    const tCount = document.getElementById('timer-count');
    if(tCount) tCount.innerText = timeLeft;
    
    quizTimer = setInterval(() => {
        timeLeft--;
        if(tCount) tCount.innerText = timeLeft;
        if(timeLeft <= 0) {
            clearInterval(quizTimer);
            showQuizFeedback(false, "O tempo limite esgotou! Mantenha a atenção digital.");
        }
    }, 1000);

    const qData = quizQuestions[currentQuizIndex];
    const qQuest = document.getElementById('quiz-question');
    if(!qQuest) return;

    qQuest.innerText = qData.q;
    document.getElementById('quiz-difficulty').innerText = currentQuizIndex === 0 ? "Fácil" : currentQuizIndex === 1 ? "Médio" : "Difícil";
    document.getElementById('quiz-progress-text').innerText = `${currentQuizIndex + 1}/${quizQuestions.length}`;
    document.getElementById('quiz-progress-bar').style.width = `${((currentQuizIndex + 1)/quizQuestions.length)*100}%`;

    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';
    
    qData.o.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.classList.add('option-btn');
        btn.innerText = opt;
        btn.addEventListener('click', () => checkQuizAnswer(idx));
        optionsContainer.appendChild(btn);
    });
    
    document.getElementById('quiz-feedback').classList.add('hidden');
    document.getElementById('quiz-playground').classList.remove('hidden');
}

function checkQuizAnswer(selectedIdx) {
    clearInterval(quizTimer);
    const qData = quizQuestions[currentQuizIndex];
    const isCorrect = selectedIdx === qData.a;
    showQuizFeedback(isCorrect, qData.e);
}

function showQuizFeedback(isCorrect, explanation) {
    const feedbackBox = document.getElementById('quiz-feedback');
    const txt = document.getElementById('feedback-text');
    if(!feedbackBox) return;

    feedbackBox.classList.remove('hidden');
    if(isCorrect) {
        txt.innerHTML = `<span style="color:#45f3ff; font-weight:bold;">Correto!</span> ${explanation}`;
        gainXP(30);
    } else {
        txt.innerHTML = `<span style="color:#ff007f; font-weight:bold;">Incorreto.</span> ${explanation}`;
    }
}

function nextQuizQuestion() {
    currentQuizIndex++;
    if(currentQuizIndex < quizQuestions.length) {
        loadQuizQuestion();
    } else {
        document.getElementById('quiz-playground').classList.add('hidden');
        document.getElementById('quiz-feedback').classList.add('hidden');
        document.getElementById('quiz-result-screen').classList.remove('hidden');
        document.getElementById('earned-xp').innerText = quizQuestions.length * 30;
        appState.user.quizzesDone++;
        gainXP(40);
    }
}

function resetQuiz() {
    currentQuizIndex = 0;
    document.getElementById('quiz-result-screen').classList.add('hidden');
    loadQuizQuestion();
}

/* ==========================================================================
   JOGO PRINCIPAL 2D (HTML5 CANVAS)
   ========================================================================== */
function initKeyboardListeners() {
    window.addEventListener('keydown', (e) => {
        if(['w','a','s','d','W','A','S','D'].includes(e.key)) keys[e.key.toLowerCase()] = true;
    });
    window.addEventListener('keyup', (e) => {
        if(['w','a','s','d','W','A','S','D'].includes(e.key)) keys[e.key.toLowerCase()] = false;
    });
}

function startGame2D() {
    const overlay = document.getElementById('game-overlay');
    if(overlay) overlay.style.display = 'none';
    
    gameScore = 0; lives = 3; gameActive = true;
    collectibles = []; hazards = [];
    player.x = 50; player.y = 180;

    document.getElementById('game-score').innerText = gameScore;
    document.getElementById('game-lives').innerText = lives;
    
    clearInterval(gameInterval);
    gameInterval = setInterval(updateGame2D, 1000 / 60);
}

function updateGame2D() {
    if(!gameActive || !canvas) return;

    // Movimentação Segura W, A, S, D
    if(keys.w && player.y > 0) player.y -= player.speed;
    if(keys.s && player.y < canvas.height - player.size) player.y += player.speed;
    if(keys.a && player.x > 0) player.x -= player.speed;
    if(keys.d && player.x < canvas.width - player.size) player.x += player.speed;

    // Gerador de Entidades
    if(Math.random() < 0.02) {
        collectibles.push({ x: canvas.width, y: Math.random() * (canvas.height - 20), size: 15, speed: 3 });
    }
    if(Math.random() < 0.03) {
        hazards.push({ x: canvas.width, y: Math.random() * (canvas.height - 25), size: 22, speed: 4 });
    }

    // Colisão de Itens Verdes (Verdades/Fatos)
    collectibles.forEach((item, idx) => {
        item.x -= item.speed;
        if(checkCollision(player, item)) {
            collectibles.splice(idx, 1);
            gameScore += 10;
            document.getElementById('game-score').innerText = gameScore;
            gainXP(5);
        }
    });

    // Colisão de Obstáculos Vermelhos (Fake News)
    hazards.forEach((haz, idx) => {
        haz.x -= haz.speed;
        if(checkCollision(player, haz)) {
            hazards.splice(idx, 1);
            lives--;
            document.getElementById('game-lives').innerText = lives;
            if(lives <= 0) endGame2D(false);
        }
    });

    collectibles = collectibles.filter(i => i.x > -20);
    hazards = hazards.filter(h => h.x > -20);

    if(gameScore >= 60) endGame2D(true);

    renderGame2D();
}

function checkCollision(r1, r2) {
    return (r1.x < r2.x + r2.size && r1.x + r1.size > r2.x &&
            r1.y < r2.y + r2.size && r1.y + r1.size > r2.y);
}

function renderGame2D() {
    if(!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Personagem (Escudo Digital)
    ctx.fillStyle = '#45f3ff';
    ctx.fillRect(player.x, player.y, player.size, player.size);

    // Dados Confiáveis
    ctx.fillStyle = '#00ffcc';
    collectibles.forEach(item => {
        ctx.beginPath();
        ctx.arc(item.x, item.y, item.size / 2, 0, Math.PI * 2);
        ctx.fill();
    });

    // Desinformação / Perigos
    ctx.fillStyle = '#ff007f';
    hazards.forEach(haz => {
        ctx.fillRect(haz.x, haz.y, haz.size, haz.size);
    });
}

function endGame2D(isVictory) {
    gameActive = false;
    clearInterval(gameInterval);
    const overlay = document.getElementById('game-overlay');
    if(!overlay) return;

    overlay.style.display = 'flex';
    if(isVictory) {
        overlay.innerHTML = `<h3>🏆 Vitória Digital!</h3><p>Você atingiu a pontuação máxima protegendo os dados escolares!</p>
                             <button class="btn btn-primary" onclick="startGame2D()">Jogar Novamente</button>`;
        appState.user.gamesDone++;
        gainXP(60);
    } else {
        overlay.innerHTML = `<h3>💀 Fim de Jogo</h3><p>As deepfakes comprometeram sua navegação crítica.</p>
                             <button class="btn btn-primary" onclick="startGame2D()">Tentar De Novo</button>`;
    }
}

/* ==========================================================================
   MINI-JOGOS ADICIONAIS
   ========================================================