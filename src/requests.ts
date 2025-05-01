import { StoredRegatta } from "./types";

export async function getRegatta(regattaId: string) {
    const payload = {
        "where": {
            "objectId": regattaId
        },
        "_method": "GET",
        "_ApplicationId": "myclubspot2017"
    }

    const resp = await fetch("https://theclubspot.com/parse/classes/regattas", {
        method: "POST",
        headers: {
            "content-type": "text/plain"
        },
        body: JSON.stringify(payload)
    }).then(r => r.json())
        .then(r => {
            if (r.results.length == 0) {
                return null
            } else {
                return r.results[0]
            }
        })

    return resp;
}

export async function getResults(regattaId: string, boatClass: string) {
    const url = `https://results.theclubspot.com/clubspot-results-v3/${regattaId}?boatClassIDs=${boatClass}`
    return await fetch(url)
        .then(r => r.json()).then(r => { return r })
}

export function parseRegatta(regattaId: string, data: any): StoredRegatta {
    const boatClasses = data.boatClassesArray.map((e) => e.objectId);
    return {
        name: data.name,
        regattaId,
        boatClasses
    }
}
