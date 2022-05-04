import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import { FrontPage } from './components'

function Application() {

  
    return (
      <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<FrontPage />} />
        
      </Routes>
    </BrowserRouter>
    );
  }
  
  ReactDOM.render(<Application />, document.getElementById("app"));
  