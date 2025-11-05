import { useEffect, useState } from 'react';
import axios from 'axios';

export default function TasaOficial() {
  const [tasa, setTasa] = useState(null);

  useEffect(() => {
    const fetchTasa = async () => {
      try {
        const response = await axios.get('https://ve.dolarapi.com/v1/dolares/oficial');
        const promedio = response.data.promedio;
        setTasa(promedio.toFixed(2));
      } catch (error) {
        console.error('Error al obtener la tasa oficial:', error);
        setTasa(null);
      }
    };

    fetchTasa();
  }, []); 

  return tasa;
}

