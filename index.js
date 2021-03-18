// Base input *abstract* class for extending (already regretting about not using typescript)
class Input {
	constructor(htmlInput, nextFocusInput = undefined) {
		this.input = htmlInput

		htmlInput.onblur = (e) => {
			const val = e.target.value
			// enables validation on input blur
			this.enableValidation()
			this.validate(val)
		}

		htmlInput.oninput = (e) => {
			const val = e.target.value
			this.validate(val)
			if (nextFocusInput && this.canNextFocus(e.target.value)) {
				nextFocusInput.focus()
			}
			this.onInput(val)
		}
	}

	// events
	onInput(value) {
	}

	// validation methods
	setInputValid(isValid) {
		this.input.classList.toggle('card_input--invalid', !isValid)
	}

	validate(value) {
		this.setInputValid(this.isValid(value))
	}

	enableValidation(enable = true) {
		this.input.classList.toggle('card_input--can-validate', enable)
	}

	// replace this in child classes with your own logic
	isValid(value) {
		return true
	}

	canNextFocus(value) {
		return this.isValid(value)
	}

	// manually set value of input, for example, when formatting card or phone number
	setInputValue(newValue) {
		this.input.value = newValue
	}
}

function changeCardLogo(value) {
	const firstChar = value.charAt(0)
	let src = ''
	if (firstChar === '4')
		src = 'assets/visa_logo.svg'
	else if (firstChar === '5')
		src = 'assets/mastercard_logo.svg'
	document.getElementById('card_logo_id').src = src
}

// Luhn check if card number is valid
const luhnCheck = (function (arr) {
	return function (ccNum) {
		let
			len = ccNum.length,
			bit = 1,
			sum = 0,
			val

		while (len) {
			val = parseInt(ccNum.charAt(--len), 10)
			sum += (bit ^= 1) ? arr[val] : val
		}

		return sum && sum % 10 === 0
	}
}([0, 2, 4, 6, 8, 1, 3, 5, 7, 9]))

// Input classes

// Card input class
class CardInput extends Input {
	constructor(...args) {
		super(...args)
	}

	static formatCardNumber(value) {
		const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
		const matches = v.match(/\d{4,16}/g)
		const match = matches && matches[0] || ''
		const parts = []

		for (let i = 0, len = match.length; i < len; i += 4) {
			parts.push(match.substring(i, i + 4))
		}

		return parts.length ? parts.join(' ') : value
	}

	hasValidLength(value) {
		return value.replaceAll(/\s/g, '').length === 16
	}

	isValid(value) {
		return this.hasValidLength(value) && luhnCheck(value.replaceAll(/\s/g, ''))
	}

	onInput(value) {
		changeCardLogo(value)
		this.setInputValue(CardInput.formatCardNumber(value))
		if (this.hasValidLength(value))
			this.enableValidation()
	}
}

// CSC (CVV) input class
class CSCInput extends Input {
	constructor(...args) {
		super(...args)
	}

	hasValidLength(value) {
		return value.length === 3
	}

	isValid(value) {
		return value.match(/^[0-9]{3}$/g)
	}

	onInput(value) {
		if (this.hasValidLength(value))
			this.enableValidation()
	}
}

// Base class for year and month inputs
class ExpireDateInputBase extends Input {
	constructor(...args) {
		super(...args)
		this.parent = this.input.parentNode
	}

	setInputValid(isValid) {
		this.parent.classList.toggle('card_input--invalid', !isValid)
		super.setInputValid(isValid)
	}

	enableValidation(enable = true) {
		this.parent.classList.toggle('card_input--can-validate', enable)
		super.enableValidation(enable)
	}

	hasValidLength(value) {
		return value.length >= 1 && value.length <= 2
	}

	isValid(value) {
		return value.match(/\d+/g) && this.hasValidLength(value)
	}

	canNextFocus(value) {
		return super.canNextFocus(value) && value.length === 2
	}

	onInput(value) {
		if (this.hasValidLength(value))
			this.enableValidation()
	}
}

// Month expire input class
class MonthInput extends ExpireDateInputBase {
	constructor(...args) {
		super(...args)
	}

	isValid(value) {
		return super.isValid(value) && value >= 1 && value <= 12
	}
}

// Year expire input class
class YearInput extends ExpireDateInputBase {
	constructor(...args) {
		super(...args)
	}

	isValid(value) {
		return super.isValid(value) && value >= 0 && value <= 99
	}
}

const ccNumberDom = document.getElementById('frmCCNum')
const ccMonthDom = document.getElementById('frmCCMonth')
const ccYearDom = document.getElementById('frmCCYear')
const ccCscDom = document.getElementById('frmCCCsc')

new CardInput(ccNumberDom, ccMonthDom)
new MonthInput(ccMonthDom, ccYearDom)
new YearInput(ccYearDom, ccCscDom)
new CSCInput(ccCscDom, document.getElementById('frmCCBtn'))
