window.onload = function() {
    var blogContent = document.getElementById("blogContent");
    if(blogContent) {
        blogContent.addEventListener("click", function() {
            console.log("hello");
            if(this.value === "  Blog Post Goes Here") {
                this.value = "";
            }
        });
    }
}