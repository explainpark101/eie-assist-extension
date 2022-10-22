// title URL 추가
function headerNewButton(href="#", HTMLclassName="btn btn-primary", innerText = "new URL BUTTON"){
    let header = document.querySelector("div.header-container ul.nav-left #toolbox");
    header.insertAdjacentHTML("beforeend", `
    <a href=${href} class='${HTMLclassName}' id="eie-assist-url-header-button" target="_blank">${innerText}</a>
    `);

    console.log("LOADED")
}
function headerNewButtonEmbeded(href="#", HTMLclassName="btn btn-primary", innerText = "new embeded BUTTON"){
    let header = document.querySelector("div.header-container ul.nav-left #toolbox");
    header.insertAdjacentHTML("beforeend", `
    <a href=${href} class='${HTMLclassName}' id="eie-assist-url-header-button">${innerText}</a>
    `);

    console.log("LOADED")
}

function 광고판이동(){
    let 광고판HTML = `<button type="button" class="modal-btn btn btn-eie-notice-list" data-toggle="modal" data-target=".modal-view" data-modal-title="알림" data-modal-url="/eielms/pages/modal/common/alert.list.php"><span>본사공지사항</span></button>`

    let 광고판 = document.querySelector("div.header-container .nav-left .search-box");
    광고판.innerHTML = 광고판HTML;
    // 광고판_btn = 광고판.querySelector("a");
    // 광고판_btn.innerHTML = `<span>본사공지사항</span>`;
    // 광고판_btn.classList.add("btn-eie-notice-list");
    광고판.style.float = "right";
    // document.querySelector(".page-nav").insertAdjacentElement("afterbegin", 광고판);
}

function dashboardURLsetting() {
    let mainLogoUrl = document.querySelector("div.logo").parentElement;
    let dashboardButton = document.querySelector(".side-nav-menu li.nav-item a");
    dashboardButton.href = mainLogoUrl.href;
}

const renderMain = ()=>{
    document.querySelector("div.header-container ul.nav-left li").insertAdjacentHTML("afterend",`<span id="toolbox"></span>`);
    headerNewButton("https://www.jlive.shop/", "btn btn-primary", "JLive LMS(Presentation Video)");
    headerNewButton("https://www.youtube.com/channel/UCTF7qRuacBq0Eic_en4FYHw", "btn btn-danger", "EiE Presentation Server");
    headerNewButtonEmbeded("/eielms/pages/academy/community/cletter.list.php", "btn btn-info", "알림장");
    headerNewButtonEmbeded("/eielms/pages/academy/community/advice.list.php", "btn btn-info", "상담일지");

    광고판이동();
    dashboardURLsetting();
}
/**
 * LocalStorage를 이용하여 코드가 맞을 경우, 사용가능한 상태로 변경됨.
 * @returns boolean : 활성화여부
 */


const activationTest = async (callback) => {
    // console.log(chrome.storage.local);
    let resultParent = false;
    await chrome.storage.local.get("EiE_ASSIST_activation",(result)=>{
        let activationKey = result.EiE_ASSIST_activation;
        // console.log(activationKey);
        let activationList = [
            "01088009369",
            "01041229369"
        ];
        if(activationList.includes(activationKey)){
            resultParent = true;
        }
        if(resultParent){
            callback();
        }
        else{
            console.log("Authentication Failed");
        }
    });
}

activationTest(renderMain);