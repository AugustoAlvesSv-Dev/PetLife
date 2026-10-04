/* 
   PetLife - calendario.js
   Calendário que abre no campo "Data desejada". */

(function () {
  'use strict';

  const campo = document.querySelector('input[name="data"]');
  if (!campo) return;

  const MESES_ANTECEDENCIA = 12; // igual ao script.js
  const DIAS_SEMANA = [
    ['D', 'Domingo'], ['S', 'Segunda'], ['T', 'Terça'], ['Q', 'Quarta'],
    ['Q', 'Quinta'], ['S', 'Sexta'], ['S', 'Sábado'],
  ];
  const nomeMes = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' });
  const dataExtenso = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  /* Datas */
  const semHora = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const somarDias = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  const mesmoDia = (a, b) => a && b && a.getTime() === b.getTime();
  const doisDigitos = (n) => String(n).padStart(2, '0');
  const formatar = (d) => `${doisDigitos(d.getDate())}/${doisDigitos(d.getMonth() + 1)}/${d.getFullYear()}`;
  const idDoDia = (d) => `cal-${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

  const hoje = semHora(new Date());
  const limite = new Date(hoje.getFullYear(), hoje.getMonth() + MESES_ANTECEDENCIA, hoje.getDate());
  const permitido = (d) => d >= hoje && d <= limite;

  function lerCampo() {
    const m = campo.value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!m) return null;
    const d = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
    return d.getDate() === Number(m[1]) && d.getMonth() === Number(m[2]) - 1 ? d : null;
  }

  
  const envoltorio = document.createElement('span');
  envoltorio.className = 'campo-data';
  campo.parentNode.insertBefore(envoltorio, campo);
  envoltorio.append(campo);

  const botao = document.createElement('button');
  botao.type = 'button';
  botao.className = 'campo-data-botao';
  botao.setAttribute('aria-label', 'Abrir calendário');
  botao.innerHTML = '<span aria-hidden="true">📅</span>';
  envoltorio.append(botao);

  const painel = document.createElement('div');
  painel.className = 'calendario';
  painel.id = 'calendario-data';
  painel.setAttribute('role', 'dialog');
  painel.setAttribute('aria-label', 'Escolher data');
  painel.hidden = true;
  painel.innerHTML = `
    <div class="calendario-topo">
      <button type="button" class="calendario-nav" data-mes="-1" aria-label="Mês anterior">‹</button>
      <strong class="calendario-titulo" aria-live="polite"></strong>
      <button type="button" class="calendario-nav" data-mes="1" aria-label="Próximo mês">›</button>
    </div>
    <div class="calendario-semana" aria-hidden="true">
      ${DIAS_SEMANA.map(([letra, nome]) => `<abbr title="${nome}">${letra}</abbr>`).join('')}
    </div>
    <div class="calendario-dias" role="grid"></div>
    <div class="calendario-rodape">
      <button type="button" class="calendario-hoje">Hoje</button>
    </div>
  `;
  envoltorio.append(painel);

  campo.setAttribute('aria-haspopup', 'dialog');
  campo.setAttribute('aria-controls', painel.id);
  campo.setAttribute('aria-expanded', 'false');

  const titulo = painel.querySelector('.calendario-titulo');
  const grade = painel.querySelector('.calendario-dias');
  const [btnAnterior, btnProximo] = painel.querySelectorAll('.calendario-nav');

 
  let mesVisivel = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  let diaAtivo = null;      // dia destacado pelo teclado
  let navegando = false;    // true quando as setas controlam o calendário

 
  function desenhar(direcao = 0) {
    const ano = mesVisivel.getFullYear();
    const mes = mesVisivel.getMonth();
    const selecionado = lerCampo();

    const textoMes = nomeMes.format(mesVisivel);
    titulo.textContent = textoMes.charAt(0).toUpperCase() + textoMes.slice(1);

    btnAnterior.disabled = new Date(ano, mes, 1) <= new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    btnProximo.disabled = new Date(ano, mes + 1, 1) > limite;

    grade.innerHTML = '';
    const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
    const totalDias = new Date(ano, mes + 1, 0).getDate();

    for (let i = 0; i < primeiroDiaSemana; i++) {
      grade.append(document.createElement('span'));
    }

    for (let dia = 1; dia <= totalDias; dia++) {
      const data = new Date(ano, mes, dia);
      const b = document.createElement('button');
      b.type = 'button';
      b.tabIndex = -1;
      b.id = idDoDia(data);
      b.className = 'calendario-dia';
      b.textContent = dia;
      b.dataset.data = formatar(data);
      b.setAttribute('aria-label', dataExtenso.format(data));

      if (!permitido(data)) b.disabled = true;
      if (mesmoDia(data, hoje)) b.classList.add('eh-hoje');
      if (mesmoDia(data, selecionado)) {
        b.classList.add('selecionado');
        b.setAttribute('aria-selected', 'true');
      }
      if (navegando && mesmoDia(data, diaAtivo)) b.classList.add('ativo');

      grade.append(b);
    }

    if (navegando && diaAtivo) campo.setAttribute('aria-activedescendant', idDoDia(diaAtivo));
    else campo.removeAttribute('aria-activedescendant');

    // Animação de troca de mês
    grade.classList.remove('vindo-direita', 'vindo-esquerda');
    if (direcao) {
      void grade.offsetWidth;
      grade.classList.add(direcao > 0 ? 'vindo-direita' : 'vindo-esquerda');
    }
  }

  
  const aberto = () => !painel.hidden;

  function abrir() {
    if (aberto()) return;
    const selecionado = lerCampo();
    const base = selecionado && permitido(selecionado) ? selecionado : hoje;
    mesVisivel = new Date(base.getFullYear(), base.getMonth(), 1);
    navegando = false;
    diaAtivo = null;
    desenhar();
    painel.hidden = false;
    envoltorio.classList.add('aberto');
    campo.setAttribute('aria-expanded', 'true');
    botao.setAttribute('aria-label', 'Fechar calendário');

    // Se o calendário abriu cortado no fim da tela, rola só o necessário
    requestAnimationFrame(() => {
      const r = painel.getBoundingClientRect();
      if (r.bottom > window.innerHeight) {
        window.scrollBy({ top: r.bottom - window.innerHeight + 16, behavior: 'smooth' });
      }
    });
  }

  function fechar() {
    if (!aberto()) return;
    painel.hidden = true;
    navegando = false;
    envoltorio.classList.remove('aberto');
    campo.setAttribute('aria-expanded', 'false');
    campo.removeAttribute('aria-activedescendant');
    botao.setAttribute('aria-label', 'Abrir calendário');
  }

  function escolher(data) {
    if (!permitido(data)) return;
    campo.value = formatar(data);
    campo.dataset.tocado = 'sim';
    // Avisa o script.js (máscara e validação) que o valor mudou
    campo.dispatchEvent(new Event('input', { bubbles: true }));
    campo.setSelectionRange(campo.value.length, campo.value.length);
    fechar();
    envoltorio.classList.remove('escolhido');
    void envoltorio.offsetWidth;
    envoltorio.classList.add('escolhido');
  }

  function mudarMes(passo) {
    const novo = new Date(mesVisivel.getFullYear(), mesVisivel.getMonth() + passo, 1);
    const primeiroPermitido = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    if (novo < primeiroPermitido || novo > limite) return;
    mesVisivel = novo;
    if (navegando && diaAtivo) {
      const ultimoDia = new Date(novo.getFullYear(), novo.getMonth() + 1, 0).getDate();
      diaAtivo = new Date(novo.getFullYear(), novo.getMonth(), Math.min(diaAtivo.getDate(), ultimoDia));
      if (diaAtivo < hoje) diaAtivo = hoje;
      if (diaAtivo > limite) diaAtivo = limite;
    }
    desenhar(passo);
  }

  function moverAtivo(dias) {
    let alvo = somarDias(diaAtivo || lerCampo() || hoje, dias);
    if (alvo < hoje) alvo = hoje;
    if (alvo > limite) alvo = limite;
    diaAtivo = alvo;

    const mudouMes =
      alvo.getMonth() !== mesVisivel.getMonth() || alvo.getFullYear() !== mesVisivel.getFullYear();
    const direcao = alvo > mesVisivel ? 1 : -1;
    if (mudouMes) mesVisivel = new Date(alvo.getFullYear(), alvo.getMonth(), 1);
    desenhar(mudouMes ? direcao : 0);
  }

  
  [painel, botao].forEach((el) =>
    el.addEventListener('mousedown', (e) => e.preventDefault())
  );

  campo.addEventListener('focus', abrir);
  campo.addEventListener('click', abrir);
  campo.addEventListener('blur', fechar);

  botao.addEventListener('click', () => {
    if (aberto()) {
      fechar();
    } else {
      campo.focus();
      abrir();
    }
  });

  painel.addEventListener('click', (e) => {
    const dia = e.target.closest('.calendario-dia');
    if (dia && !dia.disabled) {
      const [d, m, a] = dia.dataset.data.split('/').map(Number);
      escolher(new Date(a, m - 1, d));
      return;
    }
    const nav = e.target.closest('.calendario-nav');
    if (nav && !nav.disabled) mudarMes(Number(nav.dataset.mes));
    if (e.target.closest('.calendario-hoje')) escolher(hoje);
  });

  // Enquanto a pessoa digita, o calendário acompanha
  campo.addEventListener('input', () => {
    navegando = false;
    const data = lerCampo();
    if (aberto() && data && permitido(data)) {
      mesVisivel = new Date(data.getFullYear(), data.getMonth(), 1);
    }
    if (aberto()) desenhar();
  });

  campo.addEventListener('keydown', (e) => {
    const parar = () => {
      e.preventDefault();
      e.stopPropagation(); // não deixa o Enter enviar o formulário
    };

    if (e.key === 'Escape' && aberto()) {
      parar();
      fechar();
      return;
    }

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      parar();
      if (!aberto()) abrir();
      if (!navegando) {
        navegando = true;
        const atual = lerCampo();
        diaAtivo = atual && permitido(atual) ? atual : hoje;
        mesVisivel = new Date(diaAtivo.getFullYear(), diaAtivo.getMonth(), 1);
        desenhar();
      } else {
        moverAtivo(e.key === 'ArrowDown' ? 7 : -7);
      }
      return;
    }

    if (!aberto()) return;

    if (navegando && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      parar();
      moverAtivo(e.key === 'ArrowRight' ? 1 : -1);
    } else if (e.key === 'PageDown' || e.key === 'PageUp') {
      parar();
      mudarMes(e.key === 'PageDown' ? 1 : -1);
    } else if (e.key === 'Enter' && navegando && diaAtivo) {
      parar();
      escolher(diaAtivo);
    } else if (e.key === 'Tab') {
      fechar();
    }
  });

  // Ao enviar com sucesso, o formulário é limpo: fecha e redesenha
  campo.form?.addEventListener('petlife:enviado', fechar);
})();
