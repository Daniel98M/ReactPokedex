//Carlos Daniel Martinez Zarate Codigo: 197620
import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

export const PokemonesCapturados = () => {
  const [capturados, setCapturados] = useState([]);

  useEffect(() => {
    const collectionRef = collection(db, 'pokemonesCapturados');
    const q = query(collectionRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const pokemonesCapturados = [];
      querySnapshot.forEach((doc) => {
        pokemonesCapturados.push(doc.data());
      });
      setCapturados(pokemonesCapturados);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className='App'>
      <h1>PC de Bill</h1>
      <div className='Pokedex'>
        {
          capturados.map((pokemon, index) => {
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

export default PokemonesCapturados;