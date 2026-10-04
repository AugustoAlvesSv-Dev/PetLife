

(function () {
  'use strict';


  const LIMITE_MENSAGEM = 500;   // caracteres permitidos no campo Mensagem
  const MESES_ANTECEDENCIA = 12; // até quanto tempo à frente pode agendar


  const somenteDigitos = (valor) => valor.replace(/\D/g, '');

 
  const normalizar = (texto) =>
    texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();


  const mascaras = {
    // (00) 0000-0000 ou (00) 00000-0000
    telefone(d) {
      d = d.slice(0, 11);
      if (d.length === 0) return '';
      if (d.length <= 2) return '(' + d;

      const ddd = d.slice(0, 2);
      const numero = d.slice(2);
      const corte = d.length === 11 ? 5 : 4;

      if (numero.length <= corte) return `(${ddd}) ${numero}`;
      return `(${ddd}) ${numero.slice(0, corte)}-${numero.slice(corte)}`;
    },

    // DD/MM/AAAA
    data(d) {
      d = d.slice(0, 8);
      if (d.length <= 2) return d;
      if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
      return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
    },
  };

  
  function aplicarMascara(campo, formatar) {
    campo.addEventListener('input', () => {
      const posicao = campo.selectionStart ?? campo.value.length;
      const digitosAntesDoCursor = somenteDigitos(campo.value.slice(0, posicao)).length;

      const formatado = formatar(somenteDigitos(campo.value));
      campo.value = formatado;

      let i = 0;
      let contados = 0;
      while (i < formatado.length && contados < digitosAntesDoCursor) {
        if (/\d/.test(formatado[i])) contados++;
        i++;
      }
      campo.setSelectionRange(i, i);
    });
  }

 
  function converterData(texto) {
    const [dia, mes, ano] = texto.split('/').map(Number);
    const data = new Date(ano, mes - 1, dia);
    // Garante que a data existe (ex.: 31/02 vira 03/03 no JS e é recusada)
    const existe =
      data.getFullYear() === ano && data.getMonth() === mes - 1 && data.getDate() === dia;
    return existe ? data : null;
  }

  const validadores = {
    nome(valor) {
      const v = valor.trim();
      if (!v) return 'Informe seu nome.';
      if (!/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/.test(v)) return 'Use apenas letras no nome.';
      if (v.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ]/g, '').length < 3) {
        return 'O nome precisa ter pelo menos 3 letras.';
      }
      return '';
    },

    email(valor) {
      const v = valor.trim();
      if (!v) return 'Informe seu e-mail.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
        return 'E-mail inválido. Exemplo: nome@email.com';
      }
      return '';
    },

    telefone(valor) {
      const d = somenteDigitos(valor);
      if (!d) return 'Informe um telefone para contato.';
      if (d.length < 10) return 'Telefone incompleto. Use o formato (00) 00000-0000.';
      if (d[0] === '0') return 'DDD inválido.';
      if (d.length === 11 && d[2] !== '9') return 'Celular deve começar com 9 depois do DDD.';
      return '';
    },

    servico(valor) {
      return valor ? '' : 'Selecione o serviço desejado.';
    },

    pet(valor) {
      return valor ? '' : 'Selecione o pet que você quer conhecer.';
    },

    data(valor) {
      if (!valor) return 'Informe a data desejada.';
      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(valor)) return 'Data incompleta. Use o formato DD/MM/AAAA.';

      const data = converterData(valor);
      if (!data) return 'Essa data não existe. Confira o dia e o mês.';

      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      if (data < hoje) return 'Escolha uma data a partir de hoje.';

      const limite = new Date(hoje);
      limite.setMonth(limite.getMonth() + MESES_ANTECEDENCIA);
      if (data > limite) return 'Agendamentos podem ser feitos com até 1 ano de antecedência.';

      return '';
    },

    // Mensagem é opcional; só verifica o tamanho
    mensagem(valor) {
      return valor.length > LIMITE_MENSAGEM
        ? `A mensagem pode ter no máximo ${LIMITE_MENSAGEM} caracteres.`
        : '';
    },
  };

  /* ----------------------------------------------------------------------
     Exibição de erros (acessível: aria-invalid + aria-describedby)
     ---------------------------------------------------------------------- */
  function criarAreaDeErro(campo) {
    const erro = document.createElement('span');
    erro.id = `${campo.id}-erro`;
    erro.className = 'mensagem-erro';
    erro.hidden = true;
    campo.insertAdjacentElement('afterend', erro);
    campo.setAttribute('aria-describedby', erro.id);
    return erro;
  }

  function validarCampo(campo) {
    const mensagem = validadores[campo.name](campo.value);
    const erro = document.getElementById(`${campo.id}-erro`);

    erro.textContent = mensagem;
    erro.hidden = !mensagem;

    if (mensagem) {
      campo.setAttribute('aria-invalid', 'true');
    } else if (campo.value.trim()) {
      campo.setAttribute('aria-invalid', 'false'); // borda verde de "ok"
    } else {
      campo.removeAttribute('aria-invalid');       // opcional e vazio: neutro
    }
    return !mensagem;
  }

  function limparEstado(campo) {
    campo.removeAttribute('aria-invalid');
    campo.dataset.tocado = '';
    const erro = document.getElementById(`${campo.id}-erro`);
    if (erro) {
      erro.textContent = '';
      erro.hidden = true;
    }
  }

 
  function configurarContador(textarea) {
    textarea.maxLength = LIMITE_MENSAGEM;

    const contador = document.createElement('span');
    contador.className = 'contador';
    contador.setAttribute('aria-live', 'polite');
    textarea.insertAdjacentElement('afterend', contador);

    const atualizar = () => {
      contador.textContent = `${textarea.value.length}/${LIMITE_MENSAGEM} caracteres`;
    };
    textarea.addEventListener('input', atualizar);
    atualizar();
    return atualizar;
  }


  function configurarFormulario(form) {
    const campos = Array.from(form.querySelectorAll('input, select, textarea'))
      .filter((campo) => campo.name in validadores && campo.id);
    if (!campos.length) return;

    const botao = form.querySelector('button');

    // Área de aviso geral (erro ou sucesso), logo acima do botão
    const status = document.createElement('div');
    status.className = 'form-status';
    status.setAttribute('role', 'status');
    status.hidden = true;
    botao.insertAdjacentElement('beforebegin', status);

    let atualizarContador = null;

    campos.forEach((campo) => {
      criarAreaDeErro(campo);

      
      switch (campo.name) {
        case 'nome':
          campo.autocomplete = 'name';
          break;
        case 'email':
          campo.autocomplete = 'email';
          campo.inputMode = 'email';
          break;
        case 'telefone':
          campo.autocomplete = 'tel';
          campo.inputMode = 'tel';
          campo.maxLength = 15;
          campo.placeholder = campo.placeholder || '(00) 00000-0000';
          aplicarMascara(campo, mascaras.telefone);
          break;
        case 'data':
          campo.autocomplete = 'off';
          campo.inputMode = 'numeric';
          campo.maxLength = 10;
          aplicarMascara(campo, mascaras.data);
          break;
        case 'mensagem':
          atualizarContador = configurarContador(campo);
          break;
      }

     
      campo.addEventListener('blur', () => {
        if (campo.value.trim() || campo.dataset.tocado) {
          campo.dataset.tocado = 'sim';
          validarCampo(campo);
        }
      });

      
      campo.addEventListener('input', () => {
        if (campo.dataset.tocado) validarCampo(campo);
      });

      if (campo.tagName === 'SELECT') {
        campo.addEventListener('change', () => {
          campo.dataset.tocado = 'sim';
          validarCampo(campo);
        });
      }
    });

    function mostrarStatus(tipo, texto) {
      status.className = `form-status form-status--${tipo}`;
      status.textContent = texto;
      status.hidden = false;
    }

    function enviar() {
      if (botao.disabled) return; // evita envio duplicado

      let primeiroInvalido = null;
      campos.forEach((campo) => {
        campo.dataset.tocado = 'sim';
        if (!validarCampo(campo) && !primeiroInvalido) primeiroInvalido = campo;
      });

      if (primeiroInvalido) {
        const qtd = campos.filter((c) => c.getAttribute('aria-invalid') === 'true').length;
        mostrarStatus(
          'erro',
          qtd === 1
            ? 'Falta corrigir 1 campo destacado.'
            : `Falta corrigir ${qtd} campos destacados.`
        );
        primeiroInvalido.focus();
        return;
      }

      // Simula o envio (o site não tem servidor)
      const textoOriginal = botao.textContent;
      botao.disabled = true;
      botao.textContent = 'Enviando...';
      status.hidden = true;

      const nome = form.querySelector('[name="nome"]');
      const primeiroNome = nome ? nome.value.trim().split(/\s+/)[0] : '';

      setTimeout(() => {
        form.reset();
        campos.forEach(limparEstado);
        if (atualizarContador) atualizarContador();

        botao.disabled = false;
        botao.textContent = textoOriginal;

        mostrarStatus(
          'sucesso',
          `Obrigado${primeiroNome ? ', ' + primeiroNome : ''}! Recebemos sua solicitação ` +
            'e nossa equipe entrará em contato em breve.'
        );
        status.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Avisa o efeitos.js para comemorar o envio
        form.dispatchEvent(
          new CustomEvent('petlife:enviado', { bubbles: true, detail: { status } })
        );
      }, 800);
    }

    // O botão do HTML é type="button", então tratamos o clique...
    botao.addEventListener('click', enviar);

    // ...e o Enter dentro dos campos (exceto na Mensagem, onde Enter quebra linha)
    form.addEventListener('keydown', (evento) => {
      if (evento.key === 'Enter' && evento.target.tagName !== 'TEXTAREA') {
        evento.preventDefault();
        enviar();
      }
    });

    // Caso algum dia o botão vire type="submit"
    form.addEventListener('submit', (evento) => {
      evento.preventDefault();
      enviar();
    });

    
    form.addEventListener('input', () => {
      if (status.classList.contains('form-status--sucesso')) status.hidden = true;
    });
  }

  
  function configurarBotoesAdocao() {
    const seletorPet = document.querySelector('select[name="pet"]');
    if (!seletorPet) return;

    document.querySelectorAll('article a[href="#formulario"]').forEach((link) => {
      link.addEventListener('click', () => {
        const titulo = link.closest('article').querySelector('h3');
        if (!titulo) return;

        const valor = normalizar(titulo.textContent);
        const existe = Array.from(seletorPet.options).some((op) => op.value === valor);
        if (!existe) return;

        seletorPet.value = valor;
        if (seletorPet.dataset.tocado) validarCampo(seletorPet);

       
        const nome = document.querySelector('#formulario [name="nome"]');
        if (nome) setTimeout(() => nome.focus({ preventScroll: true }), 0);
      });
    });
  }


  const chaveServico = (texto) => normalizar(texto).replace(/\+/g, ' e ').replace(/[^a-z]/g, '');

  function selecionarServico(seletor, valor) {
    seletor.value = valor;
    seletor.dispatchEvent(new Event('change', { bubbles: true }));
    seletor.classList.remove('campo-destaque');
    void seletor.offsetWidth; // reinicia a animação
    seletor.classList.add('campo-destaque');
  }

  function agendarPelaTabela() {
    const seletor = document.querySelector('select[name="servico"]');
    const secaoForm = seletor && seletor.closest('section');
    if (!seletor || !secaoForm) return;

    const opcaoPara = (rotulo) =>
      Array.from(seletor.options).find(
        (op) => op.value && chaveServico(op.textContent) === chaveServico(rotulo)
      );

    document.querySelectorAll('table').forEach((tabela) => {
      if (!tabela.tBodies[0] || !tabela.tHead) return;
      const cabecalho = tabela.tHead.rows[0].cells;
      let algumClicavel = false;

      Array.from(tabela.tBodies[0].rows).forEach((linha) => {
        const opcao = opcaoPara(linha.cells[0].textContent);
        if (!opcao) return;

        Array.from(linha.cells).slice(1).forEach((celula) => {
          const preco = celula.textContent.trim();
          const porte = cabecalho[celula.cellIndex]?.textContent.trim() || '';

          // O botão fica dentro da célula: a tabela continua sendo tabela
          const botao = document.createElement('button');
          botao.type = 'button';
          botao.className = 'preco-botao';
          botao.textContent = preco;
          botao.title = 'Clique para agendar';
          botao.setAttribute('aria-label', `Agendar ${opcao.textContent.trim()}, porte ${porte}, ${preco}`);
          celula.textContent = '';
          celula.classList.add('celula-com-botao');
          celula.append(botao);

          botao.addEventListener('click', () => {
            selecionarServico(seletor, opcao.value);
            secaoForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
            const nome = secaoForm.querySelector('[name="nome"]');
            if (nome) nome.focus({ preventScroll: true });
          });
          algumClicavel = true;
        });
      });

      if (algumClicavel) {
        const dica = document.createElement('p');
        dica.className = 'dica-tabela';
        dica.textContent = '💡 Clique em um preço para já agendar o serviço.';
        tabela.insertAdjacentElement('afterend', dica);
      }
    });
  }

  function servicoPelaUrl() {
    const seletor = document.querySelector('select[name="servico"]');
    if (!seletor) return;
    const valor = new URLSearchParams(window.location.search).get('servico');
    if (valor && Array.from(seletor.options).some((op) => op.value === valor)) {
      selecionarServico(seletor, valor);
    }
  }

 
  function linksDeAgendamento() {
    const atual = document.querySelector('header nav a[aria-current="page"]');
    if (!atual || document.querySelector('select[name="servico"]')) return;

    const valores = { banhoetosa: 'banho-tosa', hotel: 'hotel' };
    const valor = valores[chaveServico(atual.textContent)];
    if (!valor) return;

    document.querySelectorAll('a[href="index.html#contato"]').forEach((link) => {
      link.href = `index.html?servico=${valor}#contato`;
    });
  }

  
  document.querySelectorAll('form').forEach(configurarFormulario);
  configurarBotoesAdocao();
  agendarPelaTabela();
  servicoPelaUrl();
  linksDeAgendamento();
})();
