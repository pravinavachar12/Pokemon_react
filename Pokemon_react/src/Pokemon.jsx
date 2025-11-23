import { useEffect, useState } from "react";
import "./index.css";
import PokemonCards from "./PokemonCards";

export default function Pokemon() {
  const [pokemon, setPokemon] = useState([]);
  const [search, setSearch] = useState("");

  // Multiple filter states
  const [filters, setFilters] = useState({
    height: "",
    weight: "",
    speed: "",
    experience: "",
    attack: "",
  });

  // Sorting
  const [sortType, setSortType] = useState("");

  // Fetch Pokémon
  const getPoke = async () => {
    try {
      let res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=200");
      let data = await res.json();

      const detailedPokemon = await Promise.all(
        data.results.map(async (poke) => {
          const res = await fetch(poke.url);
          return await res.json();
        })
      );

      setPokemon(detailedPokemon);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    getPoke();
  }, []);

  // FILTER + SEARCH + SORT
  let filteredPokemon = pokemon
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))

    .filter((p) => {
      const statMap = {
        height: p.height,
        weight: p.weight,
        speed: p.stats[5].base_stat,
        experience: p.base_experience,
        attack: p.stats[1].base_stat,
      };

      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return statMap[key] >= Number(value);
      });
    });

  // Sorting
  if (sortType) {
    filteredPokemon.sort((a, b) => {
      const statMap = {
        attack: 1,
        defense: 2,
        speed: 5,
        height: "height",
        weight: "weight",
      };

      if (statMap[sortType] === "height") return b.height - a.height;
      if (statMap[sortType] === "weight") return b.weight - a.weight;

      return (
        b.stats[statMap[sortType]].base_stat -
        a.stats[statMap[sortType]].base_stat
      );
    });
  }

  // Clear Filters
  const clearFilters = () => {
    setFilters({
      height: "",
      weight: "",
      speed: "",
      experience: "",
      attack: "",
    });
    setSortType("");
  };

  return (
    <>
      {/* Search Bar */}
      <div className="pokemon-search">
        <input
          type="text"
          placeholder="Search Pokémon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Filters Section */}
      <div className="filter-container">

        <input
          type="number"
          placeholder="Min Height"
          value={filters.height}
          onChange={(e) =>
            setFilters({ ...filters, height: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Min Weight"
          value={filters.weight}
          onChange={(e) =>
            setFilters({ ...filters, weight: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Min Speed"
          value={filters.speed}
          onChange={(e) =>
            setFilters({ ...filters, speed: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Min Experience"
          value={filters.experience}
          onChange={(e) =>
            setFilters({ ...filters, experience: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Min Attack"
          value={filters.attack}
          onChange={(e) =>
            setFilters({ ...filters, attack: e.target.value })
          }
        />

        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="attack">Highest Attack</option>
          <option value="defense">High Defense</option>
          <option value="speed">High Speed</option>
          <option value="height">Tallest</option>
          <option value="weight">Heaviest</option>
        </select>

        <button onClick={clearFilters} className="clear-btn">
          Clear Filters
        </button>
      </div>

      {/* Pokémon Cards */}
      <ul className="cards">
        {filteredPokemon.map((p) => (
          <PokemonCards key={p.id} pokemonData={p} />
        ))}
      </ul>
    </>
  );
}
