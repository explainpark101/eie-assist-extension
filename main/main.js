// title URL 추가
function headerNewButton(href="#", HTMLclassName="btn btn-primary", innerText = "new URL BUTTON"){
    let header = document.querySelector("div.header-container ul.nav-left");
    header.insertAdjacentHTML("beforeend", `
    <a href=${href} class='${HTMLclassName}' id="eie-assist-url-header-button" target="_blank">${innerText}</a>
    `);

    console.log("LOADED")
}
function headerNewButtonEmbeded(href="#", HTMLclassName="btn btn-primary", innerText = "new embeded BUTTON"){
    let header = document.querySelector("div.header-container ul.nav-left");
    header.insertAdjacentHTML("beforeend", `
    <a href=${href} class='${HTMLclassName}' id="eie-assist-url-header-button">${innerText}</a>
    `);

    console.log("LOADED")
}

function 광고판이동(){
    let 광고판 = document.querySelector("div.header-container .nav-left .search-box");
    광고판_btn = 광고판.querySelector("a");
    광고판_btn.innerHTML = `<span>본사공지사항</span>`;
    광고판_btn.classList.add("btn-eie-notice-list");
    광고판.style.float = "right";
    document.querySelector(".page-nav").insertAdjacentElement("afterbegin", 광고판);
}


headerNewButton("https://www.jlive.shop/", "btn btn-primary", "JLive LMS(Presentation Video)");
headerNewButton("https://www.youtube.com/channel/UCTF7qRuacBq0Eic_en4FYHw", "btn btn-danger", "EiE Presentation Server");
headerNewButtonEmbeded("/eielms/pages/academy/community/cletter.list.php", "btn btn-info", "알림장");
headerNewButtonEmbeded("/eielms/pages/academy/community/advice.list.php", "btn btn-info", "상담일지");

광고판이동();