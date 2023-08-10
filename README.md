# vat-validation
Utility to validate VAT numbers using [VIES](https://ec.europa.eu/taxation_customs/vies/#/technical-information) api.

## Installation
`npm i @quinck/vat-validation`

## Usage

WIP

```js
import { createVatValidationService } from '@quinck/vat-validation'

const vatValidationService = createVatValidationService()

vatValidationService.validateVat({
    countryCode: 'IT', // ISO 3611 alpha-2
    vatNumber: '01234567890' // Vat Number
})
    .then(result => {
        // do something with result
    })
    .catch(error => {
        // handle errors
    })

```

## Contact
* Quinck: info@quinck.io
* Stefano Righini: stefano.righini@quinck.io