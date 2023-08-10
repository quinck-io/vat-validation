import { XmlElement } from 'jstoxml'
import { SoapClient } from '../../soap/soap-client'
import { VatValidationInput, VatValidationResult, VatValidationService } from '../vat-validation.models'

interface ViesCheckVatRequestData extends XmlElement {
    _content: {
        'soapenv:Header': Record<string, never>,
        'soapenv:Body': {
            'urn:checkVat': {
                'urn:countryCode': string
                'urn:vatNumber': string
            }
        }
    }
}

interface ViesCheckVatResponseData {
    'soap:Envelope': {
        'soap:Body': {
            checkVatResponse: {
                countryCode: string
                vatNumber: string
                requestDate: string
                valid: boolean
                name: string
                address: string
            }
        }
    }
}

const ROOT = 'soapenv:Envelope'

const ROOT_ATTRIBUTES = {
    'xmlns:soapenv':'http://schemas.xmlsoap.org/soap/envelope/',
    'xmlns:urn':'urn:ec.europa.eu:taxud:vies:services:checkVat:types'
}

const CHECK_VAT_ACTION = 'checkVat'

const VIES_SOAP_SERVICE_BASE_URL = 'http://ec.europa.eu/taxation_customs/vies/services/checkVatService'

export class ViesVatValidationService extends SoapClient implements VatValidationService {

    constructor() {
        super({soapWsdlServiceUrl: VIES_SOAP_SERVICE_BASE_URL})
    }

    public async validateVat(input: VatValidationInput): Promise<VatValidationResult> {
        const { countryCode, vatNumber } = input

        const body: ViesCheckVatRequestData = {
            _name: ROOT,
            _attrs: ROOT_ATTRIBUTES,
            _content: {
                'soapenv:Header': {},
                'soapenv:Body': {
                    'urn:checkVat': {
                        'urn:countryCode': countryCode,
                        'urn:vatNumber': vatNumber
                    }
                }
            }
        }
        const response = await this.action<ViesCheckVatRequestData,ViesCheckVatResponseData>(CHECK_VAT_ACTION,body)

        return response['soap:Envelope']['soap:Body'].checkVatResponse
    }

}