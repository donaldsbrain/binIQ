import './App.css'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { BinLayout } from './pages/binLayout';
import { Home } from './pages/home';
import Layout from './components/theme';

function App() {

  return (<Router>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />          
        <Route path="/bin-layout/:id" element={<BinLayout />} />
        <Route path="/bin-layout" element={<BinLayout />} />
      </Route>
    </Routes>
  </Router>)
}

export default App
