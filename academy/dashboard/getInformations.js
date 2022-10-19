
function AjaxGetReq(url, responseObject){
    let request = new XMLHttpRequest();
    request.onreadystatechange = (event)=>{
        if(request.readyState == request.DONE){
            let resp = request.response;
            if (request.status == 200){ //success
                responseObject.load(resp);
            }
            else{ //fail
                responseObject.error(resp);
            }
        }
    };
    request.open("GET", url);
    request.responseType = "html";
    request.send();
}



function getClassList_teacher(){
    let classList = document.querySelectorAll("div.box_today ul.class_list li");
    let todayDate = document.querySelector("div.cont1 div.tit input.btn_today.datepicker2");
    let allStudentArray = [];
    classList.forEach((c)=>{
        let uid = c.dataset.uid;
        let url = `/eielms/pages/modal/academy/class.detail.php?uid=${uid}&class_today=${todayDate.value}`;
        AjaxGetReq(url, {
            load:function(resp){
                let responsePage = document.createElement("html");
                responsePage.innerHTML = resp;
                let respList = responsePage.querySelectorAll(".auth_box");
                let teachers = respList[1];
                // let students = respList[2];
                c.querySelectorAll("dd strong")[0].innerText = `강사(${teachers.querySelectorAll("span.title").length}명) : ` + Array.from(teachers.querySelectorAll("span.title")).map(x => x.innerText).join(", ");
                c.querySelectorAll("dd strong")[0].dataset.teacherNames = Array.from(teachers.querySelectorAll("span.title")).map(x => x.innerText).join(", ");

            },
            error:function(resp){
                console.log(`error occured`, resp);
            },
        })
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

    document.querySelector("div.tit h2").insertAdjacentHTML("beforeend", `
    <span id="오늘오는사람숫자"></span>
    <span id="검색된숫자"></span>
    `);
}



function getClassList_student(){
    let url = "/eielms/process/json/get.academy.dashboard.json.php"
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
            data:{
                class_uid   : uid,
                class_today : todayDate.value
            },
            success: function(data){
                data = JSON.parse(data);
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
        studentList.push(s.member_name.replace("<BR>","").replace("<br>",""));
    }
    return studentList;
}
