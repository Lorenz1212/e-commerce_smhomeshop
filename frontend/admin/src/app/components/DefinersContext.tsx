import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import api from '@@@@/api'

interface Definers {
  [key: string]: number | string;
}

interface DefinersContextProps {
  definers: Definers;
  loading: boolean;
}

const DefinersContext = createContext<DefinersContextProps>({
  definers: {},
  loading: true,
});

export const useDefiners = () => useContext(DefinersContext);

interface ProviderProps {
  children: ReactNode;
}

export const DefinersProvider = ({ children }: ProviderProps) => {
  const [definers, setDefiners] = useState<Definers>({});
  const [loading, setLoading] = useState(true);

  const fetchData = async function(){
  try {
    const response = await api.get('/definers');
    const result = response.data;

    const defs: Definers = {};
    result.forEach((d:any) => {
        defs[d.name_code] = d.value;
    });
    setDefiners(defs);
    setLoading(false);
  } catch (error) {
    setLoading(false)
  }
}

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DefinersContext.Provider value={{ definers, loading }}>
      {children}
    </DefinersContext.Provider>
  );
};
