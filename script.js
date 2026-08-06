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
            htmlCartao += `<div class="responsavel">👤 ${tarefa.responsavel}</div>`;
        } else {
            htmlCartao += `<button class="btn-assumir" onclick="assumirTarefa(${tarefa.id})">Assumir Tarefa</button>`;
        }

        cartao.innerHTML = htmlCartao;
        document.getElementById(`lista-${tarefa.status}`).appendChild(cartao);
    });
}

// Cria uma nova tarefa (Ação do Professor)
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
        status: 'todo', // Status inicial
        responsavel: null
    };

    tarefas.push(novaTarefa);
    salvarDados();
    input.value = '';
    renderizarTarefas();
}

// Associa o aluno à tarefa
function assumirTarefa(id) {
    const nomeAluno = document.getElementById('nome-aluno').value.trim();
    
    if (nomeAluno === '') {
        alert('Por favor, digite seu nome no topo da página antes de assumir uma tarefa.');
        return;
    }

    const index = tarefas.findIndex(t => t.id === id);
    if (index !== -1) {
        tarefas[index].responsavel = nomeAluno;
        // Move automaticamente para "Em Andamento" se estiver em "A Fazer"
        if(tarefas[index].status === 'todo') {
             tarefas[index].status = 'doing';
        }
        salvarDados();
        renderizarTarefas();
    }
}

// Funções de Drag and Drop (Arrastar e Soltar)
function arrastar(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function permitirSoltar(event) {
    event.preventDefault();
}

function soltar(event) {
    event.preventDefault();
    const idElemento = event.dataTransfer.getData("text");
    const cartao = document.getElementById(idElemento);
    const idTarefa = parseInt(idElemento.split('-')[1]);
    
    // Identifica a coluna destino
    let colunaDestino = event.target;
    while (!colunaDestino.classList.contains('coluna')) {
        colunaDestino = colunaDestino.parentElement;
    }

    const novoStatus = colunaDestino.id;
    
    // Atualiza o status da tarefa no array
    const index = tarefas.findIndex(t => t.id === idTarefa);
    if (index !== -1) {
        tarefas[index].status = novoStatus;
        salvarDados();
    }

    renderizarTarefas();
}

// Salva no LocalStorage
function salvarDados() {
    localStorage.setItem('tarefasKanban', JSON.stringify(tarefas));
}

// Inicialização
renderizarTarefas();
