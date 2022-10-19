function AddSearchBox(){
    let toolbar = document.querySelector("div#eie-assist-toolbar");
    toolbar.insertAdjacentHTML("afterbegin",`
    <input type='text' id='class-searchbox' 
        class="search-custom-input" placeholder="Classes 검색">
    `)
}
function searchByClassname(searchBox){
    let classList = document.querySelectorAll("div.cont1 div.box_today div.cont .class_select");
    let count = 0;
    if(searchBox.value == ""){
        for(c of classList){
            c.style.display="";
            count += new Number(c.querySelectorAll("div.class_cont dl.director dd strong")[1].dataset.studentCount);
        }
        try{
            document.querySelector("span#검색된숫자").innerText = `[${count}명]`
        }
        catch{
            return;
        }
        return;
    }
    for(c of classList){
        if(c.querySelector("div.class_cont dl.director dt strong a").innerText.toLowerCase().includes(searchBox.value.toLowerCase()) || 
            c.querySelector("div.class_cont dl.director dd strong").innerText.toLowerCase().includes(searchBox.value.toLowerCase()) ||
            c.querySelectorAll("div.class_cont dl.director dd strong")[1].innerText.toLowerCase().includes(searchBox.value.toLowerCase())
            ){
            c.style.display = "";
            count += new Number(c.querySelectorAll("div.class_cont dl.director dd strong")[1].dataset.studentCount);
        }
        else{
            c.style.display = "none";
        }
    }
    try{
        document.querySelector("span#검색된숫자").innerText = `[${count}명]`
    }
    catch{
        return;
    }
}

/**
 * dashboard의 classes를 정렬하는 함수
 * @param {string} method 정렬기준
 * @param {int} sortRule 1 : asc / 0: desc 방식으로 정렬
 */
function sortBy(method){
    switch (method) {
        
        case "className":
            sortByClassName(1);
            break;
        case "-className":
            sortByClassName(0);
            break;
        case "default":
            unSort(1);
            break;
        case "-default":
            unSort(0);
            break;
        default:
            break;
    }
}

function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}


function sortByClassName(sortRule){
    let classList = document.querySelectorAll("ul.class_list>li");
    let sortableArray = [];
    classList.forEach((element)=>{
        let c_obj = {
            className : element.querySelector("dt strong a").innerText,
            element : element
        };
        sortableArray.push(c_obj);
    })
    if (sortRule) sortableArray.sort(dynamicSort("className"));
    else sortableArray.sort(dynamicSort("-className"));
    sortableArray.forEach(obj=>{
        object = obj.element;
        document.querySelector("ul.class_list").insertAdjacentElement("beforeend", object);
    })
}
function unSort(sortRule=1){
    let classList = document.querySelectorAll("ul.class_list>li");
    let sortableArray = [];
    classList.forEach((element)=>{
        let c_obj = {
            index : new Number(element.querySelectorAll("dt strong")[0].innerText),
            element : element
        };
        sortableArray.push(c_obj);
    })
    if (sortRule) sortableArray.sort(dynamicSort("index"));
    else sortableArray.sort(dynamicSort("-index"));
    sortableArray.forEach(obj=>{
        object = obj.element;
        document.querySelector("ul.class_list").insertAdjacentElement("beforeend", object);
    })
}


function insertSortMethod(){
    let toolbar = document.querySelector("div#eie-assist-toolbar");
    toolbar.insertAdjacentHTML("afterbegin", `
        <select id="sort" class="form-control">
            <option value="default">정렬: 기본순서</option>
            <option value="className">정렬: 반명</option>
            <option value="-className">정렬: 반명(내림차순)</option>
            <option value="-default">정렬: 기본순서(내림차순)</option>
        </select>
    `);
}
function sortFunction(){
    let sortSelect = document.querySelector("select#sort");
    sortBy(sortSelect.value);
}







const renderAll = ()=>{
    overwriteNamesButton();
    console.log("EIE ASSIST LOADED!");
    AddSearchBox();
    insertSortMethod();
    let searchBox = document.querySelector("input#class-searchbox");
    searchBox.addEventListener("keydown",(event)=>{
        if(event.keyCode == 13){
            event.preventDefault();
        }
    });
    searchBox.addEventListener("keyup",(event)=>{
        searchByClassname(event.target);
    });
    
    document.querySelector("select#sort").addEventListener("click",(event)=>{
        sortFunction();
    })
}

activationTest(renderAll);