
//@ts-ignore
document.getElementById("signOut").addEventListener("click", async (event) => {
    
    console.log("event: " + location); //the submission
    console.log("target: " + event.target); //the form
    //remove user/admin token cookie
    const resp = await fetch(location+"user/signout", {
      method: "POST"
    });
    const response = await resp;
    window.location.href = ("http://"+window.location.hostname+":"+window.location.port+"/user/signin")
});