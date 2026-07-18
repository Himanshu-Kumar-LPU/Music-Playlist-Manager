import { createContext, useContext, useEffect, useState } from 'react';

const WasmContext = createContext(null);

export function WasmProvider({ children }) {
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadModule() {
      try {
        const factoryModule = await import('../wasm/dsa.js');
        const factory = factoryModule.default || factoryModule;
        const instance = await factory({
          locateFile: (name) => (
            new URL(`../wasm/${name}`, import.meta.url).href
          ),
        });
        if (!cancelled) {
          setModule(instance);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      }
    }

    loadModule();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <WasmContext.Provider value={{ module, loading, error }}>
      {children}
    </WasmContext.Provider>
  );
}

export function useWasm() {
  return useContext(WasmContext);
}
