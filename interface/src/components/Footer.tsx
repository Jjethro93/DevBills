


const Footer = () =>{

    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-gray-800 border-t border-gray-700 py-4">
            <div className="container-app">
                <p className="text-sm text-gray-400 text-center">
                   DevBills {currentYear} - Desenvolvido por <strong className="text-primary-500">JETHRO SUFRA</strong> com {""}
                    <strong className="text-primary-500">TypeScript</strong> & <strong className="text-primary-500">React</strong> & <strong className="text-primary-500">Tailwind</strong>
                </p>
            </div>            
        </footer>

    );
};



export default Footer