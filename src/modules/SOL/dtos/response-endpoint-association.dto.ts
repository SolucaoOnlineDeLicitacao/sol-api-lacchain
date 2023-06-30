export interface ResponseEndpointAssociationDto {
  name: string;
  cnpj: string;
  id: number;
  address: {
    latitude: number;
    longitude: number;
    address: string;
    number: string | null;
    neighborhood: string;
    cep: string;
    complement: string | null;
    reference_point: string | null;
    city_code: string | null;
    id: number;
  };
  legal_representative: {
    entity_id: number;
    name: string;
    nationality: string | null;
    civil_state: string;
    rg: string;
    cpf: string;
    valid_until: string;
    id: number;
    address: {
      latitude: number | null;
      longitude: number | null;
      address: string;
      number: number | null;
      neighborhood: string | null;
      cep: string | null;
      complement: string | null;
      reference_point: string | null;
      city_code: string | null;
      id: number;
    };
  };
  users: [
    {
      entity_id: number;
      email: string;
      name: string;
      role: string;
      cpf: string;
      phone: string;
      id: number;
    }
  ];
}
