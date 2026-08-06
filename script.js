let tarefas = JSON.parse(localStorage.getItem('tarefasKanban')) || [];

// Renderiza as tarefas na tela ao carregar a página
function renderizarTarefas() {
    document.getElementById('lista-todo').innerHTML = '';
    document.getElementById('lista-doing').innerHTML = '';
    document.getElementById('lista-done').innerHTML = '';

    tarefas.forEach(tarefa => {
        const cartao = document.createElement('div');
        cartao.className = 'cartao';
        cartao.draggable = true;
        cartao.id = 'tarefa-' + tarefa.id;
        cartao.ondragstart = arrastar;

        let htmlCartao = `<p><strong>${tarefa.descricao}</strong></p>`;
        
        if (tarefa.responsavel) {
            htmlCartao += `<div class="responsavel">👥 Grupo: ${tarefa.responsavel}</div>`;
        } else {
            htmlCartao += `<button class="btn-assumir" onclick="assumirTarefa(${tarefa.id})">Assumir Atividade</button>`;
        }

        cartao.innerHTML = htmlCartao;
        document.getElementById(`lista-${tarefa.status}`).appendChild(cartao);
    });
}

// Cria uma nova tarefa (Ação do Professor) - Vai direto para "A Fazer"
function adicionarTarefa() {
    const input = document.getElementById('nova-tarefa');
    const descricao = input.value.trim();

    if (descricao === '') {
        alert('Por favor, descreva a atividade.');
        return;
    }

    const novaTarefa = {
        id: Date.now(),
        descricao: descricao,
        status: 'todo', // Sempre nasce no "A fazer"
        responsavel: null
    };

    tarefas.push(novaTarefa);
    salvarDados();
    input.value = '';
    renderizarTarefas();
}

// Associa o grupo à atividade
function assumirTarefa(id) {
    const nomeGrupo = document.getElementById('nome-grupo').value.trim();
    
    if (nomeGrupo === '') {
        alert('Por favor, digite o nome do Grupo no topo da página antes de assumir uma atividade.');
        return;
    }

    const index = tarefas.findIndex(t => t.id === id);
    if (index !== -1) {
        tarefas[index].responsavel = nomeGrupo;
        // Quando o grupo assume, a tarefa vai automaticamente para "Em Andamento"
        if(tarefas[index].status === 'todo') {
             tarefas[index].status = 'doing';
        }
        salvarDados();
        renderizarTarefas();
    }
}

// ==========================================
// FUNÇÕES DE ARRASTAR E SOLTAR (DRAG & DROP)
// ==========================================

function arrastar(event) {
    // Guarda o ID do cartão que está sendo arrastado
    event.dataTransfer.setData("text", event.target.id);
}

function permitirSoltar(event) {
    // Necessário para permitir que o cartão seja solto na área
    event.preventDefault();
}

// Nova função soltar, agora recebendo o statusDestino com precisão
function soltar(event, statusDestino) {
    event.preventDefault();
    
    // Recupera o ID da tarefa arrastada
    const idElemento = event.dataTransfer.getData("text");
    const idTarefa = parseInt(idElemento.split('-')[1]);
    
    // Atualiza o status da tarefa no array para a coluna correta
    const index = tarefas.findIndex(t => t.id === idTarefa);
    if (index !== -1) {
        tarefas[index].status = statusDestino;
        salvarDados();
    }

    // Atualiza a tela
    renderizarTarefas();
}

// Salva no LocalStorage
function salvarDados() {
    localStorage.setItem('tarefasKanban', JSON.stringify(tarefas));
}

// Inicialização
renderizarTarefas();
