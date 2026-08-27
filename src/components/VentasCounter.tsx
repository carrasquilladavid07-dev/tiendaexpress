// src/components/VentasCounter.tsx
import { useState } from 'react';

function VentasCounter() {
  const [ventas, setVentas] = useState(0);
  const [cajaAbierta, setCajaAbierta] = useState(true);
  const [mensaje, setMensaje] = useState('');

  const registrarVenta = () => {
    setVentas((v) => v + 1);
  };

  const registrarCombo = () => {
    setVentas((v) => v + 3);
  };

  const anularUltima = () => {
    setVentas((v) => (v > 0 ? v - 1 : 0));
  };

  const cerrarCaja = () => {
    setVentas(0);
    setCajaAbierta(false);
  };

  const reabrirCaja = () => {
    setVentas(0);
    setCajaAbierta(true);
  };

  return (
    <div className="p-3">
      <h5 className="card-title">
        Ventas del día: <strong>{ventas}</strong>
      </h5>

      <span
        className={`badge ${
          cajaAbierta ? 'bg-success' : 'bg-secondary'
        }`}
      >
        {cajaAbierta ? 'Caja abierta' : 'Caja cerrada'}
      </span>

      <div className="d-flex gap-2 mt-3 flex-wrap">
        <button
          className="btn btn-primary"
          disabled={!cajaAbierta}
          onClick={registrarVenta}
        >
          +1 venta
        </button>

        <button
          className="btn btn-info"
          disabled={!cajaAbierta}
          onClick={registrarCombo}
        >
          Combo (+3)
        </button>

        <button
          className="btn btn-warning"
          disabled={!cajaAbierta}
          onClick={anularUltima}
        >
          Anular última
        </button>

        <button
          className="btn btn-dark"
          disabled={!cajaAbierta}
          onClick={cerrarCaja}
        >
          Cerrar caja
        </button>

        {!cajaAbierta && (
          <button
            className="btn btn-success"
            onClick={reabrirCaja}
          >
            Reabrir caja
          </button>
        )}
      </div>

      {mensaje && (
        <div className="alert alert-info mt-3 mb-0">
          {mensaje}
        </div>
      )}
    </div>
  );
}

export default VentasCounter;