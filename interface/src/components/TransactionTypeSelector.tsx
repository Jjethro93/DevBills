import { TransactionType } from "../types/transactions"

interface TransactionTypeSelectionProps{
    value: TransactionType;
    id?: string;
    onChange: (type: TransactionType)=>void;
}


const TransactionTypeSelector = ({value, onChange,id}:TransactionTypeSelectionProps)=>{

    const transactionsTypeButtons = [
        {
            type: TransactionType.EXPENSE,
            label: "Despesas",
            activeClasses: 'bg-red-700 border-red-700 text-white font-medium',
            inativeClasses:'bg-tranpparent border-red-700 text-red-700 hover:bg-red-50'

        },

        {
            type: TransactionType.INCOME,
            label: "Receita",
            activeClasses: 'bg-green-500 border-green-600 text-[#051626] font-medium',
            inativeClasses:'bg-tranpparent border-green-300 text-green-500 hover:bg-green-50'

        },
    ]



        return(
            <fieldset id={id} className = "grid grid-cols-2 gap-4">
                

                {transactionsTypeButtons.map((item) =>(
                    <button key = {item.type} 
                    type="button"
                    onClick ={()=> onChange(item.type)}
                    className={`cursor-pointer flex items-center justify-center border rounded-md py-2 px-4 transition-all
                        ${value===item.type? item.activeClasses: item.inativeClasses}`}
                    > {item.label}  </button>
                )

                ) }
                
            </fieldset>
        );


};



export default TransactionTypeSelector