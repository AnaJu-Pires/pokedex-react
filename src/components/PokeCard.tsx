import { useEffect, useState } from "react";
import "./PokeCard.css";

type Pokemon = {
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string | null;
  };
  types: Array<{
    type: { name: string };
  }>;
};

type Props = {
  pokemon: Pokemon;
};

export default function PokeCard({ pokemon }: Props) {
  const [favorito, setFavorito] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem("pokedex_favoritos") || "[]";
      const arr: string[] = JSON.parse(raw);
      return arr.includes(pokemon.name);
    } catch {
      return false;
    }
  });

  useEffect(() => {
    console.log(`Pokémon ${pokemon.name} carregado com sucesso!`);
  }, [pokemon]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("pokedex_favoritos") || "[]";
      const arr: string[] = JSON.parse(raw);
      const set = new Set(arr);
      if (favorito) set.add(pokemon.name);
      else set.delete(pokemon.name);
      localStorage.setItem(
        "pokedex_favoritos",
        JSON.stringify(Array.from(set)),
      );
      try {
        window.dispatchEvent(new CustomEvent("favoritosChanged"));
      } catch {}
    } catch (e) {
    }
  }, [favorito, pokemon.name]);

  const typeColors: Record<string, string> = {
    grass: "#4CAF50",
    fire: "#F44336",
    water: "#2196F3",
    bug: "#8BC34A",
    normal: "#9E9E9E",
    poison: "#9C27B0",
    electric: "#FFEB3B",
    ground: "#A1887F",
    fairy: "#F8BBD0",
    fighting: "#D32F2F",
    psychic: "#E91E63",
    rock: "#795548",
    ghost: "#5E35B1",
    ice: "#81D4FA",
    dragon: "#673AB7",
    dark: "#37474F",
    steel: "#B0BEC5",
    flying: "#90A4AE",
  };

  const primaryType = pokemon.types[0]?.type?.name || "normal";
  const borderColor = typeColors[primaryType] || "#e2e8f0";

  return (
    <div
      className="pokecard"
      style={{ borderLeft: `6px solid ${borderColor}` }}
    >
      <div className="pokecard-header">
        <h3 className="pokecard-name">
          {pokemon.name}
          {favorito && <span className="pokecard-star"> ⭐</span>}
        </h3>
        <button
          className={`pokecard-fav ${favorito ? "active" : ""}`}
          onClick={() => setFavorito((s) => !s)}
        >
          {favorito ? "Desfavoritar" : "Favoritar"}
        </button>
      </div>

      {pokemon.sprites.front_default && (
        <img
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          className="pokecard-image"
        />
      )}

      <div className="pokecard-body">
        <p>
          <strong>Altura:</strong> {pokemon.height * 10} cm
        </p>
        <p>
          <strong>Peso:</strong> {pokemon.weight / 10} kg
        </p>
        <p>
          <strong>Tipos:</strong>{" "}
          {pokemon.types.map((t) => t.type.name).join(" / ")}
        </p>
      </div>
    </div>
  );
}
