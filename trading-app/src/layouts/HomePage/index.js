import Home from './pages/Home';
import Swap from './pages/Swap'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import theme from './utils/theme/index';
import { ThemeProvider } from 'styled-components';
import About from './pages/About';
import Navbar from './components/Navbars/Navbar';
import Footer from './components/Footers/Footer';

const App = () => {
  return (
    <div>
      <ThemeProvider theme={theme}>

        <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/swap" element={<Swap/>}/>
        <Route path="/about" element={<About/>}/>
      </Routes>
      <Footer/>
      </ThemeProvider>
    </div>
  )
}

export default App