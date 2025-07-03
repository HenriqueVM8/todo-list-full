
const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

window.onload = load;

function saveTasks(){
  const tasks = [];
  const items = listContainer.querySelectorAll("li");
  items.forEach(li => {
    const text = li.firstChild.textContent;
    const completed = li.classList.contains("selected");
    tasks.push({ text, completed}); // push no texto da tarefa
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function load(){
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(task => {
    const li = document.createElement("li")
    li.innerHTML = task.text;

    if(task.completed){
      li.classList.add("selected");
    }

    const editSpan = document.createElement("span")
    editSpan.innerHTML = "✎"
    editSpan.className = "edit-btn"
    li.appendChild(editSpan)

    const span = document.createElement("span");
    span.innerHTML = "\u00d7";
    li.appendChild(span);

    listContainer.appendChild(li);
  });
}

function addTask(){
    const btn = document.getElementById('btn');
    btn.disabled = true;
    if (inputBox.value.trim() === ''){
        alert("Você precisa escrever algo!");   
    } 
    else{
        const li = document.createElement("li");
        li.innerHTML = inputBox.value;
        listContainer.appendChild(li);

        const editSpan = document.createElement("span")
        editSpan.innerHTML = "✎"
        editSpan.className = "edit-btn"
        li.appendChild(editSpan)

        const span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);

        listContainer.appendChild(li);
        saveTasks(); // salva no localStorage
    }
    inputBox.value = "";
    inputBox.focus()

    setTimeout(() => {
      btn.disabled = false;
    }, 500);
}


function editTask(li) {
  const currentText = li.firstChild.textContent
  const input = document.createElement("input")
  input.maxLength = 35;
  input.type = "text"
  input.value = currentText
  input.className = "edit-input"

  li.firstChild.textContent = ""
  li.insertBefore(input, li.firstChild.nextSibling)
  input.focus()

  function saveEdit() {
    const newText = input.value.trim()
    if (newText !== "") {
      li.firstChild.textContent = newText
    } else {
      li.firstChild.textContent = currentText
    }
    input.remove()
    saveTasks(); // salvar depois de editar
  }

  input.addEventListener("blur", saveEdit)
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      saveEdit()
    }
  })
}


listContainer.addEventListener("click", function(e){
    if (e.target.tagName === "LI"){
        e.target.classList.toggle("selected");
        saveTasks();
    }
    else if (e.target.tagName === "SPAN" && !e.target.classList.contains("edit-btn")){
        e.target.parentElement.remove();
        saveTasks();
    }
    else if (e.target.classList.contains("edit-btn")){
        editTask(e.target.parentElement);
    }
}, false);