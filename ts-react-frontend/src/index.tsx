import React from 'react';
import ReactDOM from 'react-dom/client';
import "./index.css"
import App from './App';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {GlobalHeader} from "./Global/Header";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <BrowserRouter>
        <GlobalHeader/>
       <Routes>
           <Route path="/" element={<App/>}></Route>
       </Routes>
    </BrowserRouter>

);


