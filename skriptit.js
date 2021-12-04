//Muuttujat säädetty valmiiksi, jotta saadaan elementit kehiin.
var pokemonsUl = document.getElementById('pokemons');
const form = document.querySelector('form');
const nextButton = document.getElementById('next');
const previousButton = document.getElementById('previous');

var pokemonList = [];
var firstCard = 1;
var perPage = 12;
var lastCard = perPage;

//Aloitus alkaa tästä.
init();

//Tässä haetaan Eventillä tarkennettu kohde syötetyn tekstin mukaan.
form.addEventListener('submit', event =>{
  event.preventDefault();
  const inputValue = event.target.search.value;
  console.log(inputValue);
  search(inputValue);
});
//Tässä on säädetty nappien avulla seuraavan ja edellisen sivun siirtymät
nextButton.addEventListener('click',next);
previousButton.addEventListener('click',previous);


//Metodeilla kutsutaan ensimmäisestä kortista viimeiseen korttiin pokemon listalta
async function getPokemons() {
  for (let i = firstCard; i <= lastCard; i++) {
    pokemonList.push(await fetchPokemon(i));
  }
  render();
}
//Tässä haetaan Fetchin avulla API, joka toimii ilman avainta ja tarkentuu ihan id avulla.
async function fetchPokemon(id) {
  const URL = `https://pokeapi.co/api/v2/pokemon/${id}`;
  const response = await fetch(URL);
  const pokemon = await response.json();
  return pokemon;
  
}
//Tässä haetaan pokemonien tietoja, eli tarkemmin otetaan sen tyyppi esille.
function getTypes(pokemon) {
  const types = pokemon.types.map((typeInfo) => typeInfo.type.name);
  let spanHtml = ``;
  types.forEach((element) => {
    spanHtml += `<span class="badge badge-primary text-capitalize m-1 p-2 ${element}">${element}</span>`;
  });

  return spanHtml;
}
//Pieni funktio Varmistaa, että on oikea pokemoni kyseessä.
function isPokemon(pokemon){
  return pokemon == pokemonList;
}
//Tästä haetaan annetun arvon mukaan pokemonit, jos ne toteutuu se tulee esiin renderöimällä, jos ei se antaa virheen!
async function search(value){
  pokemonsUl.innerHTML = '';

  if(value == '') {
    pokemonList = [];
    getPokemons();
    render();
    return
  }
// Tässä siis fetch kokeilee, että oikea arvo on annettu muuten se antaa virheen.
  try{
    const pokemon = await fetchPokemon(value.toLowerCase());
    pokemonList = [];
    pokemonList.push(pokemon);
    render();
  }catch(e){
    pokemonsUl.innerHTML = `
    <div class="alert alert-danger" role="alert">
      Pokemonisi ei löytynyt! Yritä uudelleen.
    </div>
    `
  }
}

//Tässä tapahtuu se "renderöinti" jolloin tulee pokemoni esiin kortilla jossa on kuva, nimi ja tyyppi.
//Koska on bootstrappi käytössä, niin en oikein halunnut siirtää sen html kohdalle, sillä ne kortit ilmestyy funktiolla.
function render(){
    pokemonList.forEach((pokemon) =>{
      let typesHTML = getTypes(pokemon);
      pokemonsUl.innerHTML += 
      `<style>
      #zoom:hover {
        transition: transform 1s;
        transform: scale(1.35); 
      }
      </style>
        <li class="p-2 m-2 col-md-auto">
          <div class="card  border-0 shadow-sm" style="width: 18rem;">
            <div class="card-header">
              <h6 class="card-subtitle mb-2 text-muted"># Nº ${pokemon.id}</h6>
            </div>
            <div class="card-body">
              <img src="${pokemon.sprites.front_default}" class="card-img-top"  id="zoom" alt="${pokemon.name}">
              <div class="card-body">
                <h5 class="card-tittle text-center text-capitalize">${pokemon.name}</h5>
                ${typesHTML}
              </div>
            </div>
            
        </div> 
        </li>
      `
    });
}

function init(){
  pokemonsUl.innerHTML = '';
  pokemonList = [];
  getPokemons();   
}


//Tämä funktio kontrolloi, että seuraava sivu tulee esille. 250 korttiin edestä.
function next(){
  firstCard = lastCard + 1;
  lastCard = lastCard + perPage;

  if(firstCard > 250){
    return
  }

  init();
}
//Tämä funktio kontrolloi, että tulee edellinen sivu esille.
function previous(){
  firstCard = firstCard - perPage;
  lastCard = lastCard - perPage;

  if(firstCard < 1){
    return
  }
  init()
}
