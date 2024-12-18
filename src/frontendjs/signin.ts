//@ts-ignore
document.forms["formBody"].addEventListener("submit", async (event) => {
  
  event.preventDefault(); //default behaviour replaces the page with the response file, which is not ideal.
  
  const resp = await fetch("http://"+window.location.hostname+":"+window.location.port+"/user/signin", {
    method: "POST",
    //@ts-ignore
    body: new URLSearchParams(new FormData(event.target)) //It's unclear what URLSeachParams does, but without it, request body is empty.
    
  });
    
  const result = await resp.json();
  
  //if the user is found, it returns user object again, otherwise response is empty
  if(result[0]){
    window.location.href = ("http://"+window.location.hostname+":"+window.location.port+"/")
  }
  else{
    document.getElementById("signinError")!.innerHTML = "Incorrect username or password";
  }

});
