import type { CreateTransactionDTO, MonthlyTransaction, Transaction, TransactionFilter, TransactionSummary } from "../types/transactions";
import { api } from "./api";

export const getTransactions = async (filter?: Partial< TransactionFilter>): Promise< Transaction[]> => {


   const response = await api.get< Transaction[]> ("/transactions", {params: filter, });
   
   return response.data;

};

export const getTransactionSummary = async (month: number, year: number): Promise< TransactionSummary> =>{
    const response = await api.get<TransactionSummary>("/transactions/summary", {
        params:{month, year},

    });

    return response.data;

};



export const getTransactionsHistory = async (
    month: number,
    year: number,
    lengthMonths?: number
): Promise <{ history: MonthlyTransaction[] }> =>{

    const response = await api.get("/transactions/history", {
        params:{
            month,
            year,
            lengthMonths,
        },
    });

    return response.data
};



export const deleteTransactions = async(id:string):Promise<void>=>{
    await api.delete(`/transactions/${id}`);
};


export const createTransaction = async(
    transactionData:CreateTransactionDTO): Promise<Transaction> =>{
    const response = await api.post<Transaction>("transactions", transactionData)
    return response.data
};
