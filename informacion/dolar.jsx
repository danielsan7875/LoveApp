import { useEffect, useState } from 'react';

export default function TasaOficial() {
  const [tasa, setTasa] = useState(null);

  useEffect(() => {
    const fetchTasa = async () => {
      try {
        const response = await fetch('https://ve.dolarapi.com/v1/dolares/oficial');
        const data = await response.json();
        const promedio = data.promedio;
        setTasa(promedio.toFixed(2)); // Redondea a 2 decimales
      } catch (error) {
        console.error('Error al obtener la tasa oficial:', error);
        setTasa(null);
      }
    };

    fetchTasa();
  }, []);

  return tasa;
}
