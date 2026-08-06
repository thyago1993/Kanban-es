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
        
        // Verifica se alguém já assumiu a tarefa
        if (tarefa.responsavel) {
            htmlCartao += `<div class="responsavel">👥 Equipe: <strong>${tarefa.responsavel}</strong></div>`;
        } else {
            // Se ninguém assumiu, mostra o input e o botão DENTRO do cartão
            htmlCartao += `
                <div class="area-assumir">
                    <input type="text" id="input-grupo-${tarefa.id}" class="input-equipe" placeholder="Nome da sua equipe">
                    <button class="btn-assumir" onclick="assumirTarefa(${tarefa.id})">Assumir Atividade</button>
                </div>
            `;
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
        status: 'todo', // Sempre nasce no "A fazer"
        responsavel: null
    };

    tarefas.push(novaTarefa);
    salvarDados();
    input.value = '';
    renderizarTarefas();
}

// Associa a equipe à atividade específica
function assumirTarefa(id) {
    // Busca a caixa de texto específica deste cartão usando o ID
    const inputEquipe = document.getElementById(`input-grupo-${id}`);
    const nomeGrupo = inputEquipe.value.trim();
    
    if (nomeGrupo === '') {
        alert('Por favor, digite o nome da equipe antes de assumir a atividade.');
        return;
    }

    const index = tarefas.findIndex(t => t.id === id);
    if (index !== -1) {
        tarefas[index].responsavel = nomeGrupo;
        // Move automaticamente para "Em Andamento"
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
    event.dataTransfer.setData("text", event.target.id);
}

function permitirSoltar(event) {
    event.preventDefault();
}

function soltar(event, statusDestino) {
    event.preventDefault();
    
    const idElemento = event.dataTransfer.getData("text");
    const idTarefa = parseInt(idElemento.split('-')[1]);
    
    const index = tarefas.findIndex(t => t.id === idTarefa);
    if (index !== -1) {
        tarefas[index].status = statusDestino;
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
