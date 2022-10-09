function SortAll(){
    let table = document.querySelector('.c-table');
    let rows = table.querySelectorAll('tbody>tr');
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
    let allRowsArray = new Array();
    let rowDict = new Object();
    for(row of rows){
        rowName = row.childNodes[1].innerText;
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

    toolbar.querySelector("#정렬").addEventListener("click", SortAll);
    toolbar.querySelector("#정렬해제").addEventListener("click", unSortAll);
}

function searchByNames(){
    let searchBox = document.querySelector("div.search-box input.form-control[type=text][name=search_keyword]");
    let cTable = document.querySelector("table.c-table");
    for(row of cTable.querySelectorAll("tbody tr")){
        let 수업명 = row.childNodes[5];
        let 강사 = row.childNodes[9];
        if(수업명.innerText.toLowerCase().includes(searchBox.value.toLowerCase()) || 강사.innerText.toLowerCase().includes(searchBox.value.toLowerCase()) || searchBox.value == ""){
            row.style.display = "";
        }
        else{
            row.style.display = "none";
        }
    }
}

function getAllTeacherNames(){
    let rows = document.querySelectorAll(".c-table tbody tr");
    rows.forEach(function(row){
        let url = row.querySelector("a").href;
        $.ajax({
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
                row.childNodes[9].innerText = teacherNames;
                row.childNodes[11].innerText = studentNames;
            }
        })
    })
    addToolBar();
}


 
console.log("EIE ASSIST LOADED!");
getAllTeacherNames();
//  SortAll();
let searchBox = document.querySelector("input.form-control[type=text][name=search_keyword]");
searchBox.addEventListener("keyup", function(){
    searchByNames();
})
searchBox.addEventListener("keydown", function(event){
    if(event.keyCode == 13){event.preventDefault();}
 })





