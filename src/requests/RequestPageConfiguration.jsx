import axios from "axios";
import getConfig from "./config/config";

export default async function requestPageConfiguration(affiliateid, sessionid, setPageInformation) {
    await axios.get(`${getConfig().backend_url}/configuration`, { headers: { "affiliateid": affiliateid, "sessionid": sessionid }}).then(response=> {
        setPageInformation(response.data);
    }).catch(error=> {
        if(error.response.status===400) {
            window.location.replace('/login');
            return;
        }
        window.alert('Erro! Tente novamente mais tarde.')
    });
}