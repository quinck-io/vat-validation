import { XmlElement } from 'jstoxml'
import { SoapClient } from '../../soap/soap-client'
import {
    VatValidationInput,
    VatValidationResult,
    VatValidationService,
} from '../vat-validation.models'

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

interface ViesCheckVatResponseData {
    'env:Envelope': {
        'env:Body': {
            'ns2:checkVatResponse': {
                'ns2:countryCode': string
                'ns2:vatNumber': string
                'ns2:requestDate': string
                'ns2:valid': boolean
                'ns2:name': string
                'ns2:address': string
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
        const checkVatResponse =
            response['env:Envelope']['env:Body']['ns2:checkVatResponse']

        return {
            countryCode: checkVatResponse['ns2:countryCode'],
            vatNumber: checkVatResponse['ns2:vatNumber'],
            requestDate: checkVatResponse['ns2:requestDate'],
            valid: checkVatResponse['ns2:valid'],
            name: checkVatResponse['ns2:name'],
            address: checkVatResponse['ns2:address'],
        }
    }
}
