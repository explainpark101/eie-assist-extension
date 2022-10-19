


window.addEventListener('DOMContentLoaded', () => {
  renderAll();
})

const renderAll = async () => {
  const PasswordBox = document.querySelector("input[name=passwordCode]");
  await chrome.storage.local.get("EiE_ASSIST_activation",(result)=>{
    let activationKey = result.EiE_ASSIST_activation;
    if(activationKey != "undefined")
    PasswordBox.value = activationKey;
  });
  
  PasswordBox.addEventListener("change", (e)=>{
    chrome.storage.local.set({"EiE_ASSIST_activation": PasswordBox.value});
  });
}