import React, { useCallback, useState } from 'react';
import Splash from './Splash';
import Table from './Table';
import { StoredRegatta } from './types';

function App() {
  const [savedRegattas, setStoredRegattas] = useState<StoredRegatta[]>(
    JSON.parse(localStorage.getItem("savedRegattas") || "[]"));

  const addRegatta = useCallback((regatta: StoredRegatta) => {
    const newRegattas = [...savedRegattas, regatta]
    localStorage.setItem("savedRegattas", JSON.stringify(newRegattas))
    setStoredRegattas(newRegattas);
  }, [savedRegattas])

  if (savedRegattas.length == 0) {
    return <Splash
      addRegatta={addRegatta}
    />
  } else {
    return <div>
      <h3>{savedRegattas[0].name}</h3>
      <Table
        regatta={savedRegattas[0]}
      />
    </div>
  }
}

export default App
