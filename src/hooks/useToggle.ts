// src/hooks/useToggle.ts
import { useState } from 'react';

export function useToggle(inicial = false) {
  const [valor, setValor] = useState(inicial);
  const alternar = () => setValor((anterior) => !anterior);
  return [valor, alternar] as const;
}
