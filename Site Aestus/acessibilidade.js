// ============================================================
// acessibilidade.js — painel de acessibilidade (botão no canto da tela).
//
// Ideia geral: existe um objeto "estado" com todas as opções. Qualquer
// clique no painel muda o estado, e a função aplicar() transforma o estado
// em classes e estilos no <html>. O CSS (style.css, seção ACESSIBILIDADE)
// faz o resto. O estado fica salvo no navegador para valer nas próximas visitas.
// ============================================================
(function () {
    'use strict';

    var CHAVE = 'aestus_a11y'; // nome com que salvamos tudo no localStorage

    // Valores iniciais. Também usados pelo botão "Restaurar padrão".
    var PADRAO = { fonte: 100, dislexia: false, contraste: false, cinza: false, daltonismo: '', links: false, animacoes: false };
    var raiz = document.documentElement;
    var estado = Object.assign({}, PADRAO); // cópia, para nunca alterar o PADRAO sem querer

    // Recupera o que a pessoa escolheu antes. O Object.assign só sobrescreve
    // o que foi salvo e mantém o padrão no resto (útil se adicionarmos opções novas).
    try { Object.assign(estado, JSON.parse(localStorage.getItem(CHAVE) || '{}')); } catch (e) { /* segue com o padrão */ }

    function salvar() {
        try { localStorage.setItem(CHAVE, JSON.stringify(estado)); } catch (e) { /* sem armazenamento */ }
    }

    // Traduz o estado em mudanças visuais. É chamada sempre que algo muda.
    function aplicar() {
        // Tamanho do texto: mexe no tamanho-base do <html>; tudo que usa "em"
        // no CSS cresce junto.
        raiz.style.fontSize = estado.fonte + '%';

        // Cada opção liga/desliga uma classe; o visual de cada uma está no CSS.
        raiz.classList.toggle('a11y-dislexia', estado.dislexia);
        raiz.classList.toggle('a11y-contraste', estado.contraste);
        raiz.classList.toggle('a11y-links', estado.links);
        raiz.classList.toggle('a11y-sem-animacao', estado.animacoes);

        // Tons de cinza e daltonismo usam a mesma propriedade (filter), então
        // juntamos os dois numa lista só. Assim um não apaga o outro.
        var filtros = [];
        if (estado.cinza) filtros.push('grayscale(1)');
        if (estado.daltonismo) filtros.push('url(#a11y-' + estado.daltonismo + ')'); // filtros SVG do index.html
        raiz.style.filter = filtros.join(' ');
    }

    // Roda já na carga do script (que está no <head>) para a página nascer
    // com as preferências aplicadas, sem piscar.
    aplicar();

    // A parte do painel precisa dos elementos do HTML, então espera a página carregar.
    document.addEventListener('DOMContentLoaded', function () {
        var botao = document.getElementById('a11y-botao');
        var painel = document.getElementById('a11y-painel');
        if (!botao || !painel) return;

        var rotuloFonte = document.getElementById('a11y-fonte-valor');
        var selDalto = document.getElementById('a11y-daltonismo');
        var chaves = painel.querySelectorAll('[data-a11y]'); // todos os interruptores

        // Deixa o painel mostrando o estado real (texto "110%", interruptores
        // ligados/desligados). Chamada ao abrir a página e ao restaurar.
        function sincronizar() {
            rotuloFonte.textContent = estado.fonte + '%';
            selDalto.value = estado.daltonismo;
            chaves.forEach(function (c) { c.checked = !!estado[c.dataset.a11y]; });
        }

        // Abre ou fecha o painel. O foco vai para dentro ao abrir, para quem
        // usa teclado ou leitor de tela não ficar "perdido" atrás do painel.
        function abrir(abrirPainel) {
            painel.hidden = !abrirPainel;
            botao.setAttribute('aria-expanded', String(abrirPainel));
            if (abrirPainel) painel.querySelector('button, input, select').focus();
        }

        botao.addEventListener('click', function () { abrir(painel.hidden); });
        document.getElementById('a11y-fechar').addEventListener('click', function () { abrir(false); botao.focus(); });

        // Esc fecha o painel e devolve o foco ao botão (padrão em janelas flutuantes).
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && !painel.hidden) { abrir(false); botao.focus(); }
        });
        // Clique fora do painel também fecha, para ele não ficar atrapalhando.
        document.addEventListener('click', function (e) {
            if (!painel.hidden && !painel.contains(e.target) && !botao.contains(e.target)) abrir(false);
        });

        // A− / A+: muda de 10 em 10%, com trava entre 80% e 150% para o
        // layout não quebrar nem ficar minúsculo.
        function mudarFonte(delta) {
            estado.fonte = Math.min(150, Math.max(80, estado.fonte + delta));
            aplicar(); sincronizar(); salvar();
        }
        document.getElementById('a11y-menos').addEventListener('click', function () { mudarFonte(-10); });
        document.getElementById('a11y-mais').addEventListener('click', function () { mudarFonte(10); });

        // Todos os interruptores usam o mesmo código: o atributo data-a11y no
        // HTML diz qual opção do estado ele controla (ex.: data-a11y="contraste").
        chaves.forEach(function (c) {
            c.addEventListener('change', function () {
                estado[c.dataset.a11y] = c.checked;
                aplicar(); salvar();
            });
        });

        selDalto.addEventListener('change', function () {
            estado.daltonismo = selDalto.value;
            aplicar(); salvar();
        });

        // Volta tudo ao padrão e limpa a tela e o painel.
        document.getElementById('a11y-reset').addEventListener('click', function () {
            estado = Object.assign({}, PADRAO);
            aplicar(); sincronizar(); salvar();
        });

        sincronizar();
    });
})();
