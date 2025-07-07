const containerBtn = document.getElementById('container-btn');
const containerBtnL = document.getElementById('container-btnL')
const closeBtn = document.createElement('span');
const closeBtnL = document.createElement('span')
const containerForms = document.querySelector('.registro-div');
const containerLogin = document.querySelector('.login-div')
const modalBack = document.querySelector('.modal-back');
const modalBackL = document.querySelector('.modal-back-L');

closeBtn.innerHTML = '&times;';
closeBtn.classList.add('close-btn');

closeBtnL.innerHTML = '&times;';
closeBtnL.classList.add('close-btn');

function abrirLogin(){
  if (containerLogin && modalBackL) {
    containerLogin.style.display = 'block';
    modalBackL.style.display = 'block';
    containerBtnL.style.display = 'block';
  }
}

closeBtnL.onclick = function () {
  containerBtnL.style.display = 'none';
  containerLogin.style.display = 'none';
  modalBackL.style.display = 'none';
};

containerBtnL.appendChild(closeBtnL);






function abrirRegistro(){
  if (containerForms && modalBack) {
    containerForms.style.display = 'block';
    modalBack.style.display = 'block';
    containerBtn.style.display = 'block';
  }
}

closeBtn.onclick = function () {
  containerBtn.style.display = 'none';
  containerForms.style.display = 'none';
  modalBack.style.display = 'none';
};

containerBtn.appendChild(closeBtn);

