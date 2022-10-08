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
 
 console.log("EIE ASSIST LOADED!");
 SortAll();
 let searchBox = document.querySelector("input.form-control[type=text][name=search_keyword]");
 searchBox.addEventListener("keyup", function(){
     searchByNames();
 })
 searchBox.addEventListener("keydown", function(event){
     if(event.keyCode == 13){event.preventDefault();}
 })