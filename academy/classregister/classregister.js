const classregisterRendering = ()=>{let studentsUrl = "https://eie.co.kr/eielms/pages/modal/academy/class.student.select2.php?page=";
let 원본URL = "https://eie.co.kr/eielms/pages/modal/academy/class.student.select2.php?page=12&method=&search_where=&search_keyword=";

function removeCharactersFromArray(target,removeList){

    for(remove of removeList){
        target = target.replace(remove,"");
    }
    return target;
}

function 학생목록불러오기(){
    let modalTitle = document.querySelector(".modal-title");
    modalTitle.insertAdjacentHTML("afterend",`
    <span id="selected-student-list"></span>
    `);
    let selected_student_list = modalTitle.querySelector("span#selected-student-list");
    let iframe = document.querySelector("div.modal iframe");
    iframe.addEventListener("load",()=>{
        let document = iframe.contentWindow.document;
        let last_item = document.querySelector("a.pg_end");
        var urlPoint = last_item.href.indexOf('page=');
        let last_page_num = removeCharactersFromArray(last_item.href.slice(urlPoint+5,-1),[
            "&method=r","&search_where=","&search_keyword=","&search_keyword","&method=u"
        ]);
        document.body.insertAdjacentHTML("afterbegin", `<style type='text/css'>
        table.c-table tbody tr:has(input[type=checkbox]:checked), table.c-table tbody tr:has(input[type=checkbox]:checked) *{
            background-color:#b72025;
            color:white;
            font-weight:600;
        }
        </style>`);

        document.querySelectorAll("button#select_ok").forEach(el=>{
            el.addEventListener("click", ()=>{
                modalTitle.parentElement.querySelector(`span#selected-student-list`).remove();
            })
        })

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
        iframeSearchboxDatalist(searchbox);

        $.when(ajaxArray).then(()=>{
            document.querySelector(".table_paginate").parentElement.parentElement.remove();
            document.querySelector(".c-table").insertAdjacentHTML("afterend", `<button type="button" id="select_ok" class="btn btn-sm btn-primary">학생 등록</button>`);    
            
        })
        

    })
}

function iframeSearchboxDatalist(searchbox){
    searchbox.insertAdjacentHTML("afterend", `<datalist for="searchBox" id="searchList">
    <option value="&unchecked">&unchecked</option>
    <option value="&checked">&checked</option>
    </datalist>`);
    searchbox.setAttribute("list", "searchList");
    searchbox.setAttribute("id", "searchBox");
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
        if((searchbox.value == "&checked")){
            if(row.querySelector("input[type=checkbox]")?.checked) {
                row.style.display = "";
            }
            else {
                row.style.display = "none";
            }
        }
        if((searchbox.value == "&unchecked")){
            if(row.querySelector("input[type=checkbox]")?.checked) {
                row.style.display = "none";
            }
            else {
                row.style.display = "";
            }
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

const appendDeletebtnProgram = ()=>{
    document.querySelector(`button[data-modal-title="프로그램 선택"]`).insertAdjacentHTML("beforebegin",`
    <button type="button" id="program_add_del" class="btn btn-eie-assist" style="display: inline-block;">프로그램 개별 삭제</button>
    `)
    document.querySelector("button#program_add_del").addEventListener("click", (event)=>{
        deleteProgramBtn();
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
const deleteprogramWithButton = (delbtn)=>{
    let programForm = document.querySelector("div.program_input");
    let input = programForm.querySelector(`input[id=${delbtn.parentElement.dataset.id}]`);
    input.remove();
}
function reviveProgramSelection(){
    let program_btn = document.querySelector("button#program_button");
    program_btn.style.display = "";
    program_btn.disabled = false;
    program_btn.classList.add("btn-eie-assist");
    program_btn.classList.remove("btn-default");
    let program_all_del_btn = document.querySelector("button#question_del");
    program_all_del_btn.style.display = "";
    program_all_del_btn.disabled = false;
    program_all_del_btn.classList.add("btn-eie-assist");
    program_all_del_btn.classList.remove("btn-default");

}

const deleteProgramBtn = ()=>{
    let allprogramRows = document.querySelectorAll("ul#program_list > li");
    allprogramRows.forEach(row => {
        if(row.querySelector("span.q-updown") == undefined)
            row.insertAdjacentHTML("beforeend", `<span class="q-updown"><i class="ti-close s-del"></i></span>`);
        let delbtn = row.querySelector("i");
        delbtn.addEventListener("click", (event)=>{event.target});
    })
    allprogramRows.forEach(row=>{
        row.querySelector("span.q-updown").style.display = "";
    });
}


function unlockSessionSelect(){
    if(new URL(window.location.href).searchParams.get("method")=="u")
        document.querySelector("select#session_uid").disabled = false;
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
    unlockSessionSelect();
    reviveProgramSelection();
    appendDeletebtnProgram();
    deleteProgramBtn();
})

document.querySelector(".modal-view").addEventListener("loaded.bs.modal",function(e){
    console.log("MODAL LOADED!zzzzzzzzzzzzzzzzzzzzzzzzzzzz");
})
}


activationTest(classregisterRendering);