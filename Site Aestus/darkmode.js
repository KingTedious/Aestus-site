// ============================================================
// darkmode.js — aplica o tema escuro salvo ANTES da página ser desenhada.
//
// Por que existe um arquivo separado? Ele é carregado no <head>, então roda
// antes de o navegador pintar qualquer coisa. Se deixássemos isso só no
// script.js (que carrega no fim), a página apareceria clara por uma fração
// de segundo e depois escureceria: aquele "piscar" incômodo.
// ============================================================
(function () {
    // try/catch porque em alguns navegadores (aba anônima, por exemplo)
    // o localStorage pode estar bloqueado e lançar erro.
    try {
        if (localStorage.getItem('aestus_tema') === 'escuro') {
            // A classe vai na tag <html> porque ela já existe neste momento;
            // o <body> ainda nem foi criado.
            document.documentElement.classList.add('dark-mode');
        }
    } catch (e) { /* sem localStorage: segue no tema claro */ }
})();
