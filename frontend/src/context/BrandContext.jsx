import React, { createContext, useContext, useState } from 'react';

const BrandContext = createContext(null);

export function BrandProvider({ children }) {
  const [brandId, setBrandId] = useState(
    localStorage.getItem('brandId') ? parseInt(localStorage.getItem('brandId')) : null
  );
  const [brandData, setBrandData] = useState(null);

  const saveBrand = (id, data) => {
    setBrandId(id);
    setBrandData(data);
    localStorage.setItem('brandId', id);
  };

  return (
    <BrandContext.Provider value={{ brandId, brandData, saveBrand }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  return useContext(BrandContext);
}
