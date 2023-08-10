import { VatValidationService } from './vat-validation.models'
import { ViesVatValidationService } from './vies/vies-vat-validation.service'

export const createVatValidationService = (): VatValidationService => new ViesVatValidationService()