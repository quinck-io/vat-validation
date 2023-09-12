import axios, { AxiosInstance } from 'axios'
import { toXML, XmlElement, XmlOptions } from 'jstoxml'
import { xml2json } from 'xml-js'

const XML_OPTIONS: XmlOptions = {
    header: false,
    indent: '  ',
}

const DEFAULT_HEADERS = {
    'Content-Type': 'text/xml;charset=UTF-8',
}

export type SoapClientParams = {
    soapWsdlServiceUrl: string
}

export class SoapClient {
    private readonly connection: AxiosInstance

    constructor({ soapWsdlServiceUrl }: SoapClientParams) {
        this.connection = axios.create({
            baseURL: soapWsdlServiceUrl,
            headers: DEFAULT_HEADERS,
        })
    }

    public async action<Request extends XmlElement, Response>(
        name: string,
        body: Request,
    ): Promise<Response> {
        const xmlBody = toXML(body, XML_OPTIONS)
        const response = await this.connection.post<Response>('', xmlBody, {
            headers: {
                SOAPAction: name,
            },
            transformResponse: [data => this.xml2json<Response>(data)],
        })
        return response.data
    }

    private xml2json = <ResultType>(xml: string): ResultType =>
        JSON.parse(xml2json(xml)) as unknown as ResultType
}
