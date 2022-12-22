import Head from 'next/head'
import { useState} from "react";
import {useRouter} from "next/router";
import Loader from "../../components/loader";
import Layout, {siteTitle} from "../../components/layout";
import useSWR from 'swr'
import Link from "next/link";
import {round} from "../../lib/round";
import {validate_address} from "../../lib/validate_address";
import {ArrowPathIcon, ChevronLeftIcon} from "@heroicons/react/24/solid";
import ReactTimeAgo from 'react-time-ago'
import Image from "next/image";

const fetcher = (...args) => fetch(...args).then(res => {
    if (!res.ok) {
        const error = new Error(res.status)
        error.status = res.status
        throw error
    }
    return res.json()
})

export default function Raffle() {
    const router = useRouter()
    const { raffle } = router.query

    const [ticketsToBuy, setTicketsToBuy] = useState(1)
    const [ticketsAlreadyBought, setTicketsAlreadyBought] = useState(0)
    let calcs = {
        minWinRate: null,
        maxWinRate: null,
        cost: null,
        ratio: null
    }

    const refreshInterval = 10 * 60000
    const {data, error, mutate, isValidating} = useSWR(raffle ? `/api/${raffle}` : null, fetcher, { refreshInterval: refreshInterval })

    if (raffle != null && !validate_address(raffle)) {
        router.push('/')
    }

    const refreshCalcs = () => {
        if (data && data.tickets) {
            let myTickets = (ticketsToBuy + ticketsAlreadyBought);
            if (!Number.isNaN(myTickets)) {
                calcs = {
                    minWinRate: myTickets / parseInt(data.tickets.supply),
                    maxWinRate: myTickets / (parseInt(data.tickets.sold) + ticketsToBuy),
                    cost: data.tickets.cost * myTickets,
                    ratio: myTickets > 0 ? parseFloat(data.prize.value) / (parseFloat(data.tickets.cost) * myTickets) : null,
                    profit: data.tickets.cost ? (((parseInt(data.tickets.sold) + ticketsToBuy) * data.tickets.cost) - parseFloat(data.prize.value)) : null,
                }
            } else {
                calcs = {
                    minWinRate: null,
                    maxWinRate: null,
                    cost: null,
                    ratio: null,
                    profit: null,
                }
            }
            const totalCost = (parseInt(data.tickets.supply)) * data.tickets.cost
            calcs.maxProfit = data.tickets.cost ? (totalCost - parseFloat(data.prize.value)) : null
            calcs.maxProfitRatio = totalCost  / parseFloat(data.prize.value)
        }
    }

    refreshCalcs()

    const handleChangeTicketsToBuy = (e) => {
        if (e.target.value > parseInt(data.tickets.left)) {
            setTicketsToBuy(parseInt(data.tickets.left))
        } else {
            setTicketsToBuy(parseInt(e.target.value))
        }
        refreshCalcs()
    }
    const handleChangeTicketsAlreadyBought = (e) => {
        if (e.target.value > parseInt(data.tickets.sold)) {
            setTicketsAlreadyBought(parseInt(data.tickets.sold))
        } else {
            setTicketsAlreadyBought(parseInt(e.target.value))
        }
        refreshCalcs()
    }

    const pageTitle = `${siteTitle} | ${data && data.name ? data.name : raffle}`

    const fffCollects = {
        'transdimensional_fox_federation': 'tff',
        'famous_fox_federation': 'fff'
    }

    return (
        <Layout>
            <Head>
                <title>{pageTitle}</title>
            </Head>

                {data ? (
                <>
                    <div className="md:w-1/3 md:mr-8 px-8 pt-5 md:pt-0 md:px-0">
                        <div className="relative rounded-2xl overflow-hidden mb-8">
                            <picture>
                                <img className="mx-auto" alt={data.name} src={data.prize.image} />
                            </picture>
                        </div>
                        <div>
                            <span className={"pr-5"}>
                                <Link href={`https://magiceden.io/item-details/${data.prize.mint}`}>
                                    <a target="_blank">
                                        <Image src={'/img/magiceden.png'} width={32} height={32} alt={'open on Magic Eden'} />
                                    </a>
                                </Link>
                            </span>
                            <span className={"pr-5"}>
                                <Link href={`https://solscan.io/token/${data.prize.mint}`}>
                                    <a target="_blank">
                                        <Image src={'/img/solscan.png'} width={32} height={32} alt={'open on Solscan'} />
                                    </a>
                                </Link>
                            </span>
                            { fffCollects[data.prize.collection] ? <span className={"pr-5"}>
                                <Link href={`https://famousfoxes.com/fameleaderboard?tokenId=${data.name.substring(data.name.indexOf('#') + 1)}&collection=${fffCollects[data.prize.collection]}`}>
                                    <a target="_blank">
                                        <Image src={'/img/fff.png'} width={32} height={32} alt={'open on FAME Leaderboard'} />
                                    </a>
                                </Link>
                            </span> : ''}
                        </div>
                    </div>
                    <div className="md:w-2/3 bg-white w-full md:rounded-2xl p-8 mt-5 md:mt-0 flex flex-col justify-between transition">
                        <div className="w-full">
                            <div className="flex flex-col md:flex-row flex-between">
                                <div className="w-full">
                                    <strong className="text-4xl pb-1">{data.name}</strong> <ArrowPathIcon className={`w-5 h-5 inline-block mb-3 ml-2 text-purple-600 hover:opacity-80 font-bold hover:cursor-pointer ${isValidating ? "rotate-anim" : ""}`} onClick={() => { !isValidating && mutate()}}></ArrowPathIcon>
                                </div>
                                <div className="flex justify-between md:justify-start md:flex-col mt-3 md:mt-0 gap-x-8 md:gap-x-0 text-sm">
                                    <Link href="/">
                                        <button className="flex items-center text-purple-600 hover:opacity-80 font-bold ml-1">
                                            <ChevronLeftIcon className="w-5 mr-1 fill-current"></ChevronLeftIcon>
                                            <span className="ml-1">Back</span>
                                        </button>
                                    </Link>
                                </div>
                            </div>
                            <div className="py-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 font-bold gap-3 gap-y-6">
                                    <div><strong className="block text-sm text-gray-500">Ticket Sales Ends in:</strong>
                                        <div className="text-xl"><span title={new Date(data.end * 1000).toLocaleString()}><ReactTimeAgo date={new Date(data.end * 1000)} /></span></div>
                                    </div>
                                    <div className=""><strong className="block text-sm text-gray-500">Tickets Remaining:</strong>
                                        <div className="text-black text-xl">{data.tickets.left}&nbsp;/&nbsp;{data.tickets.supply}</div>
                                    </div>
                                    <div className="">
                                        <strong className="block text-sm text-gray-500">Prize Value:</strong>
                                        <div className="text-xl">{data.prize.value}&nbsp;SOL</div>
                                    </div>
                                    <div className="">
                                        <strong className="block text-sm text-gray-500">Ticket Cost:</strong>
                                        <div className="text-xl">{data.tickets.cost ? `${round(data.tickets.cost, 4)} SOL` : '?'}{data.mint.symbol !== 'SOL' ? ` (${data.mint.cost} ${data.mint.symbol || '?'})` : ''}</div>
                                    </div>
                                    { calcs.maxProfit ?
                                        <div className=""><strong className="block text-sm text-gray-500">Creator Max Profits (All Tickets Sold):</strong>
                                            <div className="text-black text-xl">{round(calcs.maxProfit, -1)}&nbsp;SOL ({calcs.maxProfitRatio * 100 - 100 > 0 ? '+' : ''}{round(calcs.maxProfitRatio * 100 - 100, -1)}%)</div>
                                        </div> : ''}
                                </div>
                            </div>
                            {
                                data.status === 'running' ?
                                    <>
                                        <div className="py-5 border-t border-gray-200">
                                            <div className="flex  items-center">
                                                <div className="mr-2 lg:mr-6">I have</div>
                                                <div className="mr-2 lg:mr-6 w-[100px] lg:w-[150px]"><input
                                                    className="border-2 w-full h-full text-center border-white focus:border-purple-500 appearance-none focus:outline-none p-3 bg-offbase rounded-2xl text-white font-bold text-2xl bg-purple"
                                                    type="number" placeholder="Number Of Tickets Already Bought" min="0" max={data.tickets.sold} defaultValue={ticketsAlreadyBought} onChange={ handleChangeTicketsAlreadyBought } /></div>
                                                <div className="mr-2 lg:mr-6">tickets and I want to buy</div>
                                                <div className="mr-2 lg:mr-6 w-[100px] lg:w-[150px]"><input
                                                    className="border-2 w-full h-full text-center border-white focus:border-purple-500 appearance-none focus:outline-none p-3 bg-offbase rounded-2xl text-white font-bold text-2xl bg-purple"
                                                    type="number" placeholder="Number Of Tickets I Want To Buy" min="1" max={data.tickets.left} defaultValue={ticketsToBuy} onChange={ handleChangeTicketsToBuy } /></div>
                                                <div className="mr-2 lg:mr-6">more</div>
                                            </div>
                                        </div>
                                        <div className="pb-5 border-b border-gray-200">
                                            <div className="grid grid-cols-1 md:grid-cols-2 font-bold gap-3 gap-y-6">
                                                { calcs.ratio ?
                                                    <div className="md:col-span-2">
                                                        <div
                                                            className="p-5 border border-amber-200 rounded-xl bg-amber-100">
                                                            <div className="font-bold text-amber-600">I have {calcs.minWinRate === calcs.maxWinRate ? `${round(calcs.minWinRate * 100, -1)}%` : `between ${round(calcs.minWinRate * 100, -1)}% and ${round(calcs.maxWinRate * 100, -1)}%`} chances to win {round(data.prize.value, 2)}&nbsp;SOL by spending {round(calcs.cost, 2)}&nbsp;SOL, it&apos;s a x{round(calcs.ratio, -1)}</div>
                                                        </div>
                                                    </div> : ''}
                                                <div className=""><strong className="block text-sm text-gray-500">Profits Multiplier:</strong>
                                                    <div className="text-black text-xl">{ calcs.ratio ? `x${round(calcs.ratio, -1)}` : '?'}</div>
                                                </div>
                                                <div className="">
                                                    <strong className="block text-sm text-gray-500">Total Cost:</strong>
                                                    <div className="text-xl">{calcs.cost ? `${round(calcs.cost, 4)} SOL` : '?'}{data.mint.symbol !== 'SOL' ? ` (${data.mint.cost * ((ticketsToBuy || 0) + (ticketsAlreadyBought || 0))} ${data.mint.symbol})` : ''}</div>
                                                </div>
                                                <div className=""><strong className="block text-sm text-gray-500">Min Win Rate (All Tickets Sold):</strong>
                                                    <div className="text-black text-xl">{round(calcs.minWinRate * 100, -1)}%</div>
                                                </div>
                                                <div className=""><strong className="block text-sm text-gray-500">Max Win Rate (I&apos;m The Last To Buy Tickets):</strong>
                                                    <div className="text-black text-xl">{round(calcs.maxWinRate * 100, -1)}%</div>
                                                </div>
                                                <div className=""><strong className="block text-sm text-gray-500">Tickets Remaining After Me:</strong>
                                                    <div className="text-black text-xl">{parseInt(data.tickets.left) - (ticketsToBuy || 0)}&nbsp;/&nbsp;{data.tickets.supply}</div>
                                                </div>
                                                { calcs.profit ?
                                                    <div className=""><strong className="block text-sm text-gray-500">Creator Profits:</strong>
                                                        <div className="text-black text-xl">{round(calcs.profit, -1)}&nbsp;SOL</div>
                                                    </div> : ''}
                                            </div>
                                        </div>
                                    </> : <p className="py-5">Raffle has ended.</p>
                            }
                        </div>
                        <div
                            className="p-5 border border-purple-200 rounded-xl bg-purple-100 mt-4">
                            <h3 className="font-bold text-purple-600">Buyer&apos;s Tips</h3>
                            <ol className="list-decimal ml-5">
                                <li>Never assume you will make the last purchase</li>
                                <li>Spend only what you&apos;re comfortable with losing</li>
                            </ol>
                            Read more from <Link href={"https://vell-sol.gitbook.io/fff_raffle_buyer_tips/"}><a className="text-purple-600">official FFF Raffle Buyer&apos;s Guide</a></Link>
                        </div>
                    </div>
                    </>
                ) : <div className="px-8 md:px-0 absolute top-0 left-0 w-full h-full flex items-center justify-center text-purple-600">
                        <div className="flex flex-col md:flex-row justify-center items-center text-primary">
                            {
                                error ? <div className="text-xl">404</div> : <>
                                    <Loader/>
                                    <div className="text-xl">Loading, please wait...</div>
                                </>
                            }
                        </div>
                    </div>
                }
        </Layout>
    )
}