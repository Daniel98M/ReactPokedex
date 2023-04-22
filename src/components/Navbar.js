//Carlos Daniel Martinez Zarate Codigo: 197620
import React from 'react';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import { BlogList } from './BlogList';
import { BlogPost } from './BlogPost';
import { PokemonesCapturados } from './Capturados';
import { PokemonesFavoritos } from './Favoritos';
import './styles/Navbar.css';

export const Navbar = () => {
  return (
    <>
      {/* Se crea una barra de navegación */}
      <nav id='navbar'>
        <a href="/"> List </a>
        <a href="/post"> Post </a>
        <a href="/wishlist"> Lista de deseados </a>
        <a href="/capture"> Capturados </a>
      </nav>

      {/* Se establecen las rutas para cada sección de la barra de navegación */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BlogList />} /> {/* Se renderiza el componente BlogList en la ruta principal */}
          <Route path="/post" element={<BlogPost/>} /> {/* Se renderiza el componente BlogPost en la ruta '/post' */}
          <Route path="/wishlist" element={<PokemonesFavoritos/>} /> {/* Se renderiza el componente PokemonesFavoritos en la ruta '/wishlist' */}
          <Route path="/capture" element={<PokemonesCapturados/>} /> {/* Se renderiza el componente PokemonesCapturados en la ruta '/capture' */}
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default Navbar;
