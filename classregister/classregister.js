let studentsUrl = "https://eie.co.kr/eielms/pages/modal/academy/class.student.select2.php?page=";
let 원본URL = "https://eie.co.kr/eielms/pages/modal/academy/class.student.select2.php?page=12&method=&search_where=&search_keyword=";

function 학생목록불러오기(){
    let iframe = document.querySelector("div.modal iframe");
    iframe.addEventListener("load",()=>{
        let document = iframe.contentWindow.document;
        let last_item = document.body.querySelector("#table2_last");
        var urlPoint = last_item.href.indexOf('page=');
        let last_page_num = last_item.href.slice(urlPoint+5,-1).replace("&method=r&search_where=&search_keyword","");
        let currentTable = document.querySelector(".c-table tbody");
        for(let page_num = 2; page_num <= last_page_num; page_num++){
            $.ajax({
                url: studentsUrl+page_num,
                contenttype: "html",
                method:"GET",
                success: (resp) => {
                    let newDoc = document.createElement("html");
                    newDoc.innerHTML = resp;
                    let rows = newDoc.querySelectorAll(".c-table tbody tr");
                    rows.forEach(row => {
                        row.querySelector("input[type=checkbox]").classList.add("form-control");
                        currentTable.insertAdjacentElement("beforeend",row);
                    })
                    // console.log("완료!");
                }
            })
        }
        // 검색기능 구현하기
        let searchbox = document.querySelector("input[name=search_keyword]");
        searchbox.addEventListener("keydown",(e)=>{ //엔터키로 검색하기 죽이기
            if(e.keyCode==13){e.preventDefault();}
        });
        searchbox.addEventListener("keyup",()=>{
            iframeSearchbox(searchbox, iframe);
        });
        document.querySelector(".table_paginate").parentElement.parentElement.remove();
        document.querySelector(".c-table").insertAdjacentHTML("afterend", `<button type="button" id="select_ok" class="btn btn-sm btn-primary">학생 등록</button>`);


    })
}


function iframeSearchbox(searchbox, iframe){
    let document = iframe.contentWindow.document;
    let allRows = document.querySelectorAll(".c-table tbody tr");
    allRows.forEach(row => {
        if(row.innerText.toLowerCase().includes(searchbox.value.toLowerCase()) || searchbox.value == ""){
            row.style.display = "";
        }
        else{
            row.style.display = "none";
        }
    })
}

/*
모달창에 대해서 함수를 구현해야함. 다음 질의를 참고해야함.
*/
// https://stackoverflow.com/questions/17461682/calling-a-function-on-bootstrap-modal-open

document.querySelector("button[data-modal-title='학생 선택']").addEventListener("click", ()=>{
    학생목록불러오기();
})

document.querySelector(".modal-view").addEventListener("loaded.bs.modal",function(e){
    console.log("MODAL LOADED!zzzzzzzzzzzzzzzzzzzzzzzzzzzz");
})