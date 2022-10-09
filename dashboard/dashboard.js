function AddSearchBox(){
    let toolbar = document.querySelector("div#eie-assist-toolbar");
    toolbar.insertAdjacentHTML("afterbegin",`
    <input type='text' id='class-searchbox' 
        class="search-custom-input" placeholder="Classes 검색">
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
            c.querySelector("div.class_cont dl.director dd strong").innerText.toLowerCase().includes(searchBox.value.toLowerCase()) ||
            c.querySelectorAll("div.class_cont dl.director dd strong")[1].innerText.toLowerCase().includes(searchBox.value.toLowerCase())
            ){
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



