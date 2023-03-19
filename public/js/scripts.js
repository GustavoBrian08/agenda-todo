import { initializeApp } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js";
import { getFirestore, addDoc, query, collection, where, onSnapshot, updateDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAxdViEkLXWFDKmxEVjmiafWxVxgC3yNZU",
    authDomain: "agenda-organizada-e68ca.firebaseapp.com",
    projectId: "agenda-organizada-e68ca",
    storageBucket: "agenda-organizada-e68ca.appspot.com",
    messagingSenderId: "784610822688",
    appId: "1:784610822688:web:2da125cccaa3b522e04a45"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app)


//CADASTRAR USER
async function cadastrarUsuario(){
    var email = document.querySelector('#email').value;
    var senha = document.querySelector('#senha').value;
    var confSenha = document.querySelector('#confSenha').value;
    if(senha!=confSenha){
        alert('Senha e confirmar senha estão diferentes');
    }else{
        createUserWithEmailAndPassword(auth, email, senha).then(function(){ window.location.href = "inicial.html" }).catch((error) => {
          if(error.message == "Firebase: Error (auth/email-already-in-use)."){ alert('Esta conta já existe!') }
        });
    }
}

//LOGAR USER
function fazerLogin(){
    var email = document.querySelector('#email-log').value;
    var senha = document.querySelector('#senha-log').value;
    
    signInWithEmailAndPassword(auth, email, senha).then(function(){ window.location.href = "inicial.html" }
    ).catch();
}


var formLogin = document.querySelector("#login")
var botaoCadastro = document.getElementById("botCadastro");
var botaoLogin = document.querySelector("#botLogin");
var formCadastro = document.getElementById("cadastro");

//CADASTRO
function irParaCadastro(){
    formCadastro.style.display = "flex";
    sairDoLogin();
}

function sairDoCadastro(){
    formCadastro.style.display = "none";
}

if(botaoCadastro) {
    botaoCadastro.onclick = function(){
        irParaCadastro();
    }

    formCadastro.onsubmit = function(e){
        e.preventDefault();
        cadastrarUsuario();
    }
}


//LOGIN
function irParaLogin(){
    formLogin.style.display = "flex";
    sairDoCadastro();
}

function sairDoLogin(){
    formLogin.style.display = "none";
}

if(botaoLogin) {
    botaoLogin.onclick = function(){
        irParaLogin();
    }
    
    formLogin.onsubmit = function(e){
        e.preventDefault()
        fazerLogin();
    }
}



// LOGOUT
const deslogar = () => signOut(auth).then(() => window.location.href = 'index.html' )
  
const botaoDeslogar = document.getElementById('botao-logout')
if(botaoDeslogar){ botaoDeslogar.onclick = () => deslogar() }

// -------- TO DO ---------

var formTarefa = document.querySelector("#form-tarefa");
var inputTarefa = document.querySelector("#input-tarefa");
var espacoTarefa = document.querySelector("#espaco-tarefa");
var dataTarefa = document.querySelector("#data-tarefa");

// CREATE
const criarTarefa = async (email) => {
    if(inputTarefa.value.length != 0 && inputTarefa.value != ' ' && dataTarefa.value.length != 0){
      try {
        await addDoc(collection(db, "Tarefas"), {
          nome: inputTarefa.value,
          usuario: email,
          concluido: false,
          dataSelecionada: dataTarefa.value
        })
        
        inputTarefa.value = ''
        dataTarefa.value = ''
        console.log('tarefa criada')
      } catch (e) {
        console.log(`Erro ao criar tarefa: ${e}`);
      }
    } else {
      alert('Insira o nome da tarefa e um prazo!');
    }
  }
  
// READ
const carregarTarefas = function (nomeTarefa, dataTarefa, status) {
    let new_data = new Date(`${dataTarefa} 00:00:00`)
    // let options = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' };

    const tarefas = document.createElement('div');
    const tarefaNome = document.createElement('p');
    const datas = document.createElement('div');
    const checkbox = document.createElement('input');
    const botaoDeletar = document.createElement('button');
    const barraVertical = document.createElement('hr');

    tarefaNome.innerHTML = nomeTarefa;
    datas.innerHTML = new_data.toLocaleDateString('pt-BR'); // CASO QUEIRA QUE OS DIAS DA SEMANA APAREÇAM NA DATA, DESCOMENTE "options" E COLOQUE APÓS UMA VÍRGULA DEPOIS DE 'pt-BR' COMO UM SEGUNDO ARGUMENTO.
    botaoDeletar.innerHTML = 'x';
    checkbox.type = 'checkbox';
    checkbox.checked = status
    
    tarefas.classList.add('tarefinhas');
    if(status){ tarefaNome.classList.add('concluido') };
    barraVertical.classList.add('barra-vertical');
    checkbox.classList.add('checkbox');
    botaoDeletar.classList.add('botao-deletar');
    
    tarefas.appendChild(checkbox);
    tarefas.appendChild(tarefaNome);
    tarefas.appendChild(barraVertical);
    tarefas.appendChild(datas);
    tarefas.appendChild(botaoDeletar);
    espacoTarefa.appendChild(tarefas);
}

// UPDATE
const verificarCheckbox = (id, tarefa) => {
    const checkbox = document.getElementsByClassName('checkbox')
    for(let i = 0; i < checkbox.length; i++){
        const box = checkbox[i]
          

      box.addEventListener('click', async () => {
        if(tarefa == box.parentElement.children[1].innerHTML){
          let valor
          if(box.checked){
              valor = true
              box.parentElement.children[1].classList.add('concluido')
          } else {
            valor = false
            box.parentElement.children[1].classList.remove('concluido')
          } 
          await updateDoc(doc(db, "Tarefas", id), {
            concluido: valor
          })

          console.log('tarefa atualizada')
        }
      })
    }
}

// DELETE
const deletarTarefa = (id, tarefa) => {
    const botaoDelete = document.getElementsByClassName('botao-deletar')
  
    for(let i = 0; i < botaoDelete.length; i++){
      const botao = botaoDelete[i]
      
      botao.addEventListener('click', async () => {
        if(tarefa == botao.parentElement.children[1].innerHTML){
          botao.parentElement.remove()
          await deleteDoc(doc(db, "Tarefas", id))
        }
      })
    }
  }
  


// STATUS DO USUÁRIO

onAuthStateChanged(auth, (user) => {
    if (user) { // USUARIO LOGADO
  
        formTarefa.onsubmit = function (e) {
            e.preventDefault();
            criarTarefa(user.email);
        }

      const tarefas = query(collection(db, "Tarefas"), where("usuario", "==", user.email))
      onSnapshot(tarefas, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          let status = change.doc.data().concluido
          let tarefaID = change.doc.id
          let tarefaNome = change.doc.data().nome
          let dataSelecionada = change.doc.data().dataSelecionada
          
          if (change.type === "added") {
            carregarTarefas(tarefaNome, dataSelecionada, status);
            verificarCheckbox(tarefaID, tarefaNome);
            deletarTarefa(tarefaID, tarefaNome);
          }
        })
      })
  
    } else { // USUARIO DESLOGADO
        console.log('usuario deslogado')
    }
  })