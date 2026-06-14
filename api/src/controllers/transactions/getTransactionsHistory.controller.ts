import { FastifyReply, FastifyRequest } from "fastify";
import { GetTransactionHistoryQuery } from "../../schemas/transaction.schema";
import dayjs from "dayjs";
import prisma from "../../config/prisma";
import "dayjs/locale/pt-br";
import utc from "dayjs/plugin/utc";


dayjs.locale("pt-br");
dayjs.extend(utc);

export const getTransactionsHistory = async (

    request: FastifyRequest <{ Querystring: GetTransactionHistoryQuery}>,
    reply: FastifyReply 
) : Promise<void> =>{

 const userId = request.userId

    if(!userId){
        return reply.status(401).send({error:"Unauthorized"})
    }

const{month, year, lengthMonths = 6}= request.query

const basDate = new Date(year, month-1, 1)

const startDate = dayjs.utc(basDate).subtract(lengthMonths-1, "month").startOf("month").toDate();
const endDate = dayjs.utc(basDate).endOf("month").toDate();

try {
    const transactions = await prisma.transaction.findMany({
        where:{
            userId,
            date:{
                gte: startDate,
                lte: endDate,
            },
        },
        select:{
            amount: true,
            type: true,
            date: true,
        }

       
    }); 
    
    const monthlyData = Array.from({length:lengthMonths}, (_,i)=>{
        const date = dayjs.utc(basDate).subtract(lengthMonths-1-i, "month")
    
    return {
        name: date.format("MMM/YYYY"),
        income: 0,
        expenses: 0
    };
    
    
    });

    transactions.forEach( transaction =>{

        const monthKey = dayjs.utc(transaction.date).format("MMM/YYYY");

        const monthData = monthlyData.find(m => m.name === monthKey);

        if(monthData){
            if(transaction.type === "income"){
                monthData.income += transaction.amount;
            } else{
                monthData.expenses += transaction.amount;
            }
        }
    
});


reply.send({history: monthlyData})

} catch (error) {}

};