export interface VatValidationService {
    validateVat(input: VatValidationInput): Promise<VatValidationResult>
}

export type VatValidationInput = {
    /**
     * ISO 3611 alpha-2
     */
    countryCode: string
    /**
     * Vat Number
     */
    vatNumber: string
}

export type VatValidationResult = {
    countryCode: string
    vatNumber: string
    requestDate: string
    valid: boolean
    name: string
    address: string
}