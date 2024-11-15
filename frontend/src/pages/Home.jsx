import React from 'react'
import { useSelector } from 'react-redux'
import Navbar from '../components/Navbar'
import Slide from '../components/Slide'
import Categories from '../components/Categories'
import Listenings from './Listenings'

const Home = () => {
  return (
    <div>
      <Navbar />
      <Slide />
      <Categories />
      <Listenings />
    </div>
  )
}

export default Home