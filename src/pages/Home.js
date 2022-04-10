import React from 'react';
import { Link } from "react-router-dom";
import "./Home.css";
import {Logo} from '../images/Netflix'

const Home = () => {

return(
  <>
  <div className="logo">
    <Logo />
  </div>
  <div className="container">
     <Link to="/player" className="link">Player Page</Link>
  </div>
  </>
)
}

export default Home;