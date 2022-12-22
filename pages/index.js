import Layout, {siteAuthor} from "../components/layout";
import {CheckIcon, MagnifyingGlassIcon} from "@heroicons/react/24/solid";
import Link from "next/link";
import {useEffect, useState} from "react";
import _ from "lodash";
import {validate_address} from "../lib/validate_address";
import useSWR from 'swr'
import Loader from "../components/loader";
import Image from "next/image";
import ReactTimeAgo from 'react-time-ago'

export default function Home() {
    const [address, setAddress] = useState('')
    const [addressValidated, setAddressValidated] = useState(false)

    const fetcher = (...args) => fetch(...args).then(res => {
        if (!res.ok) {
            const error = new Error(res.status)
            error.status = res.status
            throw error
        }
        return res.json()
    })

    const {data, error} = useSWR(`/api/raffles`, fetcher)

    const handleChange = async function handleChange(e) {
        const inputAdress = _.trim(e.target.value)
        let computedAdress = _.replace(inputAdress, 'https://rafffle.famousfoxes.com/raffle/', '')

        if (validate_address(computedAdress)) {
            setAddress(computedAdress)
        } else {
            setAddress('')
        }
    }

    useEffect(() => {
        setAddressValidated(address && address !== '')
    }, [address])

  return (
    <Layout>

        <div className={"flex-col flex w-full"}>
            <div className={"w-full my-10"}>
                <div className={"bg-white w-48 h-48 rounded-full mx-auto"}>
                    <Image src={"/icons/android-icon-192x192.png"}
                           alt={siteAuthor}
                           layout={"responsive"}
                           width={"46"}
                           height={"46"}
                           className={"w-40 h-40 my-4 mx-4 align-middle content-center"} />
                </div>
            </div>

            <div className={"w-full my-10"}>
                <form className="flex space-x-4 mx-auto">
                    <label className={"relative bg-grey-400 text-lg border-0 text-white h-full rounded-lg  w-5/6 lg:w-2/3"}>
                        <div className="absolute pointer-events-none right-3 w-10 h-10 top-1/2 transform -translate-y-1/2">
                            { addressValidated ? <CheckIcon className="h-10 w-10 text-purple-500" /> : '' }
                        </div>
                        <input
                            type={"text"}
                            defaultValue={address}
                            className="border-2 w-full border-primary focus:border-purple-500  focus:outline-none bg-transparent p-3 rounded-2xl text-center text-primary font-bold text-xl appearance-none"
                            onChange={ handleChange }
                            placeholder="Please Enter FFF Raffle Address Or URL"
                            autoComplete="off"
                            data-lpignore="true"
                        />
                    </label>

                    <Link href={`/raffle/${encodeURIComponent(address)}`}>
                        <button className={`flex items-center justify-center w-1/6 lg:w-1/3 px-2 md:py-0 bg-gradient-to-t from-lime-600 to-lime-400 border border-lime-500  opacity-90 hover:opacity-100 rounded-xl text-white text-xl font-bold transition ${!addressValidated ? "disabled" : ""}`}
                                disabled={!addressValidated} type={"submit"}>
                            <MagnifyingGlassIcon className="w-5 text-white fill-current"></MagnifyingGlassIcon>
                            <span className="hidden lg:inline-block ml-2">View Raffle</span>
                        </button>
                    </Link>
                </form>
            </div>

            <div className={"w-full max-w-screen-xl mx-auto"}>
                {
                    data ? _.map(data, (raffle) => {
                        return <div className="border-2 border-primary w-full p-4 mb-5 bg-white rounded-xl" key={`raffle-${raffle.address}`}>
                            <div className="w-full flex flex-col sm:flex-row justify-between lg:items-center">
                                <div className="flex mb-3 lg:mb-0 lg:items-center">
                                    <div className="w-[120px] h-[120px] lg:w-[60px] lg:h-[60px] rounded-xl overflow-hidden mr-5">
                                        <picture>
                                            <img className="object-center object-cover w-full h-full"
                                                 src={raffle.prize.image}
                                                 alt={raffle.name} />
                                        </picture>
                                    </div>

                                    <Link href={`/raffle/${encodeURIComponent(raffle.address)}`}>
                                        <a className="font-bold text-2xl text-black hover:text-lime-500 hover:text-lime-500">{raffle.name}</a>
                                    </Link>
                                </div>
                                <div className={"flex flex-col lg:flex-row lg:items-center font-bold"}>
                                    <div className="sm:block lg:flex">
                                        <div className="sm:text-right lg:px-6 mb-3 lg:mb-0">
                                            <h4 className="text-black">Time Remaining</h4>
                                            <span className="text-gray-500" title={new Date(data.end * 1000).toLocaleString()}><ReactTimeAgo date={new Date(raffle.end * 1000)} /></span></div>
                                    </div>
                                    <div>
                                        <Link href={`/raffle/${encodeURIComponent(raffle.address)}`}>
                                            <a className="from-indigo-600 to-indigo-500 border-indigo-500 sm:w-[200px] lg:w-[50px] lg:h-[50px] py-3 lg:py-0 flex items-center justify-center bg-gradient-to-t border opacity-90 hover:opacity-100 text-white text-xl font-bold rounded-2xl transition-all" >
                                                <MagnifyingGlassIcon className="w-5 text-white fill-current"></MagnifyingGlassIcon>
                                                <span className="lg:hidden ml-2">View Raffle</span>
                                            </a>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }): <div className="px-8 md:px-0 absolute top-0 left-0 w-full h-full flex items-center justify-center text-purple-600">
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
            </div>
        </div>



    </Layout>
  )
}
