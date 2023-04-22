//Carlos Daniel Martinez Zarate Codigo: 197620
import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore'; // Importamos las funciones necesarias de Firestore
import { db } from './firebase'; // Importamos la instancia de Firebase

export const PokemonesFavoritos = () => {
  const [favoritos, setFavoritos] = useState([]); // Definimos el estado "favoritos" como un array vacío

  useEffect(() => {
    const collectionRef = collection(db, 'pokemonesFavoritos'); // Obtenemos una referencia a la colección "pokemonesFavoritos" en Firestore
    const q = query(collectionRef); // Creamos una consulta que nos devolverá todos los documentos de la colección
    const unsubscribe = onSnapshot(q, (querySnapshot) => { // Creamos un listener que se ejecutará cada vez que haya cambios en la colección
      const pokemonesfavoritos = [];
      querySnapshot.forEach((doc) => {
        pokemonesfavoritos.push(doc.data()); // Recorremos los documentos de la colección y añadimos sus datos al array "pokemonesfavoritos"
      });
      setFavoritos(pokemonesfavoritos); // Actualizamos el estado "favoritos" con el array de favoritos obtenido de Firestore
    });
    return () => unsubscribe(); // Cuando el componente se desmonte, eliminamos el listener
  }, []);

  return (
    <div className='App'>
      <h1>Lista de pokemones deseados</h1>
      <div className='Pokedex'>
        {
          favoritos.map((pokemon, index) => {
            let Type = null;

            if(pokemon.types.length == 2){
              Type = <><div className="pokedex-type"><span className={"type-" + pokemon.types[0].type.name}>
                {pokemon.types[0].type.name.charAt(0).toUpperCase() + pokemon.types[0].type.name.slice(1)}</span>
                <span className={"type-" + pokemon.types[1].type.name}>
                  {pokemon.types[1].type.name.charAt(0).toUpperCase() + pokemon.types[1].type.name.slice(1)}</span></div></>
            }else{
              Type = <div className="pokedex-type"><span className={"type-" + pokemon.types[0].type.name}>
              {pokemon.types[0].type.name.charAt(0).toUpperCase() + pokemon.types[0].type.name.slice(1)}</span></div>
            }

            return (
              <div id={pokemon.id} key={index}>
                <div className='Entry' style={{ width: '10rem', height: '15rem', backgroundColor: '#F0F0C9' }}>
                  <img src={pokemon.sprites.front_default} alt={pokemon.species.name} />
                  <div>
                    <h5>{pokemon.species.name.charAt(0).toUpperCase() + pokemon.species.name.slice(1)}</h5>
                    {Type}
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  );
};

export default PokemonesFavoritos;