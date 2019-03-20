function clearBlogContent() {
    var blogContent = document.getElementById("blogContent");
    if(blogContent && blogContent.value === "  Blog Post Goes Here") {
        blogContent.value = "";
    }
}

window.onload = clearBlogContent(); 
