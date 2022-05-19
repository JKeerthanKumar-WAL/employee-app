/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
import { useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Login from './Login';
import Employee from './Employee';
import AddEmployee from './AddEmployee';

export default function App() {
  const [login, setLogin] = useState(true);
  const show = () => setLogin(!login);
  return (
    <div className="App">
      <BrowserRouter>
        {login ? (
          <div>
            <h1 className="row mt-3">
              <span className="col">Welcome to the Employee App</span>
              <span className="col">
                <button className="btn btn-outline-success " onClick={show}>
                  <Link to="/login">Register</Link>
                </button>
              </span>
            </h1>
          </div>
        ) : (
          ''
        )}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/employee" element={<Employee />} />
          <Route path="/add" element={<AddEmployee />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
