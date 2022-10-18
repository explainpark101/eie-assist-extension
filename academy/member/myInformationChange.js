function addChangeBirthDate(){
    let loc = document.querySelectorAll("div.row")[9];  
    let processDate = loc.innerText;
    processDate = processDate.slice(5,17).trim();
    loc.querySelector("div.form-control").insertAdjacentHTML("beforebegin", `
    <input class="form-control datepicker_on" id="birth_hidden" 
    name="birth_hidden" type="date" 
    autocomplete="off" required="" data-parsley-required-message="생년월일을 입력해주세요."
    >
    <input class="" id="birth" 
    name="birth" type="hidden"
    >
    `);
    loc.querySelector("input[name=birth_hidden]").value = processDate;
    document.querySelector("input[name=birth]").value = new String(document.querySelector("input[name=birth_hidden]").value).replace("-","");
    document.querySelector("input[name=birth]").value = document.querySelector("input[name=birth]").value.replace("-","");
    document.querySelector("input[name=birth_hidden]").addEventListener("change", function(e){
        document.querySelector("input[name=birth]").value = new String(e.target.value).replace("-","");
        document.querySelector("input[name=birth]").value = document.querySelector("input[name=birth]").value.replace("-","");
    })
    loc.querySelector("div.form-control").remove();
}

function removeWeirdRequiredFields(){
    document.querySelector("input[name=addr1]").required = false;
    document.querySelector("input[name=email]").required = false;
    document.querySelector("input[name=tel]").required = false;

}

addChangeBirthDate();
removeWeirdRequiredFields();