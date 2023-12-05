// Selecting items
const listWrapper = document.getElementsByClassName("list-wrapper");
const searchInput = document.getElementById("search-input");
const numberFilter = document.getElementById("number");
const nameFilter = document.getElementById("name");
const notFoundMessage = document.getElementById("not-found-message"); 

// Global variables
const MAX_POKEMON = 151;

// Store all pokemons
let allPokemons = [];

// GET API 
fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
.then((response) => response.json())
.then((data) => {
    allPokemons = data.results;
    displayPokemons(allPokemons);
});

// Fetch data of an specific pokemon
async function fetchPokemonDataBeforeRedirect(id) {
    try {
        const [pokemon, pokemonSpecies] = await Promise.all([fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then(response => response.json()
        ),
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
        .then(response =>  response.json()
        ),
    ])
    return true;
    } catch (error) {
        // If data couldn't charge
        console.error("Failed to fetch pokemon data before redirect")
    }
}


function displayPokemons(pokemon) {
    listWrapper.innerHtml = "";

    pokemon.forEach(pokemon => {
        const pokemonId = pokemon.url.split("/")[6];
        const listItem = document.createElement("div");
        listItem.className = "list-item";
        listItem.innerHTML = `
            <div class="number-wrap">
                <p class="caption-fonts">#${pokemonId}</p>
            </div>
            <div class="image-wrap">
                <img src="https://github.com/PokeAPI/sprites/blob/master/sprites/pokemon/${pokemonId}.png" alt="${pokemon.name}"/>
            </div>
            <div class="name-wrap">
                <p class="body3-fonts">${pokemon.name}</p>
            </div>
        `
        // Go to the detail page
        listItem.addEventListener("click", async () => {
            const succes = await fetchPokemonDataBeforeRedirect(pokemonId);
             if(succes) {
                window.location.href = `./detail.html?id=${pokemon.id}`
             }
        });

        listWrapper.appendChild(listItem)
    });
}
