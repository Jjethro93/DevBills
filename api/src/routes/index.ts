import type { FastifyInstance } from "fastify";
import categoryRoutes from "./category.routes";
import transactionRoutes from "./transactions.routes";

async function routes(fastify: FastifyInstance): Promise<void> {
	fastify.get("/health", async () => {
		return {
			status: "Ok",
			message: "DevBills API is running",
		};
	});

fastify.register(categoryRoutes, {prefix:"/categories"})
fastify.register(transactionRoutes, {prefix:"/transactions"})

} // function routes

export default routes;
