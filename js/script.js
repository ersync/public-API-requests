const numEmployees = 12
const url = `https://randomuser.me/api/?results=${numEmployees}&nat=us`
const gallery = document.querySelector("#gallery")
const searchInput = document.querySelector("#search-input")
let currentIndex = 0

async function getEmployees(url) {
    const response = await fetch(url)
    const json = await response.json()
    return json.results
}

function createCard(employee, i, employees) {
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
    currentCard.addEventListener("click", () => {
        currentIndex = i
        createModal(employees)
    })
}


function createModal(employees) {
    const {
        name,
        email,
        picture,
        location: {city, state, street: {name: streetName, number: streetNumber}, postcode},
        cell,
        dob,
    } = employees[currentIndex]
    const birthday = new Date(dob.date).toLocaleDateString("en-US")
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
                    <div class="modal-btn-container">
                    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                    <button type="button" id="modal-next" class="modal-next btn">Next</button>
                </div>
                </div>`
    gallery.insertAdjacentHTML("beforeend", html)

    const currentModal = document.querySelector(".modal")
    currentModal.firstElementChild.addEventListener("click", () => currentModal.parentElement.remove())
    const [modalPrev, modalNext] = checkNavigationButtons()
    modalNext.addEventListener("click", (e) => {
        currentIndex++
        updateModal(employees)
    })
    modalPrev.addEventListener("click", (e) => {
        currentIndex--
        updateModal(employees)
    })
}

function checkNavigationButtons() {
    const modalPrev = document.querySelector("#modal-prev")
    const modalNext = document.querySelector("#modal-next")
    modalPrev.disabled = currentIndex === 0
    modalNext.disabled = currentIndex === employees.length - 1
    return [modalPrev, modalNext]
}

function updateModal(employees) {
    checkNavigationButtons()
    const {
        name,
        email,
        picture,
        location: {city, state, street: {name: streetName, number: streetNumber}, postcode},
        cell,
        dob,
    } = employees[currentIndex]
    let birthday = new Date(dob.date).toLocaleDateString("en-US")
    let fullAddress = `${streetNumber} ${streetName}, ${city}, ${state}, ${postcode}`
    let currentModal = document.querySelector(".modal")
    let imgModal = currentModal.querySelector(".modal-img")
    let nameModal = currentModal.querySelector("#name")
    let emailModal = currentModal.querySelector(".modal-text")
    let cityModal = emailModal.nextElementSibling
    let phoneModal = cityModal.nextElementSibling.nextElementSibling
    let addressModal = phoneModal.nextElementSibling
    let birthdayModal = addressModal.nextElementSibling

    imgModal.src = picture.large
    nameModal.textContent = `${name.first} ${name.last}`
    emailModal.textContent = email
    cityModal.textContent = city
    phoneModal.textContent = cell
    addressModal.textContent = fullAddress
    birthdayModal.textContent = birthday
}


function search(employees) {
    searchInput.addEventListener("keyup", (e) => {
        gallery.innerHTML = ""
        const filteredList = employees.filter(employee => lookupEmployees(employee, e.target.value))
        filteredList.forEach(createCard)
    })

}

function lookupEmployees(employee, str) {
    const fullName = `${employee.name.first.toLowerCase()} ${employee.name.last.toLowerCase()}`
    return fullName.includes(str.toLowerCase())
}

async function showEmployees(url) {
    const employees = await getEmployees(url)
    employees.forEach(createCard)
    search(employees)
}

showEmployees(url)