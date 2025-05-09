export type RaceFinish = {
    raceNumber: number
    place: number
    throwout: boolean
    letterScore: string | null
}

export type BoatInfo = {
    boatName: string
    clubName: string
    crew: string[]
    net: number
    owner: string
    place: number
    races: RaceFinish[]
    sailNumber: string
    total: number
}

export type StoredRegatta = {
    name: string
    regattaId: string
    boatClasses: string[]
}
