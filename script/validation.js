/* -------------------------------------------------------------------------- */
// Alle interactieve onderdelen voor onze site. We maken van alle inputs een object met zijn eigen eigenschappen.
let email = {},
	signInButton;
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
// Twee standaard functies, nog basic, maar kan je nog uitbreiden.
const isValidEmailAddress = function(emailAddress) {
	// Basis manier om e-mailadres te checken.
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress);
};



const isEmpty = function(fieldValue) {
	return !fieldValue || !fieldValue.length;
};
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
const doubleCheckEmailAddress = function() {
	if (isValidEmailAddress(email.input.value)) {
		// Stop met dit veld in de gaten te houden; het is in orde.
		email.input.removeEventListener('input', doubleCheckEmailAddress);
		removeErrors(email);
	} else {
		// Stuk herhalende code.
		if (isEmpty(email.input.value)) {
			email.errorMessage.innerText = 'Gelieve dit veld in te vullen';
		} else {
			email.errorMessage.innerText = 'Ongeldig e-mailadres';
		}
	}
};



const addErrors = function(formField) {
	formField.field.classList.add('has-error');
	formField.errorMessage.classList.add('is-visible');
};

const removeErrors = function(formField) {
	formField.field.classList.remove('has-error');
	formField.errorMessage.classList.remove('is-visible');
};
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
const getDOMElements = function() {
	email.label = document.querySelector('.js-email-label');
	email.errorMessage = email.label.querySelector('.js-email-error-message');
	email.input = document.querySelector('.js-email-input');
	email.field = document.querySelector('.js-email-field');

	signInButton = document.querySelector('.js-sign-in-button');


};

const enableListeners = function() {
	email.input.addEventListener('blur', function() {
		if (!isValidEmailAddress(email.input.value)) {
			if (isEmpty(email.input.value)) {
				email.errorMessage.innerText = 'Gelieve dit veld in te vullen';
			} else {
				email.errorMessage.innerText = 'Ongeldig e-mailadres';
			}

			addErrors(email);

			
			email.input.addEventListener('input', doubleCheckEmailAddress);
		}
	});

	

	signInButton.addEventListener('click', function(e) {
		// We gaan de form zelf versturen wanneer nodig.
		e.preventDefault();
		console.log("click")

		if (
			isValidEmailAddress(email.input.value) 

		) {
			console.log('Form is good to go!');
		} else {
			// Stuk herhalende code...
			console.log(email.input.value)

			addErrors(email);
			email.input.addEventListener('input', doubleCheckEmailAddress);
		}
	});
};
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
// We kunnen pas iets doen met onze html-content (DOM) als die geladen is.
document.addEventListener('DOMContentLoaded', function() {
	// Ook even testen of ik DoMConteeentLoeaaded goed geschreven heb...
	console.log('DOM loaded 🥳!');

	// We splitsen alles netjes op in verschillende functies.
	// 1. Alle linken leggen naar onze HTML.
	getDOMElements();

	// 2. We voegen listeners toe om te wachten op interactie
	enableListeners();
});
/* -------------------------------------------------------------------------- */
