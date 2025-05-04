import React, { KeyboardEvent, useState, useEffect } from 'react';
import { getRegatta, parseRegatta } from './requests';

function SearchBar({ addRegatta }) {
  const [url, setUrl] = useState("")
  const [error, setError] = useState("")

  const lookUpRegatta = async () => {
    const search = /(?:https:\/\/)?.*\/regatta\/(\w+)(?:\/results)?/.exec(url);
    if (search == null) {
      setError('Failed to parse URL')
      return
    }
    const regattaId = search[1]
    await getRegatta(regattaId).then(r => {
      if (r == null) {
        setError('Regatta not found');
        return;
      }
      parseRegatta(regattaId, r).then(regatta => {

        addRegatta(regatta)
        setUrl("");
      });
    }
    )
  }

  useEffect(() => {
    console.log(error)
  }, [error])

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key == "Enter") {
      lookUpRegatta();
    }
  }

  return <div>
    <p>Enter a regatta URL to pull up results</p>
    <div className="url-search" >
      <input
        value={url}
        onChange={e => setUrl(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button onClick={lookUpRegatta}>Submit</button>
    </div>
    {error && <p className="input-error">{error}</p>}
  </div>
}

export default SearchBar;
