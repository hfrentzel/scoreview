import React, { useState, useEffect, useRef } from 'react';
import { StoredRegatta } from "./types";
import burger from './assets/menu.svg';
import plus from './assets/plus.svg';
import SearchBar from './SearchBar';

type MenuArgs = {
  savedRegattas: StoredRegatta[]
  selectRegatta: (arg0: number) => void
  addRegatta: (arg0: StoredRegatta) => void
}

function Menu({ savedRegattas, selectRegatta, addRegatta }: MenuArgs) {
  const [showMenu, setShowMenu] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  const onClickOutside = (e) => {
    if (menu.current && !menu.current.contains(e.target)) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    if (showMenu) {
      document.addEventListener('mousedown', onClickOutside);
    } else {
      document.removeEventListener('mousedown', onClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [menu, showMenu]);

  const onClick = (index: number) => {
    selectRegatta(index);
    setShowMenu(false);
  }

  const openAddRegatta = () => {
    if (dialog == null || dialog.current == null) {
      return
    }
    dialog.current.showModal();
  }

  const addAndClose = (regatta: StoredRegatta) => {
    addRegatta(regatta);
    if (dialog.current) {
      dialog.current.close();
    }
    setShowMenu(false);
  }

  return <div ref={menu} id="menu-wrapper">
    <img
      onClick={() => setShowMenu(!showMenu)}
      id="menu-icon" src={burger} />
    {showMenu && <div id="regatta-menu">
      <ul onClick={() => openAddRegatta()}><img src={plus} /> Add Regatta</ul>
      {savedRegattas.map((r, i) => {
        return <ul key={r.name}
          onClick={() => onClick(i)}
        >{r.name}</ul>
      })}
    </div>}
    <dialog closedby='any' ref={dialog}>
      <SearchBar addRegatta={addAndClose} />
    </dialog>
  </div>
}

export default Menu;
