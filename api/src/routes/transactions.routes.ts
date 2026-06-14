import { FastifyInstance } from "fastify";
import createTransaction from "../controllers/transactions/createTransaction.controller";
import { createTransactionSchema,  deleteTransactionSchema,  getTransactionsHistorySchema,  getTransactionsSchema, getTransactionsSummarySchema } from "../schemas/transaction.schema";
import { zodToJsonSchema } from "zod-to-json-schema";
import { getTransactions } from "../controllers/transactions/getTransactions.controller";
import { getTransactionsSummary } from "../controllers/transactions/getTransactionsSummary.controller";
import { deleteTransaction } from "../controllers/transactions/deleteTransaction.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getTransactionsHistory } from "../controllers/transactions/getTransactionsHistory.controller";

const transactionRoutes = async (fastify: FastifyInstance) => {

fastify.addHook("preHandler", authMiddleware);

    // criação
    fastify.route({
        method: "POST",
        url: "/",
        schema:{
            body: zodToJsonSchema(createTransactionSchema)
        },
        handler: createTransaction,
    });


    //Buscar com filtro
fastify.route({
    method: "GET",
    url:"/",
    schema:{
        querystring: zodToJsonSchema(getTransactionsSchema)  
    },
    handler: getTransactions,
});

//Buscar o resumo
fastify.route({
    method: "GET",
    url: "/summary",
    schema:{
        querystring: zodToJsonSchema(getTransactionsSummarySchema),
    },
    handler: getTransactionsSummary, 
})


// Historico de transações
fastify.route({
    method: "GET",
    url: "/history",
    schema:{
        querystring: zodToJsonSchema(getTransactionsHistorySchema),
    },
    handler: getTransactionsHistory, 
})

//deletar uma transação
fastify.route({
    method: "DELETE",
    url:"/:id",
    schema:{
        params: zodToJsonSchema(deleteTransactionSchema),
    },
    handler: deleteTransaction,
})


};

export default transactionRoutes;
