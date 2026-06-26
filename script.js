/* ==========================================================================
   ESTADO GLOBAL DA PLATAFORMA (SISTEMA DE PROGRESSO E XP REAL)
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

// Carregar progresso salvo localmente se houver
if(localStorage.getItem('cidadania_digital_state')) {
    Object.assign(appState.user, JSON.parse(localStorage.getItem('cidadania_digital_state')));
}

function saveToStorage() {
    localStorage.setItem('cidadania_digital_state', JSON.stringify(appState.user));
    updateProfileUI();
}

/* ==========================================================================
   LOADING E INICIALIZAÇÃO CORE
   ========================================================================== */
window.addEventListener('DOMContentLoaded', () => {
    // Esconder tela de carregamento
    setTimeout(() => {
        const loader = document.getElementById('loading-screen');
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
    }, 1200);

    initRouter();
    initTheme();
    initStatsAnimator();
    renderModulesMenu();
    loadModule(0);
    initQuizEngine();
    initSortingGame();
    initMemoryGame();
    updateProfileUI();
    initBackToTop();
});

/* --- ROTEADOR INTERNO (SPA) --- */
function initRouter() {
    const links = document.querySelectorAll('.nav-link, [data-target]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('data-target') || link.getAttribute('onclick')?.match(/'([^']+)'/)[1];
            if(target) switchTab(target);
        });
    });

    const toggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.nav-menu');
    toggle.addEventListener('click', () => menu.classList.toggle('mobile-active'));
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    
    const activeTab = document.getElementById(tabId);
    if(activeTab) activeTab.classList.add('active');
    
    const activeLink = document.querySelector(`.nav-link[data-target="${tabId}"]`);
    if(activeLink) activeLink.classList.add('active');
    
    document.querySelector('.nav-menu').classList.remove('mobile-active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* --- ALTERNAÇÃO DE TEMA (CLARO/ESCURO) --- */
function initTheme() {
    const btn = document.getElementById('theme-toggle');
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

/* --- SISTEMA REATIVO DE RECOMPENSAS (XP, NÍVEL & MEDALHAS) --- */
function gainXP(amount) {
    appState.user.xp += amount;
    let nextLevelXp = appState.user.level * 150;
    if(appState.user.xp >= nextLevelXp) {
        appState.user.level++;
        alert(`🎉 Parabéns! Você subiu para o Nível ${appState.user.level}! Seu escudo digital está mais forte.`);
    }
    checkMedals();
    saveToStorage();
}

function checkMedals() {
    if(appState.user.xp > 0 && !appState.user.medals.includes('medal-1')) appState.user.medals.push('medal-1');
    if(appState.user.quizzesDone >= 3 && !appState.user.medals.includes('medal-2')) appState.user.medals.push('medal-2');
    if(appState.user.gamesDone >= 1 && !appState.user.medals.includes('medal-3')) appState.user.medals.push('medal-3');
    if(appState.user.level >= 3 && !appState.user.medals.includes('medal-4')) appState.user.medals.push('medal-4');
}

function updateProfileUI() {
    document.getElementById('nav-level').innerText = appState.user.level;
    document.getElementById('profile-level-txt').innerText = `Nível ${appState.user.level}`;
    document.getElementById('profile-xp').innerText = appState.user.xp;
    document.getElementById('profile-quizzes').innerText = appState.user.quizzesDone;
    document.getElementById('profile-games').innerText = appState.user.gamesDone;
    
    let targetXp = appState.user.level * 150;
    let pct = (appState.user.xp / targetXp) * 100;
    document.getElementById('profile-xp-progress').style.width = `${Math.min(pct, 100)}%`;

    appState.user.medals.forEach(mId => {
        const element = document.getElementById(mId);
        if(element) element.classList.remove('locked');
    });
}

/* ==========================================================================
   MÓDULOS EDUCACIONAIS (CONTEÚDO EXTENSO E DIDÁTICO)
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
    document.getElementById('module-viewer').innerHTML = eduModules[index].content;
    gainXP(15);
}

/* ==========================================================================
   SISTEMA DE QUIZ TÉCNICO E DE PENSAMENTO CRÍTICO
   ========================================================================== */
const quizQuestions = [
    { q: "Qual tecnologia principal é usada para criar deepfakes realistas?", o: ["Redes Adversárias Generativas (GANs)", "Planilhas de Excel", "Bancos de dados relacionais simples", "Bluetooth avançado"], a: 0, e: "As GANs colocam duas redes neurais para competir, gerando simulações hiper-realistas de mídia." },
    { q: "O que caracteriza uma 'bolha digital' nas mídias sociais?", o: ["Uma falha que desconecta a internet", "Algoritmos mostrando apenas o que você concorda", "Vírus que sequestra fotos de perfil", "Ambiente seguro livre de robôs"], a: 1, e: "Algoritmos priorizam o engajamento, exibindo conteúdos similares aos seus gostos anteriores, isolando você em bolhas ideológicas." },
    { q: "Qual a melhor forma de validar uma notícia suspeita recebida em apps?", o: ["Acreditar se foi enviada por parentes próximos", "Verificar se está em grandes portais de checagem", "Apenas ler o título e compartilhar imediatamente", "Ignorar as leis e assumir que tudo é real"], a: 2, e: "Agências especializadas de checagem validam fatos de forma independente cruzando fontes oficiais." }
];

let currentQuizIndex = 0;
let quizTimer;
let timeLeft = 25;

function initQuizEngine() {
    loadQuizQuestion();
    document.getElementById('btn-next-question').addEventListener('click', nextQuizQuestion);
}

function loadQuizQuestion() {
    clearInterval(quizTimer);
    timeLeft = 25;
    document.getElementById('timer-count').innerText = timeLeft;
    
    // Iniciar cronômetro do quiz
    quizTimer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer-count').innerText = timeLeft;
        if(timeLeft <= 0) {
            clearInterval(quizTimer);
            showQuizFeedback(false, "O tempo esgotou! Fique atento ao cronômetro digital.");
        }
    }, 1000);

    const qData = quizQuestions[currentQuizIndex];
    document.getElementById('quiz-question').innerText = qData.q;
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
        // Fim do quiz
        document.getElementById('quiz-playground').classList.add('hidden');
        document.getElementById('quiz-feedback').classList.add('hidden');
        document.getElementById('quiz-result-screen').classList.remove('hidden');
        document.getElementById('earned-xp').innerText = quizQuestions.length * 30;
        appState.user.quizzesDone++;
        gainXP(50);
    }
}

function resetQuiz() {
    currentQuizIndex = 0;
    document.getElementById('quiz-result-screen').classList.add('hidden');
    loadQuizQuestion();
}

/* ==========================================================================
   JOGO PRINCIPAL ENGENHARIA 2D (HTML5 CANVAS)
   ========================================================================== */
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let gameInterval;
let gameActive = false;

const player = { x: 50, y: 180, size: 25, speed: 5 };
let collectibles = [];
let hazards = [];
let gameScore = 0;
let lives = 3;

// Monitoramento do Teclado WASD
const keys = { w: false, a: false, s: false, d: false };
window.addEventListener('keydown', (e) => {
    if(['w','a','s','d','W','A','S','D'].includes(e.key)) keys[e.key.toLowerCase()] = true;
});
window.addEventListener('keyup', (e) => {
    if(['w','a','s','d','W','A','S','D'].includes(e.key)) keys[e.key.toLowerCase()] = false;
});

function startGame2D() {
    document.getElementById('game-overlay').style.display = 'none';
    gameScore = 0; lives = 3; gameActive = true;
    collectibles = []; hazards = [];
    document.getElementById('game-score').innerText = gameScore;
    document.getElementById('game-lives').innerText = lives;
    
    clearInterval(gameInterval);
    gameInterval = setInterval(updateGame2D, 1000 / 60); // 60 FPS
}

function updateGame2D() {
    if(!gameActive) return;

    // Movimentação Segura do Jogador (Teclas W, A, S, D)
    if(keys.w && player.y > 0) player.y -= player.speed;
    if(keys.s && player.y < canvas.height - player.size) player.y += player.speed;
    if(keys.a && player.x > 0) player.x -= player.speed;
    if(keys.d && player.x < canvas.width - player.size) player.x += player.speed;

    // Lógica Dinâmica de Criação de Entidades
    if(Math.random() < 0.03) {
        collectibles.push({ x: canvas.width, y: Math.random() * (canvas.height - 20), size: 15, speed: 3 });
    }
    if(Math.random() < 0.04) {
        hazards.push({ x: canvas.width, y: Math.random() * (canvas.height - 25), size: 22, speed: 4 });
    }

    // Processamento de Colecionáveis (Verdades / Fatos)
    collectibles.forEach((item, idx) => {
        item.x -= item.speed;
        if(checkCollision(player, item)) {
            collectibles.splice(idx, 1);
            gameScore += 10;
            document.getElementById('game-score').innerText = gameScore;
            gainXP(5);
        }
    });

    // Processamento de Obstáculos perigosos (Deepfakes / Fake news)
    hazards.forEach((haz, idx) => {
        haz.x -= haz.speed;
        if(checkCollision(player, haz)) {
            hazards.splice(idx, 1);
            lives--;
            document.getElementById('game-lives').innerText = lives;
            if(lives <= 0) endGame2D(false);
        }
    });

    // Filtro de telas de limpeza automática fora de borda
    collectibles = collectibles.filter(i => i.x > -20);
    hazards = hazards.filter(h => h.x > -20);

    // Condição de vitória por pontos na fase
    if(gameScore >= 100) {
        endGame2D(true);
    }

    renderGame2D();
}

function checkCollision(r1, r2) {
    return (r1.x < r2.x + r2.size && r1.x + r1.size > r2.x &&
            r1.y < r2.y + r2.size && r1.y + r1.size > r2.y);
}

function renderGame2D() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenho do Jogador (Escudo de Cidadania)
    ctx.fillStyle = '#45f3ff';
    ctx.fillRect(player.x, player.y, player.size, player.size);
    ctx.shadowBlur = 10; ctx.shadowColor = '#45f3ff';

    // Desenho de Colecionáveis (Fato / Dados Seguros)
    ctx.fillStyle = '#00ffcc';
    ctx.shadowColor = '#00ffcc';
    collectibles.forEach(item => {
        ctx.beginPath();
        ctx.arc(item.x, item.y, item.size / 2, 0, Math.PI * 2);
        ctx.fill();
    });

    // Desenho de Ameaças Digitais (Deepfakes)
    ctx.fillStyle = '#ff007f';
    ctx.shadowColor = '#ff007f';
    hazards.forEach(haz => {
        ctx.fillRect(haz.x, haz.y, haz.size, haz.size);
    });
    ctx.shadowBlur = 0; // Reset
}

function endGame2D(isVictory) {
    gameActive = false;
    clearInterval(gameInterval);
    const overlay = document.getElementById('game-overlay');
    overlay.style.display = 'flex';
    
    if(isVictory) {
        overlay.innerHTML = `<h3>🏆 Vitória!</h3><p>Você protegeu a comunidade escolar de dados falsos e atingiu 100 pontos!</p>
                             <button class="btn btn-primary" onclick="startGame2D()">Jogar De Novo</button>`;
        appState.user.gamesDone++;
        gainXP(100);
    } else {
        overlay.innerHTML = `<h3>💀 Fim de Jogo</h3><p>As deepfakes comprometeram sua navegação segura.</p>
                             <button class="btn btn-primary" onclick="startGame2D()">Tentar Novamente</button>`;
    }
}

/* ==========================================================================
   INTERATIVIDADE EXTRA: GESTÃO DE MINI-JOGOS
   ========================================================================== */
document.querySelectorAll('.games-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.games-tabs .tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.game-window').forEach(w => w.classList.remove('active'));
        
        btn.classList.add('active');
        const mode = btn.getAttribute('data-game');
        if(mode === 'arcade') document.getElementById('game-arcade-wrapper').classList.add('active');
        if(mode === 'sorting') document.getElementById('game-sorting-wrapper').classList.add('active');
        if(mode === 'memory') document.getElementById('game-memory-wrapper').classList.add('active');
    });
});

/* --- JOGO 2: DRAG AND DROP (CLASSIFICAR CONTEÚDOS) --- */
const sortingItems = [
    