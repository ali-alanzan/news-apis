import React, { useContext, useEffect, useState} from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import { Header, FrontPage, Sidebar, SingleArticle, AddArticle, MyArticles, EditArticle, SingleTopic } from './components'

import { fetchJSON, randomString, sha256, useLoader} from './components/utils'
import {ToastContainer} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
const LoginContext = React.createContext(undefined);

function Login() {
  const { discovery_endpoint, client_id, scope } = useContext(LoginContext);
  useEffect(async () => {
    const { authorization_endpoint } = await fetchJSON(discovery_endpoint);

    const state = randomString(50);
    window.sessionStorage.setItem("authorization_state", state);
    const code_verifier = randomString(50);
    window.sessionStorage.setItem("code_verifier", code_verifier);

    const parameters = {
      response_type: "code",
      response_mode: "fragment",
      state,
      client_id,
      scope,
      code_challenge: await sha256(code_verifier),
      code_challenge_method: "S256",
      redirect_uri: window.location.origin + "/login/callback",
      domain_hint: "egms.no", 
    };

    window.location.href =
      authorization_endpoint + "?" + new URLSearchParams(parameters);
  }, []);

  return (
    <div>
      <h1>Please wait....</h1>
    </div>
  );
}



function LoginCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState();
  const { discovery_endpoint, client_id } = useContext(LoginContext);
  useEffect(async () => {
    const { state, code, access_token, error, error_description } =
      Object.fromEntries(
        new URLSearchParams(window.location.hash.substring(1))
      );
    const expectedState = window.sessionStorage.getItem("authorization_state");
    if (state !== expectedState) {
      setError("Invalid callback - state mismatch");
    } else if (error || error_description) {
      setError(error_description || error);
    } else if (code) {
      const grant_type = "authorization_code";
      const code_verifier = window.sessionStorage.getItem("code_verifier");
      const redirect_uri = window.location.origin + "/login/callback";
      const { token_endpoint } = await fetchJSON(discovery_endpoint);
      const parameters = {
        client_id,
        grant_type,
        code,
        code_verifier,
        redirect_uri,
      };
      const tokenRes = await fetch(token_endpoint, {
        method: "post",
        body: new URLSearchParams(parameters),
      });
      if (!tokenRes.ok) {
        setError(
          `Failed to fetch token: ${tokenRes.status} ${tokenRes.statusText}`
        );
        console.log(await tokenRes.json());
      } else {
        setError(`Okay -- lets try to get the token from ${token_endpoint}!`);
        const { access_token } = await tokenRes.json();
        const res = await fetch("/api/login", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ access_token }),
        });
        if (res.ok) {
          window.location.replace(window.location.origin)
        } else {
          setError(`Failed ${res.status} ${res.statusText}`);
        }
      }
    } else if (access_token) {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ access_token }),
      });
      if (res.ok) {
        window.location.replace(window.location.origin)
      } else {
        setError(`Failed ${res.status} ${res.statusText}`);
      }
    } else {
      setError("Missing access_token");
    }
  }, []);

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <div>{error}</div>
        <div>
          <Link to={"/login"}>Try again</Link>
        </div>
      </div>
    );
  }

  return <h1>Please wait...</h1>;
}



function Application() {
  const { data, loading, error } = useLoader(() => fetchJSON("/api/config"));

  const [account, setAccount] = useState({})
  const dataAccount  =  async () => {
    const data = await fetchJSON("/api/login"); 
    return data;
  }
  useEffect(() => {

    dataAccount().then(data => setAccount(data));
    
  }, [account])
  if (loading) {
    return <div>Please wait...</div>;
  }

  if (error) {
    return (
      <>
        <h1>Error</h1>
        <div>{error.toString()}</div>
      </>
    );
  }

  const { discovery_endpoint, client_id, scope } = data;

    return (
      <LoginContext.Provider value={{ discovery_endpoint, client_id, scope }}>
          <ToastContainer position="top-center" />
          <BrowserRouter>
          <Header account={account} />
          <Sidebar />

          <Routes>
            <Route path={"/"} element={<FrontPage />} />
            <Route path={"/add"} element={<AddArticle account={account} />} />
            <Route path={"/myarticles"} element={<MyArticles account={account} />} />
            <Route path={"/view/:slug"} element={<SingleArticle />} />
            <Route path={"/edit/:slug"} element={<EditArticle account={account} />} />
            <Route path={"/login"} element={<Login />} />
            <Route path={"/login/callback"} element={<LoginCallback />} />
            <Route path={"/topic/:topic"} element={<SingleTopic />} />

          </Routes>
        </BrowserRouter>
      </LoginContext.Provider>

    );
  }
  
  ReactDOM.render(<Application />, document.getElementById("app"));
  