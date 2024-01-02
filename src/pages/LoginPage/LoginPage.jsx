import React, { useEffect, useState } from "react";
import './Styles.modules.css';
import { useCookies } from "react-cookie";
import requestLoginSession from "../../requests/RequestLoginSession";

export default function LoginPage() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [cookies, setCookie, removeCookie] = useCookies(["user"]);
    const user = cookies["user"];

    const performLogin = ()=> {
        const data = {login: username, password: password};
        requestLoginSession({login: username, password: password}, setCookie);
    }

    return (
        <div className="login-page-main">
            <div className="login-container">
                <span className="title">Iniciar Sessão</span>
                <div>
                    <span>Username: </span>
                    <input type="text" onChange={e => setUsername(e.target.value)}/>
                </div>
                <div>
                    <span>Senha: </span>
                    <input type="text"  onChange={e => setPassword(e.target.value)}/>
                </div>
                <span className="button" onClickCapture={()=> performLogin()}>Login</span>
            </div>
        </div>
    );
}