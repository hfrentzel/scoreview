import { BoatInfo } from './types';

export function parseResults(results): [BoatInfo[], number[], boolean] {
    const parsed = [] as BoatInfo[];

    const races = [] as number[];
    for (const race of results.races) {
        races.push(race.number)
    }
    races.sort()

    let has_throwouts = false;
    for (const data of results.scoresByRegistration) {
        const reggie = data.registrationObject
        const item = {} as BoatInfo
        item["sailNumber"] = reggie.sailNumber
        item["owner"] = reggie.firstName + " " + reggie.lastName;
        item["boatName"] = reggie.boatName
        item["clubName"] = reggie.clubName
        item["crew"] = reggie.participantNames.filter(x => x != item["owner"])
        item["net"] = 0
        item["total"] = 0
        item["races"] = []
        for (const race of data.scoring_data) {
            const throwout = race?.throwout ?? false
            has_throwouts ||= throwout;
            item.races.push({
                raceNumber: race.race_number,
                place: race.points,
                throwout
            })
            item.total += race.points
            if (!throwout) {
                item.net += race.points
            }
        }

        item.races.sort((a, b) => a.raceNumber - b.raceNumber)
        parsed.push(item)
    }

    parsed.sort((a, b) => a.net - b.net)
    for (const [index, p] of parsed.entries()) {
        p.place = index + 1
    }

    return [parsed, races, has_throwouts]
}
