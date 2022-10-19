function makeDashBoardLinkCorrectly(){
    let dashboard = document.querySelector(`a[href="/eielms/pages/academy/dashboard.php"]`);
    dashboard.href = "/eielms/pages/teacher/dashboard.php";
    return ;
}

const renderTeacher = ()=>{
    makeDashBoardLinkCorrectly();

}


activationTest(renderTeacher);