import axios from "axios";
import _ from "lodash";
import {timestamp} from "../../lib/timestamp";

const getData = async function getData() {
    const resFFF = await axios({
        method: 'post',
        url: `https://rafffle.famousfoxes.com/foxy/raffles/10/1`,
        data: {
            "drift": 0,
            "sort": [
                "end",
                1
            ],
            "period":"current"
        },
        timeout: 3000
    })

    const filteredRaffles = _.filter(resFFF.data, (raffle) => {
        return (raffle.end - 300) > timestamp()
    })

    return _.map(filteredRaffles, (raffle) => {
        return {
            address: raffle.raffle,
            name: raffle.nft.name,
            status: 'running',
            end: raffle.end - 300,
            prize: {
                collection: raffle.nft.collection,
                image: raffle.nft.image,
            }
        }
    })
}

export default async function handler(req, res) {
    res.status(200).json(await getData())
}