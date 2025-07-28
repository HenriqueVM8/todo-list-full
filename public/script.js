const form = document.getElementById("task-form");
const input = document.getElementById("input-todo");
const listContainer = document.getElementById("list-container");


form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const value = input.value.trim();
  const btn = document.getElementById("btn");
  btn.disabled = true;


  if (value === "") {
    alert("Você precisa escrever algo!");
    btn.disabled = false;
    return;
  }

  try {
    const response = await fetch("/tasks/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ input: value })
    });

    if (!response.ok) {
      throw new Error("Erro ao adicionar tarefa");
    }

    const task = await response.json(); // Espera que o backend retorne a tarefa criada com o id

    // Criar novo <li> com a tarefa e data-id
    const li = document.createElement("li");
    li.dataset.id = task.id;
    li.textContent = task.title;

    const editSpan = document.createElement("span");
    editSpan.innerHTML = "✎";
    editSpan.className = "edit-btn";
    li.appendChild(editSpan);

    const span = document.createElement("span");
    span.innerHTML = "\u00d7";
    span.className = "delete-btn";
    li.appendChild(span);

    listContainer.appendChild(li);
  } catch (err) {
    console.error("Erro ao adicionar tarefa:", err);
    alert("Erro ao adicionar tarefa.");
  }

  input.value = "";
  input.focus();
  btn.disabled = false;
});

function marcarConcluida(liElement) {
    liElement.classList.toggle('selected');
}

function editTask(li) {
  const spanTitle = li.querySelector(".task-title") || li.firstChild;
  const currentText = spanTitle.textContent;

  const input = document.createElement("input");
  input.type = "text";
  input.maxLength = 35;
  input.value = currentText;
  input.className = "edit-input";

  li.insertBefore(input, spanTitle);
  li.removeChild(spanTitle);
  input.focus();

  let isSaving = false;

  async function saveEdit() {
    if (isSaving) return;
    isSaving = true;

    const newText = input.value.trim();
    if (newText === "") {
      alert("O texto não pode ser vazio.");
      input.focus();
      isSaving = false;
      return;
    }

    try {
      const response = await fetch(`/tasks/${li.dataset.id}/edit`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newText })
      });

      const text = await response.text();
      console.log("Resposta do backend:", text);

      if (!response.ok) throw new Error("Erro ao editar tarefa");

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = null;
      }

      const updatedTitle = data?.task?.title || newText;

      const newSpan = document.createElement("span");
      newSpan.className = "task-title";
      newSpan.textContent = updatedTitle;

      // Remove input
      li.removeChild(input);

      // Insere o newSpan antes do primeiro botão (edit-btn ou delete-btn)
      const firstButton = li.querySelector(".edit-btn, .delete-btn");
      if (firstButton) {
        li.insertBefore(newSpan, firstButton);
      } else {
        li.appendChild(newSpan); // fallback: se não tiver botões
      }

    } catch (err) {
      alert("Erro ao editar tarefa.");
      console.error(err);
      input.focus();
    } finally {
      isSaving = false;
    }
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveEdit();
    }
  });

  input.addEventListener("blur", saveEdit);
}




listContainer.addEventListener("click", async function(e){
  const li = e.target.closest("li");
  if (!li) return;

  if (e.target.classList.contains("edit-btn")) {
    editTask(li);
  } else if (e.target.classList.contains("delete-btn")) {
    // Apagar tarefa
    if (confirm("Deseja realmente apagar esta tarefa?")) {
      try {
        const response = await fetch(`/tasks/${li.dataset.id}/delete`, { method: "DELETE" });
        if (!response.ok) throw new Error("Erro ao deletar tarefa");
        li.remove();
      } catch (err) {
        alert("Erro ao deletar tarefa.");
        console.error(err);
      }
    }
  } else if (e.target === li || e.target.classList.contains("task-title")) {
    // Toggle feito
    li.classList.toggle("selected");
    try {
      await fetch(`/tasks/${li.dataset.id}/toggle`, { method: "PATCH" });
    } catch (err) {
      alert("Erro ao atualizar status da tarefa.");
      console.error(err);
      // Reverte a classe em caso de erro
      li.classList.toggle("selected");
    }
  }
});