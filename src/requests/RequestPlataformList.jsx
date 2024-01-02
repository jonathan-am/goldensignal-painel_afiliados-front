import axios from "axios";
import getConfig from "./config/config";

export default async function requestPlataformList(affiliateid, sessionid, setPlataformList) {
    await axios.get(`${getConfig().backend_url}/plataforms`, { headers: { "affiliateid": affiliateid, "sessionid": sessionid }}).then(response=> {
        setPlataformList(response.data);
    }).catch(error=> {
        if(error.response.status===400) {
            window.location.replace('/login');
            return;
        }
        window.alert('Erro! Tente novamente mais tarde.')
    });
}