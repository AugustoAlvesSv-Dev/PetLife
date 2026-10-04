

(function () {
  'use strict';

  const semAnimacao = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const temMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const somenteDigitos = (valor) => valor.replace(/\D/g, '');
  const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

 
  function configurarCabecalho() {
    const header = document.querySelector('header');
    if (!header) return;

    header.classList.add('header-fixo');

    let compacto = false;
    let agendado = false;

    const atualizar = () => {
      
      if (!compacto && window.scrollY > 80) compacto = true;
      else if (compacto && window.scrollY < 20) compacto = false;

      header.classList.toggle('header-compacto', compacto);
      agendado = false;
    };

    window.addEventListener(
      'scroll',
      () => {
        if (!agendado) {
          agendado = true;
          requestAnimationFrame(atualizar);
        }
      },
      { passive: true }
    );
    atualizar();
  }

 
  function digitarTitulo() {
    if (semAnimacao) return;
    const titulo = document.querySelector('.hero h1, .hero h2');
    if (!titulo) return;

    const texto = titulo.textContent.trim().replace(/\s+/g, ' ');
    titulo.setAttribute('aria-label', texto); // leitor de tela lê o texto inteiro

    const digitado = document.createElement('span');
    const cursor = document.createElement('span');
    const restante = document.createElement('span');

    cursor.className = 'cursor-digitacao';
    restante.className = 'texto-restante';
    [digitado, cursor, restante].forEach((el) => el.setAttribute('aria-hidden', 'true'));

    restante.textContent = texto;
    titulo.textContent = '';
    titulo.append(digitado, cursor, restante);

    let i = 0;
    const digitar = () => {
      i++;
      digitado.textContent = texto.slice(0, i);
      restante.textContent = texto.slice(i);

      if (i < texto.length) {
        setTimeout(digitar, texto[i - 1] === ' ' ? 80 : 45);
      } else {
        setTimeout(() => cursor.classList.add('cursor-fim'), 1500);
      }
    };
    setTimeout(digitar, 350);
  }


  function revelarAoRolar() {
    if (semAnimacao || !('IntersectionObserver' in window)) return;

    const alvos = [];
    document.querySelectorAll('main > section:not(.hero)').forEach((secao) => {
      let ordem = 0;

      Array.from(secao.children).forEach((filho) => {
        // Tabelas e listas aparecem linha por linha
        let itens = [filho];
        if (filho.tagName === 'TABLE' && filho.tBodies[0]) itens = Array.from(filho.tBodies[0].rows);
        if (filho.tagName === 'UL' || filho.tagName === 'OL') itens = Array.from(filho.children);

        itens.forEach((item) => {
          item.classList.add('revelar');
          item.style.transitionDelay = `${Math.min(ordem, 6) * 90}ms`;
          ordem++;
          alvos.push(item);
        });
      });
    });

    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;
          const el = entrada.target;
          el.classList.add('visivel');
          observador.unobserve(el);

          // Depois que aparece, tira o atraso para não afetar outros efeitos
          el.addEventListener('transitionend', () => (el.style.transitionDelay = ''), {
            once: true,
          });
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    alvos.forEach((alvo) => observador.observe(alvo));
  }

  
  function inclinarCards() {
    if (semAnimacao || !temMouse) return;

    document.querySelectorAll('.cards article').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.12s ease-out, box-shadow 0.3s ease';
        card.classList.add('card-ativo');
      });

      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;  // -0.5 a 0.5
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          `perspective(900px) rotateX(${(-y * 8).toFixed(2)}deg) ` +
          `rotateY(${(x * 8).toFixed(2)}deg) translateY(-6px)`;
        // Posição do brilho que acompanha o mouse
        card.style.setProperty('--mx', `${((x + 0.5) * 100).toFixed(1)}%`);
        card.style.setProperty('--my', `${((y + 0.5) * 100).toFixed(1)}%`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.45s ease, box-shadow 0.3s ease';
        card.style.transform = '';
        card.classList.remove('card-ativo');
      });
    });
  }

 
  function destacarTabelas() {
    document.querySelectorAll('table').forEach((tabela) => {
      const limpar = () =>
        tabela.querySelectorAll('.col-destaque').forEach((c) => c.classList.remove('col-destaque'));

      tabela.addEventListener('mouseover', (e) => {
        const celula = e.target.closest('td');
        if (!celula) return;
        limpar();
        const indice = celula.cellIndex;
        Array.from(tabela.rows).forEach((linha) => {
          if (linha.cells[indice]) linha.cells[indice].classList.add('col-destaque');
        });
      });

      tabela.addEventListener('mouseleave', limpar);
    });
  }

  
  function simuladorHotel() {
    const tabela = Array.from(document.querySelectorAll('table')).find(
      (t) => t.tHead && /di[aá]ria/i.test(t.tHead.textContent)
    );
    if (!tabela || !tabela.tBodies[0]) return;

    const planos = Array.from(tabela.tBodies[0].rows).map((linha) => ({
      porte: linha.cells[0].textContent.trim(),
      diaria: Number(somenteDigitos(linha.cells[1].textContent)),
      alta: Number(somenteDigitos(linha.cells[2].textContent)),
      linha,
    }));
    if (!planos.length) return;

    const MIN = 1;
    const MAX = 30;

    const caixa = document.createElement('div');
    caixa.className = 'simulador';
    caixa.innerHTML = `
      <h3>Simule a hospedagem</h3>
      <div class="simulador-campos">
        <p>
          <label for="sim-porte">Porte do pet:</label>
          <select id="sim-porte"></select>
        </p>
        <p>
          <label for="sim-diarias">Quantidade de diárias:</label>
          <span class="seletor-diarias">
            <button type="button" data-passo="-1" aria-label="Diminuir diárias">−</button>
            <input type="number" id="sim-diarias" min="${MIN}" max="${MAX}" value="1" inputmode="numeric" />
            <button type="button" data-passo="1" aria-label="Aumentar diárias">+</button>
          </span>
        </p>
        <p class="simulador-check">
          <label><input type="checkbox" id="sim-alta" /> Alta temporada</label>
        </p>
      </div>
      <p class="simulador-total">
        Total estimado: <strong id="sim-total" aria-hidden="true"></strong>
      </p>
      <p class="simulador-detalhe" id="sim-detalhe" aria-live="polite"></p>
    `;
    tabela.insertAdjacentElement('afterend', caixa);

    const porte = caixa.querySelector('#sim-porte');
    const diarias = caixa.querySelector('#sim-diarias');
    const alta = caixa.querySelector('#sim-alta');
    const total = caixa.querySelector('#sim-total');
    const detalhe = caixa.querySelector('#sim-detalhe');

    planos.forEach((plano, i) => {
      const opcao = document.createElement('option');
      opcao.value = String(i);
      opcao.textContent = plano.porte;
      porte.append(opcao);
    });

    let valorExibido = 0;
    let animacao = null;

    // Faz o total "correr" até o novo valor
    function animarTotal(destino) {
      cancelAnimationFrame(animacao);
      if (semAnimacao) {
        valorExibido = destino;
        total.textContent = moeda.format(destino);
        return;
      }
      const inicio = valorExibido;
      const comeco = performance.now();
      const duracao = 450;

      const passo = (agora) => {
        const t = Math.min((agora - comeco) / duracao, 1);
        const suave = 1 - Math.pow(1 - t, 3);
        valorExibido = inicio + (destino - inicio) * suave;
        total.textContent = moeda.format(valorExibido);
        if (t < 1) animacao = requestAnimationFrame(passo);
      };
      animacao = requestAnimationFrame(passo);

      total.classList.remove('pulsar');
      void total.offsetWidth; // reinicia a animação de pulso
      total.classList.add('pulsar');
    }

    function calcular() {
      let qtd = parseInt(diarias.value, 10);
      if (Number.isNaN(qtd)) return; // campo vazio enquanto a pessoa digita
      qtd = Math.min(Math.max(qtd, MIN), MAX);

      const plano = planos[Number(porte.value)];
      const valorDia = alta.checked ? plano.alta : plano.diaria;
      const soma = valorDia * qtd;

      animarTotal(soma);
      detalhe.textContent =
        `${qtd} ${qtd === 1 ? 'diária' : 'diárias'} × ${moeda.format(valorDia)} ` +
        `(${plano.porte}${alta.checked ? ', alta temporada' : ''}) = ${moeda.format(soma)}`;

      // Destaca na tabela o preço que está sendo usado
      planos.forEach((p) => {
        p.linha.classList.remove('linha-ativa');
        Array.from(p.linha.cells).forEach((c) => c.classList.remove('celula-ativa'));
      });
      plano.linha.classList.add('linha-ativa');
      plano.linha.cells[alta.checked ? 2 : 1].classList.add('celula-ativa');
    }

    function corrigirDiarias() {
      const qtd = parseInt(diarias.value, 10);
      diarias.value = Number.isNaN(qtd) ? MIN : Math.min(Math.max(qtd, MIN), MAX);
      calcular();
    }

    caixa.querySelectorAll('[data-passo]').forEach((botao) => {
      botao.addEventListener('click', () => {
        const atual = parseInt(diarias.value, 10) || MIN;
        diarias.value = Math.min(Math.max(atual + Number(botao.dataset.passo), MIN), MAX);
        calcular();
      });
    });

    porte.addEventListener('change', calcular);
    alta.addEventListener('change', calcular);
    diarias.addEventListener('input', calcular);
    diarias.addEventListener('blur', corrigirDiarias);

    calcular();
  }

 
  function ampliarFotosAdocao() {
    if (!document.querySelector('select[name="pet"]')) return;
    if (typeof HTMLDialogElement !== 'function') return;

    const cards = Array.from(document.querySelectorAll('.cards article')).filter((card) =>
      card.querySelector('img')
    );
    if (!cards.length) return;

    const dialogo = document.createElement('dialog');
    dialogo.className = 'lightbox';
    dialogo.setAttribute('aria-labelledby', 'lightbox-nome');
    dialogo.innerHTML = `
      <div class="lightbox-conteudo">
        <button type="button" class="lightbox-fechar" aria-label="Fechar">×</button>
        <img alt="" />
        <div class="lightbox-legenda">
          <h3 id="lightbox-nome"></h3>
          <p></p>
          <button type="button" class="lightbox-acao">Quero conhecer</button>
        </div>
      </div>
    `;
    document.body.append(dialogo);

    const foto = dialogo.querySelector('img');
    const nome = dialogo.querySelector('h3');
    const descricao = dialogo.querySelector('p');
    let cardAtual = null;

    function abrir(card) {
      cardAtual = card;
      const img = card.querySelector('img');
      foto.src = img.src;
      foto.alt = img.alt;
      nome.textContent = card.querySelector('h3')?.textContent.trim() || '';
      descricao.textContent = Array.from(card.querySelectorAll('p'))
        .map((p) => p.textContent.trim().replace(/\s+/g, ' '))
        .join(' · ');
      dialogo.showModal();
    }

    function fechar() {
      dialogo.close();
    }

    cards.forEach((card) => {
      const img = card.querySelector('img');
      const nomePet = card.querySelector('h3')?.textContent.trim() || 'pet';
      img.classList.add('foto-ampliavel');
      img.tabIndex = 0;
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', `Ampliar foto de ${nomePet}`);

      img.addEventListener('click', () => abrir(card));
      img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          abrir(card);
        }
      });
    });

    dialogo.querySelector('.lightbox-fechar').addEventListener('click', fechar);

    // Clicar fora da foto também fecha
    dialogo.addEventListener('click', (e) => {
      if (e.target === dialogo) fechar();
    });

    // "Quero conhecer" fecha a foto e usa o link do próprio card
    // (que já seleciona o pet e leva ao formulário)
    dialogo.querySelector('.lightbox-acao').addEventListener('click', () => {
      fechar();
      const link = cardAtual?.querySelector('a[href="#formulario"]');
      if (link) link.click();
    });
  }

  
  function botaoVoltarAoTopo() {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'voltar-topo';
    botao.setAttribute('aria-label', 'Voltar ao topo');
    botao.innerHTML = '<span aria-hidden="true">↑</span>';
    document.body.append(botao);

    let agendado = false;
    const atualizar = () => {
      botao.classList.toggle('visivel', window.scrollY > 500);
      agendado = false;
    };

    window.addEventListener(
      'scroll',
      () => {
        if (!agendado) {
          agendado = true;
          requestAnimationFrame(atualizar);
        }
      },
      { passive: true }
    );

    botao.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: semAnimacao ? 'auto' : 'smooth' });
    });

    atualizar();
  }

  /* ----------------------------------------------------------------------
     9. Patinhas ao clicar em áreas livres da página
     ---------------------------------------------------------------------- */
  function patinhasNoClique() {
    if (semAnimacao) return;

    document.addEventListener('click', (e) => {
      if (e.detail === 0) return; // clique pelo teclado
      if (e.target.closest('a, button, input, select, textarea, label, dialog, [role="button"], .hero img')) return;

      const pata = document.createElement('span');
      pata.className = 'patinha';
      pata.textContent = '🐾';
      pata.setAttribute('aria-hidden', 'true');
      pata.style.left = `${e.clientX}px`;
      pata.style.top = `${e.clientY}px`;
      pata.style.setProperty('--giro', `${Math.round(Math.random() * 60 - 30)}deg`);

      document.body.append(pata);
      pata.addEventListener('animationend', () => pata.remove());
    });
  }

  
  function comemorarEnvio() {
    const simbolos = ['🐾', '❤️', '🐶', '🐱', '⭐', '🦴'];

    document.addEventListener('petlife:enviado', (e) => {
      if (semAnimacao) return;

      // Espera a rolagem até a mensagem de sucesso terminar
      setTimeout(() => {
        const ref = e.detail?.status || e.target;
        const r = ref.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;

        for (let i = 0; i < 30; i++) {
          const peca = document.createElement('span');
          peca.className = 'confete';
          peca.setAttribute('aria-hidden', 'true');
          peca.textContent = simbolos[i % simbolos.length];
          peca.style.left = `${cx}px`;
          peca.style.top = `${cy}px`;
          peca.style.setProperty('--x', `${Math.round(Math.random() * 440 - 220)}px`);
          peca.style.setProperty('--y', `${Math.round(-60 - Math.random() * 200)}px`);
          peca.style.setProperty('--r', `${Math.round(Math.random() * 360 - 180)}deg`);
          peca.style.animationDelay = `${Math.round(Math.random() * 120)}ms`;

          document.body.append(peca);
          peca.addEventListener('animationend', () => peca.remove());
        }
      }, 350);
    });
  }

  
  const ETIQUETAS = {
    // título do card: { linha da tabela, valor reserva, texto antes do preço }
    'banho e tosa': { linha: 'banho', reserva: 35, prefixo: 'A partir de' },
    'hotel': { linha: 'pequeno', reserva: 70, prefixo: 'Diárias a partir de' },
    'adocao': { texto: 'Conheça quem espera por você 🐾' },
    'banho': { linha: 'banho', reserva: 35, prefixo: 'A partir de' },
    'tosa': { linha: 'banho + tosa', reserva: 55, prefixo: 'Com banho, a partir de' },
    'corte de unhas': { linha: 'corte de unhas', reserva: 15, prefixo: 'A partir de' },
    'hospedagem confortavel': { linha: 'pequeno', reserva: 70, prefixo: 'Diárias a partir de' },
  };

  const normalizar = (texto) =>
    texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();

  // Menor preço de uma linha das tabelas desta página (ou null)
  function menorPrecoDaLinha(rotulo) {
    for (const linha of document.querySelectorAll('tbody tr')) {
      if (normalizar(linha.cells[0].textContent) !== rotulo) continue;
      const valores = Array.from(linha.cells)
        .slice(1)
        .map((c) => Number(somenteDigitos(c.textContent)))
        .filter((v) => v > 0);
      if (valores.length) return Math.min(...valores);
    }
    return null;
  }

  function etiquetasDePreco() {
    document.querySelectorAll('.cards article').forEach((card) => {
      const titulo = card.querySelector('h3');
      const regra = titulo && ETIQUETAS[normalizar(titulo.textContent)];
      if (!regra) return;

      const etiqueta = document.createElement('span');
      etiqueta.className = 'etiqueta-preco';

      if (regra.texto) {
        etiqueta.textContent = regra.texto;
      } else {
        const valor = menorPrecoDaLinha(regra.linha) ?? regra.reserva;
        etiqueta.innerHTML = `${regra.prefixo} <strong>R$ <span class="etiqueta-valor">${valor}</span></strong>`;

        // O número "corre" de 0 até o preço a cada vez que o mouse entra
        const numero = etiqueta.querySelector('.etiqueta-valor');
        if (!semAnimacao && temMouse) {
          let quadro = null;
          card.addEventListener('mouseenter', () => {
            cancelAnimationFrame(quadro);
            const inicio = performance.now();
            const passo = (agora) => {
              const t = Math.min((agora - inicio) / 500, 1);
              numero.textContent = Math.round(valor * (1 - Math.pow(1 - t, 3)));
              if (t < 1) quadro = requestAnimationFrame(passo);
            };
            quadro = requestAnimationFrame(passo);
          });
        }
      }

      card.classList.add('com-etiqueta');
      card.prepend(etiqueta);
    });
  }

  
  function petsFalantes() {
    const imagem = document.querySelector('.hero img');
    if (!imagem) return;

    const falasCachorro = ['Au au! 🐶', 'Bora passear? 🦮', 'Cadê o petisco? 🦴'];
    const falasGato = ['Miau! 🐱', 'Prrrr... 😸', 'Carinho, por favor 💛'];
    const falasGerais = ['Au au! 🐶', 'Miau! 🐱', 'Oi, humano! 👋', 'Me dá petisco? 🦴', 'Faz carinho? 💛'];
    const sorteio = (lista) => lista[Math.floor(Math.random() * lista.length)];
    const fotoDupla = /cao-gato/.test(imagem.getAttribute('src') || '');

    imagem.classList.add('imagem-falante');
    // Depois do pulinho, a imagem volta a flutuar normalmente
    imagem.addEventListener('animationend', (e) => {
      if (e.animationName === 'pulinho') imagem.classList.remove('pulinho');
    });
    imagem.title = 'Clique em mim!';

    imagem.addEventListener('click', (e) => {
      let fala = sorteio(falasGerais);
      if (fotoDupla) {
        const r = imagem.getBoundingClientRect();
        fala = e.clientX - r.left < r.width * 0.56 ? sorteio(falasCachorro) : sorteio(falasGato);
      }

      const balao = document.createElement('span');
      balao.className = 'balao-fala';
      balao.textContent = fala;
      balao.setAttribute('aria-hidden', 'true');
      balao.style.left = `${e.clientX}px`;
      balao.style.top = `${e.clientY}px`;
      document.body.append(balao);
      balao.addEventListener('animationend', () => balao.remove());

      if (!semAnimacao) {
        imagem.classList.remove('pulinho');
        void imagem.offsetWidth;
        imagem.classList.add('pulinho');
      }
    });
  }

 
  configurarCabecalho();
  digitarTitulo();
  etiquetasDePreco();
  petsFalantes();
  simuladorHotel();
  ampliarFotosAdocao();
  revelarAoRolar();
  inclinarCards();
  destacarTabelas();
  botaoVoltarAoTopo();
  patinhasNoClique();
  comemorarEnvio();
})();
