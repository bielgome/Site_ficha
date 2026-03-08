function calcularStatus() {

    let forca = parseInt(document.getElementById("forca").value) || 0;
    let agilidade = parseInt(document.getElementById("agilidade").value) || 0;
    let presenca = parseInt(document.getElementById("presenca").value) || 0;
    let vigor = parseInt(document.getElementById("vigor").value) || 0;

    let defesa = vigor + agilidade;
    let esquiva = agilidade + presenca;
    let bloqueio = forca + vigor;

    let fadiga = vigor * 10;
    let fome = vigor * 5;
    let sede = vigor * 5;

    document.getElementById("defesa").value = defesa;
    document.getElementById("esquiva").value = esquiva;
    document.getElementById("bloqueio").value = bloqueio;

    document.getElementById("fadiga").value = fadiga;
    document.getElementById("fome").value = fome;
    document.getElementById("sede").value = sede;

}

document.getElementById("forca").addEventListener("input", calcularStatus);
document.getElementById("agilidade").addEventListener("input", calcularStatus);
document.getElementById("presenca").addEventListener("input", calcularStatus);
document.getElementById("vigor").addEventListener("input", calcularStatus);

//Rolar dados

document.querySelectorAll(".rolar").forEach(botao => {

    botao.addEventListener("click", function () {

        let linha = this.closest("tr");
        let resultadoSpan = linha.querySelector(".resultado");

        let atributoNome = linha.dataset.atributo;

        let atributo = Number(document.getElementById(atributoNome).value) || 0;

        let bonus = Number(linha.querySelector(".bonus").value) || 0;

        let maestria = Number(linha.querySelector(".maestria").value) || 0;

        let contador = 0;

        let animacao = setInterval(() => {

            let numero = Math.floor(Math.random() * 20) + 1;

            resultadoSpan.textContent = "🎲 " + numero;

            contador++;

            if (contador > 10) {

                clearInterval(animacao);

                rolagemFinal();

            }

        }, 100);



        function rolagemFinal() {

            let resultados = [];
            let somaDados = 0;

            if (atributo === 0) {

                let d1 = Math.floor(Math.random() * 20) + 1;
                let d2 = Math.floor(Math.random() * 20) + 1;

                resultados.push(d1, d2);

                somaDados = Math.min(d1, d2);

            } else {

                for (let i = 0; i < atributo; i++) {

                    let dado = Math.floor(Math.random() * 20) + 1;

                    resultados.push(dado);

                    somaDados += dado;

                }

            }

            let total = somaDados + bonus + maestria;

            resultadoSpan.textContent =
                "🎲 " + resultados.join(", ") +
                " | Soma: " + somaDados +
                " | Total: " + total;

        }

    });

});

//Calcular peso

let pesoTotal = 0;

function atualizarCapacidade() {

    let forca = Number(document.getElementById("forca").value) || 0;

    let capacidade = 9 + forca;

    if (forca === 0) {
        capacidade = capacidade - 1;
    }

    document.getElementById("capacidade").textContent = capacidade;

}

function adicionarItem() {

    let nome = document.getElementById("itemNome").value;
    let descricao = document.getElementById("itemDescricao").value;
    let dano = document.getElementById("itemDano").value;
    let peso = Number(document.getElementById("itemPeso").value);

    if (!nome || !peso) return;

    let capacidade = Number(document.getElementById("capacidade").textContent);

    if (pesoTotal + peso > capacidade) {

        alert("Peso máximo atingido!");

        return;

    }

    pesoTotal += peso;

    document.getElementById("pesoTotal").textContent = pesoTotal;

    let tabela = document.getElementById("tabelaInventario");

    let linha = tabela.insertRow();

    linha.insertCell(0).textContent = nome;
    linha.insertCell(1).textContent = descricao;
    linha.insertCell(2).textContent = dano;
    linha.insertCell(3).textContent = peso;

    let botao = document.createElement("button");

    botao.textContent = "❌";

    botao.onclick = function () {

        pesoTotal -= peso;

        document.getElementById("pesoTotal").textContent = pesoTotal;

        linha.remove();

    }

    linha.insertCell(4).appendChild(botao);

}

document.getElementById("forca").addEventListener("input", atualizarCapacidade);

atualizarCapacidade();

//Salvar ficha
function exportarFicha() {

    let dados = {};

    document.querySelectorAll("input").forEach(input => {
        dados[input.id] = input.value;
    });

    let json = JSON.stringify(dados);

    let blob = new Blob([json], { type: "application/json" });

    let link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "ficha_rpg.json";

    link.click();

}

function importarFicha(event) {

    let arquivo = event.target.files[0];

    let leitor = new FileReader();

    leitor.onload = function () {

        let dados = JSON.parse(leitor.result);

        for (let id in dados) {

            let campo = document.getElementById(id);

            if (campo) {

                campo.value = dados[id];

            }

        }

    };

    leitor.readAsText(arquivo);

}