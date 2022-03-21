async function getCoffeeShops() {
    let token = "88lCyoK44pAOutLXQ4N7w8vlQW7l2b7HopG66GXrEtz4rt7NMMnftFOEJnGyjAYC"
    let url = `http://localhost:3000/api/CoffeeShops?access_token=${token}`
    let response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })

    let res = await response.json()
    console.log(res)
    let resultTable = document.querySelector('#resultTable tbody')
    res.map((item) => {
        resultTable.innerHTML += `<tr><td>` + item.name + `</td><td>` + item.city + `</td></tr>`
    })
}

getCoffeeShops()