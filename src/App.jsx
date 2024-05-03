import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Auth  from './components/auth/auth';
import Dashboard from './components/dashboard';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<Auth />} />
        <Route exact path='/dashboard' element={<Dashboard />} />
        {/* <Route path='/dashboard' component={Contact} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
