import { XmlElement } from 'jstoxml'
import { SoapClient } from '../../soap/soap-client'
import {
    VatValidationInput,
    VatValidationResult,
    VatValidationService,
} from '../vat-validation.models'
import {
    ViesCheckVatResponseData,
    ViesCheckVatResponseDataBody,
} from './vies-vat-validation.models'

interface ViesCheckVatRequestData extends XmlElement {
    _content: {
        'soapenv:Header': Record<string, never>
        'soapenv:Body': {
            'urn:checkVat': {
                'urn:countryCode': string
                'urn:vatNumber': string
            }
        }
    }
}

const ROOT = 'soapenv:Envelope'

const ROOT_ATTRIBUTES = {
    'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
    'xmlns:urn': 'urn:ec.europa.eu:taxud:vies:services:checkVat:types',
}

const CHECK_VAT_ACTION = 'checkVat'

const VIES_SOAP_SERVICE_BASE_URL =
    'http://ec.europa.eu/taxation_customs/vies/services/checkVatService'

export class ViesVatValidationService
    extends SoapClient
    implements VatValidationService
{
    constructor() {
        super({ soapWsdlServiceUrl: VIES_SOAP_SERVICE_BASE_URL })
    }

    public async validateVat(
        input: VatValidationInput,
    ): Promise<VatValidationResult> {
        const { countryCode, vatNumber } = input

        const body: ViesCheckVatRequestData = {
            _name: ROOT,
            _attrs: ROOT_ATTRIBUTES,
            _content: {
                'soapenv:Header': {},
                'soapenv:Body': {
                    'urn:checkVat': {
                        'urn:countryCode': countryCode,
                        'urn:vatNumber': vatNumber,
                    },
                },
            },
        }
        const response = await this.action<
            ViesCheckVatRequestData,
            ViesCheckVatResponseData
        >(CHECK_VAT_ACTION, body)

        return this.parseResponse(response)
    }

    private parseResponse(
        response: ViesCheckVatResponseData,
    ): VatValidationResult {
        // console.log(JSON.stringify(response, null, 2))

        const checkVatResponse = response.elements[0].elements.find(
            x => x.name === 'env:Body',
        )

        if (!checkVatResponse || checkVatResponse.name !== 'env:Body') {
            throw new Error('Invalid response')
        }

        const { elements } = checkVatResponse.elements[0]

        return {
            countryCode: this.requiredElement(elements, 'ns2:countryCode'),
            vatNumber: this.requiredElement(elements, 'ns2:vatNumber'),
            requestDate: this.requiredElement(elements, 'ns2:requestDate'),
            valid: this.requiredElement(elements, 'ns2:valid') === 'true',
            name: this.requiredElement(elements, 'ns2:name'),
            address: this.requiredElement(elements, 'ns2:address'),
        }
    }

    private requiredElement(
        elements: ViesCheckVatResponseDataBody['elements'][0]['elements'],
        name: ViesCheckVatResponseDataBody['elements'][0]['elements'][number]['name'],
    ): string {
        const element = elements.find(x => x.name === name)

        if (!element) throw new Error('Invalid response')

        return element.elements[0].text
    }
}
