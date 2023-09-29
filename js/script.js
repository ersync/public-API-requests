const numEmployees = 12
const url = `https://randomuser.me/api/?results=${numEmployees}&nat=us`;
const gallery = document.querySelector("#gallery")
const searchInput = document.querySelector("#search-input")

async function getEmployees(url) {
    const response = await fetch(url)
    const json = await response.json()
    return json.results
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
    const currentCard = gallery.lastElementChild
    currentCard.addEventListener("click", () => createModal(employee))
}

function createModal(employee) {
    const {
        name,
        email,
        picture,
        location: {city, state, street: {name: streetName, number: streetNumber}, postcode},
        cell,
        dob,
    } = employee
    const birthday = new Date(dob.date).toLocaleDateString('en-US')
    let html = `<div class="modal-container">
                    <div class="modal">
                        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                        <div class="modal-info-container">
                            <img class="modal-img" src="${picture.large}" alt="profile picture">
                            <h3 id="name" class="modal-name cap">${name.first} ${name.last}</h3>
                            <p class="modal-text">${email}</p>
                            <p class="modal-text cap">${city}</p>
                            <hr>
                            <p class="modal-text">${cell}</p>
                            <p class="modal-text">${streetNumber} ${streetName}, ${city}, ${state}, ${postcode}</p>
                            <p class="modal-text">Birthday: ${birthday}</p>
                        </div>
                    </div>
                </div>`
    gallery.insertAdjacentHTML("beforeend", html)
    const activeModal = document.querySelector(".modal")
    activeModal.firstElementChild.addEventListener("click", () => activeModal.parentElement.remove())

}


function search(employees) {
    searchInput.addEventListener("keyup", (e) => {
        gallery.innerHTML = ""
        const filteredList = employees.filter(emplyee => lookupEmployees(emplyee, e.target.value.toLowerCase()))
        filteredList.forEach(createCard)
    })

}

function lookupEmployees(employee, str) {
    const fullName = `${employee.name.first.toLowerCase()} ${employee.name.last.toLowerCase()}`
    return fullName.includes(str)
}


async function showEmployees(url) {
    const employees = await getEmployees(url)
    employees.forEach(createCard)
    search(employees)
}


showEmployees(url)