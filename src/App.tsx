import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import LearnPage from '@/pages/LearnPage';
import Header from './components/Common/Header';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/learn' element={<LearnPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
