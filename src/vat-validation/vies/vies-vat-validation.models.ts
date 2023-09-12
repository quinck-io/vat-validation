export type ViesCheckVatResponseDataHeader = {
    type: 'element'
    name: 'env:Header'
}

export type ViesCheckVatResponseDataBody = {
    type: 'element'
    name: 'env:Body'
    elements: [
        {
            type: 'element'
            name: 'ns2:checkVatResponse'
            attributes: {
                'xmlns:ns2': 'urn:ec.europa.eu:taxud:vies:services:checkVat:types'
            }
            elements: [
                {
                    type: 'element'
                    name: 'ns2:countryCode'
                    elements: [
                        {
                            type: 'text'
                            text: string
                        },
                    ]
                },
                {
                    type: 'element'
                    name: 'ns2:vatNumber'
                    elements: [
                        {
                            type: 'text'
                            text: string
                        },
                    ]
                },
                {
                    type: 'element'
                    name: 'ns2:requestDate'
                    elements: [
                        {
                            type: 'text'
                            text: string
                        },
                    ]
                },
                {
                    type: 'element'
                    name: 'ns2:valid'
                    elements: [
                        {
                            type: 'text'
                            text: string
                        },
                    ]
                },
                {
                    type: 'element'
                    name: 'ns2:name'
                    elements: [
                        {
                            type: 'text'
                            text: string
                        },
                    ]
                },
                {
                    type: 'element'
                    name: 'ns2:address'
                    elements: [
                        {
                            type: 'text'
                            text: string
                        },
                    ]
                },
            ]
        },
    ]
}

export interface ViesCheckVatResponseData {
    elements: [
        {
            type: 'element'
            name: 'env:Envelope'
            attributes: {
                'xmlns:env': 'http://schemas.xmlsoap.org/soap/envelope/'
            }
            elements: [
                ViesCheckVatResponseDataHeader,
                ViesCheckVatResponseDataBody,
            ]
        },
    ]
}
