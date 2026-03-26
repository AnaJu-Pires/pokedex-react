import { useState, useEffect } from "react";
import "./Pokedex.css";
import PokeCard from "./PokeCard";

// Definindo o tipo com base no json para simplificar a implementação
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

export default function Pokedex() {
  const [nome, setNome] = useState("");
  const [carregando, setCarregando] = useState(false);

  // Agora podemos armazenar vários pokémons em sequência
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [erro, setErro] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [favoritosData, setFavoritosData] = useState<Pokemon[]>([]);
  const [carregandoFavoritos, setCarregandoFavoritos] = useState(false);

  // carrega favoritos do localStorage
  const loadFavoritos = () => {
    try {
      const raw = localStorage.getItem("pokedex_favoritos") || "[]";
      const arr: string[] = JSON.parse(raw);
      setFavoritos(arr);
    } catch {
      setFavoritos([]);
    }
  };

  // iniciar favoritos e escutar mudanças (disparadas por PokeCard)
  useEffect(() => {
    loadFavoritos();
    const handler = () => loadFavoritos();
    window.addEventListener("favoritosChanged", handler as EventListener);
    return () =>
      window.removeEventListener("favoritosChanged", handler as EventListener);
  }, []);

  // busca dados completos dos pokémons favoritados
  const fetchFavoritosData = async (names: string[]) => {
    setCarregandoFavoritos(true);
    try {
      const promises = names.map((n) =>
        fetch(`https://pokeapi.co/api/v2/pokemon/${n.toLowerCase()}`)
          .then((r) => {
            if (!r.ok) return null;
            return r.json();
          })
          .catch(() => null),
      );
      const results = await Promise.all(promises);
      const valid = results.filter((r): r is Pokemon => r && (r as any).name);
      setFavoritosData(valid);
    } catch {
      setFavoritosData([]);
    } finally {
      setCarregandoFavoritos(false);
    }
  };

  const buscarPokemon = async () => {
    if (!nome.trim()) return;

    setCarregando(true);
    setErro("");
    // não limpamos a lista: queremos permitir buscas em sequência

    try {
      const resposta = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${nome.toLowerCase()}`,
      );
      if (!resposta.ok) throw new Error("Pokémon não encontrado");

      // Convertemos o JSON dizendo ao TS que ele tem formato Pokemon
      const dados: Pokemon = await resposta.json();
      // Evitar duplicatas: por nome
      setPokemons((prev) => {
        if (prev.some((p) => p.name === dados.name)) return prev;
        return [...prev, dados];
      });
    } catch (e) {
      setErro("Pokémon não encontrado 😢");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="pokedex-container">
      <h2 className="pokedex-title">🔎 Pokédex</h2>

      <input
        className="pokedex-input"
        type="text"
        placeholder="Digite o nome do Pokémon"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />

      <button className="pokedex-button" onClick={buscarPokemon}>
        Buscar
      </button>

      {carregando && <p className="pokedex-loading">Carregando...</p>}
      {erro && <p className="pokedex-error">{erro}</p>}

      <div
        style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}
      >
        <button
          className="pokedex-button"
          onClick={async () => {
            const next = !showFavorites;
            setShowFavorites(next);
            if (next) {
              // recarregar lista de nomes e buscar dados
              loadFavoritos();
              const raw = localStorage.getItem("pokedex_favoritos") || "[]";
              let arr: string[] = [];
              try {
                arr = JSON.parse(raw);
              } catch {}
              if (arr.length === 0) {
                setFavoritosData([]);
                return;
              }
              await fetchFavoritosData(arr);
            }
          }}
        >
          {showFavorites
            ? "Mostrar pesquisados"
            : `Mostrar favoritos (${favoritos.length})`}
        </button>
        {carregandoFavoritos && (
          <span style={{ marginLeft: 8 }}>Carregando favoritos...</span>
        )}
      </div>

      {showFavorites ? (
        <div style={{ marginTop: 12 }}>
          {carregandoFavoritos ? (
            <p className="pokedex-loading">Carregando favoritos...</p>
          ) : favoritosData.length > 0 ? (
            <div className="pokedex-cards">
              {favoritosData.map((p) => (
                <PokeCard key={p.name} pokemon={p} />
              ))}
            </div>
          ) : (
            <p style={{ marginTop: 12 }}>Nenhum favorito salvo.</p>
          )}
        </div>
      ) : (
        pokemons.length > 0 && (
          <div className="pokedex-cards">
            {pokemons.map((p) => (
              <PokeCard key={p.name} pokemon={p} />
            ))}
          </div>
        )
      )}
    </div>
  );
}
