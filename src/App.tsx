import React, { useCallback, useState } from 'react';
import Splash from './Splash';
import Table from './Table';
import Menu from './Menu';
import { StoredRegatta } from './types';

function App() {
  const [savedRegattas, setStoredRegattas] = useState<StoredRegatta[]>(
    JSON.parse(localStorage.getItem("savedRegattas") || "[]"));
  const [savedIndex, setSavedIndex] = useState<number>(
    parseInt(localStorage.getItem('savedIndex') || '0'));

  const addRegatta = useCallback((regatta: StoredRegatta) => {
    const newRegattas = [regatta, ...savedRegattas]
    localStorage.setItem("savedRegattas", JSON.stringify(newRegattas))
    setStoredRegattas(newRegattas);
    setSavedIndex(0);
    localStorage.setItem("savedIndex", '0');
  }, [savedRegattas])

  const selectRegatta = useCallback((index: number) => {
    setSavedIndex(index);
    localStorage.setItem("savedIndex", index.toString())
  }, []);

  if (savedRegattas.length == 0) {
    return <Splash
      addRegatta={addRegatta}
    />
  } else {
    return <div>
      <div id="header">
        <h3>{savedRegattas[savedIndex].name}</h3>
        <Menu 
          addRegatta={addRegatta}
          savedRegattas={savedRegattas} 
          selectRegatta={selectRegatta}
        />
      </div>
      <Table
        regatta={savedRegattas[savedIndex]}
      />
    </div>
  }
}

export default App
