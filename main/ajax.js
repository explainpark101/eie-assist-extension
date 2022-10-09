function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

function AjaxPostReq(url, reqObject){    
    let xmlRequest = new XMLHttpRequest();
    reqObject.data.csrfmiddlewaretoken = csrftoken;
    xmlRequest.onreadystatechange = (event)=>{
        if(xmlRequest.readyState == xmlRequest.DONE){
            let resp = xmlRequest.response;
            if (xmlRequest.status == 200){ //success
                reqObject.load(resp);   
            }
            else{ //fail
                reqObject.error(resp);
                console.log(resp);
            }
        }
    };
    xmlRequest.open("POST", url);
    xmlRequest.responseType = "json";
    xmlRequest.setRequestHeader('X-CSRFToken', csrftoken);
    xmlRequest.setRequestHeader("Content-Type", "application/json; charset=euc-kr");
    xmlRequest.send(JSON.stringify(reqObject.data));
}

function AjaxGetReq(url, responseObject){
    let request = new XMLHttpRequest();
    request.onreadystatechange = (event)=>{
        if(request.readyState == request.DONE){
            let resp = request.response;
            if (request.status == 200){ //success
                responseObject.load(resp);
            }
            else{ //fail
                responseObject.error(resp);
            }
        }
    };
    request.open("GET", url);
    request.responseType = "json";
    request.send();
}