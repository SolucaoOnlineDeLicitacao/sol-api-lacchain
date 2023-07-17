export enum ModelContractTagsEnum {

  //supplier
  supplierName = "supplier_name",
  supplierId = "supplier_id",
  supplierAddress = "supplier_address",
  supplierZipCode = "supplier_zip_code",
  supplierMunicipality = "supplier_municipality",
  supplierState = "supplier_state",
  supplierLegalRepresentativeName = "supplier_legal_representative_name",
  supplierLegalRepresentativeId = "supplier_legal_representative_id",
  supplier_legal_representative_address = "supplier_legal_representative_address",
  supplier_legal_representative_supplier_municipality = "supplier_legal_representative_supplier_municipality",
  supplier_legal_representative_supplier_state = "supplier_legal_representative_supplier_state",
  
  //Association
  associationName = "association_name",
  associationId = "association_id",
  associationAddress = "association_address",
  associationZipCode = "association_zip_code",
  associationMunicipality = "association_municipality",
  associationState = "association_state",
  associationLegalRepresentativeName = "association_legal_representative_name",
  associationLegalRepresentativeId = "association_legal_representative_id",
  associationLegalRepresentativeAddress = "association_legal_representative_address",
  associationLegalRepresentativeSupplierMunicipality = "association_legal_representative_supplier_municipality",
  associationLegalRepresentativeSupplierState = "association_legal_representative_supplier_state",

  //Agreement
  covenantNumber = 'covenant_number',
  covenantObject = 'covenant_object',
  municipalityExecutionCovenant = 'municipality_execution_covenant',

  //bid
  numberYearBidding = 'number_year_bidding',
  guestSupplier = 'guest_supplier',
  proposedList = 'proposed_list',
  winningSupplier = 'winning_supplier',
  batchList = 'batch_list',

  //lots
  batchCompleteList = 'batch_complete_list',
  batchSpecificationList = 'batch_specification_list',

  //contract
  contractNumber = 'contract_number',
  signatureAssociation = 'signature_association',
  signatureSupplier = 'supplier_signature',
  supplier = 'supplier',
  documentcontractDate = 'documentcontract_date',
  documentMinutes = 'document_minutes',
  documentNoticedate = 'document_notice_date',


}
