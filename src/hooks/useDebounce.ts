// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(valor: T, retardo = 400): T {
  const [valorDiferido, setValorDiferido] = useState(valor);

  useEffect(() => {
    const temporizador = setTimeout(() => setValorDiferido(valor), retardo);
    return () => clearTimeout(temporizador); // limpieza: cancela el anterior
  }, [valor, retardo]);

  return valorDiferido;
}
