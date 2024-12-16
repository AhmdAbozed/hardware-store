const typeSelect = document.getElementById("type")
const brandSelect = document.getElementById("brand")

type product = {
  id?: Number;
  type:string;
  name: string;
  brand: string;
  description: string;
  price: Number;
  filename: string
}

//first I grab all brands/types from DB, then add filters accordingly
async function getFilters() {

  const resp = await fetch("http://" + window.location.hostname + ":" + window.location.port + "/filters", {method: "get"});

  const result = await resp.json();

  addfilters(result)
}

/*
I wanted to display the available brands for each type, 
ex: only nividia and amd gpus are available, so if gpu filter is picked, brand selector only displays nvidia and amd.
*/
function addfilters(filters: Array<any>) {

  let brands: Array<string> = [];
  let types: Array<string> = [];

  for (const filter of filters) {
    brands.push(filter.brand)
    types.push(filter.type)
  }

  //Set() is used here to have an array with only unique values.
  brands = [...new Set(brands)]
  types = [...new Set(types)]

  /*
  a filter object contains a brand and a type,
  sql filters:
  1 | nvidia | gpu   |        4
  2 | amd    | gpu   |        2
  3 | intel  | mouse |        1
  4 | amd    | cpu   |        1
  
  for each unique brand, if a filter has it, assign the filter.type to selector class
  ex: option(class = "brandOption gpu cpu" value="amd") AMD
  that way when a type is picked, only brands with it in their class are displayed.
  */
  for (const brand of brands) {

    const brandOption = document.createElement("option")
    let typesForBrand = "brandOption ";
    for (const filter of filters) {
      if (brand == filter.brand) {
        typesForBrand += filter.type + " ";
      }
    }
    brandOption.setAttribute("class", typesForBrand)
    brandOption.value = brand;
    brandOption.innerHTML = brand;
    brandSelect?.append(brandOption);

  }

  for (const type of types) {

    const typeOption = document.createElement("option")
    typeOption.value = type;
    typeOption.innerHTML = type;
    typeSelect?.append(typeOption);

  }
}

async function getproducts(type: string, brand: string) {
  console.log("INSIDE GETPRODUCTS")

  if(type == "brandOption") type = "type";
  if(brand == "brandOption") brand = "brand";

  const resp = await fetch("http://" + window.location.hostname + ":" + window.location.port + "/products/" + type + "-" + brand, {method: "get"});

  const result = await resp.json();
  console.log(result)
  return result
  }

function listProducts(products:Array<any>){
  
  let catalog = document.getElementById("catalog");
  catalog?.remove();
  
  catalog = document.createElement("div")
  catalog.setAttribute("id", "catalog")
  document.getElementById("bodyContent")?.append(catalog)

  for (const product of products) {
    const element = createProductElement(product)
    catalog?.append(element);
  }
}

function createProductElement(product:product){
  const div = document.createElement("div");
  div.setAttribute("class", "products");
  div.setAttribute("id", JSON.stringify(product.id));
  
  const img = document.createElement("img")
  img.setAttribute("src",  location + "resources/images/"+product.filename)
  img.setAttribute("class", "productImg")

  const anchor = document.createElement("a")
  anchor.setAttribute("href", location+"product/"+product.id)
  
  anchor.append(img)
  div.append(anchor)


  return div;
  
}

//when a type is selected, hide all brands except available ones
function hideCatalogOptions() {

  const options = document.querySelectorAll(".brandOption");
  const brandSelect = document.getElementById("brand")

  //@ts-ignore
  brandSelect.selectedIndex = 0;

  for (const option of options) {
    option.setAttribute("hidden", "true");
  }

}

document.getElementById("find")?.addEventListener("click", async (event) => {

  //@ts-ignore
  const products = await getproducts(typeSelect?.value, brandSelect?.value)
  listProducts(products)
})

document.getElementById("type")?.addEventListener("change", (event) => {
  //@ts-ignore //Simple error, fixing it would add a fair amount of code that is unnecessary
  console.log("inputtype event" + JSON.stringify(event.target?.value))

  hideCatalogOptions()

  //@ts-ignore
  const selectedOptions = document.querySelectorAll("." + event.target?.value)
  for (const option of selectedOptions) {
    option.removeAttribute("hidden")
  }
})

getFilters()