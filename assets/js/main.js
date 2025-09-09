
// Dinâmica: saudação temporal + relógio vivo com aria-live
function updateGreeting() {
  const el = document.getElementById('greeting');
  const clock = document.getElementById('clock');
  if (!el || !clock) return;
  const now = new Date();
  const hours = now.getHours();
  let msg = 'Boa noite';
  if (hours >= 5 && hours < 12) msg = 'Bom dia';
  else if (hours >= 12 && hours < 18) msg = 'Boa tarde';
  el.textContent = msg + ', bem-vindo(a) ao Minimercado!';
  clock.textContent = now.toLocaleString('pt-BR');
}

// Atualiza relógio a cada segundo, com aria-live para leitores de tela
setInterval(updateGreeting, 1000);
document.addEventListener('DOMContentLoaded', () => {
  updateGreeting();
  setupAgendamento();
  setupHighContrast();
  setupEntregaToggle();
});

function setupHighContrast() {
  const btn = document.getElementById('btn-contraste');
  if (!btn) return;
  btn.addEventListener('click', () => {
    document.body.classList.toggle('high-contrast');
    const active = document.body.classList.contains('high-contrast');
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
}

// Agendamento: habilita/desabilita campos conforme serviço
function setupEntregaToggle() {
  const entrega = document.getElementById('servico-entrega');
  const retirada = document.getElementById('servico-retirada');
  const blocoEndereco = document.getElementById('bloco-endereco-entrega');
  function toggle() {
    if (entrega && entrega.checked) {
      blocoEndereco?.classList.remove('d-none');
    } else {
      blocoEndereco?.classList.add('d-none');
    }
  }
  entrega?.addEventListener('change', toggle);
  retirada?.addEventListener('change', toggle);
  toggle();
}

// Define min de data/hora (não permite datas passadas) e limita horário comercial
function setupAgendamento() {
  const dataInput = document.getElementById('data-agendamento');
  const horaInput = document.getElementById('hora-agendamento');
  if (!dataInput || !horaInput) return;

  const hoje = new Date();
  hoje.setHours(0,0,0,0);
  const yyyy = hoje.getFullYear();
  const mm = String(hoje.getMonth()+1).padStart(2,'0');
  const dd = String(hoje.getDate()).padStart(2,'0');
  dataInput.min = `${yyyy}-${mm}-${dd}`;

  // Limita horário entre 08:00 e 20:00 a cada 30min
  horaInput.min = "08:00";
  horaInput.max = "20:00";
  horaInput.step = 1800;
}

// Validação simples do CPF (formato ###.###.###-## ou 11 dígitos)
function validarCPF(cpf) {
  if (!cpf) return false;
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11 || /^([0-9])\1+$/.test(digits)) return false;

  // Cálculo dos dígitos verificadores
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(digits.charAt(i)) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== parseInt(digits.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(digits.charAt(i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== parseInt(digits.charAt(10))) return false;

  return true;
}

function maskCPF(input) {
  let v = input.value.replace(/\D/g, '').slice(0,11);
  v = v.replace(/(\d{3})(\d)/, '$1.$2')
       .replace(/(\d{3})(\d)/, '$1.$2')
       .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  input.value = v;
}

function onSubmitCadastro(e) {
  const cpfEl = document.getElementById('cpf');
  const termos = document.getElementById('termos');
  if (cpfEl && !validarCPF(cpfEl.value)) {
    e.preventDefault();
    alert('CPF inválido. Verifique e tente novamente.');
    cpfEl.focus();
    return false;
  }
  if (termos && !termos.checked) {
    e.preventDefault();
    alert('Você precisa aceitar os termos.');
    termos.focus();
    return false;
  }
  return true;
}

document.addEventListener('DOMContentLoaded', () => {
  const formCadastro = document.getElementById('form-cadastro');
  if (formCadastro) {
    formCadastro.addEventListener('submit', onSubmitCadastro);
  }
  const cpfEl = document.getElementById('cpf');
  if (cpfEl) {
    cpfEl.addEventListener('input', (e) => maskCPF(e.target));
  }
});
