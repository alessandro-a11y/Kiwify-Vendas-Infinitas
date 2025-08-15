document.addEventListener('DOMContentLoaded', () => {

    // Seleciona todas as seções que você deseja observar
    const sections = document.querySelectorAll('.section');

    // Cria uma nova instância do IntersectionObserver
    // O callback é a função que será executada quando a visibilidade de um elemento mudar.
    // As opções definem quando o callback deve ser ativado.
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Verifica se a seção está visível na viewport (isIntersecting)
            if (entry.isIntersecting) {
                // Adiciona a classe 'in-view' para aplicar a animação
                entry.target.classList.add('in-view');
                // Para de observar o elemento para que a animação não se repita
                observer.unobserve(entry.target);
            }
        });
    }, {
        // Opções do observador
        root: null, // O viewport (área visível do navegador) é o elemento raiz
        rootMargin: '0px', // Nenhuma margem extra
        threshold: 0.2 // A callback é ativada quando 20% do elemento está visível
    });

    // Percorre todas as seções e começa a observá-las
    sections.forEach(section => observer.observe(section));

});