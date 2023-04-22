//Carlos Daniel Martinez Zarate Codigo: 197620
import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc  } from 'firebase/firestore'; // importa funciones de firestore
import { db } from './firebase'; // importa la instancia de la base de datos de Firebase

import './styles/BlogList.css';

export const BlogList = () => {
  const [pokemones, setpokemones] = useState([]);
  const [capturedPokemons, setCapturedPokemons] = useState([]);
  const [favoritePokemons, setFavoritePokemons] = useState([]);
  const navigate = useNavigate(); // hook para navegar entre páginas

  useEffect(()=>{
    async function obtenerPokemones(){ // función asincrónica que obtiene la lista de pokemones desde la API
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=151'); // hace una petición GET a la API
        const data = await response.json(); // convierte la respuesta a formato JSON
        const details = await Promise.all(data.results.map(async(pokemon) => {
          const url = pokemon.url;
          const detailsResponse = await fetch(url);
          const detailsJson = await detailsResponse.json();
          return detailsJson;
        })); // obtiene los detalles de cada pokemon de forma asincrónica usando Promises.all
        console.log(details);
        setpokemones(details); // actualiza el estado con la lista de pokemones y sus detalles
      } catch (error){
        console.error(error);
      }
    } 
    obtenerPokemones(); // llama a la función para obtener los pokemones cuando el componente se monta
  }, []);

  const handleClick = (id) => { // función que se llama al hacer clic en un pokemon de la lista
    navigate('/Post', { state: { pokemonId: id } }); // navega a la página de detalles del pokemon, pasando su ID como parámetro
  }

  const handleCapture = async (pokemon) => {
    //Obtenemos una referencia a la colección 'pokemonesCapturados' de Firebase
    const collectionRef = collection(db, "pokemonesCapturados");
    //Obtenemos una instantánea de la colección para buscar si el pokemon ya fue capturado
    const querySnapshot = await getDocs(collectionRef);
    //Verificamos si el pokemon ya está capturado buscando por su id
    const alreadyCaptured = querySnapshot.docs.some((doc) => doc.data().id === pokemon.id);
  
    //Si el pokemon no está capturado, lo agregamos a la colección 'pokemonesCapturados' de Firebase
    if (!alreadyCaptured) {
      try {
        await addDoc(collectionRef, pokemon);
        console.log("Pokemon capturado:", pokemon);
        
        //Si el pokemon capturado estaba en la lista de pokemones favoritos, lo eliminamos de esa lista
        if (isFavorite(pokemon)) {
          //Obtenemos una referencia a la colección 'pokemonesFavoritos' de Firebase
          const favoriteCollectionRef = collection(db, "pokemonesFavoritos");
          try {
            //Buscamos el documento que corresponde al pokemon en la colección 'pokemonesFavoritos'
            const querySnapshot = await getDocs(query(favoriteCollectionRef, where("id", "==", pokemon.id)));
            //Obtenemos el ID del documento y lo eliminamos de la colección
            const docId = querySnapshot.docs[0].id;
            await deleteDoc(doc(favoriteCollectionRef, docId));
            console.log("Pokemon eliminado de Favoritos:", pokemon);
          } catch (error) {
            console.error("Error al eliminar el pokemon:", error);
          }
        }
      } catch (error) {
        console.error("Error al guardar el pokemon:", error);
      }
    //Si el pokemon ya está capturado, lo eliminamos de la colección 'pokemonesCapturados' de Firebase
    } else {
      try {
        //Buscamos el documento que corresponde al pokemon en la colección 'pokemonesCapturados'
        const querySnapshot = await getDocs(query(collectionRef, where("id", "==", pokemon.id)));
        //Obtenemos el ID del documento y lo eliminamos de la colección
        const docId = querySnapshot.docs[0].id;
        await deleteDoc(doc(collectionRef, docId));
        console.log("Pokemon eliminado:", pokemon);
      } catch (error) {
        console.error("Error al eliminar el pokemon:", error);
      }
    }
    //Recargamos la ventana para mostrar los cambios
    window.location.reload();
  };
  
  const handleFavorite = async (pokemon) => {
    // Se obtiene la referencia a la colección de Pokemones Favoritos en la base de datos
    const favoriteCollectionRef = collection(db, "pokemonesFavoritos");
  
    // Se obtiene un QuerySnapshot de la colección de Pokemones Favoritos para verificar si el Pokemon ya está guardado como favorito
    const querySnapshot = await getDocs(favoriteCollectionRef);
    const alreadyFavorite = querySnapshot.docs.some((doc) => doc.data().id === pokemon.id);
  
    // Si el Pokemon no está guardado como favorito y tampoco ha sido capturado, se guarda en la colección de Pokemones Favoritos
    if (!alreadyFavorite && !isCaptured(pokemon)) {
      try {
        await addDoc(favoriteCollectionRef, pokemon);
        console.log("Pokemon Favorito:", pokemon);
      } catch (error) {
        console.error("Error al guardar el pokemon en Favoritos:", error);
      }
    } else {
      // Si el Pokemon ya está guardado como favorito, se elimina de la colección de Pokemones Favoritos
      try {
        const querySnapshot = await getDocs(query(favoriteCollectionRef, where("id", "==", pokemon.id)));
        const docId = querySnapshot.docs[0].id;
        await deleteDoc(doc(favoriteCollectionRef, docId));
        console.log("Pokemon eliminado de Favoritos:", pokemon);
      } catch (error) {
        console.error("Error al eliminar el pokemon:", error);
      }
    }
  
    // Se recarga la página para reflejar los cambios en la lista de Pokemones Favoritos
    window.location.reload();
  };

  useEffect(() => {
    async function getCapturedPokemons() {
      try {
        // Obtener la colección de "pokemonesCapturados"
        const collectionRef = collection(db, "pokemonesCapturados");
        // Obtener un snapshot de la colección
        const querySnapshot = await getDocs(collectionRef);
        // Obtener los datos de los documentos en la colección y agregarlos a capturedPokemons
        const data = querySnapshot.docs.map((doc) => doc.data());
        setCapturedPokemons(data);
      } catch (error) {
        console.error(error);
      }
    }
    // Llamado a la función getCapturedPokemons() una vez que se ha montado el componente
    // y asigna los datos recuperados a capturedPokemons
    getCapturedPokemons();
  }, []);
  
  const isCaptured = (pokemon) => {
    // Retorna verdadero si existe algún pokemon en capturedPokemons con el mismo id
    return capturedPokemons.some((capturedPokemon) => capturedPokemon.id === pokemon.id);
  };
  
  useEffect(() => {
    async function getFavoritePokemons() {
      try {
        // Obtener la colección de "pokemonesFavoritos"
        const collectionRef = collection(db, "pokemonesFavoritos");
        // Obtener un snapshot de la colección
        const querySnapshot = await getDocs(collectionRef);
        // Obtener los datos de los documentos en la colección y agregarlos a favoritePokemons
        const data = querySnapshot.docs.map((doc) => doc.data());
        setFavoritePokemons(data);
      } catch (error) {
        console.error(error);
      }
    }
    // Llamado a la función getFavoritePokemons() una vez que se ha montado el componente
    // y asigna los datos recuperados a favoritePokemons
    getFavoritePokemons();
  }, []);
  
  const isFavorite = (pokemon) => {
    // Retorna verdadero si existe algún pokemon en favoritePokemons con el mismo id
    return favoritePokemons.some((favoritePokemon) => favoritePokemon.id === pokemon.id);
  };

  return (
    <div className='App'>
      <h1>Lista de pokemones</h1>
      <div className='Pokedex'>
        {
          pokemones.map((pokemon, index) => {
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
                    <button className='moreInfo-button' onClick={() => handleClick(pokemon.id)}>Más información</button>
                    {isCaptured(pokemon) ? (
                      <div className="pokemon-captured">
                        <img src='https://img.icons8.com/color/24/000000/pokeball-2.png' alt='captured' className="captured-icon" />
                        <button className='capture-button' id='liberar' onClick={() => handleCapture(pokemon)}>
                          Liberar
                        </button>
                      </div>
                    ) : (
                      <div>
                        {isFavorite(pokemon) ? (
                          <button className='favorite-button' id='nofav' onClick={() => handleFavorite(pokemon)}>Eliminar de deseados</button>
                        ) : (
                          <button className='favorite-button' id='fav' onClick={() => handleFavorite(pokemon)}>Añadir a deseados</button>
                        )}
                        <button className='capture-button' id='capturar' onClick={() => handleCapture(pokemon)}>
                          Capturar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  );
}