import Head from 'next/head'
import Link from 'next/link'
import Image from "next/image";

export const siteTitle = 'The Raffle Calculator'
export const siteDescription = 'A raffle chances calculator for FFF raffles'
export const siteAuthor = 'Oppty Labs'

export default function Layout({ children }) {
    const pageTitle = `${siteTitle} | Powered by ${siteAuthor}`

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta
                    name="description"
                    content={siteDescription}
                />
                <meta name="og:title" content={siteTitle} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:creator" content="@0xOppty" />
                <meta name="twitter:image" content="https://raffle-calculator.vercel.app/icons/twitter-image.png" />
                <link rel="apple-touch-icon" sizes="57x57" href="/icons/apple-icon-57x57.png" />
                <link rel="apple-touch-icon" sizes="60x60" href="/icons/apple-icon-60x60.png" />
                <link rel="apple-touch-icon" sizes="72x72" href="/icons/apple-icon-72x72.png" />
                <link rel="apple-touch-icon" sizes="76x76" href="/icons/apple-icon-76x76.png" />
                <link rel="apple-touch-icon" sizes="114x114" href="/icons/apple-icon-114x114.png" />
                <link rel="apple-touch-icon" sizes="120x120" href="/icons/apple-icon-120x120.png" />
                <link rel="apple-touch-icon" sizes="144x144" href="/icons/apple-icon-144x144.png" />
                <link rel="apple-touch-icon" sizes="152x152" href="/icons/apple-icon-152x152.png" />
                <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-icon-180x180.png" />
                <link rel="icon" type="image/png" sizes="192x192"  href="/icons/android-icon-192x192.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="96x96" href="/icons/favicon-96x96.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
                <link rel="manifest" href="/icons/manifest.json" />
                <meta name="msapplication-TileColor" content="#22132e" />
                <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
                <meta name="theme-color" content="#22132e" />
            </Head>

            <div className="flex top-0 left-0 z-60 w-full bg-[#281E35] h-30 px-8">
                <div className="flex w-full justify-between lg:justify-start items-end">
                    <Link href={"/"}>
                        <div className="justify-center flex flex-grow md:flex-grow-0 py-2 -ml-3 md:ml-0 items-center cursor-pointer text-white">
                            <div className={"bg-white w-12 h-12 rounded-full mx-auto mr-5"}>
                                <Image src={"/icons/android-icon-192x192.png"}
                                       alt={siteAuthor}
                                       layout={"responsive"}
                                       width={"46"}
                                       height={"46"}
                                       className={"w-40 h-40 my-4 mx-4 align-middle content-center"} />
                            </div> {siteTitle}
                        </div>
                    </Link>
                </div>
            </div>

            <main className="my-4 min-h-screen">
                <div className="max-w-screen-xl mx-auto md:px-8 md:py-4 flex w-full flex-col md:flex-row">
                    {children}
                </div>
            </main>

            <footer className="flex text-indigo-500 justify-center w-full bg-gray-500/10 h-30 px-8 py-3">
                <span>Copyright {new Date().getFullYear()}. <Link href="https://twitter.com/0xOppty"><a className="" target="_blank">{siteAuthor}</a></Link>. <span className={"text-white"}>Not affiliated to FFF.</span></span>
            </footer>
        </>
    )
}