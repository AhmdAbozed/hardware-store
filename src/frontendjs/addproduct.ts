const imginput = <HTMLInputElement>document.getElementById("imgInput");

const imgarea = document.getElementById("pic")

function hideoptions(){
  
  //hide all brand selector options until a type is selected

  const options = document.querySelectorAll(".brandOption");
  const brandSelect = document.getElementById("inputBrand")  
  
  //@ts-ignore
  brandSelect.selectedIndex = 0;

  for (const option of options) {
    option.setAttribute("hidden", "true");
  }

}

hideoptions();

imginput?.addEventListener("change", async (event) => {
  const imgfile = imginput.files;
  console.log(imgfile)
  console.log("testingimgInput")
  if (imgfile![0]) {
    const imgUrl = URL.createObjectURL(imgfile![0]);
    console.log("img Url: " + imgUrl)
    imgarea?.setAttribute("src", imgUrl);
    //URL.revokeObjectURL(imgUrl)
  }
})

//@ts-ignore
document.forms["productDetails"].addEventListener("submit", async (event) => {
  const submission = new FormData(event.target)
  //@ts-ignore
  const logging = new URLSearchParams(submission)
  console.log(logging)
  if (imginput.files![0]) {
    console.log((imginput.files![0]));
    submission.append('file', imginput.files![0]);
    submission.append('filename', imginput.files![0].name);
  }
  event.preventDefault(); //default behaviour replaces the page with the response file, which is not ideal.
  const options = {
    method: "POST",
    //@ts-ignore
    body: submission

  }
  const resp = await fetch("http://" + window.location.hostname + ":" + window.location.port + "/addProduct", options);
console.log("sending")
  console.log(resp)
  if(resp.status == 200){
    document.getElementById('submitResult')!.innerHTML = 'Product Added';
  }else{
    document.getElementById('submitResult')!.innerHTML = '';
    
  }
  
}
);
//*/

document.getElementById("inputType")?.addEventListener("change", (event)=>{
  //@ts-ignore
  console.log("inputtype event"+JSON.stringify(event.target?.value))
  
  hideoptions()

  //@ts-ignore
  if(event.target?.value == "*"){
    const selectedOptions = document.querySelectorAll(".brandOption")
    for (const option of selectedOptions) {
      option.removeAttribute("hidden")
    }
  }

  //@ts-ignore
  const selectedOptions = document.querySelectorAll("."+event.target?.value)
  for (const option of selectedOptions) {
    option.removeAttribute("hidden")
  }
})