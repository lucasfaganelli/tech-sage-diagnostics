/* =====================================================================
   LogicPC Expert - Sistema Especialista de Diagnóstico de Computadores
   ---------------------------------------------------------------------
   Este script implementa um SISTEMA ESPECIALISTA baseado em REGRAS
   IF-THEN (regras de produção) utilizando LÓGICA MATEMÁTICA aplicada.
   
   Conceitos demonstrados:
     - Proposições lógicas (cada resposta SIM/NÃO é uma proposição)
     - Operadores AND (∧) e OR (∨)
     - Negação (¬)
     - Inferência lógica (dedução baseada em fatos e regras)
     - Cálculo de nível de confiança (modelo probabilístico simples)
   ===================================================================== */


/* ---------------------------------------------------------------------
   1) BASE DE PERGUNTAS
   Cada pergunta corresponde a uma PROPOSIÇÃO LÓGICA.
   A chave `id` identifica a proposição na base de fatos.
   --------------------------------------------------------------------- */
const PERGUNTAS = [
  { id: "liga",         texto: "O computador liga normalmente?" },
  { id: "barulhoFonte", texto: "Existe algum barulho vindo da fonte de alimentação?" },
  { id: "imagem",       texto: "A tela apresenta imagem ao ligar?" },
  { id: "lento",        texto: "O computador está muito lento durante o uso?" },
  { id: "telaAzul",     texto: "Aparece a famosa tela azul (BSOD) com frequência?" },
  { id: "desliga",      texto: "O computador desliga sozinho sem aviso?" },
  { id: "aquece",       texto: "O computador esquenta muito durante o uso?" },
  { id: "trava",        texto: "O sistema trava frequentemente?" },
  { id: "ruidoHD",      texto: "Existem ruídos estranhos vindos do HD (cliques, raspagem)?" },
  { id: "reinicia",     texto: "O computador reinicia sozinho sem motivo aparente?" }
];


/* ---------------------------------------------------------------------
   2) BASE DE CONHECIMENTO (REGRAS IF-THEN)
   Cada regra possui:
     - condicao(f): função que recebe os FATOS e retorna true/false
     - diagnostico: hipótese deduzida
     - explicacao: descrição técnica
     - solucao: ação recomendada
     - regras: array com as proposições usadas (para exibir no resultado)
     - logica: representação matemática IF-THEN
     - confianca: nível de confiança base (0 a 100)
   --------------------------------------------------------------------- */
const BASE_DE_REGRAS = [

  // Regra 1: Fonte de alimentação
  // IF ¬liga ∧ ¬barulhoFonte  THEN problema = Fonte
  {
    // Verifica se o computador NÃO liga E a fonte NÃO faz barulho (AND lógico com negação)
    condicao: (f) => f.liga === false && f.barulhoFonte === false,
    diagnostico: "Provável falha na FONTE DE ALIMENTAÇÃO",
    explicacao: "Quando o computador não liga e a fonte sequer emite ruído ou ventilação, há forte indício de que a PSU (Power Supply Unit) está queimada ou sem energia.",
    solucao: "Teste a fonte com um testador de PSU ou substitua-a por uma fonte sabidamente funcional. Verifique também o cabo de força e a tomada.",
    regras: ["computador não liga", "fonte sem barulho"],
    logica: "IF ¬liga ∧ ¬barulhoFonte\nTHEN problema = Fonte de Alimentação",
    confianca: 92
  },

  // Regra 2: Placa de vídeo ou memória RAM
  // IF liga ∧ ¬imagem  THEN problema = Vídeo/RAM
  {
    // O PC liga mas não envia sinal de vídeo → provável GPU ou RAM
    condicao: (f) => f.liga === true && f.imagem === false,
    diagnostico: "Provável falha na PLACA DE VÍDEO ou MEMÓRIA RAM",
    explicacao: "Se o computador liga mas não exibe imagem, geralmente o POST falha por defeito na GPU ou pentes de memória RAM mal encaixados / danificados.",
    solucao: "Reassente os módulos de memória RAM, teste com um pente por vez e verifique a placa de vídeo em outro slot ou outra máquina.",
    regras: ["computador liga", "sem imagem na tela"],
    logica: "IF liga ∧ ¬imagem\nTHEN problema = Placa de Vídeo OR Memória RAM",
    confianca: 85
  },

  // Regra 3: Tela azul (BSOD) → Memória RAM
  // IF telaAzul  THEN problema = RAM
  {
    // Tela azul é fortemente associada a falha de memória ou drivers
    condicao: (f) => f.telaAzul === true,
    diagnostico: "Provável ERRO CRÍTICO DE MEMÓRIA RAM",
    explicacao: "Telas azuis (BSOD) frequentes indicam falha na memória RAM, drivers corrompidos ou setores de memória defeituosos.",
    solucao: "Execute o teste MemTest86, atualize drivers e, se persistir, substitua os módulos de memória.",
    regras: ["existe tela azul (BSOD)"],
    logica: "IF telaAzul\nTHEN problema = Erro Crítico de Memória RAM",
    confianca: 80
  },

  // Regra 4: Superaquecimento
  // IF aquece ∧ desliga  THEN problema = Superaquecimento
  {
    // AND lógico entre aquecimento e desligamento espontâneo
    condicao: (f) => f.aquece === true && f.desliga === true,
    diagnostico: "Provável problema de SUPERAQUECIMENTO",
    explicacao: "Computadores que esquentam muito e desligam sozinhos estão acionando proteção térmica do processador devido a falha de refrigeração.",
    solucao: "Limpe os coolers, troque a pasta térmica do processador e verifique se as ventoinhas estão funcionando corretamente.",
    regras: ["computador esquenta muito", "desliga sozinho"],
    logica: "IF aquece ∧ desligaSozinho\nTHEN problema = Superaquecimento",
    confianca: 90
  },

  // Regra 5: Lentidão + travamento
  // IF lento ∧ trava  THEN problema = RAM/Processos
  {
    // Se trava E está lento → excesso de processos ou RAM insuficiente
    condicao: (f) => f.lento === true && f.trava === true,
    diagnostico: "EXCESSO DE PROCESSOS ou POUCA MEMÓRIA RAM",
    explicacao: "Lentidão somada a travamentos frequentes indica saturação de memória RAM, processos em segundo plano em excesso ou possível malware.",
    solucao: "Abra o Gerenciador de Tarefas, finalize processos pesados, execute antivírus e considere aumentar a memória RAM.",
    regras: ["computador lento", "trava frequentemente"],
    logica: "IF lento ∧ trava\nTHEN problema = Excesso de Processos OR RAM Insuficiente",
    confianca: 78
  },

  // Regra 6: HD com defeito
  // IF ruidoHD  THEN problema = HD
  {
    // Ruídos no HD = falha mecânica
    condicao: (f) => f.ruidoHD === true,
    diagnostico: "Provável FALHA NO DISCO RÍGIDO (HD)",
    explicacao: "Ruídos mecânicos no HD indicam falha iminente do disco. Os cabeçotes podem estar danificados ou o motor com problemas.",
    solucao: "Faça backup IMEDIATO dos dados e substitua o HD por um SSD ou novo HD. Execute CHKDSK ou CrystalDiskInfo para confirmar.",
    regras: ["ruídos estranhos no HD"],
    logica: "IF ruidoHD\nTHEN problema = Falha no HD",
    confianca: 88
  },

  // Regra 7: Reinício espontâneo
  // IF reinicia  THEN problema = Fonte instável OR Superaquecimento
  {
    // Reinício espontâneo geralmente é fonte ou superaquecimento
    condicao: (f) => f.reinicia === true,
    diagnostico: "FONTE INSTÁVEL ou SUPERAQUECIMENTO",
    explicacao: "Reinícios espontâneos ocorrem por falta de energia estável (fonte ruim) ou proteção térmica acionada pelo processador.",
    solucao: "Teste a fonte com outro modelo confiável, verifique temperaturas do CPU com HWMonitor e limpe o sistema de refrigeração.",
    regras: ["computador reinicia sozinho"],
    logica: "IF reinicia\nTHEN problema = Fonte Instável OR Superaquecimento",
    confianca: 75
  },

  // Regra 8: Apenas lento
  // IF lento ∧ ¬trava  THEN problema = Otimização
  {
    condicao: (f) => f.lento === true && f.trava === false,
    diagnostico: "NECESSIDADE DE OTIMIZAÇÃO DO SISTEMA",
    explicacao: "O computador está lento mas estável. Geralmente é causado por programas iniciando junto ao sistema, fragmentação ou disco cheio.",
    solucao: "Desative programas de inicialização, limpe arquivos temporários, atualize o Windows e considere migrar de HD para SSD.",
    regras: ["computador lento"],
    logica: "IF lento ∧ ¬trava\nTHEN problema = Otimização Necessária",
    confianca: 70
  }
];


/* ---------------------------------------------------------------------
   3) ESTADO DO SISTEMA
   --------------------------------------------------------------------- */
let perguntaIndex = 0;        // índice da pergunta atual
let fatos = {};               // base de FATOS (proposições conhecidas)
let historico = [];           // histórico de respostas


/* ---------------------------------------------------------------------
   4) NAVEGAÇÃO ENTRE TELAS
   --------------------------------------------------------------------- */
function mostrarSecao(id) {
  document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}


/* ---------------------------------------------------------------------
   5) INICIAR DIAGNÓSTICO
   Reinicia variáveis e exibe a primeira pergunta.
   --------------------------------------------------------------------- */
function iniciarDiagnostico() {
  perguntaIndex = 0;
  fatos = {};
  historico = [];
  document.getElementById("lista-historico").innerHTML = "";
  document.getElementById("etapa-total").textContent = PERGUNTAS.length;
  mostrarSecao("tela-perguntas");
  renderizarPergunta();
}


/* ---------------------------------------------------------------------
   6) RENDERIZAR PERGUNTA ATUAL
   Atualiza UI, progresso e efeito de digitação.
   --------------------------------------------------------------------- */
function renderizarPergunta() {
  const p = PERGUNTAS[perguntaIndex];
  document.getElementById("etapa-atual").textContent = perguntaIndex + 1;
  document.getElementById("titulo-pergunta").textContent = "Pergunta " + (perguntaIndex + 1);
  document.getElementById("texto-pergunta").textContent = "";

  // Atualiza barra de progresso (regra de 3 visual)
  const pct = (perguntaIndex / PERGUNTAS.length) * 100;
  document.getElementById("progress-bar").style.width = pct + "%";

  // Efeito de digitação (simula IA escrevendo)
  efeitoDigitando(document.getElementById("texto-pergunta"), p.texto, 18);
}


/* ---------------------------------------------------------------------
   7) EFEITO "IA DIGITANDO"
   --------------------------------------------------------------------- */
function efeitoDigitando(el, texto, velocidade) {
  let i = 0;
  el.textContent = "";
  const timer = setInterval(() => {
    el.textContent += texto.charAt(i);
    i++;
    if (i >= texto.length) clearInterval(timer);
  }, velocidade);
}


/* ---------------------------------------------------------------------
   8) RESPONDER PERGUNTA
   - Salva o fato (proposição) na base de conhecimento
   - Atualiza histórico
   - Avança ou chama o motor de inferência
   --------------------------------------------------------------------- */
function responder(resposta) {
  const p = PERGUNTAS[perguntaIndex];

  // Armazena o FATO: ex. fatos["liga"] = true
  fatos[p.id] = resposta;

  // Adiciona ao histórico visual
  historico.push({ pergunta: p.texto, resposta });
  const li = document.createElement("li");
  li.innerHTML = `<b>${p.texto}</b> → <span class="${resposta ? "yes" : "no"}">${resposta ? "SIM" : "NÃO"}</span>`;
  document.getElementById("lista-historico").appendChild(li);

  // Avança para a próxima pergunta
  perguntaIndex++;
  if (perguntaIndex < PERGUNTAS.length) {
    renderizarPergunta();
  } else {
    // Todas perguntas respondidas → motor de inferência
    processarDiagnostico();
  }
}


/* ---------------------------------------------------------------------
   9) MOTOR DE INFERÊNCIA (CORE LÓGICO)
   Percorre todas as regras IF-THEN e seleciona a que melhor se aplica.
   --------------------------------------------------------------------- */
function motorInferencia() {
  // Lista de regras ativadas (que tiveram condição satisfeita)
  const ativadas = [];

  // Itera sobre cada regra da base de conhecimento
  for (const regra of BASE_DE_REGRAS) {
    // Avalia a condição lógica IF (combinação de AND/OR/NOT)
    if (regra.condicao(fatos)) {
      // Regra "disparou" → adiciona à lista de ativações
      ativadas.push(regra);
    }
  }

  // Se nenhuma regra foi ativada, retornamos um diagnóstico genérico
  if (ativadas.length === 0) {
    return {
      diagnostico: "Nenhum problema crítico detectado",
      explicacao: "Com base nas respostas fornecidas, não foi possível identificar uma falha clara. O computador parece estar operando dentro da normalidade.",
      solucao: "Realize manutenções preventivas periódicas: limpeza interna, atualização de drivers e verificação de antivírus.",
      regras: ["nenhuma regra IF-THEN satisfeita"],
      logica: "∄ regra R | condicao(R) = verdadeira\nTHEN diagnóstico = inconclusivo",
      confianca: 50
    };
  }

  // Ordena por nível de confiança (regra mais forte vence)
  ativadas.sort((a, b) => b.confianca - a.confianca);

  // Retorna a regra principal
  return ativadas[0];
}


/* ---------------------------------------------------------------------
   10) PROCESSAR DIAGNÓSTICO COM LOADING
   --------------------------------------------------------------------- */
function processarDiagnostico() {
  // Mostra a barra cheia
  document.getElementById("progress-bar").style.width = "100%";

  // Vai para a tela de loading
  mostrarSecao("tela-loading");

  const mensagens = [
    "Aplicando inferência IF-THEN...",
    "Avaliando operadores AND / OR...",
    "Calculando nível de confiança...",
    "Consultando base de conhecimento...",
    "Deduzindo hipótese mais provável..."
  ];

  let i = 0;
  const loaderMsg = document.getElementById("loader-msg");
  const tickLoader = setInterval(() => {
    loaderMsg.textContent = mensagens[i % mensagens.length];
    i++;
  }, 600);

  // Simula tempo de processamento (~2.5s) para efeito visual
  setTimeout(() => {
    clearInterval(tickLoader);
    const resultado = motorInferencia();
    exibirResultado(resultado);
  }, 2500);
}


/* ---------------------------------------------------------------------
   11) EXIBIR RESULTADO FINAL
   --------------------------------------------------------------------- */
function exibirResultado(r) {
  mostrarSecao("tela-resultado");

  document.getElementById("diagnostico-titulo").textContent = r.diagnostico;
  document.getElementById("diagnostico-explicacao").textContent = r.explicacao;
  document.getElementById("diagnostico-solucao").textContent = r.solucao;

  // Lista de regras aplicadas
  document.getElementById("regras-aplicadas").textContent =
    r.regras.map((x, i) => `• Fato ${i + 1}: ${x}`).join("\n");

  // Inferência lógica formal
  document.getElementById("inferencia-logica").textContent = r.logica;

  // Animação do círculo de confiança
  animarConfianca(r.confianca);
}


/* ---------------------------------------------------------------------
   12) ANIMAÇÃO DO MEDIDOR DE CONFIANÇA
   --------------------------------------------------------------------- */
function animarConfianca(alvo) {
  const circle = document.querySelector(".conf-circle");
  const num = document.getElementById("conf-num");
  let atual = 0;
  const step = Math.max(1, Math.round(alvo / 40));
  const t = setInterval(() => {
    atual += step;
    if (atual >= alvo) { atual = alvo; clearInterval(t); }
    num.textContent = atual;
    circle.style.setProperty("--p", atual);
  }, 25);
}


/* ---------------------------------------------------------------------
   13) REINICIAR DIAGNÓSTICO
   --------------------------------------------------------------------- */
function reiniciar() {
  iniciarDiagnostico();
}


/* ---------------------------------------------------------------------
   14) INICIALIZAÇÃO
   --------------------------------------------------------------------- */
window.addEventListener("DOMContentLoaded", () => {
  mostrarSecao("tela-inicial");
});
