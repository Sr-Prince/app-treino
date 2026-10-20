// ============================================================
// 1) TREINO INICIAL (só é usado na primeira vez ou ao restaurar)
// ============================================================
// Atalho: ex("Supino Reto", 3, 32, 16) = { nome, series, kg, reps }
// Use "" onde a sua nota tem (-)
function ex(nome, series, kg, reps) {
  return { nome: nome, series: series, kg: kg, reps: reps };
}

const planoPadrao = {
  seg: {
    aba: "Seg A",
    nome: "A - Segunda-feira",
    grupos: [
      { grupo: "Peito", exercicios: [
        ex("Flexão Normal", 2, 0, 22),
        ex("Flexão inclinada", 2, 0, 13),
        ex("Supino Reto", 3, 32, 16)
      ]},
      { grupo: "Ombro", exercicios: [
        ex("Desenvolvimento", 3, 11, 14),
        ex("Elevação Lateral", 3, 8, 11),
        ex("Crucifixo Invertido", 2, 16, 8)
      ]},
      { grupo: "Tríceps", exercicios: [
        ex("Tríceps Banco", 2, 0, 20),
        ex("Tríceps Francês", 2, 8, 10)
      ]}
    ]
  },

  ter: {
    aba: "Ter B",
    nome: "B - Terça-feira",
    grupos: [
      { grupo: "Costas", exercicios: [
        ex("Barra Fixa", 3, 0, 17),
        ex("Remada Bilateral", 3, 22, 12),
        ex("Remada Unilateral", 2, 16, 15)
      ]},
      { grupo: "Bíceps", exercicios: [
        ex("Rosca Direta", 2, 11, 8),
        ex("Rosca 45º", 2, 8, 10)
      ]},
      { grupo: "Antebraço", exercicios: [
        ex("Rosca Inversa", 2, "", ""),
        ex("Flexão de Punho Unilateral", 1, "", "")
      ]},
      { grupo: "Trapézio", exercicios: [
        ex("Trapézio Descendente", 3, 22, 16)
      ]}
    ]
  },

  qua: {
    aba: "Qua C",
    nome: "C - Quarta-feira",
    grupos: [
      { grupo: "Pernas", exercicios: [
        ex("Agachamento", 3, 22, 14),
        ex("Agachamento Búlgaro", 3, 22, 6)
      ]},
      { grupo: "Posterior", exercicios: [
        ex("Stiff com halteres", 3, 22, 15)
      ]},
      { grupo: "Panturrilha", exercicios: [
        ex("Elevação em pé", 3, 0, 27)
      ]},
      { grupo: "Abdômen", exercicios: [
        ex("Ab. supra", 2, "", 24),
        ex("Ab. Infra", 2, "", 15),
        ex("Prancha frontal", 2, "", "")
      ]}
    ]
  },

  qui: {
    aba: "Qui A",
    nome: "A - Quinta-feira",
    grupos: [
      { grupo: "Peito", exercicios: [
        ex("Flexão Normal", 2, "", 25),
        ex("Supino Inclinado", 3, 32, 13),
        ex("Supino Reto", 2, 32, 15)
      ]},
      { grupo: "Ombro", exercicios: [
        ex("Flexão Pyke", 2, "", 10),
        ex("Elevação Lateral uni.", 3, 8, 9),
        ex("Crucifixo Invertido", 2, 8, 6)
      ]},
      { grupo: "Tríceps", exercicios: [
        ex("Tríceps Testa", 2, 16, 10),
        ex("Tríceps Francês", 2, 8, 10)
      ]}
    ]
  },

  sex: {
    aba: "Sex B",
    nome: "B - Sexta-feira",
    grupos: [
      { grupo: "Costas", exercicios: [
        ex("Barra Fixa", 3, "", 21),
        ex("Remada Bilateral", 3, 22, 14),
        ex("Remada Unilateral", 2, 16, 15)
      ]},
      { grupo: "Bíceps", exercicios: [
        ex("Rosca Direta", 2, 11, 9),
        ex("Rosca Martelo", 2, 11, 9)
      ]},
      { grupo: "Antebraço", exercicios: [
        ex("Rosca Inversa", 2, 8, 11),
        ex("Flexão de Punho Unilateral", 1, "", "")
      ]},
      { grupo: "Trapézio", exercicios: [
        ex("Trapézio Descendente", 3, 32, 12)
      ]}
    ]
  },

  sab: {
    aba: "Sáb C",
    nome: "C - Sábado",
    grupos: [
      { grupo: "Pernas", exercicios: [
        ex("Agachamento", 2, 22, 12),
        ex("Agachamento Búlgaro", 2, 22, 6),
        ex("Sissy Squat", 2, 0, 7)
      ]},
      { grupo: "Posterior", exercicios: [
        ex("Stiff Unilateral", 3, 22, 11)
      ]},
      { grupo: "Panturrilha", exercicios: [
        ex("Elevação Uni. Dune.", 3, 0, 20)
      ]},
      { grupo: "Abdômen", exercicios: [
        ex("Ab. supra", 2, "", 20),
        ex("Ab. Infra", 2, "", 14),
        ex("Prancha frontal", 2, "", 40)
      ]}
    ]
  },

  dom: {
    aba: "Dom",
    nome: "Domingo - Descanso 😎",
    grupos: []
  }
};

// Faz uma cópia independente do plano padrão
// (pra editar a cópia sem estragar o original)
function copiaDoPadrao() {
  return JSON.parse(JSON.stringify(planoPadrao));
}

// ============================================================
// 2) SALVAR E CARREGAR (localStorage)
// ============================================================
// Agora o PLANO INTEIRO fica salvo, não só os números.
let plano = null;
try {
  plano = JSON.parse(localStorage.getItem("plano"));
} catch (erro) {
  plano = null; // dado salvo corrompido: começa do padrão
}
if (!plano || typeof plano !== "object") {
  plano = copiaDoPadrao();
}

function salvar() {
  localStorage.setItem("plano", JSON.stringify(plano));
}

// Descobre o dia de hoje: getDay() dá 0 = domingo, 1 = segunda ...
const nomesDias = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];
let diaAtual = nomesDias[new Date().getDay()];
if (!plano[diaAtual]) {
  diaAtual = "seg";
}

// ============================================================
// 3) TÍTULO EDITÁVEL
// ============================================================
const campoTitulo = document.getElementById("titulo-app");
campoTitulo.value = localStorage.getItem("tituloApp") || "Meu Treino";
campoTitulo.addEventListener("input", function () {
  localStorage.setItem("tituloApp", campoTitulo.value);
});

// ============================================================
// 4) DESENHAR A TELA
// ============================================================
const areaAbas = document.getElementById("abas");
const areaTreino = document.getElementById("treino");

// Cria um campo de texto editável que parece texto normal
function criarTexto(valor, classe, dica, aoMudar) {
  const input = document.createElement("input");
  input.type = "text";
  input.className = "texto-editavel " + classe;
  input.value = valor;
  input.placeholder = dica;
  input.addEventListener("input", function () {
    aoMudar(input.value);
  });
  return input;
}

// Cria um campo com rótulo em cima (séries, carga, reps)
function criarCampo(rotulo, tipo, valor, aoMudar) {
  const label = document.createElement("label");
  const texto = document.createElement("span");
  texto.textContent = rotulo;

  const input = document.createElement("input");
  input.type = tipo;
  input.value = valor;
  if (tipo === "number") {
    input.inputMode = "decimal"; // teclado numérico no celular
    input.step = "any";
  }
  input.addEventListener("input", function () {
    aoMudar(input.value);
  });

  label.append(texto, input);
  return label;
}

// Cria um botão
function criarBotao(texto, classe, aoClicar) {
  const botao = document.createElement("button");
  botao.textContent = texto;
  botao.className = classe;
  botao.addEventListener("click", aoClicar);
  return botao;
}

// Cria um exercício dentro de um treino
function criarExercicio(dia, grupo, indice) {
  const exercicio = grupo.exercicios[indice];

  const bloco = document.createElement("div");
  bloco.className = "exercicio";

  // Linha de cima: nome do exercício + botão de remover
  const linha = document.createElement("div");
  linha.className = "linha linha-exercicio";
  linha.append(
    criarTexto(exercicio.nome, "nome-exercicio", "Nome do exercício", function (v) {
      exercicio.nome = v;
      salvar();
    }),
    criarBotao("✕", "botao-pequeno botao-remover", function () {
      if (confirm('Remover o exercício "' + exercicio.nome + '"?')) {
        grupo.exercicios.splice(indice, 1);
        salvar();
        desenharDia(dia);
      }
    })
  );

  // Linha de baixo: séries, carga, reps
  const campos = document.createElement("div");
  campos.className = "campos";
  campos.append(
    criarCampo("Séries", "number", exercicio.series, function (v) {
      exercicio.series = v;
      salvar();
    }),
    criarCampo("Carga (kg)", "number", exercicio.kg, function (v) {
      exercicio.kg = v;
      salvar();
    }),
    criarCampo("Reps", "number", exercicio.reps, function (v) {
      exercicio.reps = v;
      salvar();
    })
  );

  bloco.append(linha, campos);
  return bloco;
}

// Cria a caixa de um treino (Peito, Ombro...)
function criarGrupo(dia, indice) {
  const grupo = plano[dia].grupos[indice];

  const caixa = document.createElement("div");
  caixa.className = "grupo";

  // Cabeçalho: nome do treino + botão de remover
  const cabecalho = document.createElement("div");
  cabecalho.className = "linha";
  cabecalho.append(
    criarTexto(grupo.grupo, "nome-grupo", "Nome do treino", function (v) {
      grupo.grupo = v;
      salvar();
    }),
    criarBotao("✕", "botao-pequeno botao-remover", function () {
      if (confirm('Remover o treino "' + grupo.grupo + '" e todos os exercícios dele?')) {
        plano[dia].grupos.splice(indice, 1);
        salvar();
        desenharDia(dia);
      }
    })
  );
  caixa.append(cabecalho);

  // Exercícios
  grupo.exercicios.forEach(function (_, i) {
    caixa.append(criarExercicio(dia, grupo, i));
  });

  // Botão de adicionar exercício
  caixa.append(
    criarBotao("+ Exercício", "botao-adicionar", function () {
      grupo.exercicios.push(ex("", "", "", ""));
      salvar();
      desenharDia(dia);
      // coloca o cursor no nome do novo exercício
      const nomes = areaTreino
        .querySelectorAll(".grupo")[indice]
        .querySelectorAll(".nome-exercicio");
      nomes[nomes.length - 1].focus();
    })
  );

  return caixa;
}

// Desenha o dia escolhido
function desenharDia(dia) {
  diaAtual = dia;
  areaTreino.replaceChildren(); // limpa a tela antes de desenhar

  const d = plano[dia];

  // Nome do dia (editável)
  areaTreino.append(
    criarTexto(d.nome, "nome-dia", "Nome do dia", function (v) {
      d.nome = v;
      salvar();
    })
  );

  // Nome do botão do dia (editável)
  areaTreino.append(
    criarTexto(d.aba, "nome-botao", "Nome do botão", function (v) {
      d.aba = v;
      salvar();
      desenharAbas(); // atualiza o botão lá em cima na hora
    })
  );

  // Treinos do dia
  d.grupos.forEach(function (_, i) {
    areaTreino.append(criarGrupo(dia, i));
  });

  if (d.grupos.length === 0) {
    const aviso = document.createElement("p");
    aviso.className = "aviso";
    aviso.textContent = "Nenhum treino neste dia.";
    areaTreino.append(aviso);
  }

  // Botão de adicionar treino
  areaTreino.append(
    criarBotao("+ Treino", "botao-adicionar", function () {
      d.grupos.push({ grupo: "", exercicios: [] });
      salvar();
      desenharDia(dia);
      const nomes = areaTreino.querySelectorAll(".nome-grupo");
      nomes[nomes.length - 1].focus();
    })
  );

  // Botão de restaurar o treino original
  areaTreino.append(
    criarBotao("Restaurar treino original", "botao-restaurar", function () {
      if (confirm("Isso apaga TODAS as suas alterações e volta ao treino original. Continuar?")) {
        plano = copiaDoPadrao();
        salvar();
        desenharDia(diaAtual);
      }
    })
  );

  desenharAbas();
}

// Desenha os botões dos dias (o do dia atual fica verde)
function desenharAbas() {
  areaAbas.replaceChildren();
  Object.keys(plano).forEach(function (dia) {
    const botao = document.createElement("button");
    botao.textContent = plano[dia].aba || "?";
    if (dia === diaAtual) {
      botao.className = "ativo";
    }
    botao.addEventListener("click", function () {
      desenharDia(dia);
    });
    areaAbas.append(botao);
  });
}

desenharDia(diaAtual);

// ============================================================
// 5) CRONÔMETRO (igual ao da etapa anterior)
// ============================================================
let intervalo = null;

const telaTempo = document.getElementById("tempo");
const botaoParar = document.getElementById("parar");
const botoesTempo = document.querySelectorAll("#botoes-tempo button");

function mostrarTempo(segundos) {
  const min = Math.floor(segundos / 60);
  const seg = segundos % 60;
  telaTempo.textContent =
    String(min).padStart(2, "0") + ":" + String(seg).padStart(2, "0");
}

function iniciar(segundos) {
  parar();
  mostrarTempo(segundos);

  intervalo = setInterval(function () {
    segundos = segundos - 1;
    mostrarTempo(segundos);
    if (segundos <= 0) {
      parar();
    }
  }, 1000);
}

function parar() {
  clearInterval(intervalo);
  intervalo = null;
}

botoesTempo.forEach(function (botao) {
  botao.addEventListener("click", function () {
    iniciar(Number(botao.dataset.segundos));
  });
});

botaoParar.addEventListener("click", function () {
  parar();
  mostrarTempo(0);
});

// ============================================================
// 6) BACKUP (exportar e importar)
// ============================================================
const botaoExportar = document.getElementById("exportar");
const botaoImportar = document.getElementById("importar");
const campoArquivo = document.getElementById("arquivo-backup");
const infoBackup = document.getElementById("info-backup");

// Mostra a data do último backup
function mostrarInfoBackup() {
  const ultimo = localStorage.getItem("ultimoBackup");
  if (ultimo) {
    infoBackup.textContent =
      "Último backup: " + new Date(ultimo).toLocaleString("pt-BR");
  } else {
    infoBackup.textContent = "Você ainda não fez nenhum backup.";
  }
}

// Data de hoje no formato 2026-10-19 (pra usar no nome do arquivo)
function dataDeHoje() {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return d.getFullYear() + "-" + mes + "-" + dia;
}

// ---------- EXPORTAR ----------
botaoExportar.addEventListener("click", function () {
  const backup = {
    versao: 2,
    exportadoEm: new Date().toISOString(),
    tituloApp: campoTitulo.value,
    plano: plano,
    historico: historico
  };

  // Transforma em texto (o 2 deixa o arquivo organizado e legível)
  const texto = JSON.stringify(backup, null, 2);

  // Cria um "arquivo" na memória e manda o navegador baixar
  const arquivo = new Blob([texto], { type: "application/json" });
  const url = URL.createObjectURL(arquivo);
  const link = document.createElement("a");
  link.href = url;
  link.download = "backup-treino-" + dataDeHoje() + ".json";
  link.click();
  setTimeout(function () {
    URL.revokeObjectURL(url);
  }, 1000);

  localStorage.setItem("ultimoBackup", new Date().toISOString());
  mostrarInfoBackup();
});

// ---------- IMPORTAR ----------
// Confere se o plano do arquivo tem o formato esperado
// (evita que um arquivo errado quebre o app)
function planoValido(p) {
  if (!p || typeof p !== "object" || Array.isArray(p)) {
    return false;
  }
  const dias = Object.keys(p);
  if (dias.length === 0) {
    return false;
  }
  return dias.every(function (dia) {
    const d = p[dia];
    return (
      d &&
      typeof d.nome === "string" &&
      typeof d.aba === "string" &&
      Array.isArray(d.grupos) &&
      d.grupos.every(function (g) {
        return (
          g &&
          typeof g.grupo === "string" &&
          Array.isArray(g.exercicios) &&
          g.exercicios.every(function (e) {
            return e && typeof e.nome === "string";
          })
        );
      })
    );
  });
}

botaoImportar.addEventListener("click", function () {
  campoArquivo.click(); // abre a janela de escolher arquivo
});

campoArquivo.addEventListener("change", async function () {
  const arquivo = campoArquivo.files[0];
  campoArquivo.value = ""; // permite escolher o mesmo arquivo de novo depois
  if (!arquivo) {
    return;
  }

  try {
    const texto = await arquivo.text();
    const backup = JSON.parse(texto);

    if (!backup || !planoValido(backup.plano)) {
      alert("Esse arquivo não parece ser um backup válido do app.");
      return;
    }

    if (!confirm("Isso substitui o treino atual pelo do backup. Continuar?")) {
      return;
    }

    plano = backup.plano;
    salvar();
        // Se o backup tem histórico, restaura também (ignorando itens quebrados)
    if (Array.isArray(backup.historico)) {
      historico = backup.historico.filter(function (h) {
        return h && typeof h.data === "string" && Array.isArray(h.exercicios);
      });
      salvarHistorico();
    }

    const titulo = typeof backup.tituloApp === "string" ? backup.tituloApp : "Meu Treino";
    campoTitulo.value = titulo;
    localStorage.setItem("tituloApp", titulo);

    // Se o dia que estava aberto não existe no backup, abre o primeiro
    if (!plano[diaAtual]) {
      diaAtual = Object.keys(plano)[0];
    }
    desenharDia(diaAtual);

    alert("Backup restaurado!");
  } catch (erro) {
    alert("Não consegui ler esse arquivo.");
  }
});

mostrarInfoBackup();
// ============================================================
// 7) PWA: registra o service worker (permite instalar e usar offline)
// ============================================================
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
// Pede ao navegador pra não apagar os dados do app sozinho
if (navigator.storage && navigator.storage.persist) {
  navigator.storage.persist();
}