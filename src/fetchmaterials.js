
const input = document.querySelectorAll('input')
const names = document.querySelectorAll('#names')

async function fetchingmaterials(){
    const data = await fetch('/api/materials.html')
    const info = await data.json()

    for(let i = 0; i < 19; i++){
        names[i].textContent = info[i].name
        input[i].max = info[i].quantity
        console.log(input[i].max)
    }
}

fetchingmaterials()

