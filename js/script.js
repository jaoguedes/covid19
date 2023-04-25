function menuOnClick() {
    document.getElementById('menu-bar').classList.toggle('change');//parar remover e adicionar outra
    document.getElementById('nav').classList.toggle('change');
    document.getElementById('menu-bg').classList.toggle('change');
    let nav = document.getElementById('nav');
    if (nav.style.display == 'block') {
        nav.style.display = 'none'
    }
    else {
        nav.style.display = 'block'
    }
}
// FAZENDO O MAPA
function exibirErro(mensagem) {
    let erro = document.getElementById('div-erro');
    erro.style.display = 'block';
    erro.innerHTML = '<b>Erro ao acessar a API:</b><br />' + mensagem;
}
var mp = document.getElementById('area-mapa');

async function carregarMapa() {

    let erro = document.getElementById('div-erro');
    erro.style.display = 'none';

    await fetch('https://covid19-brazil-api.vercel.app/api/report/v1/countries')
        .then(response => response.json())
        .then(dados => prepararDados(dados))
        .catch(e => exibirErro(e.mensage));

    gp.style.display = 'none';
    tabela.style.display = 'none';
    mp.style.display = 'block';
   

}

function prepararDados(dados) {
    paises = [
        ['pais', 'casos']
    ]
    for (let i = 0; i < dados['data'].length; i++) {
        paises.push(
            [dados['data'][i].country,
            dados['data'][i].confirmed]
        )
    }
    drawRegionsMap()
}
// 
var paises = [
    ['pais', 'casos'],
    ['0', 0]
]

google.charts.load('current', {
    'packages': ['geochart'],
});
google.charts.setOnLoadCallback(drawRegionsMap);

function drawRegionsMap() {
    var data = google.visualization.arrayToDataTable(paises);

    var options = {
        backgroundColor: '#81d4fa',
        colorAxis: { colors: ['#fc0404', '#fc7c7c', '#830101', '#970101'] }
    };

    var chart = new google.visualization.GeoChart(document.getElementById('area-mapa'));

    chart.draw(data, options);
}

// FAZENDO GRAFICO DE PIZZA
let gp = document.getElementById('graficoPizza');
async function carregarPizza() {

    let erro = document.getElementById('div-erro');
    erro.style.display = 'none';

    await fetch('https://covid19-brazil-api.vercel.app/api/report/v1/countries')
        .then(response => response.json())
        .then(dados => prepararPizza(dados))
        .catch(e => exibirErro(e.mensage));
}

function prepararPizza(dados) {
    pizza = [
        ['casos', 'total']]

    let confirmados = 0;
    let mortos = 0;
    let recuperados = 0;

    for (let i = 0; i < dados['data'].length; i++) {
        confirmados = confirmados + dados['data'][i].confirmed;

        mortos = mortos + dados['data'][i].deaths;
        recuperados = recuperados + dados['data'][i].recovered
    }
    pizza.push(['confirmados', confirmados])
    pizza.push(['mortos', mortos])
    pizza.push(['recuperados', recuperados])


    mp.style.display = 'none';
    tabela.style.display = 'none';
    gp.style.display = 'block';

    drawChart()
}
var pizza = [
    ['casos', 'total'],
    ['', 0]
]
google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {

    var data = google.visualization.arrayToDataTable(pizza);

    var options = {
        title: 'Quantia de Casos'
    };

    var chart = new google.visualization.PieChart(document.getElementById('graficoPizza'));

    chart.draw(data, options);
}




// FAZENDO TABELA
async function carregarTabela() {
    //ocultar a duv de erro (se estiver visível)
    var tabela = document.getElementById('tabela')
    const divErro = document.getElementById('div-erro');
    divErro.style.display = 'none';
    mp.style.display = 'none';
    gp.style.display = 'none';
    tabela.style.display = 'block';

    await fetch('https://covid19-brazil-api.now.sh/api/report/v1') //Endpoint da API
        .then(response => response.json())   //Obtendo resposta da API
        .then(dadosTab => prepararTabela(dadosTab)) //Obtendo os dados
        .catch(e => exibirErro(e.message));  //Obtendo o erro (se der erro)



}

//Função para exibir mensagem de erro
function exibirErro(mensagem) {
    const divErro = document.getElementById('div-erro');
    divErro.style.display = 'block';
    divErro.innerHTML = '<b>Erro ao acessar a API</b><br><br />' + mensagem;

}

//Função para preparar e exibir os dados no HTML
function prepararTabela(dadosTab) {
    //Criando variável para controlar as linhas da tbody
    let linhas = document.getElementById('linhas');
    linhas.innerHTML = '';

    //Laço para percorrer todos os dados recebidos
    for (let i = 0; i < dadosTab['data'].length; i++) {
        let auxLinha = '';

        if (i % 2 != 0)
            auxLinha = '<tr class="listra">';
        else
            auxLinha = '<tr>';

        auxLinha += '<td>' + dadosTab['data'][i].state + '</td>' +
            '<td>' + dadosTab['data'][i].uf + '</td>' +
            '<td>' + dadosTab['data'][i].cases + '</td>' +
            '<td>' + dadosTab['data'][i].deaths + '</td>' +
            '<td>' + dadosTab['data'][i].suspects + '</td>' +
            '<td>' + dadosTab['data'][i].refuses + '</td>' +
            '</tr>';

        linhas.innerHTML += auxLinha;

    }

}
 

