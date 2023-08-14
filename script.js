//global variables for updateContact function
//let hasEditing = false;
let updateId = "";

//get the element where the image will be dropped
const dropArea = document.querySelector(".space-to-drop");
let file; //global variable to use inside multiple functions

//If user Drag File Over DropArea
dropArea.addEventListener("dragover", (event) => {
    event.preventDefault(); //preventing from default behaviour
    dropArea.classList.add("active");
    if (dropArea.querySelector("p")) {
        dropArea.querySelector("p").textContent = "Release to Upload File";
    }
});

//If user leave dragged File from DropArea
dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("active");
    if (dropArea.querySelector("p")) {
        dropArea.querySelector("p").textContent = "Drag & Drop to Upload File";
    }
});

//Function to show image on dropArea
function showFile() {
    let fileType = file.type;
    let validExtensions = ["image/jpeg", "image/jpg", "image/png"];
    if (validExtensions.includes(fileType)) {
        let fileReader = new FileReader();
        fileReader.onload = () => {
            let fileURL = fileReader.result;
            let imgTag = `<img src="${fileURL}" alt="image" id="profile-photo">`;
            dropArea.innerHTML = imgTag;
        }
        fileReader.readAsDataURL(file);
    } else {
        alert("This is not an Image File!");
        dropArea.classList.remove("active");
        if (dropArea.querySelector("p")) {
            dropArea.querySelector("p").textContent = "Drag & Drop to Upload File";
        }
    }
}

//If user drop File on DropArea
dropArea.addEventListener("drop", (event) => {
    event.preventDefault();
    file = event.dataTransfer.files[0];
    showFile(); //calling function
});

//class for all type Contact objects to create
class Contact {
    constructor(prenom, nom, phone, groupe, email, bio, photo) {
        this.prenom = prenom;
        this.nom = nom;
        this.phone = phone;
        this.groupe = groupe;
        this.email = email;
        this.bio = bio;
        this.photo = photo;
    }
}

//add contact
function createContact(personalContact) {
    //get timesTamp as an Id for all insert
    let indexIdentity = 'contatct-' + Date.now().toString();
    //Create new div element
    let newElement = document.createElement('div');
    let parent = document.querySelector('.form-contact');
    newElement.innerHTML = `
        <div class="contact-list" id="${indexIdentity}">
            <div class="photo">
                <img src="${personalContact.photo}" alt="contact profil" class="img"/>
            </div>
            <div class="text">
                <div class="identity">
                    <span class="contact-name">${personalContact.prenom}</span> <span class="contact-nom">${personalContact.nom}</span> - <span class="contact-group">${personalContact.groupe}</span>
                    <span class="update-buttons">
                        <button id="btnUpdate" onClick="updateContact(this, '${indexIdentity}')"></button>
                        <button id="btnDelete" onClick="deletContact(this)"></button>
                    </span>
                </div>
                <div class="phone"><span class="number">${personalContact.phone}</span> <span>-</span> <span class="email">${personalContact.email}</span></div>
                <div class="biography">
                    ${personalContact.bio}
                </div>
            </div>
        </div>
    `
        //Add new div element to its parent
    parent.appendChild(newElement);
}
//Get the form element
let form = document.querySelector('form');
let getDivPere = document.querySelector('#contact-picture');

function enterContact(element) {

    element.preventDefault();

    //get all values of the form
    let prenom = document.querySelector('#contact-prenom').value;
    let nom = document.querySelector('#contact-nom').value;
    let phone = document.querySelector('#contact-phone').value;
    let groupe = document.querySelector('#contact-group').value;
    let email = document.querySelector('#contact-mail').value;
    let bio = document.querySelector('#contact-bio').value;
    let photo = document.querySelector('#profile-photo').src;
    if (updateId !== "") {
        //set up if/else statement for form validation
        let alertbutton = document.querySelector('.btn-red');
        if (prenom === '' || nom === '' || phone === '' || groupe === '' || email === '' || bio === '' || photo === null) {

            alertbutton.style.display = 'block';
        } else {
            //Create contact
            document.querySelector(`#${updateId} .text .identity .contact-name`).innerText = prenom;
            document.querySelector(`#${updateId} .text .identity .contact-nom`).innerText = nom;
            document.querySelector(`#${updateId} .text .phone .number`).innerText = phone;
            document.querySelector(`#${updateId} .text .identity .contact-group`).innerText = groupe;
            document.querySelector(`#${updateId} .text .phone .email`).innerText = email;
            document.querySelector(`#${updateId} .text .biography`).textContent = bio.replace(/&nbsp;/g, ' ');
            document.querySelector(`#${updateId} .photo .img`).src = photo;
            console.log(updateId);
            console.log(groupe);
            alertbutton.style.display = 'none';
            // createContact(personalContact);
        }
    } else {

        //create an object of the information from contact
        const personalContacting = new Contact(prenom, nom, phone, groupe, email, bio, photo);
        let alertbutton = document.querySelector('.btn-red');

        //set up if/else statement for form validation
        if (prenom === '' || nom === '' || phone === '' || groupe === '' || email === '' || bio === '' || photo === null) {

            alertbutton.style.display = 'block';
        } else {
            //Create contact
            createContact(personalContacting);
            alertbutton.style.display = 'none';
        }
    }
    resetForm();
}

let buttonCreer = document.querySelector('.btn-creer');
buttonCreer.addEventListener('click', enterContact);

function deletContact(supprime) {
    if (window.confirm("Voulez-vous supprimer le contact ?")) {
        // let divToDelete = document.querySelector('.contact-list');
        // divToDelete.remove();
        let elementToDelete = supprime.parentElement.parentElement.parentElement.parentElement;
        elementToDelete.remove();
    }
}

function updateContact(edit, id) {
    // let divToUpdate = document.querySelector('.contact-list');
    // let modifyElement = divToUpdate;
    let elementToUpdate = edit.parentElement.parentElement.parentElement.parentElement;
    console.log(id);
    form.querySelector('#contact-prenom').value = elementToUpdate.querySelector('.contact-name').innerHTML;
    form.querySelector('#contact-nom').value = elementToUpdate.querySelector('.contact-nom').innerHTML;
    form.querySelector('#contact-phone').value = elementToUpdate.querySelector('.number').innerHTML;
    form.querySelector('#contact-group').value = elementToUpdate.querySelector('.contact-group').innerHTML;
    form.querySelector('#contact-mail').value = elementToUpdate.querySelector('.email').innerHTML;
    form.querySelector('#contact-bio').value = elementToUpdate.querySelector('.biography').innerHTML;
    let fileURL = elementToUpdate.querySelector('.img').src;
    let imgTag = `<img src="${fileURL}" alt="image" id="profile-photo">`;
    dropArea.innerHTML = imgTag;
    form.querySelector('.btn-creer').textContent = 'Modifier';

    //hasEditing = true;
    updateId = id;
}

let buttonReinit = document.querySelector('.btn-reinit');
buttonReinit.addEventListener('click', () => {
    resetForm();
    let hideAlertbutton = document.querySelector('.btn-red');
    hideAlertbutton.style.display = 'none';
});

function resetForm() {
    form.querySelector('.btn-creer').textContent = 'Créer';

    form.reset();
    updateId = "";
    //hasEditing = false;
    dropArea.innerHTML = '<img src="" alt="image" id="profile-photo" style="display: none;"> <p class="photo-paragraph">Déplacez la photo ici</p>';
}