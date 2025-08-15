document.addEventListener('DOMContentLoaded', () => {

    // Funções auxiliares (helpers) para evitar repetição de código (DRY - Don't Repeat Yourself)
    const aplicarAnimacaoEscalonada = (elementos, multiplicadorDelay) => {
        elementos.forEach((elemento, indice) => {
            elemento.style.animationDelay = `${0.1 + indice * multiplicadorDelay}s`;
            elemento.classList.add('in-view');
        });
    };

    const configurarObservador = (seletor, threshold, callback) => {
        const elementos = document.querySelectorAll(seletor);
        if (elementos.length > 0) {
            const observador = new IntersectionObserver((entradas, observador) => {
                entradas.forEach(entrada => {
                    if (entrada.isIntersecting) {
                        callback(entrada.target);
                        observador.unobserve(entrada.target);
                    }
                });
            }, { threshold });
            elementos.forEach(elemento => observador.observe(elemento));
        }
    };

    // 1. Interseções e animações
    // ------------------------------------------------
    configurarObservador('section', 0.2, (secao) => {
        secao.classList.add('in-view');

        const idSecao = secao.id;
        const classesSecao = secao.classList;

        if (idSecao === 'o-que-e' || classesSecao.contains('how-to-earn')) {
            aplicarAnimacaoEscalonada(secao.querySelectorAll('.card'), 0.15);
        } else if (idSecao === 'depoimentos-reais') {
            aplicarAnimacaoEscalonada(secao.querySelectorAll('.depoimento'), 0.2);
        }
    });

    configurarObservador('.hero-header-content', 0.1, (conteudoHero) => {
        // A animação do herói é controlada diretamente pelo CSS.
        // Se a lógica fosse por aqui, seria algo como:
        // conteudoHero.classList.add('in-view');
    });

    // 2. Rolagem suave para links âncora
    // ------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(ancora => {
        ancora.addEventListener('click', (e) => {
            e.preventDefault();

            const idAlvo = ancora.getAttribute('href');
            const elementoAlvo = document.querySelector(idAlvo);

            if (elementoAlvo) {
                elementoAlvo.scrollIntoView({ behavior: 'smooth' });
                history.pushState(null, '', idAlvo);
            }
        });
    });

    // 3. Efeito de digitação dinâmico
    // ------------------------------------
    const elementoTextoDigitando = document.getElementById('typing-text');
    if (elementoTextoDigitando) {
        const textos = JSON.parse(elementoTextoDigitando.dataset.texts);
        let indiceTexto = 0;
        let indiceCaractere = 0;
        let estaDeletando = false;
        const velocidadeDigitacao = 100;
        const velocidadeDelecao = 50;
        const pausaAntesDeletar = 2000;
        const pausaAntesDigitar = 1000;

        const digitar = () => {
            const textoAtual = textos[indiceTexto];
            if (!estaDeletando) {
                elementoTextoDigitando.textContent = textoAtual.substring(0, indiceCaractere + 1);
                indiceCaractere++;
                if (indiceCaractere === textoAtual.length) {
                    estaDeletando = true;
                    setTimeout(digitar, pausaAntesDeletar);
                } else {
                    setTimeout(digitar, velocidadeDigitacao);
                }
            } else {
                elementoTextoDigitando.textContent = textoAtual.substring(0, indiceCaractere - 1);
                indiceCaractere--;
                if (indiceCaractere === 0) {
                    estaDeletando = false;
                    indiceTexto = (indiceTexto + 1) % textos.length;
                    setTimeout(digitar, pausaAntesDigitar);
                } else {
                    setTimeout(digitar, velocidadeDelecao);
                }
            }
        };

        setTimeout(digitar, 1500);
    }

    // 4. Botão "Voltar ao Topo"
    // ------------------------------------
    const botaoVoltarAoTopo = document.querySelector('#back-to-top');
    if (botaoVoltarAoTopo) {
        window.addEventListener('scroll', () => {
            botaoVoltarAoTopo.classList.toggle('show', window.scrollY > 300);
        });

        botaoVoltarAoTopo.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // A função auxiliar `isInViewport` foi removida, pois o `IntersectionObserver`
    // já lida com a detecção de visibilidade de forma mais eficiente.
});