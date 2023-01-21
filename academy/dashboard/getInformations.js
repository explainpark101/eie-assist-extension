
function AjaxGetReq(url, responseObject){
    fetch(url, {
        method:"GET",
        // headers:{
        //     "Content-Type":"http",
        // }
    })
    .then(resp=>resp.text())
    .then(data=>{
        return new Promise((resolve, reject)=>{
            return resolve(responseObject.load(data));
        })
    })
    .catch(err=>{
        responseObject.error(err);
    })

    
    // let request = new XMLHttpRequest();
    // request.onreadystatechange = (event)=>{
    //     if(request.readyState == request.DONE){
    //         let resp = request.response;
    //         if (request.status == 200){ //success
    //             responseObject.load(resp);
    //         }
    //         else{ //fail
    //             responseObject.error(resp);
    //         }
    //     }
    // };
    // request.open("GET", url);
    // request.responseType = "html";
    // request.send();
}



function getClassList_teacher(){
    let classList = document.querySelectorAll("div.box_today ul.class_list li");
    let todayDate = document.querySelector("div.cont1 div.tit input.btn_today.datepicker2");
    let allStudentArray = [];
    classList.forEach((c)=>{
        let uid = c.dataset.uid;
        // `/classes/calendar_view?uid=1365981&class_day=2023-01-11`
        let url = `/classes/calendar_view?uid=${uid}&class_day=${todayDate.value}`;
        fetch(url, {
            method:"GET",
            // headers:{
            //     "Content-Type":"http",
            // }
        })
        .then(resp=>resp.text())
        .then(data=>{
            return new Promise((resolve, reject)=>{
                let responsePage = document.createElement("html");
                responsePage.innerHTML = data;
                let respList = responsePage.querySelectorAll(".auth_box");
                let teachers = respList[1];
                // console.log(teachers);
                // let students = respList[2];
                c.querySelectorAll("dd strong")[0].innerText = `강사(${teachers.querySelectorAll("span.title").length}명) : ` + Array.from(teachers.querySelectorAll("span.title")).map(x => x.innerText).join(", ");
                c.querySelectorAll("dd strong")[0].dataset.teacherNames = Array.from(teachers.querySelectorAll("span.title")).map(x => x.innerText).join(", ");

                return resolve(true);
            })
        })
        .catch(err=>{
            responseObject.error(err);
        });


    })
}


// title URL 추가
function overwriteNamesButton(HTMLclassName="btn btn-primary", innerText = "new URL BUTTON", id="test"){
    let targetElement = document.querySelector("div.main-content");
    targetElement.insertAdjacentHTML("afterbegin", `
        <div class='container-fluid' id="eie-assist-toolbar">
        </div>
    `)
    document.querySelector("div#eie-assist-toolbar").insertAdjacentHTML("beforeend", `
    <button class='btn btn-primary' id='overwriteNames' style="background-color:#b72025;">이름불러오기</button>
    `);
    
    document.querySelector("button#overwriteNames").addEventListener("click", function(e){
        getClassList_teacher();
        getClassList_student();
    })
    getClassList_teacher();
    getClassList_student();

    document.querySelector("div.tit h2").insertAdjacentHTML("beforeend", `
    <span id="오늘오는사람숫자"></span>
    <span id="검색된숫자"></span>
    `);
}

// function dashboard_view(class_uid, class_today){
//     $.ajax({
//         type:'POST',
//         url:'/main/getclassinfo',
//         data: 'class_uid='+class_uid+'&today='+class_today,
//         dataType: "JSON",
//         success: (data) => {
//             console.log(data);
//             $('#inclass_cont > ul, #class_student').empty();
//             $.each(data.inclass, function(k, v) {
//                 chtml = "";
//                 chtml += '<p>'+v.program_name+'</p>';
//                 chtml += '<div>'+v.inclass+'</div>';
//                 $('#inclass_cont > ul').append("<li>"+chtml+"</li>");
//             });

//             $.each(data.student, function(k, v) {
//                 let chtml = "";
//                 chtml += '<td>'+(k+1)+'</td>';
//                 chtml += '<td>'+v.member_name+'</td>';
//                 chtml += '<td>'+v.today_prep+'</td>';
//                 chtml += '<td>'+v.today_review+'</td>';
//                 //chtml += '<td></td>';
//                 chtml += '<td>';
//                 chtml += '<input type="checkbox" class="sattent" name="student_attend_y['+class_today+']['+v.member_uid+']" value="Y" '+(v.member_attend=='Y'?'CHECKED':'')+'>';
//                 chtml += '<input type="hidden" name="student_attend_n['+class_today+']['+v.member_uid+']" value="Y" '+(v.member_attend=='Y'?'disabled':'')+'>';
//                 chtml += '</td>';
//                 chtml += '<td>';
//                 chtml += '<input type="checkbox" class="slate" name="student_late_y['+class_today+']['+v.member_uid+']" value="Y" '+(v.member_late=='Y'?'CHECKED':'')+' data-attend="student_attend_y['+class_today+']['+v.member_uid+']">';
//                 chtml += '<input type="hidden" name="student_late_n['+class_today+']['+v.member_uid+']" value="Y" '+(v.member_late=='Y'?'disabled':'')+'>';
//                 chtml += '</td>';

//                 $('#class_student').append("<tr>"+chtml+"</tr>");
//             });

//             $('#class_uid').val(class_uid);
//         },
//         error: function(data){
//             //console.log(data);
//         }
//     });
// }

const getClassList_student_2 = () => {
    let url = `/main/getclassinfo`;
    let classList = document.querySelectorAll("div.box_today ul.class_list li");
    let class_today = document.querySelector("#class_today").value;

    classList.forEach((c)=>{
        let class_uid = c.dataset.uid;
        $.ajax({
            type:'POST',
            url:'/main/getclassinfo',
            data: 'class_uid='+class_uid+'&today='+class_today,
            dataType: "JSON",
            success: (data) => {
                console.log(data);
            },
            error: (err) => {
                console.log(err);
            },
        });
        // fetch(url, {method:"POST", data:'class_uid='+class_uid+'&today='+class_today})
        // .then(resp=>resp.json())
        // .then(data=>{
        //     console.log(data);
        //     return;
        //     let newDocument = document.createElement("html");
        //     newDocument.innerHTML = data;
        //     let studentTable = newDocument.querySelector("tbody#class_student");
        //     let studentRows = Array.from(studentTable.querySelectorAll("tr td:nth-child(2)")).map(el=>el.innerText.replace("\n",""));
        //     let studentNames = studentRows.join(", ");

        // })
        
    })
}

function getClassList_student(){
    let url = "/main/getclassinfo"
    let classList = document.querySelectorAll("div.box_today ul.class_list li");
    let todayDate = document.querySelector("#class_today");
    let allStudentArray = [];
    
    
    classList.forEach((c)=>{
        let uid = c.dataset.uid;
        let data = {
            class_uid   : uid,
			class_today : todayDate.value
        }
        $.ajax({
            type:'POST',
            url:url,
            data: 'class_uid='+data.class_uid+'&today='+data.class_today,
            success: function(data){
                console.log(data);
                let students = data.student;
                students = student_process(students);
                c.querySelectorAll("dd strong")[1].innerText = `학생(${students.length}명) : ` + students.join(", ");
                c.querySelectorAll("dd strong")[1].dataset.studentNames = students.join(", ");
                c.querySelectorAll("dd strong")[1].dataset.studentCount = students.length;
                for(i of students){allStudentArray.push(i);};
                list = new Set(allStudentArray);
                document.querySelector("#오늘오는사람숫자").innerText = `(${list.size}명)`;
                document.querySelector("#검색된숫자").innerText = `(${list.size}명)`;
                sortFunction();
            }
        })
    })
}

function student_process(students){
    let studentList = new Array();
    for(s of students){
        studentList.push(s.member_name.replace("<BR/>","").replace("<br/>","").replace("<BR>","").replace("<br>",""));
    }
    return studentList;
}
