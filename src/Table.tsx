import React, { useEffect, useState } from 'react'
import { getResults } from './requests';
import { parseResults } from './results'
import { BoatInfo, StoredRegatta } from './types';

type TableArgs = {
  regatta: StoredRegatta
}

function Table({ regatta }: TableArgs) {
  const [results, setResults] = useState<[BoatInfo[], number[], boolean]>([[], [], false]);
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
  }, [regattaId, boatClassId])


  useEffect(() => {
    let newResults = [...results[0]];
    if (sortKey == 'Net') {
      newResults.sort((a, b) => a.net - b.net)
    } else if (sortKey == 'Total') {
      newResults.sort((a, b) => a.total - b.total)
    } else {
      const raceNum = parseInt(sortKey[1])
      newResults.sort((a, b) => {
        return (a.races.find((n) => n.raceNumber == raceNum)?.place ?? 10000) -
          (b.races.find((n) => n.raceNumber == raceNum)?.place ?? 10000)
      })
    }
    setResults([newResults, [...results[1]], results[2]])

  }, [setResults, sortKey])

  if (isLoading) {
    return <h4>Loading...</h4>
  } else {
    return (
      <table>
        <thead>
          <tr>
            <th></th>
            <th className="sticky">Sailor</th>
            <th>Sail Number</th>
            <th
              className={sortKey == 'Net' && 'sort' || ''}
              onClick={() => setSortKey('Net')}>Net</th>
            {results[2] && <th
              className={sortKey == 'Total' && 'sort' || ''}
              onClick={() => setSortKey('Total')}>Total</th>
            }
            {results && results[1].map((r) => {
              const key = `R${r}`;
              const className = sortKey == key ? 'sort' : '';
              return <th className={className}
                onClick={() => setSortKey(key)} key={key}>{key}</th>
            })}
          </tr>
        </thead>
        <tbody>
          {results && results[0].map((r) => {
            return <tr key={r.sailNumber}>
              <td>{r.place}</td>
              <td className='sticky'>{r.owner}</td>
              <td>{r.sailNumber}</td>
              <td>{r.net}</td>
              {results[2] && <td>{r.total}</td>}
              {results[1].map((raceNum) => {
                const num = r.races.find((n) => n.raceNumber == raceNum);
                if (num == undefined) {
                  return <td key={`${raceNum}_${r.sailNumber}`} title={`-`}>
                    -
                  </td>
                }
                const display = num.letterScore || num.place;
                return <td key={`${num.raceNumber}_${num.place}`}
                  title={`${num.place}`}>
                  {num.throwout && `[${display}]` || display}
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
