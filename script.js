// js/script.js
// Quiz
const questions = [
    {
        q: "Qual é uma característica comum de deepfakes?",
        a: ["Piscadas naturais", "Bordas borradas no rosto", "Áudio sempre sincronizado", "Iluminação perfeita"],
        correct: 1
    },
    {
        q: "O que você deve fazer antes de compartilhar uma notícia impactante?",
        a: ["Compartilhar imediatamente", "Verificar a fonte original", "Confiar no título", "Enviar para todos os grupos"],
        correct: 1
    },
    {
        q: "O que significa 2FA?",
        a: ["Dois Fatores de Autenticação", "Duas Fake Accounts", "Dois Formulários", "Duas Ferramentas Avançadas"],
        correct: 0
    }
];

let currentQuestion = 0;
let score = 0;

function loadQuestion() {
    document.getElementById('question').textContent = questions[currentQuestion].q;
    const opts = document.getElementById('options');
    opts.innerHTML = '';
    document.getElementById('next-btn').style.display = 'none';

    questions[currentQuestion].a.forEach((answer, index) => {
        const btn = document.createElement('button');
        btn.textContent = answer;
        btn.onclick = () => checkAnswer(index);
        opts.appendChild(btn);
    });
}

function checkAnswer(selected) {
    const correct = questions[currentQuestion].correct;
    const buttons = document.querySelectorAll('#options button');
    
    buttons.forEach((btn, i) => {
        btn.disabled = true;
        if (i === correct) btn.style.background = '#00ff00';
        if (i === selected && i !== correct) btn.style.background = '#ff0000';
    });

    if (selected === correct) score++;
    document.getElementById('next-btn').style.display = 'block';
}

document.getElementById('next-btn').addEventListener('click', () => {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        showResult();
    }
});

function showResult() {
    const container = document.getElementById('quiz-container');
    container.innerHTML = `
        <h2>Resultado do Quiz</h2>
        <p style="font-size: 2rem; margin: 30px 0;">
            Você acertou <strong>${score}</strong> de ${questions.length} perguntas!
        </p>
        <p>${score === questions.length ? '🎉 Excelente! Você domina o tema!' : 'Continue estudando sobre Cidadania Digital!'}</p>
        <button onclick="location.reload()" class="cta-button">Refazer Quiz</button>
    `;
}

// Formulário
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('✅ Mensagem enviada com sucesso! (Simulação)');
    this.reset();
});

// Inicializar Quiz
loadQuestion();
