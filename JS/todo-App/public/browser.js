document.addEventListener("click", function(e) {
    if (e.target.classList.contains("edit-me")) {
        let userInput = prompt("Enter updated text:")
        axios.post("/update-item", {text: userInput}).then(function() {
            // do something later
        }).catch(function() {
            console.log("Please try again later.")
        })
    }
})