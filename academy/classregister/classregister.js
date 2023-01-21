const classregisterRendering = ()=>{
    let studentsUrl = "/common/student_select?page=";

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
            }</style>`);

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

    function addStyleToCtableModal(){
        let modal = document.querySelector("div.modal");
        let iframe = modal.querySelector("iframe");
        iframe.addEventListener("load",()=>{
            let document = iframe.contentWindow.document;
            document.body.insertAdjacentHTML("afterbegin", `<style type='text/css'>
            table.c-table tbody tr:has(input[type=checkbox]:checked), table.c-table tbody tr:has(input[type=checkbox]:checked) *{
                background-color:#b72025;
                color:white;
                font-weight:600;
            }</style>`);
        });
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
        <button type="button" id="teacher_add_del" class="btn btn-eie-assist" style="display: inline-block;">강사 선택 삭제</button>
        `)
        document.querySelector("button#teacher_add_del").addEventListener("click", (event)=>{
            addDeleteToTeacher();
        })
    }
    const appendDeletebtnStudent = ()=>{
        document.querySelector(`button[data-modal-title="학생 선택"]`).insertAdjacentHTML("beforebegin",`
        <button type="button" id="student_add_del" class="btn btn-eie-assist" style="display: inline-block;">학생 선택 삭제</button>
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
        // 반등록을 할 수 없도록 오류나는 현상 해결
        const ProgramStock = document.querySelector("div#program_stock");
        const studentOriginalCount = document.querySelector("input#student_org_count");
        const ProgramStockNumber = Array.from(ProgramStock.querySelectorAll("input")).map(el=>+(el.value)).reduce((a,b)=>a+b,0);
        studentOriginalCount.value = ProgramStockNumber;
        // console.log(studentOriginalCount.value, ProgramStockNumber);
        
        학생목록불러오기();
    })
    
    const renderAll = () => {
        console.log("loading")
        addDeleteToStudent();
        addDeleteToTeacher();
        appendDeletebtnTeacher();
        appendDeletebtnStudent();
        unlockSessionSelect();
        reviveProgramSelection();
        appendDeletebtnProgram();
        deleteProgramBtn();
    }

    const rednerAll_event = ()=>{
        renderAll();
        document.querySelectorAll("div.page-nav div.pn-toolbar h5.pn-toolbar-meta").forEach(el => {
            el.removeEventListener("click", rednerAll_event);
        })
    }

    window.addEventListener("load", ()=>{
        renderAll();
    });
    
    document.querySelectorAll("div.page-nav div.pn-toolbar h5.pn-toolbar-meta").forEach(el=>{
        el.innerText = "수업등록 / Load EiE Assistant";
        el.addEventListener("click", rednerAll_event);
    })

    document.querySelectorAll("button[data-toggle=modal]").forEach((element)=>{element.addEventListener("click",addStyleToCtableModal);})


    const 불러오기 = () => {
        let $textarea = document.querySelector("textarea#가져오기input");
     
        content = JSON.parse($textarea.value);
        console.log(content);
        let subject = document.querySelector("input[name=subject]");
        let start = document.querySelector("input[name=class_start_time]");
        let end = document.querySelector("input[name=class_end_time]");
        let color_select = document.querySelector("select[name=class_color]");
        start.value = content.start_time;
        end.value = content.end_time;
        subject.value = content.subject_name;
        color_select.querySelectorAll(`option`).forEach(option=>{
            if(option.value == content.color_select) {
              option.selected = true;
              color_select.parentElement.querySelector(`span[data-color='${content.color_select}']`).click();
              
            }
        })
    }
     
    const 가져오기 = () => {
        let start = document.querySelector("input[name=class_start_time]");
        let end = document.querySelector("input[name=class_end_time]");
        let subject = document.querySelector("input[name=subject]");
        let color_select = document.querySelector("select[name=class_color]");
        let result = {
           start_time:start.value,
           end_time:end.value,
           subject_name:subject.value,
           color_select:color_select.value,
        }
        let $textarea = document.querySelector("textarea#가져오기input");
        $textarea.innerText = JSON.stringify(result);
        $textarea.select();
        document.execCommand('copy');
        alert(`복사됨! ${$textarea.innerText}`);
        
    }
     
     
     
    const addButtonForSaveLoad = () => {
        toolbar = document.querySelector("div.page-nav div.pn-toolbar");
        let newRegister = `
        <a href="./class.register.php?page=1" target="_blank">
            <i class="fa fa-plus u-mr-xsmall u-opacity-medium"></i> 수업등록
        </a>
        `
        
        let 불러오기btn = document.createElement("button");
        불러오기btn.classList.add("btn");
        불러오기btn.classList.add("btn-primary");
        불러오기btn.innerText = "반정보 입력";
        
        let 가져오기btn = document.createElement("button");
        가져오기btn.classList.add("btn");
        가져오기btn.classList.add("btn-info");
        가져오기btn.innerText = "반정보 복사하기";
        
        let 가져오기input = document.createElement("textarea");
        가져오기input.placeholder = "여기에 코드를 복사붙여넣기";
        가져오기input.id = "가져오기input";
        
        불러오기btn.addEventListener("click", ()=>{
            불러오기();
        })
        가져오기btn.addEventListener("click", ()=>{
            가져오기();
        })
        
        toolbar.insertAdjacentElement("beforeend", 가져오기btn);
        toolbar.insertAdjacentHTML("beforeend", newRegister);
        toolbar.insertAdjacentElement("beforeend", 가져오기input);
        toolbar.insertAdjacentElement("beforeend", 불러오기btn);
    }
     
    addButtonForSaveLoad();
    renderAll();
}


activationTest(classregisterRendering);