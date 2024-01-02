import HomePage from "./pages/HomePage/HomePage";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFontAwesome } from '@fortawesome/free-brands-svg-icons'
import LoginPage from "./pages/LoginPage/LoginPage";
import { BrowserRouter, Route, Routes } from 'react-router-dom';

library.add(fas, faTwitter, faFontAwesome)


function App() {
  return (
    <BrowserRouter >
        <Routes>
            <Route index element={<HomePage />}/>
            <Route path="/login" element={<LoginPage/>} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
