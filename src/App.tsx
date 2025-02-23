import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import { Route, Routes } from "react-router-dom";
import { PageImpressum } from './components/PageImpressum';
import { PageProfil } from './components/PageProfil';
import { PageAlleBuchungen } from './components/PageAlleBuchungen';
import { PageLogin } from './components/PageLogin';
import { LoginContext, LoginInfo } from './components/LoginContext';
import { useEffect, useState } from 'react';
import { PageRegistrieren } from './components/PageRegistrieren';
import { getAllebuchungen, getLogin } from './backend/api';
import { PageVerify } from './components/PageVerify';
import { PageStart } from './components/PageStart';
import { PageDashboard } from './components/PageDashboard';
import { PageAnalyse } from './components/PageAnalyse';
import { PageKontakt } from './components/PageKontakt';
import { ToastContainer } from 'react-toastify';
import { PageDatenschutz } from './components/PageDatenschutz';

import 'intro.js/minified/introjs.min.css';

function App() {
  const [loginInfo, setLoginInfo] = useState<LoginInfo | false | undefined>(undefined);
  useEffect(() => {
    const storedLoginInfo = localStorage.getItem('loginInfo');

    if (storedLoginInfo) {
      setLoginInfo(JSON.parse(storedLoginInfo));
    } else {
      const fetchLogin = async () => {
        const loginFromServer = await getLogin();
        setLoginInfo(loginFromServer);
        localStorage.setItem('loginInfo', JSON.stringify(loginFromServer));
      };
      fetchLogin();
    }
  }, []);


  return (
    <>
      <div>
        <LoginContext.Provider value={{ loginInfo, setLoginInfo }}>
          <Header />
          <ToastContainer
            position="top-right"
            autoClose={2500}
            hideProgressBar={false}
            closeOnClick={true}
            pauseOnHover={true}
            draggable={true}
            closeButton={true}
            style={{ zIndex: 1000000000 }} />
          <Routes>
            <Route path="/dashboard" Component={PageDashboard} />
            <Route path="/impressum" Component={PageImpressum} />
            <Route path="/datenschutz" Component={PageDatenschutz} />
            {/* <Route path="/BuchungNew" Component={PageBuchungNew} /> */}
            <Route path="/Profil" Component={PageProfil} />
            <Route path="/AlleBuchungen" Component={PageAlleBuchungen} />
            <Route path="/Login" Component={PageLogin} />
            <Route path="/Registrieren" Component={PageRegistrieren} />
            <Route path="/Verify" Component={PageVerify} />
            <Route path="/" Component={PageStart} />
            <Route path="/analysen" Component={PageAnalyse} />
            <Route path="/kontakt" Component={PageKontakt} />
          </Routes>

          <Footer />
        </LoginContext.Provider>
      </div>



    </>
  );
}

export default App;