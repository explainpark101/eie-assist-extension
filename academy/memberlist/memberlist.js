function notStudentColored(){
    let table = document.querySelector(".c-table");
    let rows = table.querySelectorAll("tbody>tr");
    rows.forEach(row=>{
        if(!row.childNodes[3].innerText.toLowerCase().includes("학생")){
            row.classList.add("not-student");
        }
    })
}

notStudentColored();