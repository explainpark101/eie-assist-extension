const classlistRendering = ()=>{
    if(window.location.href.includes("modify")) return;
    const locationHref = new URL(window.location.href);
    let activateClassListRendering = true;
    if(locationHref.search.endsWith("=") || locationHref.search == "") activateClassListRendering = false;
    const getAllRowsFromPages= ()=>{
        if(!activateClassListRendering) return;
        let ajaxArray = [];
        let allpages = Array.from(document.querySelectorAll("div.table_paginate a")).filter(el=>!(el.classList.contains("pg_start")||el.classList.contains("pg_end")));
        console.log(allpages)
        for( a of allpages ){
            if (a.id=="table2_last") return getAllTeacherNames(document.querySelectorAll(".c-table tbody tr"));
        }
        allpages.forEach(element=>{
            let href = element.href;
            let urlParams = new URL(href).searchParams;
            let page_num = urlParams.get("page");
            let param1 = {
                "key":"search_target[PZ_LMS_CLASS.PZ_SESSION_UID]",
                "value":urlParams.get("search_target[PZ_LMS_CLASS.PZ_SESSION_UID]"),
            };
            let ajaxURL = new URL(window.location.href);
            if(Object.keys(ajaxURL.searchParams).length == 0) ajaxURL = new URL(href);
            ajaxURL.searchParams[param1.key] = param1.value;
            ajaxURL.searchParams["page"] = page_num;

            let tbody = document.querySelector("table.c-table tbody");
            if(ajaxURL.origin == "null") return;
            // console.log(ajaxURL)

            
            let ajax = $.ajax({
                type: "GET",
                contentType:"html",
                success:function(data){
                    let result = document.createElement("html");
                    result.innerHTML = data;
                    let allRows = result.querySelectorAll("table.c-table tbody tr");
                    $.when(getAllTeacherNames(allRows)).then(function(){
                        allRows.forEach(row => {
                            tbody.insertAdjacentElement("beforeend", row);
                        })
                    })
                },
                error:function(data){},
                url: ajaxURL,
            });
            ajaxArray.push(ajax);
        })
        document.querySelector("div.table_paginate").remove(); // 페이지 선택 제거
        $.when(ajaxArray).then(function(){
            let rows = document.querySelectorAll(".c-table tbody tr");
            getAllTeacherNames(rows);
        })
    }

    const sessionLimit = () => {
        var today = new Date();
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        let select = document.querySelector(`.main-content form div.search-container .search-box select.form-control`);
        select.querySelectorAll("option").forEach(option=>{
            let indicator = option.innerText.slice(0,7);
            let option_year = new Number(indicator.slice(0,4));
            let option_month = new Number(indicator.replace(option_year,"").replace("-",""));
            if(mm == 12){
                if(new Number(option_year) == (new Number(yyyy)+1) && new Number(option_month) > 1) {
                    option.remove();
                    return;
                }
                if(new Number(option_year) > (new Number(yyyy)+1)) {
                    option.remove();
                    return;
                }
            }
            else{
                if(new Number(option_year) > new Number(yyyy)){
                    option.remove();
                    return;
                }
                if(((option_month>(new Number(mm)+1)) && (option_year == yyyy))){
                    option.remove();
                    return;
                }
            }
        })
    }

    const SortAll = () =>{
        let table = document.querySelector('.c-table');
        let rows = table.querySelectorAll('tbody>tr');
        rows = Array.from(rows).sort((a,b)=>{
            let a_number = +a.querySelector("td:nth-child(3)").innerText;
            let b_number = +b.querySelector("td:nth-child(3)").innerText;
            if(a_number > b_number) return 1;
            if(a_number == b_number) return 0;
            if(a_number < b_number) return -1;
            // return a_number - b_number;
        });
        const tbody = table.querySelector("tbody");
        rows.forEach(row=>tbody.insertAdjacentElement("beforeend",row));
        return;

        // let table = document.querySelector('.c-table');
        // let rows = table.querySelectorAll('tbody>tr');
        let allRowsArray = new Array();
        let rowDict = new Object();
        for(row of rows){
            rowName = row.childNodes[5].querySelector('a').innerText;
            rowDict[rowName] = row;
            allRowsArray.push(rowName);
        }

        allRowsArray.sort();
        let actualRowsArray = new Array();
        for(r of allRowsArray){
            actualRowsArray.push(rowDict[r]);
        }
        document.querySelector('.c-table > tbody').innerHTML = "";

        for(row of actualRowsArray){
            table.querySelector("tbody").appendChild(row);
        }
    }
    function unSortAll(){
        let table = document.querySelector('.c-table');
        let rows = table.querySelectorAll('tbody>tr');
        rows = Array.from(rows).sort((a,b)=>{
            let a_number = +a.querySelector("td.text-center").innerText;
            let b_number = +b.querySelector("td.text-center").innerText;
            return a_number - b_number;
        });
        const tbody = table.querySelector("tbody");
        rows.forEach(row=>tbody.insertAdjacentElement("beforeend",row));
        return;


        let allRowsArray = new Array();
        let rowDict = new Object();
        for(row of rows){
            rowName = new Number(row.childNodes[1].innerText);
            rowDict[rowName] = row;
            allRowsArray.push(+rowName);
        }

        allRowsArray.sort();
        let actualRowsArray = new Array();
        for(r of allRowsArray){
            actualRowsArray.push(rowDict[r]);
        }
        document.querySelector('.c-table > tbody').innerHTML = "";

        for(row of actualRowsArray){
            table.querySelector("tbody").insertAdjacentElement("beforeend",row);
        }
    }

    function addToolBar(){
        let toolbar = document.querySelector(".search-container");
        toolbar.insertAdjacentHTML("beforeend", `
        <div class='search-box'>
            <button type="button" class="form-control mrg-top-20 btn-eie-assist" id="정렬">정렬</button>
        </div>
        <div class='search-box'>
            <button type="button" class="form-control mrg-top-20 btn-eie-assist" id="정렬해제">정렬해제</button>
        </div>
        `);
        try{toolbar.insertAdjacentElement("beforeend", 
            toolbar.querySelector(`div.search-box:has(button.form-control[type=button][onclick="location.href='/eielms/pages/academy/class/class.list.php';"])`))
        }
        catch(e){}
        toolbar.querySelector("#정렬").addEventListener("click", SortAll);
        toolbar.querySelector("#정렬해제").addEventListener("click", unSortAll);
    }

    function searchByNames(){
        let searchBox = document.querySelector("div.search-box input.form-control[type=text][name=search_keyword]");
        let cTable = document.querySelector("table.c-table");
        let studentCount = 0;
        for(row of cTable.querySelectorAll("tbody tr")){
            let 수업명 = row.childNodes[5];
            let 강사 = row.childNodes[9];
            if(수업명.innerText.toLowerCase().includes(searchBox.value.toLowerCase()) || 강사.innerText.toLowerCase().includes(searchBox.value.toLowerCase()) || searchBox.value == ""){
                row.style.display = "";
                studentCount+= new Number(row.dataset.studentCount);
            }
            else{
                row.style.display = "none";
            }
        }
        document.querySelectorAll("table.c-table thead tr th")[5].innerText = `학생[${studentCount}명]`

    }

    function getAllTeacherNames(rows){
        let countStudents = 0;
        rows.forEach((row)=>{
            // console.log(row);
            let url = row.querySelector("a")?.href;
            if(url===undefined) return;
            
            row.style.backgroundColor = "rgba(0,0,0,0.1)"
            row.classList.add("unloaded");
            return $.ajax({
                method:"GET",
                url:url, 
                datatype:"html",
                success:(data)=>{
                    let respHTML = document.createElement("html");
                    respHTML.innerHTML = data;
                    respHTML = respHTML.querySelector("body");
                    let teacherBox = respHTML.querySelectorAll("div.form-data")[3];
                    let studentBox = respHTML.querySelectorAll("div.form-data")[4];
                    let teacherNames = Array.from(teacherBox.querySelectorAll("span.title")).map(x=>x.innerText).join(", ");
                    let studentNames = Array.from(studentBox.querySelectorAll("span.title")).map(x=>x.innerText).join(", ");
                    let studentCount = studentBox.querySelectorAll("span.title").length;
                    row.childNodes[9].innerText = teacherNames;
                    row.childNodes[11].innerText = studentNames;
                    row.dataset.studentCount = studentCount;
                    countStudents+=studentCount;
                    
                    document.querySelectorAll("table.c-table thead tr th")[5].innerText = `학생[${countStudents}명]`
                    row.style.backgroundColor = "";
                    row.classList.remove("unloaded");
                    if(!document.querySelectorAll("table.c-table tbody .unloaded").length) searchByNames();
            }
            })
        })
    }


    function sessionAutoLoad(){
        // return;
        let sessionSelect = document.querySelector(`.main-content form div.search-container .search-box select.form-control`);
        let value = sessionSelect.value;
        // `/classes/?search_session=441&search_target=1&search_keyword=`
        window.location.href = `/classes/?${sessionSelect.name}=${value}`;
    }

    sessionLimit();
    addToolBar();
    getAllRowsFromPages();
    SortAll();
    let searchBox = document.querySelector("input.form-control[type=text][name=search_keyword]");
    searchBox.addEventListener("keyup", function(){
        searchByNames();
    })
    searchBox.addEventListener("keydown", function(event){
        if(event.keyCode == 13){event.preventDefault();}
    })

    //session auto load
    document.querySelector(`.main-content form div.search-container .search-box select.form-control`).addEventListener("change", sessionAutoLoad)
}
 
 activationTest(classlistRendering);

