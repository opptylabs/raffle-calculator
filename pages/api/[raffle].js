import axios from "axios";
import {fixBalance} from "../../lib/fix_balance";
import {timestamp} from "../../lib/timestamp";
import _ from "lodash";
import tokens from "../../lib/tokens.json";

const getData = async function getData(address) {
  const resFFF = await axios({
    method: 'get',
    url: `https://rafffle.famousfoxes.com/foxy/raffle/${address}`,
    timeout: 3000
  })

  const [resPrice, resCollection] = await Promise.all([axios({
    method: 'get',
    url: `https://price.jup.ag/v1/price?id=${resFFF.data.mint}&vsToken=SOL`,
    timeout: 3000
  }), axios({
    method: 'get',
    url: `https://rafffle.famousfoxes.com/api/me/collections/${resFFF.data.nft.collection}`,
    timeout: 3000
  })]);

  const mintToken = (_.find(tokens, (token) => { return token.address === resFFF.data.mint }));
  const ticketCost = resPrice.data.data.price ? resPrice.data.data.price * resFFF.data.cost : null;
  const tokenMintSymbol = resPrice.data.data.mintSymbol || mintToken.name;

  return {
    address: resFFF.data.raffle,
    name: resFFF.data.nft.name,
    tickets: {
      cost: ticketCost,
      supply: resFFF.data.supply,
      sold: resFFF.data.sold,
      left: resFFF.data.supply - resFFF.data.sold,
    },
    status: (resFFF.data.end - 300) > timestamp() ? 'running' : 'ended',
    end: resFFF.data.end - 300,
    mint: {
      symbol: tokenMintSymbol,
      price: resPrice.data.data.price || null,
      cost: resFFF.data.cost
    },
    prize: {
      collection: resFFF.data.nft.collection,
      image: resFFF.data.nft.image,
      value: fixBalance(resCollection.data.collection.floorPrice, 9),
      mint: resFFF.data.nft.mintAddress
    },
    link: `https://rafffle.famousfoxes.com/raffle/${resFFF.data.raffle}`
  }
}

export default async function handler(req, res) {
  res.status(200).json(await getData(req.query.raffle))
}
