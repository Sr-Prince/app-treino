// ============================================================
// HISTÓRICO
// (usa coisas que já existem no script.js: plano, diaAtual,
//  dataDeHoje, criarBotao...)
// ============================================================

// Cada item do histórico é um treino salvo:
// { id, data: "2026-10-19", dia: "seg", nomeDia: "A - Segunda-feira",
//   exercicios: [ { grupo, nome, series, kg, reps } ] }
let historico = [];
try {
  historico = JSON.parse(localStorage.getItem("historico")) || [];
} catch (erro) {
  historico = [];
}
if (!Array.isArray(historico)) {
  historico = [];
}

function salvarHistorico() {
  localStorage.setItem("historico", JSON.stringify(historico));
}

// ---------- Funções de apoio ----------

// "2026-10-19" -> "19/10/2026"
function formatarData(iso) {
  const p = iso.split("-");
  return p[2] + "/" + p[1] + "/" + p[0];
}

// "2026-10-19" -> "19/10"
function formatarDataCurta(iso) {
  const p = iso.split("-");
  return p[2] + "/" + p[1];
}

// Converte o que foi digitado em número (ou null se estiver vazio)
function numeroOuNulo(valor) {
  const n = parseFloat(String(valor).replace(",", "."));
  return isNaN(n) ? null : n;
}

// Mostra o número, ou "-" se não tiver
function mostrarNumero(n) {
  return n === null || n === undefined ? "-" : String(n);
}

// Ordem do mais antigo pro mais novo
function ordemCronologica(a, b) {
  if (a.data !== b.data) {
    return a.data < b.data ? -1 : 1;
  }
  return (a.id || 0) - (b.id || 0);
}

// Data em formato 2026-10-19
function dataISO(d) {
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return d.getFullYear() + "-" + mes + "-" + dia;
}

// ---------- Trocar de tela ----------
const telaTreino = document.getElementById("tela-treino");
const telaHistorico = document.getElementById("tela-historico");
const menuTreino = document.getElementById("menu-treino");
const menuHistorico = document.getElementById("menu-historico");
const listaHistorico = document.getElementById("lista-historico");

function mostrarTela(qual) {
  const noHistorico = qual === "historico";
  telaTreino.hidden = noHistorico;
  telaHistorico.hidden = !noHistorico;
  menuTreino.className = noHistorico ? "" : "ativo";
  menuHistorico.className = noHistorico ? "ativo" : "";
  if (noHistorico) {
    desenharHistorico();
  }
}

menuTreino.addEventListener("click", function () {
  mostrarTela("treino");
});
menuHistorico.addEventListener("click", function () {
  mostrarTela("historico");
});

// ---------- Salvar o treino de hoje ----------
document.getElementById("salvar-treino").addEventListener("click", function () {
  const dia = plano[diaAtual];
  const exercicios = [];

  dia.grupos.forEach(function (g) {
    g.exercicios.forEach(function (e) {
      if (e.nome.trim() === "") {
        return; // ignora exercício sem nome
      }
      exercicios.push({
        grupo: g.grupo,
        nome: e.nome.trim(),
        series: numeroOuNulo(e.series),
        kg: numeroOuNulo(e.kg),
        reps: numeroOuNulo(e.reps)
      });
    });
  });

  if (exercicios.length === 0) {
    alert("Não há exercícios pra salvar neste dia.");
    return;
  }

  const hoje = dataDeHoje();
  const posicao = historico.findIndex(function (h) {
    return h.data === hoje && h.dia === diaAtual;
  });

  if (posicao >= 0) {
    if (!confirm("Você já salvou este treino hoje. Substituir pelo atual?")) {
      return;
    }
    historico.splice(posicao, 1);
  }

  historico.push({
    id: Date.now(),
    data: hoje,
    dia: diaAtual,
    nomeDia: dia.nome,
    exercicios: exercicios
  });
  salvarHistorico();
  alert("Treino salvo no histórico!");
});

// ---------- Desenhar a lista do histórico ----------
function criarResumo(principal, extra) {
  const resumo = document.createElement("summary");
  const a = document.createElement("span");
  a.className = "principal";
  a.textContent = principal;
  resumo.append(a);
  if (extra) {
    const b = document.createElement("span");
    b.className = "extra";
    b.textContent = extra;
    resumo.append(b);
  }
  return resumo;
}

function desenharHistorico() {
  listaHistorico.replaceChildren();

  if (historico.length === 0) {
    const aviso = document.createElement("p");
    aviso.className = "aviso";
    aviso.textContent = "Nenhum treino salvo ainda. Na tela Treino, use o botão \"Salvar treino de hoje\".";
    listaHistorico.append(aviso);
    return;
  }

  // Do mais recente pro mais antigo
  historico
    .slice()
    .sort(ordemCronologica)
    .reverse()
    .forEach(function (h) {
      listaHistorico.append(criarCartaoData(h));
    });
}

// Cartão de um treino salvo (a linha vermelha do seu desenho)
function criarCartaoData(h) {
  const caixa = document.createElement("details");

  const titulo =
    formatarData(h.data) + " · " + (h.nomeDia || "") + (h.exemplo ? " (exemplo)" : "");
  const resumo = criarResumo(titulo);

  const remover = criarBotao("✕", "botao-pequeno botao-remover", function (evento) {
    evento.preventDefault();
    evento.stopPropagation();
    if (confirm("Apagar este treino do histórico?")) {
      historico = historico.filter(function (x) {
        return x !== h;
      });
      salvarHistorico();
      desenharHistorico();
    }
  });
  resumo.append(remover);
  caixa.append(resumo);

  h.exercicios.forEach(function (e) {
    caixa.append(criarCartaoExercicio(e));
  });

  return caixa;
}

// Cartão de um exercício (a linha azul do seu desenho)
function criarCartaoExercicio(e) {
  const caixa = document.createElement("details");

  const resumoDoDia =
    mostrarNumero(e.series) + "x | " + mostrarNumero(e.kg) + "kg | " + mostrarNumero(e.reps);
  caixa.append(criarResumo(e.nome, resumoDoDia));

  // O conteúdo só é montado na primeira vez que abre
  let montado = false;
  caixa.addEventListener("toggle", function () {
    if (caixa.open && !montado) {
      montado = true;
      caixa.append(criarDetalheExercicio(e.nome));
    }
  });

  return caixa;
}

// Todos os registros de um exercício, do mais antigo ao mais novo
function registrosDoExercicio(nome) {
  const lista = [];
  historico
    .slice()
    .sort(ordemCronologica)
    .forEach(function (h) {
      h.exercicios.forEach(function (e) {
        if (e.nome === nome) {
          lista.push({ data: h.data, series: e.series, kg: e.kg, reps: e.reps });
        }
      });
    });
  return lista;
}

function criarLinhaRegistro(valores, classe) {
  const linha = document.createElement("div");
  linha.className = classe;
  valores.forEach(function (v) {
    const celula = document.createElement("span");
    celula.textContent = v;
    linha.append(celula);
  });
  return linha;
}

// Parte de dentro do exercício: registros + gráfico
function criarDetalheExercicio(nome) {
  const registros = registrosDoExercicio(nome);
  const area = document.createElement("div");
  area.className = "detalhe-exercicio";

  area.append(criarLinhaRegistro(["Data", "Série", "Kg", "Reps"], "registro cabecalho"));
  registros
    .slice()
    .reverse() // mais recente primeiro
    .forEach(function (r) {
      area.append(
        criarLinhaRegistro(
          [formatarDataCurta(r.data), mostrarNumero(r.series), mostrarNumero(r.kg), mostrarNumero(r.reps)],
          "registro"
        )
      );
    });

  // Botões Kg / Reps + gráfico
  const escolha = document.createElement("div");
  escolha.className = "escolha-grafico";
  const areaGrafico = document.createElement("div");
  areaGrafico.className = "grafico";

  const botaoKg = document.createElement("button");
  botaoKg.textContent = "Kg";
  const botaoReps = document.createElement("button");
  botaoReps.textContent = "Reps";

  function mostrarGrafico(campo) {
    botaoKg.className = campo === "kg" ? "ativo" : "";
    botaoReps.className = campo === "reps" ? "ativo" : "";
    areaGrafico.replaceChildren(desenharGrafico(registros, campo));
  }

  botaoKg.addEventListener("click", function () {
    mostrarGrafico("kg");
  });
  botaoReps.addEventListener("click", function () {
    mostrarGrafico("reps");
  });

  escolha.append(botaoKg, botaoReps);
  area.append(escolha, areaGrafico);
  mostrarGrafico("kg");

  return area;
}

// ---------- Gráfico de linha (SVG) ----------
// Cria um elemento SVG com atributos
function elementoSvg(nome, atributos) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", nome);
  Object.keys(atributos).forEach(function (chave) {
    el.setAttribute(chave, atributos[chave]);
  });
  return el;
}

function desenharGrafico(registros, campo) {
  const pontos = registros.filter(function (r) {
    return r[campo] !== null && r[campo] !== undefined;
  });

  if (pontos.length < 2) {
    const aviso = document.createElement("p");
    aviso.className = "aviso";
    aviso.textContent =
      "O gráfico aparece quando houver pelo menos 2 treinos com " +
      (campo === "kg" ? "carga" : "reps") +
      " preenchida.";
    return aviso;
  }

  const valores = pontos.map(function (p) {
    return p[campo];
  });
  let min = Math.min.apply(null, valores);
  let max = Math.max.apply(null, valores);
  if (min === max) {
    min = min - 1;
    max = max + 1;
  }
  const folga = (max - min) * 0.15;
  min = min - folga;
  max = max + folga;

  // Área do desenho (dentro de um quadro de 300 x 165)
  const esquerda = 24;
  const direita = 284;
  const topo = 25;
  const base = 130;
  const n = pontos.length;

  function posX(i) {
    return esquerda + i * ((direita - esquerda) / (n - 1));
  }
  function posY(v) {
    return base - ((v - min) / (max - min)) * (base - topo);
  }

  const svg = elementoSvg("svg", { viewBox: "0 0 300 165" });

  // Linha do eixo embaixo
  svg.append(elementoSvg("line", { x1: esquerda, y1: 140, x2: direita, y2: 140, class: "eixo-grafico" }));

  // A linha do gráfico
  const textoPontos = pontos
    .map(function (p, i) {
      return posX(i) + "," + posY(p[campo]);
    })
    .join(" ");
  svg.append(elementoSvg("polyline", { points: textoPontos, class: "linha-grafico" }));

  // Bolinhas e valores
  pontos.forEach(function (p, i) {
    svg.append(
      elementoSvg("circle", { cx: posX(i), cy: posY(p[campo]), r: 3.5, class: "ponto-grafico" })
    );
    if (n <= 8 || i === 0 || i === n - 1) {
      const valor = elementoSvg("text", {
        x: posX(i),
        y: posY(p[campo]) - 8,
        "text-anchor": "middle",
        class: "valor-grafico"
      });
      valor.textContent = String(p[campo]);
      svg.append(valor);
    }
  });

  // Datas: primeira e última
  const dataInicio = elementoSvg("text", { x: esquerda, y: 158, "text-anchor": "start", class: "texto-grafico" });
  dataInicio.textContent = formatarDataCurta(pontos[0].data);
  const dataFim = elementoSvg("text", { x: direita, y: 158, "text-anchor": "end", class: "texto-grafico" });
  dataFim.textContent = formatarDataCurta(pontos[n - 1].data);
  svg.append(dataInicio, dataFim);

  return svg;
}

// ---------- Dados de exemplo (só pra testar) ----------
document.getElementById("gerar-exemplos").addEventListener("click", function () {
  // Remove exemplos antigos pra não duplicar
  historico = historico.filter(function (h) {
    return !h.exemplo;
  });

  const chave = plano.seg ? "seg" : Object.keys(plano)[0];
  const base = plano[chave];

  // 5 treinos, um por semana, com números crescendo
  for (let i = 5; i >= 1; i--) {
    const data = new Date();
    data.setDate(data.getDate() - 7 * i);

    const exercicios = [];
    base.grupos.forEach(function (g) {
      g.exercicios.forEach(function (e) {
        if (e.nome.trim() === "") {
          return;
        }
        const kg = numeroOuNulo(e.kg);
        const reps = numeroOuNulo(e.reps);
        exercicios.push({
          grupo: g.grupo,
          nome: e.nome.trim(),
          series: numeroOuNulo(e.series),
          kg: kg === null ? null : Math.max(0, kg - i),
          reps: reps === null ? null : Math.max(1, reps - i + (i % 2))
        });
      });
    });

    historico.push({
      id: Date.now() + i,
      data: dataISO(data),
      dia: chave,
      nomeDia: base.nome,
      exemplo: true,
      exercicios: exercicios
    });
  }

  salvarHistorico();
  desenharHistorico();
});

document.getElementById("remover-exemplos").addEventListener("click", function () {
  historico = historico.filter(function (h) {
    return !h.exemplo;
  });
  salvarHistorico();
  desenharHistorico();
});