import axios from "axios";
import getConfig from "./config/config";

export default async function requestLoginSession(data, setCookie) {
    axios.post(`${getConfig().backend_url}/login`, data).then(response=> {
        console.log(response)
        setCookie('user', response.data);
        window.alert('Success!');
        window.location.replace('/');
    }).catch(error=> {
        window.alert('Error on login. Try again later!');
    })
}