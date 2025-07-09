/*document.addEventListener('DOMContentLoaded', () => {
  const btnAdicionar = document.getElementById('btn-adicionar');
  const inputTarefa = document.getElementById('input-tarefa');
  const listaTarefas = document.getElementById('lista-tarefas');

  btnAdicionar.addEventListener('click', async () => {
    const titulo = inputTarefa.value.trim();

    if (titulo === '') {
      alert('Digite algo antes de adicionar.');
      return;
    }

    try {
      const resposta = await fetch('/tasks/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ input: titulo })
      });

      if (!resposta.ok) throw new Error('Erro na requisição');

      const novaTarefa = await resposta.json();

      // Cria o elemento li
      const li = document.createElement('li');
      li.innerText = novaTarefa.title;
      li.dataset.id = novaTarefa.id;

      // Opcional: botão para deletar
      const btnDelete = document.createElement('button');
      btnDelete.innerText = 'Deletar';
      btnDelete.addEventListener('click', () => deletarTarefa(novaTarefa.id, li));

      li.appendChild(btnDelete);
      listaTarefas.appendChild(li);

      inputTarefa.value = ''; // limpa o input

    } catch (err) {
      console.error('Erro ao adicionar tarefa:', err);
      alert('Erro ao adicionar tarefa');
    }
  });
});

// Função para deletar tarefa
async function deletarTarefa(id, liElement) {
  if (!confirm('Tem certeza que deseja excluir essa tarefa?')) return;

  try {
    const resposta = await fetch(`/tasks/${id}/delete`, {
      method: 'DELETE'
    });

    if (!resposta.ok) throw new Error('Erro ao deletar');

    liElement.remove();
  } catch (err) {
    console.error('Erro ao deletar tarefa:', err);
    alert('Erro ao deletar tarefa');
  }
} */