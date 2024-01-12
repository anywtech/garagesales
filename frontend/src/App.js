
import './App.css';
import { BrowserRouter, Routes, Route} from 'react-router-dom' ;
import Navbar from './Components/Navbar/Navbar';
import Shop  from './Pages/Shop';
import ShopCat from './Pages/ShopCat';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import Login from './Pages/Login';
import Footer from './Components/Footer/Footer';

import men_banner from './Components/assets/banner_mens.png'
import women_banner from './Components/assets/banner_women.png'
import kids_banner from './Components/assets/banner_kids.png'



function App() {
  return (
    <div >
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Shop/>}/>
        <Route path='/men' element={<ShopCat banner={men_banner} category="men"/>}/>
        <Route path='/women' element={<ShopCat  banner = {women_banner} category ="women"/>}/>
        <Route path='/kids' element={<ShopCat banner={kids_banner} category ="kid"/>}/>
        <Route path='/product' element={<Product/>}>
          <Route path=':productId' element={<Product/>}/>
        </Route>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/login' element={<Login/>}/>
        
      </Routes>
      <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
