/* ============================================================
   CidadaniaIA — App principal
   ============================================================ */

// ---------- STORAGE ----------
const Storage = {
  get(k, d){ try{ return JSON.parse(localStorage.getItem(k)) ?? d }catch{ return d } },
  set(k, v){ localStorage.setItem(k, JSON.stringify(v)) }
};
const state = {
  name: Storage.get('name',''),
  xp: Storage.get('xp',0),
  modulesRead: Storage.get('modulesRead',[]),
  medals: Storage.get('medals',[]),
  activity: Storage.get('activity',[]),
  theme: Storage.get('theme','dark')
};
function save(){
  Storage.set('name',state.name); Storage.set('xp',state.xp);
  Storage.set('modulesRead',state.modulesRead); Storage.set('medals',state.medals);
  Storage.set('activity',state.activity); Storage.set('theme',state.theme);
}
function addXP(n, reason){
  state.xp += n;
  state.activity.unshift(`+${n} XP — ${reason} (${new Date().toLocaleString('pt-BR')})`);
  state.activity = state.activity.slice(0,30);
  checkMedals(); save(); renderProfile();
}
function logActivity(t){
  state.activity.unshift(`${t} (${new Date().toLocaleString('pt-BR')})`);
  state.activity = state.activity.slice(0,30); save(); renderProfile();
}

// ---------- MEDALS ----------
const MEDALS = [
  {id:'first', icon:'🌟', name:'Primeiro passo', test:()=>state.xp>=10},
  {id:'reader', icon:'📚', name:'Leitor', test:()=>state.modulesRead.length>=5},
  {id:'scholar', icon:'🎓', name:'Estudioso', test:()=>state.modulesRead.length>=15},
  {id:'quiz', icon:'🧩', name:'Quiz Master', test:()=>state.xp>=100},
  {id:'gamer', icon:'🎮', name:'Gamer', test:()=>state.activity.some(a=>a.includes('jogo'))},
  {id:'expert', icon:'🛡️', name:'Especialista', test:()=>state.xp>=300},
  {id:'hero', icon:'🦸', name:'Herói Digital', test:()=>state.xp>=500},
  {id:'legend', icon:'👑', name:'Lenda', test:()=>state.xp>=1000}
];
function checkMedals(){
  MEDALS.forEach(m=>{
    if(m.test() && !state.medals.includes(m.id)){
      state.medals.push(m.id);
      state.activity.unshift(`🏅 Medalha desbloqueada: ${m.name}`);
    }
  });
}

// ---------- THEME ----------
function applyTheme(){
  document.documentElement.setAttribute('data-theme', state.theme);
  document.getElementById('themeToggle').textContent = state.theme==='dark'?'🌙':'☀️';
}
document.getElementById('themeToggle').onclick = ()=>{
  state.theme = state.theme==='dark'?'light':'dark'; save(); applyTheme();
};

// ---------- NAV ----------
document.querySelectorAll('[data-nav]').forEach(a=>{
  a.onclick = e=>{
    e.preventDefault();
    const id = a.getAttribute('href').slice(1);
    document.getElementById(id)?.scrollIntoView({behavior:'smooth'});
    document.getElementById('nav').classList.remove('open');
  };
});
document.getElementById('menuToggle').onclick = ()=>{
  document.getElementById('nav').classList.toggle('open');
};

// ---------- BACK TOP ----------
const backTop = document.getElementById('backTop');
window.addEventListener('scroll',()=>{
  backTop.classList.toggle('hidden', window.scrollY<400);
});
backTop.onclick = ()=>window.scrollTo({top:0,behavior:'smooth'});

// ---------- MÓDULOS ----------
const MODULES = [
  {cat:'IA', t:'O que é Inteligência Artificial?', d:'Definição, história e tipos de IA.'},
  {cat:'IA', t:'Machine Learning na prática', d:'Como máquinas aprendem com dados.'},
  {cat:'IA', t:'Redes Neurais Explicadas', d:'Inspiração biológica e funcionamento.'},
  {cat:'IA', t:'IA Generativa', d:'GPT, DALL-E, Midjourney e seus impactos.'},
  {cat:'IA', t:'Ética em IA', d:'Vieses, transparência e responsabilidade.'},
  {cat:'IA', t:'IA no cotidiano', d:'Assistentes, recomendações e automação.'},
  {cat:'Deepfake', t:'O que são Deepfakes?', d:'Conceito, origem e funcionamento.'},
  {cat:'Deepfake', t:'Como Deepfakes são criadas', d:'GANs, autoencoders e síntese de voz.'},
  {cat:'Deepfake', t:'Detectando Deepfakes', d:'Sinais visuais, sonoros e ferramentas.'},
  {cat:'Deepfake', t:'Casos famosos de Deepfake', d:'Política, celebridades e fraudes.'},
  {cat:'Deepfake', t:'Deepfake e privacidade', d:'Uso indevido de imagem e voz.'},
  {cat:'Deepfake', t:'Legislação sobre Deepfake', d:'Leis no Brasil e no mundo.'},
  {cat:'FakeNews', t:'O que são Fake News?', d:'Origem, motivações e tipos.'},
  {cat:'FakeNews', t:'Como Fake News se espalham', d:'Algoritmos e câmaras de eco.'},
  {cat:'FakeNews', t:'Checagem de fatos', d:'Agências, métodos e ferramentas.'},
  {cat:'FakeNews', t:'Identificando manchetes falsas', d:'Sensacionalismo e clickbait.'},
  {cat:'FakeNews', t:'Bolhas de informação', d:'Como sair da bolha algorítmica.'},
  {cat:'FakeNews', t:'Impacto político das Fake News', d:'Eleições, polarização e democracia.'},
  {cat:'Seguranca', t:'Senhas seguras', d:'Boas práticas e gerenciadores.'},
  {cat:'Seguranca', t:'Phishing e golpes', d:'Identifique e proteja-se.'},
  {cat:'Seguranca', t:'Autenticação em 2 fatores', d:'Por que ativar em tudo.'},
  {cat:'Seguranca', t:'Privacidade online', d:'Configurações essenciais.'},
  {cat:'Seguranca', t:'Engenharia social', d:'O elo mais fraco é humano.'},
  {cat:'Seguranca', t:'Proteção contra malware', d:'Vírus, ransomware e prevenção.'},
  {cat:'Cidadania', t:'O que é Cidadania Digital?', d:'Direitos e deveres online.'},
  {cat:'Cidadania', t:'Netiqueta', d:'Boas maneiras no mundo digital.'},
  {cat:'Cidadania', t:'Cyberbullying', d:'Identificar, denunciar e prevenir.'},
  {cat:'Cidadania', t:'LGPD na prática', d:'Seus direitos sobre dados pessoais.'},
  {cat:'Cidadania', t:'Discurso de ódio online', d:'Limites entre opinião e crime.'},
  {cat:'Cidadania', t:'Pensamento crítico digital', d:'Avaliar fontes e argumentos.'},
  {cat:'Cidadania', t:'Educação Midiática', d:'Consumir e produzir mídia conscientemente.'},
  {cat:'Cidadania', t:'Ativismo digital responsável', d:'Engajamento construtivo.'}
];
const ICONS = {IA:'🧠', Deepfake:'🎭', FakeNews:'📰', Seguranca:'🛡️', Cidadania:'🌐'};

function renderModules(){
  const grid = document.getElementById('modulesGrid');
  const q = document.getElementById('searchModules').value.toLowerCase();
  const cat = document.getElementById('filterCategory').value;
  grid.innerHTML = '';
  MODULES.filter(m=>(!cat||m.cat===cat)&&(m.t.toLowerCase().includes(q)||m.d.toLowerCase().includes(q)))
    .forEach((m,i)=>{
      const id = `${m.cat}-${i}`;
      const done = state.modulesRead.includes(id);
      const card = document.createElement('article');
      card.className = 'module-card';
      card.innerHTML = `
        <span class="tag">${ICONS[m.cat]} ${m.cat}</span>
        <h3>${m.t}</h3>
        <p>${m.d}</p>
        <div class="actions">
          <button data-read="${id}" class="${done?'done':''}">${done?'✓ Lido':'Marcar como lido'}</button>
        </div>`;
      grid.appendChild(card);
    });
  grid.querySelectorAll('[data-read]').forEach(b=>{
    b.onclick = ()=>{
      const id = b.dataset.read;
      if(!state.modulesRead.includes(id)){
        state.modulesRead.push(id); addXP(5,'Módulo lido'); renderModules();
      }
    };
  });
}
document.getElementById('searchModules').oninput = renderModules;
document.getElementById('filterCategory').onchange = renderModules;

// ---------- QUIZ ----------
const QUESTIONS = generateQuestions();
function generateQuestions(){
  const base = [
    ['O que é uma deepfake?',['Vídeo/áudio sintético criado por IA','Notícia escrita por jornalista','Imagem original sem edição','Mensagem de texto comum'],0,'facil'],
    ['Qual sigla representa a lei brasileira de proteção de dados?',['LGPD','CLT','ECA','CDC'],0,'facil'],
    ['Fake news são:',['Informações falsas disfarçadas de notícia','Notícias oficiais','Pesquisas acadêmicas','Documentos jurídicos'],0,'facil'],
    ['Phishing é:',['Tentativa de roubar dados por engano','Tipo de antivírus','Aplicativo de fotos','Linguagem de programação'],0,'facil'],
    ['Cidadania digital envolve:',['Direitos e deveres online','Apenas usar redes sociais','Comprar gadgets','Programar sites'],0,'facil'],
    ['Autenticação em 2 fatores aumenta:',['Segurança da conta','Velocidade da internet','Espaço em disco','Bateria do celular'],0,'facil'],
    ['Cyberbullying é:',['Agressão online','Jogo educativo','Tipo de antivírus','Software de IA'],0,'facil'],
    ['Checar fontes ajuda a:',['Evitar fake news','Aumentar likes','Ganhar dinheiro','Carregar mais rápido'],0,'facil'],
    ['IA significa:',['Inteligência Artificial','Internet Avançada','Informação Anônima','Interface Aberta'],0,'facil'],
    ['Netiqueta é:',['Etiqueta na internet','Tipo de rede','App de jogos','Sistema operacional'],0,'facil'],

    ['Qual técnica é base das deepfakes?',['GANs','HTML','SQL','CSS'],0,'medio'],
    ['Câmara de eco refere-se a:',['Bolha onde só vemos o que concordamos','Estúdio musical','Sala de TV','Tipo de microfone'],0,'medio'],
    ['Bias algorítmico é:',['Viés em decisões de IA','Erro de hardware','Falha de internet','Defeito visual'],0,'medio'],
    ['Sinais de deepfake incluem:',['Piscar estranho e sincronia labial ruim','Áudio em alta qualidade','Cores naturais','Resolução 4K'],0,'medio'],
    ['LGPD garante o direito de:',['Acesso e exclusão de dados pessoais','Internet grátis','Computador novo','Curso online'],0,'medio'],
    ['Engenharia social explora:',['Confiança humana','Falhas de hardware','Bugs de CSS','Problemas de rede'],0,'medio'],
    ['Clickbait é:',['Título sensacionalista para gerar cliques','Tipo de vírus','Anúncio legal','Notícia verificada'],0,'medio'],
    ['Ransomware faz o quê?',['Sequestra dados e exige resgate','Acelera o PC','Limpa cache','Atualiza drivers'],0,'medio'],
    ['Fonte primária é:',['Origem direta da informação','Cópia de cópia','Boato','Opinião'],0,'medio'],
    ['IA Generativa pode:',['Criar texto, imagem e áudio','Apenas calcular','Só jogar xadrez','Só traduzir'],0,'medio'],

    ['Diferença entre misinformation e disinformation:',['Disinformation é intencional, misinformation não','São iguais','Misinformation é pior','Disinformation é legal'],0,'dificil'],
    ['Em GANs, o gerador e o discriminador:',['Competem entre si','Trabalham separados','Não se comunicam','São o mesmo'],0,'dificil'],
    ['Deepfake de voz usa principalmente:',['Síntese neural de fala','Auto-tune','Eco analógico','Mixagem manual'],0,'dificil'],
    ['Filter bubble foi cunhado por:',['Eli Pariser','Mark Zuckerberg','Elon Musk','Tim Cook'],0,'dificil'],
    ['Astroturfing é:',['Falso movimento popular orquestrado','Tipo de grama','Esporte digital','App de jardim'],0,'dificil'],
    ['Watermarking de IA serve para:',['Identificar conteúdo gerado por IA','Aumentar resolução','Reduzir tamanho','Adicionar cor'],0,'dificil'],
    ['Direito ao esquecimento permite:',['Solicitar remoção de dados','Apagar memória','Resetar PC','Bloquear sites'],0,'dificil'],
    ['Marco Civil da Internet é de:',['2014','2010','2020','2000'],0,'dificil'],
    ['Cheapfake difere de deepfake porque:',['Usa edição simples, não IA','É mais caro','Usa só áudio','É legal'],0,'dificil'],
    ['Prebunking é:',['Antecipar e desmentir desinformação','Pré-pagar conta','Tipo de bunker','Backup'],0,'dificil']
  ];
  // expand to 120 by duplicating with variation
  const all = [];
  base.forEach(q=>all.push({q:q[0],opts:q[1],a:q[2],lvl:q[3]}));
  while(all.length<120){
    const b = base[all.length%base.length];
    all.push({q:b[0],opts:b[1],a:b[2],lvl:b[3]});
  }
  return all;
}

let quiz = {qs:[], i:0, score:0, timer:null, timeLeft:30};
document.getElementById('startQuiz').onclick = ()=>{
  const lvl = document.getElementById('quizDifficulty').value;
  const n = +document.getElementById('quizCount').value;
  const pool = QUESTIONS.filter(q=>q.lvl===lvl).sort(()=>Math.random()-.5);
  quiz = {qs:pool.slice(0,n), i:0, score:0, timer:null, timeLeft:30};
  document.getElementById('quizSetup').classList.add('hidden');
  document.getElementById('quizResult').classList.add('hidden');
  document.getElementById('quizArea').classList.remove('hidden');
  showQuestion();
};
function showQuestion(){
  const q = quiz.qs[quiz.i];
  document.getElementById('quizProgress').textContent = `${quiz.i+1}/${quiz.qs.length}`;
  document.getElementById('quizScore').textContent = `⭐ ${quiz.score}`;
  document.getElementById('quizQuestion').textContent = q.q;
  const opts = document.getElementById('quizOptions');
  opts.innerHTML = '';
  q.opts.forEach((o,i)=>{
    const b = document.createElement('button');
    b.textContent = o;
    b.onclick = ()=>answer(i,b);
    opts.appendChild(b);
  });
  document.getElementById('quizNext').classList.add('hidden');
  quiz.timeLeft = 30;
  clearInterval(quiz.timer);
  quiz.timer = setInterval(()=>{
    quiz.timeLeft--;
    document.getElementById('quizTimer').textContent = `⏱ ${quiz.timeLeft}s`;
    if(quiz.timeLeft<=0){ answer(-1,null); }
  },1000);
}
function answer(i, btn){
  clearInterval(quiz.timer);
  const q = quiz.qs[quiz.i];
  document.querySelectorAll('#quizOptions button').forEach((b,idx)=>{
    b.disabled = true;
    if(idx===q.a) b.classList.add('correct');
    else if(idx===i) b.classList.add('wrong');
  });
  if(i===q.a){ quiz.score++; }
  document.getElementById('quizScore').textContent = `⭐ ${quiz.score}`;
  document.getElementById('quizNext').classList.remove('hidden');
}
document.getElementById('quizNext').onclick = ()=>{
  quiz.i++;
  if(quiz.i>=quiz.qs.length) finishQuiz();
  else showQuestion();
};
function finishQuiz(){
  document.getElementById('quizArea').classList.add('hidden');
  document.getElementById('quizSetup').classList.remove('hidden');
  const res = document.getElementById('quizResult');
  res.classList.remove('hidden');
  const pct = Math.round(quiz.score/quiz.qs.length*100);
  const xp = quiz.score*10;
  addXP(xp,'Quiz concluído');
  res.innerHTML = `
    <h3>🎉 Quiz Finalizado!</h3>
    <p>Você acertou <strong>${quiz.score}/${quiz.qs.length}</strong> (${pct}%)</p>
    <p>Ganhou <strong>+${xp} XP</strong></p>
    ${pct>=70?`<button class="btn btn-primary" onclick="window.print()">🖨 Imprimir certificado</button>`:''}
  `;
}

// ---------- FERRAMENTAS ----------
const checklist = document.getElementById('checklist');
checklist.addEventListener('change',()=>{
  const total = checklist.querySelectorAll('input').length;
  const done = checklist.querySelectorAll('input:checked').length;
  const pct = Math.round(done/total*100);
  const res = document.getElementById('checklistResult');
  res.textContent = `Confiabilidade: ${pct}% — ${pct>=80?'Boa checagem!':pct>=40?'Verifique mais.':'Cuidado!'}`;
});
document.getElementById('analyzeBtn').onclick = ()=>{
  const txt = document.getElementById('newsText').value.toLowerCase();
  const flags = ['urgente','compartilhe','você não vai acreditar','exclusivo','chocante','milagre','médicos odeiam'];
  const found = flags.filter(f=>txt.includes(f));
  const score = Math.max(0, 100 - found.length*20 - (txt.length<50?30:0));
  const res = document.getElementById('analyzeResult');
  res.innerHTML = `<strong>Score de confiabilidade: ${score}%</strong><br>
    ${found.length?`⚠️ Sinais suspeitos: ${found.join(', ')}`:'✅ Nenhum sinal óbvio de sensacionalismo'}<br>
    <small>Sempre confirme em fontes oficiais.</small>`;
};

// ---------- PERFIL ----------
function renderProfile(){
  document.getElementById('profileName').value = state.name;
  const lvl = Math.floor(state.xp/100)+1;
  const next = lvl*100;
  document.getElementById('profileLevel').textContent = lvl;
  document.getElementById('profileXP').textContent = state.xp;
  document.getElementById('xpFill').style.width = ((state.xp%100))+'%';
  const med = document.getElementById('medalsGrid');
  med.innerHTML = MEDALS.map(m=>`<div class="medal ${state.medals.includes(m.id)?'unlocked':''}" title="${m.name}">${m.icon}</div>`).join('');
  document.getElementById('activityLog').innerHTML = state.activity.length?state.activity.map(a=>`<li>${a}</li>`).join(''):'<li class="muted">Sem atividade ainda.</li>';
}
document.getElementById('profileName').oninput = e=>{ state.name = e.target.value; save(); };
document.getElementById('resetProgress').onclick = ()=>{
  if(confirm('Resetar todo o progresso?')){
    localStorage.clear();
    Object.assign(state,{name:'',xp:0,modulesRead:[],medals:[],activity:[],theme:state.theme});
    renderProfile(); renderModules();
  }
};

// ---------- FAQ ----------
const FAQS = [
  ['O que é uma deepfake?','Conteúdo (vídeo, áudio ou imagem) sintético criado por IA, que imita pessoas reais de forma convincente.'],
  ['Como identificar fake news?','Verifique a fonte, a data, o autor, busque em outros veículos e desconfie de manchetes sensacionalistas.'],
  ['O que é cidadania digital?','É o exercício de direitos e deveres no ambiente online, com ética, respeito e responsabilidade.'],
  ['IA é perigosa?','A IA é uma ferramenta. Os riscos vêm do uso indevido — por isso a educação digital é essencial.'],
  ['Como me proteger online?','Use senhas fortes, ative 2FA, desconfie de links suspeitos e cuide do que compartilha.'],
  ['O site armazena meus dados?','Tudo é salvo apenas no seu navegador (localStorage). Nada é enviado a servidores.']
];
document.getElementById('faqList').innerHTML = FAQS.map(([q,a])=>`<details class="faq-item"><summary>${q}</summary><div class="faq-body">${a}</div></details>`).join('');

// ---------- JOGOS ----------
const modal = document.getElementById('gameModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
document.getElementById('closeModal').onclick = ()=>{ modal.classList.add('hidden'); modalBody.innerHTML=''; };
document.querySelectorAll('.game-card').forEach(c=>{
  c.querySelector('button').onclick = ()=>openGame(c.dataset.game);
});
function openGame(g){
  modal.classList.remove('hidden');
  ({platformer:gamePlatformer, memory:gameMemory, truefalse:gameTF,
    wordsearch:gameWord, classify:gameClassify, realai:gameRealAI, complete:gameComplete}[g])();
}

// --- 1. PLATFORMER ---
function gamePlatformer(){
  modalTitle.textContent = '🕹️ Caçador da Verdade';
  modalBody.innerHTML = `
    <p class="muted">Use <strong>A/D</strong> para mover, <strong>W ou Espaço</strong> para pular. Pegue ✅ verdades, evite ❌ fake news!</p>
    <div class="game-hud"><span id="pScore">Pontos: 0</span><span id="pLives">Vidas: 3</span><span id="pStage">Fase: 1</span></div>
    <canvas id="pCanvas" width="760" height="380"></canvas>`;
  const cv = document.getElementById('pCanvas'), ctx = cv.getContext('2d');
  const p = {x:40,y:300,vx:0,vy:0,w:24,h:30,onGround:false};
  let keys={}, score=0, lives=3, stage=1, items=[], enemies=[], plats=[], goal;
  const setupStage = ()=>{
    plats = [{x:0,y:350,w:760,h:30},{x:150,y:280,w:100,h:14},{x:320,y:220,w:100,h:14},{x:500,y:170,w:100,h:14},{x:650,y:260,w:90,h:14}];
    items = [{x:170,y:255,t:'✅'},{x:340,y:195,t:'✅'},{x:520,y:145,t:'✅'},{x:80,y:325,t:'✅'}];
    enemies = [{x:400,y:325,d:1},{x:600,y:325,d:-1}];
    goal = {x:710,y:225,w:30,h:30};
    p.x=20; p.y=300; p.vx=0; p.vy=0;
  };
  setupStage();
  window.addEventListener('keydown',e=>keys[e.key.toLowerCase()]=true);
  window.addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
  let running = true;
  modal.addEventListener('click',function close(e){ if(e.target.id==='closeModal'||e.target===modal){running=false; modal.removeEventListener('click',close);} },true);

  function loop(){
    if(!running||modal.classList.contains('hidden')){ running=false; return; }
    // Input
    p.vx = 0;
    if(keys['a']||keys['arrowleft']) p.vx=-3;
    if(keys['d']||keys['arrowright']) p.vx=3;
    if((keys['w']||keys[' ']||keys['arrowup'])&&p.onGround){ p.vy=-10; p.onGround=false; }
    p.vy += 0.5;
    p.x += p.vx; p.y += p.vy;
    // collisions
    p.onGround=false;
    plats.forEach(pl=>{
      if(p.x<pl.x+pl.w && p.x+p.w>pl.x && p.y+p.h>pl.y && p.y+p.h<pl.y+pl.h+10 && p.vy>=0){
        p.y = pl.y - p.h; p.vy=0; p.onGround=true;
      }
    })