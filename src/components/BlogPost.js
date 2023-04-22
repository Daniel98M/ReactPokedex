//Carlos Daniel Martinez Zarate Codigo: 197620
import React, { useState, useEffect } from 'react';
import './styles/BlogPost.css';
import { useLocation } from 'react-router-dom';

export const BlogPost = () => {
  // Obtener el objeto location de la ruta actual
  const location = useLocation();
  // Definir el valor inicial del id del pokemon en 1
  let pokemonId = 1
  // Si hay información en el objeto state de la ruta, actualizar el id del pokemon con el valor especificado
  if (location.state && location.state.pokemonId) {
    pokemonId = location.state.pokemonId
  }
  // Definir estado para el número del pokemon y la información del pokemon
  const [pokemonNumber, setPokemonNumber] = useState(pokemonId);
  const [pokemonInfo, setPokemonInfo] = useState(null);

  // Obtener la información del pokemon con el id especificado y actualizar el estado
  useEffect(() => {
    const fetchPokemonInfo = async () => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNumber}`);
      const data = await response.json();
      setPokemonInfo(data);
    };
    fetchPokemonInfo();
  }, [pokemonNumber]);

  // Manejar el evento del botón "Anterior" para actualizar el estado con el número del pokemon anterior (si es posible)
  const handlePreviousClick = () => {
    if (pokemonNumber > 1) {
      setPokemonNumber(pokemonNumber - 1);
    }
  };

  // Manejar el evento del botón "Siguiente" para actualizar el estado con el número del pokemon siguiente (si es posible)
  const handleNextClick = () => {
    if (pokemonNumber < 151) {
      setPokemonNumber(pokemonNumber + 1);
    }
  };

  return (
    <div className="pokedex">
      <h1>Pokedex</h1>
      {pokemonInfo ? (
        <div className="pokedex-screen">
          <div className="pokedex-image">
            <img src={pokemonInfo.sprites.front_default} alt={pokemonInfo.name} />
          </div>
          <div className="pokedex-info">
            <h2 className="pokedex-name">
              {pokemonInfo.id.toString().padStart(3, '0')} - {pokemonInfo.species.name.charAt(0).toUpperCase() + pokemonInfo.species.name.slice(1)}
            </h2>
            <div className="pokedex-data">
              <div className="pokedex-type">
                {pokemonInfo.types.map((type) => (
                  <span key={type.type.name} className={`type-${type.type.name}`}>
                    {type.type.name}
                  </span>
                ))}
              </div>
              <div className="pokedex-stats">
                <div className="pokedex-stat">
                  <span className="pokedex-stat-name">HP</span>
                  <span className="pokedex-stat-value">{pokemonInfo.stats[0].base_stat}</span>
                </div>
                <div className="pokedex-stat">
                  <span className="pokedex-stat-name">Attack</span>
                  <span className="pokedex-stat-value">{pokemonInfo.stats[1].base_stat}</span>
                </div>
                <div className="pokedex-stat">
                  <span className="pokedex-stat-name">Defense</span>
                  <span className="pokedex-stat-value">{pokemonInfo.stats[2].base_stat}</span>
                </div>
                <div className="pokedex-stat">
                  <span className="pokedex-stat-name">Speed</span>
                  <span className="pokedex-stat-value">{pokemonInfo.stats[5].base_stat}</span>
                </div>
              </div>
            </div>
            <div className="pokedex-buttons">
              <button className="pokedex-button" onClick={handlePreviousClick}>
                <span className="pokedex-button-label">Previous</span>
              </button>
              <button className="pokedex-button" onClick={handleNextClick}>
                <span className="pokedex-button-label">Next</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
      <div className="pokedex-carcass"></div>
    </div>
  );
};

