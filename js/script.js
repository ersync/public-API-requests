const numEmployees = 12
const url = `https://randomuser.me/api/?results=${numEmployees}&nat=us`
const gallery = document.querySelector("#gallery")
const searchInput = document.querySelector("#search-input")
let currentIndex = 0

/* getEmployees(url): This function fetches employee data from the specified URL and returns the results as an array
 of objects.*/
async function getEmployees(url) {
    try {
        const response = await fetch(url)
        const json = await response.json()
        return json.results
    } catch (e) {
        console.error('Error:', e);
    }
}

/* createCard(employee, i, employees): This function creates a card element for a given employee and inserts it into
 the gallery. It also adds a click event listener to the card that opens a modal with more details about the employee.
 */
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

/* createModal(employees): This function creates a modal element with detailed information about the currently
 selected employee. It also adds event listeners to the modal's close button and navigation buttons.
 */
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

     const currentModal = document.querySelector(".modal-container")
     currentModal.addEventListener("click", (e) => {
     // If the click is directly on the modal container (outside the modal)
     if (e.target === currentModal) {
         currentModal.remove()
     }
 })
     
     currentModal.firstElementChild.firstElementChild.addEventListener("click", () => currentModal.remove())
     
     const [modalPrev, modalNext] = checkNavigationButtons(employees)
     
     modalNext.addEventListener("click", () => {
         currentIndex++
         updateModal(employees)
     })
     modalPrev.addEventListener("click", () => {
         currentIndex--
         updateModal(employees)
     })
 }
/* checkNavigationButtons(): This function checks the current index of the selected employee and disables the
 previous and next navigation buttons if necessary. It returns an array containing references to the previous and next buttons.
 */
function checkNavigationButtons(employees) {
     const modalPrev = document.querySelector("#modal-prev")
     const modalNext = document.querySelector("#modal-next")
     modalPrev.disabled = currentIndex === 0
     modalNext.disabled = currentIndex === employees.length - 1
     return [modalPrev, modalNext]
 }

/* updateModal(employees): This function updates the content of the modal with the details of the currently selected
 employee. It also calls checkNavigationButtons() to update the navigation buttons.
 */
function updateModal(employees) {
     const [modalPrev, modalNext] = checkNavigationButtons(employees)
     
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
     birthdayModal.textContent = `Birthday: ${birthday}`
 }
/* search(employees): This function adds a keyup event listener to the search input field. It filters the list of
 employees based on the
 search input and updates the gallery accordingly.
 */
function search(employees) {
     searchInput.addEventListener("keyup", (e) => {
         gallery.innerHTML = ""
         const filteredList = employees.filter(employee => lookupEmployees(employee, e.target.value))
         filteredList.length === 0 ? noResults() : filteredList.forEach((employee, i) => createCard(employee, i, filteredList))
     })

}

/* lookupEmployees(employee, str): This function checks if the full name of an employee matches the search string.
 It returns true if there is a match, false otherwise.
 */
function lookupEmployees(employee, str) {
    const fullName = `${employee.name.first.toLowerCase()} ${employee.name.last.toLowerCase()}`
    return fullName.includes(str.toLowerCase())
}

/* showEmployees(url): This function fetches employee data from the specified URL, creates cards for each employee,
 and adds search functionality to the gallery.
 */
function noResults() {
    gallery.innerHTML = "<h3>No results found</h3>"
}

async function showEmployees(url) {
    const employees = await getEmployees(url)
    employees.forEach(createCard)
    search(employees)
}

showEmployees(url)