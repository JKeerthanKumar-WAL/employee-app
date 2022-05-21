import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Login from './Login';
import Employee from './Employee';
import AddEmployee from './AddEmployee';

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/employee" element={<Employee />} />
          <Route path="/add" element={<AddEmployee />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
