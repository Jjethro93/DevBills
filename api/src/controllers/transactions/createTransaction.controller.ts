import { FastifyReply, FastifyRequest } from "fastify";
import { CreateTransactionQuery, createTransactionSchema } from "../../schemas/transaction.schema";
import prisma from "../../config/prisma";


const createTransaction = async (request:FastifyRequest <{Body: CreateTransactionQuery}>, reply:FastifyReply):Promise<void> => {
    const userId = request.userId

    if(!userId){
        return reply.status(401).send({error:"Unauthorized"})
    }

   const result = createTransactionSchema.safeParse(request.body)

   if(!result.success){
    const errorMessage = result.error.issues[0].message || "Validação invalida";
    return reply.status(400).send({error: errorMessage})
   }


   const transaction = result.data


   try {
    
    const category = await prisma.category.findFirst({
        where:{
            id: transaction.categoryId,
            type: transaction.type,
        },
    });

    if(!category){
       return reply.status(400).send({error:"Categoria Invalida!"})

    }

    const parsedDate = new Date(transaction.date);

    const newTransaction = await prisma.transaction.create({
        data:{
            ...transaction,
            userId,
            date: parsedDate,
        },

        include:{
            category: true,
        },
    });

    reply.status(201).send(newTransaction)

   } catch (error) {
    request.log.error({ error }, "Error creating transaction:");
    reply.status(500).send({error:"Erro interno do servidor" })
   }
    //validacao dos dados de entrada
};


export default createTransaction;