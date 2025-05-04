import React from 'react';
import SearchBar from './SearchBar';

function Splash({ addRegatta }) {
  return <div className="splash">
    <h1>
      Scoreview
    </h1>
    <SearchBar addRegatta={addRegatta} />
  </div>

}

export default Splash
