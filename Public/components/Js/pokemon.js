// Selecting items
const listWrapper = document.querySelector(".list-wrapper");
const searchInput = document.querySelector("#search-input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notFoundMessage = document.querySelector("#not-found-message"); 

const closeBtn = document.querySelector(".search-close-icon");

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

// Create container for the pokemons
function displayPokemons(pokemon) {
    listWrapper.innerHTML = "";

    pokemon.forEach(pokemon => {
        const pokemonId = pokemon.url.split("/")[6];
        const listItem = document.createElement("div");
        listItem.className = "list-item";
        listItem.innerHTML = `
            <div class="number-wrap">
                <p class="caption-fonts">#${pokemonId}</p>
            </div>
            <div class="image-wrap">
                <img src="https://raw.github.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonId}.svg" alt="${pokemon.name}"/>
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


searchInput.addEventListener("keyup", handleSearch);

function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    let filteredPokemons;

    if(numberFilter.checked) {
        filteredPokemons = allPokemons.filter((pokemon) => {
            const pokemonId = pokemon.url.split("/")[6];
            return pokemonId.startsWith(searchTerm);
        });
    }   else if(nameFilter.checked){
        filteredPokemons = allPokemons.filter((pokemon) => 
            pokemon.name.toLowerCase().startsWith(searchTerm)
        );
    }   else {
        filteredPokemons = allPokemons;
    }

    displayPokemons(filteredPokemons);

    if(filteredPokemons.length === 0) {
        notFoundMessage.style.display = "block"
    } else {
        notFoundMessage.style.display = "none"
    }
}

closeBtn.addEventListener("click", clearSearch)

function clearSearch() {
    searchInput.value = '';
    displayPokemons(allPokemons);
    notFoundMessage.style.display = "none"
}