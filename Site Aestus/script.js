// ============================================================
// script.js — o "cérebro" da página: menu, rolagem, animações e tema.
// Tudo roda só depois que o HTML terminou de carregar, porque
// antes disso os elementos ainda não existem e o código quebraria.
// ============================================================
document.addEventListener('DOMContentLoaded', () => {

    // Pegamos uma vez só os elementos que vamos usar várias vezes.
    const header = document.querySelector('header');
    const menu = document.getElementById('menu');
    const btnMenu = document.getElementById('btn-menu');

    // --- 1. MENU MOBILE (HAMBÚRGUER) ---
    // No celular o menu fica escondido. Ao clicar no botão, a classe "aberto"
    // é ligada/desligada: o CSS usa ela para mostrar o menu e transformar
    // as 3 linhas do botão em um "X". O aria-expanded avisa leitores de tela
    // se o menu está aberto ou fechado.
    btnMenu.addEventListener('click', () => {
        const aberto = menu.classList.toggle('aberto');
        btnMenu.classList.toggle('ativo', aberto);
        btnMenu.setAttribute('aria-expanded', aberto);
    });

    // --- 2. ROLAGEM SUAVE NO MENU ---
    // Pega só os links do menu que apontam para uma seção da própria página (#sobre, #ods...).
    const linksInternos = document.querySelectorAll('.menu a[href^="#"]');

    linksInternos.forEach(link => {
        link.addEventListener('click', function (e) {
            // Cancelamos o pulo seco do navegador para controlar a rolagem nós mesmos.
            e.preventDefault();

            const destinoId = this.getAttribute('href');
            const destinoSection = document.querySelector(destinoId);

            // Fecha o menu mobile, senão ele ficaria aberto cobrindo a seção.
            menu.classList.remove('aberto');
            btnMenu.classList.remove('ativo');
            btnMenu.setAttribute('aria-expanded', 'false');

            if (destinoSection) {
                // O header é fixo e ficaria por cima do título da seção;
                // por isso descontamos a altura dele da posição final.
                const headerHeight = header.offsetHeight;

                window.scrollTo({
                    top: destinoSection.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 3. REVELAR SEÇÕES AO ROLAR A PÁGINA ---
    // As seções com classe "reveal" começam invisíveis (ver style.css).
    // O IntersectionObserver avisa quando uma delas entra na tela, e aí
    // damos a classe "em-vista" para ela aparecer com a animação.
    // Isso é bem mais leve do que ouvir o evento de scroll o tempo todo.
    const elementosRevelaveis = document.querySelectorAll('.reveal');

    if (elementosRevelaveis.length) {
        const revealObserver = new IntersectionObserver((entradas, observer) => {
            entradas.forEach(entrada => {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add('em-vista');
                    // Depois de revelada não precisamos mais vigiar essa seção.
                    observer.unobserve(entrada.target);
                }
            });
        }, { threshold: 0.15 }); // dispara quando 15% da seção já está visível

        elementosRevelaveis.forEach(el => revealObserver.observe(el));
    }

    // --- 4. BOTÃO DE TEMA (CLARO / ESCURO) ---
    // O tema salvo já foi aplicado pelo darkmode.js, antes da página aparecer.
    // Aqui só cuidamos do botão: o texto dele e o clique.
    const btnTema = document.getElementById('btn-tema');
    const raiz = document.documentElement; // a tag <html>, onde fica a classe "dark-mode"

    if (!btnTema) return; // se o botão não existir, não há mais nada a fazer

    const temaSalvo = localStorage.getItem('aestus_tema');

    // Se o tema já está escuro, o botão deve oferecer a volta para o claro.
    if (temaSalvo === 'escuro' || raiz.classList.contains('dark-mode')) {
        raiz.classList.add('dark-mode');
        btnTema.textContent = '☀️ Claro';
    }

    // A cada clique alterna o tema, atualiza o texto do botão e salva a escolha
    // no navegador para ela ser lembrada na próxima visita.
    btnTema.addEventListener('click', () => {
        raiz.classList.toggle('dark-mode');

        if (raiz.classList.contains('dark-mode')) {
            localStorage.setItem('aestus_tema', 'escuro');
            btnTema.textContent = '☀️ Claro';
        } else {
            localStorage.setItem('aestus_tema', 'claro');
            btnTema.textContent = '🌙 Escuro';
        }
    });
});
