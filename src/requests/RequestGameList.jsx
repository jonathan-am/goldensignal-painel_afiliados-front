import axios from "axios";
import getConfig from "./config/config";

export default async function requestGameList(affiliateid, sessionid, setGameList) {
    await axios.get(`${getConfig().backend_url}/games`, { headers: { "affiliateid": affiliateid, "sessionid": sessionid }}).then(response=> {
        setGameList(response.data);
    }).catch(error=> {
        if(error.response.status===400) {
            window.location.replace('/login');
            return;
        }
        window.alert('Erro! Tente novamente mais tarde.')
    });
}