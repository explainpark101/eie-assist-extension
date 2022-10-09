let studentsUrl = "https://eie.co.kr/eielms/pages/modal/academy/class.student.select2.php?page=";
let 원본URL = "https://eie.co.kr/eielms/pages/modal/academy/class.student.select2.php?page=12&method=&search_where=&search_keyword=";


function 학생목록불러오기(){
    let iframe = document.querySelector("div.modal iframe");
    document = iframe.contentWindow.document;
    let last_item = document.body.querySelector("#table2_last");
    console.log(document, last_item);
    var urlPoint = last_item.href.indexOf('page=');
    let last_page_num = last_item.href.replace("&method=&search_where=&search_keyword=","").slice(urlPoint+5,0);
    console.log(last_page_num);

}

document.querySelector("button[data-modal-title='학생 선택']").addEventListener("click", ()=>{
    학생목록불러오기();
})