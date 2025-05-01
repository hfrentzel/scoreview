import React, { useEffect, useState } from 'react'
import { getResults } from './requests';
import { parseResults } from './results'
import { BoatInfo, StoredRegatta } from './types';

type TableArgs = {
  regatta: StoredRegatta
}

function Table({ regatta }: TableArgs) {
  const [results, setResults] = useState<[BoatInfo[], number[]]>([[], []]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortKey, setSortKey] = useState("Net");
  const regattaId = regatta.regattaId
  const boatClassId = regatta.boatClasses[0]

  useEffect(() => {
    const get = async () => {
      const data = await getResults(regattaId, boatClassId);
      setResults(parseResults(data));
      setIsLoading(false);
    }
    get();
  }, [])

  useEffect(() => {
    let newResults = [...results[0]];
    if (sortKey == 'Net') {
      newResults.sort((a, b) => a.net - b.net)
    } else if (sortKey == 'Total') {
      newResults.sort((a, b) => a.total - b.total)
    } else {
      const raceNum = parseInt(sortKey[1])
      newResults.sort((a, b) => a.races[raceNum - 1].place - b.races[raceNum - 1].place)
    }
    setResults([newResults, [...results[1]]])

  }, [setResults, sortKey])

  if (isLoading) {
    return <h4>Loading...</h4>
  } else {
    return (
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>Sailor</th>
            <th>Sail Number</th>
            <th
              className={sortKey == 'Net' && 'sort' || ''}
              onClick={() => setSortKey('Net')}>Net</th>
            <th
              className={sortKey == 'Total' && 'sort' || ''}
              onClick={() => setSortKey('Total')}>Total</th>
            {results && results[1].map((r) => {
              const key = `R${r}`;
              const className = sortKey == key ? 'sort' : '';
              return <th className={className}
                onClick={() => setSortKey(key)} key={key}>R{r}</th>
            })}

          </tr>
          {results && results[0].map((r) => {
            return <tr key={r.sailNumber}>
              <td>{r.place}</td>
              <td>{r.owner}</td>
              <td>{r.sailNumber}</td>
              <td>{r.net}</td>
              <td>{r.total}</td>
              {r.races.map((num) => {
                return <td key={`${num.raceNumber}_${num.place}`}>
                  {num.throwout && `[${num.place}]` || num.place}
                </td>
              })}
            </tr>
          }
          )}
        </tbody>
      </table>
    )
  }
}

export default Table
