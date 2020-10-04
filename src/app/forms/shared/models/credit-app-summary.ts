export interface CreditAppSummary {
  id: string;
  clientID?: string;
  customerName: string;
  customerNumber?: string;
  customerID?: number;
  templateName: string;
  referenceNumber?: number;
  createdByUserName: string;
  createdByUserFullName: string;
  createdDate: Date;
  submittedDate: Date;
  status: string;
  assignedAdmin: string;
  statusDisplayName?: string;
  docuSignEnvelopeID?: string;
}
