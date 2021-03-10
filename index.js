const cardNumber = document.getElementById('frmCCNum')

function getLogoSrc(value) {
	const firstChar = value.charAt(0)
	if (firstChar === '4')
		return 'visa_logo.svg'
	return 'mastercard_logo.svg'
}

function isCardNumberValid(inputValue) {
	if (inputValue.length !== 16)
		return false
	if (inputValue.charAt(0) !== '4' && inputValue.charAt(0) !== '5')
		return false

	const sum = inputValue.split('').map(ch => parseInt(ch, 10)).reduce((a, b) => a + b, 0)

	return sum % 10 === 0
}

function validateCardNumber(value) {
	cardNumber.classList.toggle('card_input--invalid', !isCardNumberValid(value))
}

cardNumber.onblur = function (e) {
	cardNumber.classList.add('card_input--can-validate')
	validateCardNumber(e.target.value)
}
cardNumber.oninput = function (e) {
	const val = e.target.value
	document.getElementById('card_logo_id').src = getLogoSrc(val)
	validateCardNumber(val)
}
