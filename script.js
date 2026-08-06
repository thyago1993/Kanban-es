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
            htmlCartao += `<div class="responsavel">👥 Equipe: <strong>${tarefa.responsavel}</strong></div>`;
        } else {
            // A DIV abaixo recebeu 'onmousedown="event.stopPropagation();"' 
            // Isso impede que o navegador tente arrastar o cartão enquanto o aluno digita
            htmlCartao += `
                <div class="area-assumir" onmousedown="event.stopPropagation();">
                    <input type="text" id="input-grupo-${tarefa.id}" class="input-equipe" placeholder="Nome da equipe">
                    <button type="button" class="btn-assumir" onclick="assumirTarefa(${tarefa.id})">Assumir Atividade</button>
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
        status: 'todo', 
        responsavel: null
    };

    tarefas.push(novaTarefa);
    salvarDados();
    input.value = '';
    renderizarTarefas();
}

// Associa a equipe à atividade específica
function assumirTarefa(id) {
    const inputEquipe = document.getElementById(`input-grupo-${id}`);
    
    // Trava de segurança extra
    if (!inputEquipe) {
        alert("Ocorreu um erro ao ler o campo. Por favor, aperte Ctrl + F5 para atualizar a página.");
        return;
    }

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
    
    // Se o que foi solto não for um cartão, ignora
    if (!idElemento || !idElemento.includes('tarefa-')) return;

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
