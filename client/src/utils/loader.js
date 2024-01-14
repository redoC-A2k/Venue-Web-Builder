function showLoader(){
    let element = document.getElementById('loader')
    element.classList.add("show")
}

function hideLoader(){
    let element = document.getElementById('loader')
    element.classList.remove("show")
}

export {showLoader, hideLoader}