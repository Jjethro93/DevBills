import { useEffect, useState } from "react";
import MonthYearSelect from "../components/MonthYearSelect";
import { getTransactions, getTransactionsHistory, getTransactionSummary } from "../services/transactionService";
import type { MonthlyTransaction, TransactionSummary } from "../types/transactions";
import Card from "../components/Card";
import { ArrowUp, TrendingUp, Wallet, Calendar } from "lucide-react"
import { formatCurrency } from "../utils/formatter";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, CartesianGrid, XAxis, YAxis, Legend, Bar, Rectangle } from "recharts"
import type { ValueType } from "recharts/types/component/DefaultTooltipContent";


const initialSummary: TransactionSummary = {
    balance: 0,
    totalExpenses: 0,
    totalIncomes: 0,
    expensesByCategory: [],
}
const Dashboard = () => {

    const currentDate = new Date();
    const [year, setYear] = useState<number>(currentDate.getFullYear() - 1);
    const [month, setMonth] = useState(currentDate.getMonth());
    const [summary, setSummary] = useState<TransactionSummary>(initialSummary)
    const [monthlyTransactionData, setMonthlyTransactionData] = useState<MonthlyTransaction[]>([])

    useEffect(() => {
        async function loadTransactionSummary() {
            const response = await getTransactionSummary(month, year);

            console.log(response)

            setSummary(response);
        }

        loadTransactionSummary();
    }, [month, year]);


    useEffect(() => {
        async function loadTransactionHistory() {
            const response = await getTransactionsHistory(month, year);

            console.log(response)

            setMonthlyTransactionData(response.history);
        }

        loadTransactionHistory();
    }, [month, year]);



    const renderPieChatLabel = ({ name, percent }: { name?: string; percent?: number }) =>
        `${name}: ${((percent ?? 0) * 100).toFixed(1)}%`;

    const formatTooltipValue = (value: ValueType | undefined) =>
        formatCurrency(typeof value === "number" ? value : 0);

    return (
        <div className="container-app py-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h1 className="text-2xl font-bold mb-4 md:mb-0">Dashboard</h1>
                <MonthYearSelect month={month} year={year} onMonthChange={setMonth} onYearChange={setYear} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card
                    icon={<Wallet size={20} className="text-primary-500" />}
                    title="Saldo"
                    hover
                    glowEffect={summary.balance > 0}
                >

                    <p className={`text-2xl font-semibold mt-2
                ${summary.balance > 0 ? "text-green-500" : "text-red-600"}
            `}
                    >
                        {formatCurrency(summary.balance)}
                    </p>

                </Card>



                <Card
                    icon={<ArrowUp size={20} className="text-primary-500" />}
                    title="Receitas"
                    hover

                >

                    <p className="text-2xl font-semibold mt-2 text-green-500">
                        {formatCurrency(summary.totalIncomes)}
                    </p>

                </Card>




                <Card
                    icon={<Wallet size={20} className="text-red-600" />}
                    title="Despesas"
                    hover
                >

                    <p className="text-2xl font-semibold mt-2 text-red-600">
                        {formatCurrency(summary.totalExpenses)}
                    </p>

                </Card>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 mt-3">
                <Card icon={<TrendingUp size={20} className="text-primary-500" />}
                    title="Despesas por Categoria"
                    className="min-h-80"
                    hover
                >
                    {summary.expensesByCategory.length > 0 ? (
                        <div className="h-72 mt-4">
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={summary.expensesByCategory}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        dataKey="amount"
                                        nameKey="categoryName"
                                        label={renderPieChatLabel}

                                    >
                                        {summary.expensesByCategory.map((entry) => (
                                            <Cell
                                                key={entry.categoryId}
                                                fill={entry.categoryColor}
                                            />
                                        ))}
                                    </Pie>

                                    <Tooltip formatter={formatTooltipValue} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>) : (

                        <div className="flex justify-center items-center h-64 text-gray-500">
                            <p>Nenhuma despesa cadastrada nesse periodo</p>
                        </div>
                    )}


                </Card>

                <Card icon={<Calendar size={20} className="text-primary-500" />}
                    title="Histórico Mensal"
                    className="min-h-80 p-2.5"
                    hover

                >
                    <div className="h-72 mt-4">
                        {monthlyTransactionData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart
                                    data={monthlyTransactionData}
                                    margin={{left: 40}}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255 255 255 0.1)" />
                                    <XAxis dataKey="name"
                                        stroke="#94A3BB"
                                        tick={{ style: { textTransform: "capitalize", fontSize: 12 } }}

                                    />
                                    <YAxis stroke="#94A3BB" 
                                    tickFormatter={formatCurrency} 
                                    tick={{ style: { fontSize: 12 } }}
                                    />
                                    <Tooltip formatter={formatCurrency}
                                    contentStyle={{
                                     backgroundColor: "1a1a1a",
                                     borderColor: "2a2a2a",

                                    }}
                                    labelStyle={{color: "#f8f8f8"}}
                                    />
                                    <Legend />
                                    <Bar dataKey="expenses" name="Despesas" fill="#ca0404" 
                                    activeBar={<Rectangle fill= 'gray' />} 
                                    radius={[5, 5, 0, 0]}
                                    />
                                    <Bar dataKey="income" name="Receitas" fill="#37e359" 
                                    activeBar={<Rectangle fill= 'blue' />} 
                                    radius={[5, 5, 0, 0]} />

                                </BarChart>

                            </ResponsiveContainer>

                        ) : (

                            <div className="flex justify-center items-center h-64 text-gray-500">
                                <p>Nenhuma despesa cadastrada nesse periodo</p>
                            </div>

                        )}
                    </div>
                </Card>
            </div>



        </div>
    )
};

export default Dashboard;
