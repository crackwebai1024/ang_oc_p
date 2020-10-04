import { CreditAppSummary } from "../../forms/shared/models/credit-app-summary";

export interface PagedResult {
    data?: Array<CreditAppSummary>;
    currentPage: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
}