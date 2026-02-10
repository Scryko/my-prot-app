import React, { useState, useEffect } from 'https://esm.sh/react@18.2.0';
import ReactDOM from 'https://esm.sh/react-dom@18.2.0/client';

const App = () => {
    const [weight, setWeight] = useState(75);
    const [consumed, setConsumed] = useState(0);
    const [scanning, setScanning] = useState(false);

    const goal = weight * 2;

    const scanProduct = () => {
        setScanning(true);
        setTimeout(() => {
            const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
            scanner.render((text) => {
                fetch(`https://world.openfoodfacts.org/api/v0/product/${text}.json`)
                    .then(r => r.json())
                    .then(d => {
                        if(d.status === 1) {
                            const p = d.product.nutriments.proteins_100g || 0;
                            const qty = prompt(`Produit: ${d.product.product_name}\nProt pour 100g: ${p}g\nCombien de grammes mangés ?`, "100");
                            if(qty) setConsumed(prev => prev + (p * qty / 100));
                            scanner.clear();
                            setScanning(false);
                        }
                    });
            });
        }, 100);
    };

    return (
        <div className="p-5 max-w-md mx-auto">
            <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-lg mb-5">
                <h1 className="text-xl font-bold">Objectif: {goal}g</h1>
                <div className="text-4xl font-black mt-2">{consumed.toFixed(1)}g</div>
                <div className="w-full bg-blue-400 h-2 rounded-full mt-4">
                    <div style={{width: `${Math.min(consumed/goal*100, 100)}%`}} className="bg-white h-full rounded-full"></div>
                </div>
            </div>

            <button onClick={scanProduct} className="w-full bg-black text-white p-4 rounded-2xl font-bold mb-4">📷 Scanner un produit</button>
            {scanning && <div id="reader" className="mb-4"></div>}
            
            <div className="bg-white p-4 rounded-2xl shadow">
                <label className="text-sm text-gray-500">Ton poids (kg)</label>
                <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="w-full text-xl font-bold outline-none" />
            </div>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);