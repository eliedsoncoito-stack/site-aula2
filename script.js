// cidigi/js/script.js
let currentQuestionIndex = 0;
let score = 0;

const questions = [
    {
        q: "O que é uma Deepfake?",
        options: ["Vídeo manipulado por IA", "Notícia antiga", "Foto comum", "E-mail marketing"],
        correct: 0
    },
    {
        q: "Qual lei brasileira protege dados pessoais?",
        options: ["Marco Civil", "LGPD", "Lei de Copyright", "Lei Eleitoral"],
        correct: 1
    }
];

function navigateTo(section) {
    document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
    const target = document.getElementById(section);
    if (target) target.classList.remove('hidden');
    window.scrollTo(0, 0);
}

function toggleTheme() {
    alert("Plataforma já está em modo escuro.");
}

function loadModules() {
    const grid = document.getElementById('modules-grid');
    const mods = [
        {icon: "🤖", title: "Inteligência Artificial", desc: "Conceitos básicos e funcionamento"},
        {icon: "🎥", title: "Deepfakes", desc: "Como identificar e combater"},
        {icon: "📰", title: "Desinformação", desc: "Fake news e algoritmos"},
        {icon: "🔒", title: "Segurança Digital", desc: "Privacidade e LGPD"}
    ];
    
    grid.innerHTML = mods.map(m => `
        <div class="module-card" onclick="alert('Módulo aberto: ${m.title}')">
            <div style="font-size: 3rem; margin-bottom: 1rem;">${m.icon}</div>
            <h3>${m.title}</h3>
            <p>${m.desc}</p>
        </div>
    `).join('');
}

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('quiz-start').classList.add('hidden');
    document.getElementById('quiz-content').classList.remove('hidden');
    loadQuestion();
}

function loadQuestion() {
    const q = questions[currentQuestionIndex];
    document.getElementById('question-text').textContent = q.q;
    
    const optsDiv = document.getElementById('options');
    optsDiv.innerHTML = '';
    
    q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.textContent = opt;
        btn.onclick = () => {
            if (i === q.correct) score += 100;
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                loadQuestion();
            } else {
                alert(`Quiz finalizado! Pontuação: ${score} XP`);
                document.getElementById('quiz-content').classList.add('hidden');
                document.getElementById('quiz-start').classList.remove('hidden');
            }
        };
        optsDiv.appendChild(btn);
    });
}

function startPlatformer() {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    let playerX = 50, playerY = 300;
    
    const gameLoop = setInterval(() => {
        ctx.fillStyle = '#18181b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#a855f7';
        ctx.fillRect(playerX, playerY, 40, 50);
        
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(300, 250, 150, 20);
    }, 1000/60);
    
    alert("Jogo iniciado! Use WASD (implementação completa expandível).");
}

function startMemoryGame() {
    alert("🧠 Jogo da Memória iniciado!\nCombine pares sobre cidadania digital.");
}

// Init
window.onload = () => {
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
    }, 800);
    
    loadModules();
    console.log("%cCIDIGI carregada com sucesso!", "color:#a855f7;font-weight:bold");
};