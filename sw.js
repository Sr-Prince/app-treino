// Se você mudar algum arquivo do app, aumente este número (v1 -> v2)
// pra o celular baixar a versão nova
const VERSAO = "treino-v1";

const ARQUIVOS = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./historico.js",
  "./manifest.json",
  "./icone-192.png",
  "./icone-512.png"
];

// Na instalação: guarda todos os arquivos no celular
self.addEventListener("install", function (evento) {
  evento.waitUntil(
    caches.open(VERSAO).then(function (cache) {
      return cache.addAll(ARQUIVOS);
    })
  );
  self.skipWaiting();
});

// Na ativação: apaga guardados de versões antigas
self.addEventListener("activate", function (evento) {
  evento.waitUntil(
    caches.keys().then(function (nomes) {
      return Promise.all(
        nomes
          .filter(function (nome) {
            return nome !== VERSAO;
          })
          .map(function (nome) {
            return caches.delete(nome);
          })
      );
    })
  );
  self.clients.claim();
});

// A cada pedido: usa o arquivo guardado; se não tiver, busca na internet
self.addEventListener("fetch", function (evento) {
  evento.respondWith(
    caches.match(evento.request).then(function (guardado) {
      return guardado || fetch(evento.request);
    })
  );
});