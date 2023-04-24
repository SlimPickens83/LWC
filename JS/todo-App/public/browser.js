document.addEventListener("click", function(e) {
    if (e.target.classList.contains("edit-me")) {
        let userInput = prompt("Enter updated text:")
        axios.post("/update-item", {text: userInput, id: e.target.getAttribute("data-id")}).then(function() {
            // do something later
        }).catch(function() {
            console.log("Please try again later.")
        })
    }
})