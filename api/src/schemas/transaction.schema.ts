import { z } from "zod";
import {ObjectId } from "mongodb";
import { TransactionType } from "@prisma/client";


const isValidObjectId = (id: string): boolean => ObjectId.isValid(id);

export const createTransactionSchema = z.object({

    description: z.string().min(1, "Descrição obrigatorio!"),
    amount: z.number().positive("Valor deve ser posotivo!"),
    date: z.coerce.date(),
    categoryId: z.string().refine(isValidObjectId, {
        message: "Categoria Invalida!",
    }),

    type: z.enum([TransactionType.expense, TransactionType.income], {
        errorMap: () => ({message:"Tipo de transação invalido!"})
    })

});


export const getTransactionsSchema = z.object({
    //mes, ano, type, categoryId

    month: z.string().optional(),
    year: z.string().optional(),
    type: z.enum([TransactionType.expense, TransactionType.income], {
        errorMap: () => ({message:"Tipo de transação invalido!"})
    }).optional(),
    categoryId: z.string().refine(isValidObjectId, {
        message: "Categoria Invalida!",
    }).optional(),

})

export const getTransactionsSummarySchema = z.object({
    month: z.string({message:"Mês é obrigatório!"}),
    year: z.string({message:"Ano é obrigatório!"}),
});


export const getTransactionsHistorySchema = z.object({
    month: z.coerce.number().min(1).max(12),
    year: z.coerce.number().min(2000).max(2100),
    lengthMonths: z.coerce.number().min(1).max(12).optional(),
});


export const deleteTransactionSchema = z.object({
    id: z.string().refine(isValidObjectId, {
        message: "ID Invalida!",
    }),
})


export type GetTransactionQuery = z.infer< typeof getTransactionsSchema>
export type GetTransactionHistoryQuery = z.infer< typeof getTransactionsHistorySchema>
export type CreateTransactionQuery = z.infer< typeof createTransactionSchema>
export type GetTransactionSummaryQuery = z.infer< typeof getTransactionsSummarySchema>
export type DeleteTransactionParams = z.infer< typeof deleteTransactionSchema>

// description String
//   amount      Float
//   date        DateTime
//   type        TransactionType