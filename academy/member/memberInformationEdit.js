function unlockBirthDate(){
    document.querySelector("input[name=birth]").disabled = false;
    document.querySelector("input[name=birth]").removeAttribute("readonly");
    let supportText = document.querySelector("input[name=birth]").parentElement.querySelector(".support-text");
    supportText
        .innerText = `EiE LMS Assist에 의하여 수정이 가능합니다.`;
    supportText.style.color = "crimson";
}

unlockBirthDate();