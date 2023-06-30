export interface ResponseEndpointAgreementDto {
  name: string;
  number: string;
  status: string;
  signature_date: string;
  validity_date: string;
  estimated_cost: number;
  covenant_cnpj: string;
  city_code: string | null;
  updated_at: string;
  id: number;
  admin: {
    name: string;
    email: string;
    id: number;
  };
  groups: [
    {
      agreement_id: number;
      name: string;
      id: number;
      group_items: [
        {
          agreement_id: number;
          group_id: number;
          code: number;
          title: string;
          description: string;
          unit: string;
          classification: string | null;
          quantity: number;
          estimated_cost: number;
          id: number;
        },
        {
          agreement_id: number;
          group_id: number;
          code: number;
          title: string;
          description: string;
          unit: string;
          classification: string | null;
          quantity: number;
          estimated_cost: number;
          id: number;
        }
      ];
    }
  ];
}
