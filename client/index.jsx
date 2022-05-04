import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import { Header, FrontPage, Sidebar, SingleArticle } from './components'

function Application() {

  
    return (
      <BrowserRouter>
      <Header />
      <Sidebar /> 
      <Routes>
        <Route path={"/"} element={<FrontPage />} />
        <Route path={"/:slug"} element={<SingleArticle />} />
        
      </Routes>
    </BrowserRouter>
    );
  }
  
  ReactDOM.render(<Application />, document.getElementById("app"));
  