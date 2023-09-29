const numEmployees = 12
const url = `https://randomuser.me/api/?results=${numEmployees}&nat=us`;
const gallery = document.querySelector("#gallery")

async function getEmployees(url) {
    const response = await fetch(url)
    const json = await response.json()
    const employees = json.results
    return employees
}

function createCard(employee) {
    const {name, email, picture, location: {city, state}} = employee
    let html = `
            <div class="card">
                <div class="card-img-container">
                    <img class="card-img" src="${picture.medium}" alt="profile picture">
                </div>
                <div class="card-info-container">
                    <h3 id="name" class="card-name cap">${name.first} ${name.last}</h3>
                    <p class="card-text">${email}</p>
                    <p class="card-text cap">${city}, ${state}</p>
                </div>
            </div>`
    gallery.insertAdjacentHTML("beforeend", html)

}

async function showEmployees(url) {
    const employees = await getEmployees(url)
    employees.forEach(createCard)
}


showEmployees(url)
