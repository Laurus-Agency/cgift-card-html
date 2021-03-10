const cardNumber = document.getElementById('frmCCNum')

function getLogoSrc(value) {
	const firstChar = value.charAt(0)
	if (firstChar === '4')
		return 'visa_logo.svg'
	return 'mastercard_logo.svg'
}

function ccFormat(value) {
	const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
	const matches = v.match(/\d{4,16}/g)
	const match = matches && matches[0] || ''
	const parts = []

	for (let i = 0, len = match.length; i < len; i += 4) {
		parts.push(match.substring(i, i + 4))
	}

	return parts.length ? parts.join(' ') : value
}

const luhnCheck = (function (arr) {
	return function (ccNum) {
		let
			len = ccNum.length,
			bit = 1,
			sum = 0,
			val;

		while (len) {
			val = parseInt(ccNum.charAt(--len), 10);
			sum += (bit ^= 1) ? arr[val] : val;
		}

		return sum && sum % 10 === 0;
	};
}([0, 2, 4, 6, 8, 1, 3, 5, 7, 9]));

function isCardNumberValid(value) {
	const inputValue = value.replaceAll(/\s/g,'')

	if (inputValue.length !== 16)
		return false

	return luhnCheck(inputValue)
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
	cardNumber.value = ccFormat(val)
}
