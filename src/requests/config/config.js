export default function getConfig(){ 
    let test = false;
    return test ? { backend_url: "http://localhost:5504/v1" } : { backend_url: "https://panel-api.sinaldourado.com/v1"};
}