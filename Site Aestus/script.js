// Aguarda o carregamento completo da página
document.addEventListener('DOMContentLoaded', () => {

    const header = document.querySelector('header');
    const menu = document.getElementById('menu');
    const btnMenu = document.getElementById('btn-menu');

    // --- 1. MENU MOBILE (HAMBÚRGUER) ---
    btnMenu.addEventListener('click', () => {
        const aberto = menu.classList.toggle('aberto');
        btnMenu.classList.toggle('ativo', aberto);
        btnMenu.setAttribute('aria-expanded', aberto);
    });

    // --- 2. ROLAGEM SUAVE NO MENU (e fecha o menu mobile ao clicar) ---
    const linksInternos = document.querySelectorAll('.menu a[href^="#"]');

    linksInternos.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const destinoId = this.getAttribute('href');
            const destinoSection = document.querySelector(destinoId);

            menu.classList.remove('aberto');
            btnMenu.classList.remove('ativo');
            btnMenu.setAttribute('aria-expanded', 'false');

            if (destinoSection) {
                const headerHeight = header.offsetHeight;

                window.scrollTo({
                    top: destinoSection.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 3. CONTADOR ANIMADO NAS ESTATÍSTICAS DO HERO ---
    const contadores = document.querySelectorAll('.stat-num');

    const animarContador = (elemento) => {
        const alvo = parseInt(elemento.getAttribute('data-target'), 10);
        const duracao = 1200;
        const inicio = performance.now();

        const passo = (agora) => {
            const progresso = Math.min((agora - inicio) / duracao, 1);
            elemento.textContent = Math.floor(progresso * alvo);
            if (progresso < 1) {
                requestAnimationFrame(passo);
            } else {
                elemento.textContent = alvo;
            }
        };

        requestAnimationFrame(passo);
    };

    if (contadores.length) {
        const statsObserver = new IntersectionObserver((entradas, observer) => {
            entradas.forEach(entrada => {
                if (entrada.isIntersecting) {
                    animarContador(entrada.target);
                    observer.unobserve(entrada.target);
                }
            });
        }, { threshold: 0.4 });

        contadores.forEach(el => statsObserver.observe(el));
    }

    // --- 4. REVELAR SEÇÕES AO ROLAR A PÁGINA ---
    const elementosRevelaveis = document.querySelectorAll('.reveal');

    if (elementosRevelaveis.length) {
        const revealObserver = new IntersectionObserver((entradas, observer) => {
            entradas.forEach(entrada => {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add('em-vista');
                    observer.unobserve(entrada.target);
                }
            });
        }, { threshold: 0.15 });

        elementosRevelaveis.forEach(el => revealObserver.observe(el));
    }

    console.log('Site da Aestus iniciado com sucesso!');
    const btnTema = document.getElementById('btn-tema');
    const body = document.body;

    if (!btnTema) return;

    // Recupera a preferência salva no navegador (se existir)
    const temaSalvo = localStorage.getItem('aestus_tema');

    if (temaSalvo === 'escuro') {
        body.classList.add('dark-mode');
        btnTema.textContent = '☀️ Claro';
    }

    // Alterna o tema ao clicar no botão
    btnTema.addEventListener('click', () => {
        body.classList.toggle('dark-mode');

        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('aestus_tema', 'escuro');
            btnTema.textContent = '☀️ Claro';
        } else {
            localStorage.setItem('aestus_tema', 'claro');
            btnTema.textContent = '🌙 Escuro';
        }
    });
});
