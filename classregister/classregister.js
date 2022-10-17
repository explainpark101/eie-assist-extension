let studentsUrl = "https://eie.co.kr/eielms/pages/modal/academy/class.student.select2.php?page=";
let 원본URL = "https://eie.co.kr/eielms/pages/modal/academy/class.student.select2.php?page=12&method=&search_where=&search_keyword=";

function removeCharactersFromArray(target,removeList){

    for(remove of removeList){
        target = target.replace(remove,"");
    }
    return target;
}

function 학생목록불러오기(){
    let iframe = document.querySelector("div.modal iframe");
    iframe.addEventListener("load",()=>{
        let document = iframe.contentWindow.document;
        let last_item = document.querySelector("a.pg_end");
        var urlPoint = last_item.href.indexOf('page=');
        let last_page_num = removeCharactersFromArray(last_item.href.slice(urlPoint+5,-1),[
            "&method=r","&search_where=","&search_keyword=","&search_keyword","&method=u"
        ]);
        console.log(last_page_num); 

        last_page_num = new Number(last_page_num);
        let currentTable = document.querySelector(".c-table tbody");
        let ajaxArray = new Array();
        for(let page_num = 2; page_num <= last_page_num; page_num++){
            console.log(`${page_num} 페이지 학생 로딩중!`)
            let ajaxObj = $.ajax({
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
            ajaxArray.push(ajaxObj);
        }
        // 검색기능 구현하기
        let searchbox = document.querySelector("input[name=search_keyword]");
        searchbox.addEventListener("keydown",(e)=>{ //엔터키로 검색하기 죽이기
            if(e.keyCode==13){e.preventDefault();}
        });
        searchbox.addEventListener("keyup",()=>{
            iframeSearchbox(searchbox, iframe);
        });

        $.when(ajaxArray).then(()=>{
            document.querySelector(".table_paginate").parentElement.parentElement.remove();
            document.querySelector(".c-table").insertAdjacentHTML("afterend", `<button type="button" id="select_ok" class="btn btn-sm btn-primary">학생 등록</button>`);    
        })
        

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

function addDeleteToStudent(){
    let alltimesBox = document.querySelectorAll("span.q-updown");
    alltimesBox.forEach(box => {
        box.style.display = "";
    })
}

const appendDeletebtnTeacher = ()=>{
    document.querySelector(`button[data-modal-title="강사 선택"]`).insertAdjacentHTML("beforebegin",`
    <button type="button" id="teacher_add_del" class="btn btn-eie-assist" style="display: inline-block;">강사 삭제 추가</button>
    `)
    document.querySelector("button#teacher_add_del").addEventListener("click", (event)=>{
        addDeleteToTeacher();
    })
}
const appendDeletebtnStudent = ()=>{
    document.querySelector(`button[data-modal-title="학생 선택"]`).insertAdjacentHTML("beforebegin",`
    <button type="button" id="student_add_del" class="btn btn-eie-assist" style="display: inline-block;">학생 삭제 추가</button>
    `)
    document.querySelector("button#student_add_del").addEventListener("click", (event)=>{
        addDeleteToStudent();
    })
}

const deleteteacherWithButton = (delbtn)=>{
    let teacherForm = document.querySelector("div.teacher_input");
    let input = teacherForm.querySelector(`input[id=${delbtn.parentElement.dataset.id}]`);
    input.remove();
}
function addDeleteToTeacher(){
    let allTeacherRows = document.querySelectorAll("ul#teacher_list > li");
    allTeacherRows.forEach(row => {
        if(row.querySelector("span.q-updown") == undefined)
            row.insertAdjacentHTML("beforeend", `<span class="q-updown"><i class="ti-close s-del"></i></span>`);
        let delbtn = row.querySelector("i");
        delbtn.addEventListener("click", (event)=>{event.target});
    })
}

/*
모달창에 대해서 함수를 구현해야함. 다음 질의를 참고해야함.
*/
// https://stackoverflow.com/questions/17461682/calling-a-function-on-bootstrap-modal-open

document.querySelector("button[data-modal-title='학생 선택']").addEventListener("click", ()=>{
    학생목록불러오기();
})

window.addEventListener("load", ()=>{
    addDeleteToStudent();
    addDeleteToTeacher();
    appendDeletebtnTeacher();
    appendDeletebtnStudent();
})

document.querySelector(".modal-view").addEventListener("loaded.bs.modal",function(e){
    console.log("MODAL LOADED!zzzzzzzzzzzzzzzzzzzzzzzzzzzz");
})