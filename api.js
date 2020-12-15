const fetch = require('node-fetch');

const token="cd06accc7cba9e0b48b4d3106f3ea4359f593725";
const data = "2020-05-10"
const UF = "PR"
const url=`https://api.brasil.io/v1/dataset/covid19/caso/data?state=${UF}&date=${data}`


fetch(
  url,
  {
    method: 'get',
    headers: {
      Authorization: `Token ${token}`,
    },
  }
).then(res => res.json())
.then(json => lista(json));

/* Function para organizar as cidades por ordem de porcentagem*/
function ordenando(a, b) {
    return b.porcento - a.porcento;
  }

  /* Function para Pegar somente as 10 cidades */
function lista(json){
    var dados = []
    var maioresCasos = []
    for (var i=0; i < json.results.length; i++){
       dados.push({"city":json.results[i].city, "confirmados":json.results[i].confirmed, "populacao":json.results[i].estimated_population, "porcento":(json.results[i].confirmed*100)/json.results[i].estimated_population});
    }

    /* Organiza a array colocando os casos com maior porcentagem no array[0] */
    dados.sort(ordenando);

    for (var k=0; k < 10; k++){
        maioresCasos.push(dados[k]);

        fetch('https://us-central1-lms-nuvem-mestra.cloudfunctions.net/testApi', { 
            method: 'POST',
            headers: {
                MeuNome: "Ednilson Henrique Rodrigues Dos Santos"
            },
            body: {
                id: k,
                nomeCidade: dados[k].city,
                percentualDeCasos: dados[k].porcento.toFixed(2)
            } })
        .then(res => res.json())
        .then(json2 => console.log(json2));
    }
}