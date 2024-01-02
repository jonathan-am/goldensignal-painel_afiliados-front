import axios from "axios";
import getConfig from "./config/config";

export default async function requestCreateOrUpdatePlataform(affiliateid, sessionid, data) {
    await axios.post(`${getConfig().backend_url}/plataforms`, data, {headers: { "affiliateid": affiliateid, "sessionid": sessionid }}).then(response=> {
        window.alert('Sucesso!')
        window.location.replace('/');
    }).catch(error=> {
        if(error.response.status===400) {
            window.location.replace('/login');
            return;
        }
        window.alert('Erro! Tente novamente mais tarde.')
    });
}