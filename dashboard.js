function AddSearchBox(){
    let box_Classes = document.querySelector("div.dashboard-box-1 div.tit");
    box_Classes.querySelector("h2").insertAdjacentHTML("afterend",`
    <input type='text' id='class-searchbox' 
        style="border-radius:10px;
        border: 1px solid white;
        color:black; 
        font-weight:500;
        max-width:25%;
    " placeholder="검색">
    `)
}
function searchByClassname(searchBox){
    let classList = document.querySelectorAll("div.cont1 div.box_today div.cont .class_select");
    if(searchBox.value == ""){
        for(c of classList){c.style.display=""}
        return;
    }
    for(c of classList){
        if(c.querySelector("div.class_cont dl.director dt strong a").innerText.toLowerCase().includes(searchBox.value.toLowerCase()) || 
            c.querySelector("div.class_cont dl.director dd strong").innerText.toLowerCase().includes(searchBox.value.toLowerCase())){
            c.style.display = "";
        }
        else{
            c.style.display = "none";
        }
    }
}



console.log("EIE ASSIST LOADED!");
AddSearchBox();
let searchBox = document.querySelector("input#class-searchbox");
searchBox.addEventListener("keydown",(event)=>{
    if(event.keyCode == 13){
        event.preventDefault();
    }
});
searchBox.addEventListener("keyup",(event)=>{
    searchByClassname(event.target);
});