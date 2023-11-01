import { Inter } from 'next/font/google'
import { useCallback, useMemo, useState } from 'react'
import { connect, disconnect } from "@argent/get-starknet"

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [address, setAddress] = useState<string>()

  const isConnected = useMemo(() => Boolean(address), [address])

  const onClickConnect = useCallback(async () => {
    const starknet = await connect({ dappName: 'Message Dapp', modalTheme: 'light', enableArgentMobile: true })
    if (!starknet) return
    if (typeof starknet.account.address === 'string') setAddress(starknet.account.address)
  }, [])

  const onClickDisconnect = useCallback(async () => {
    await disconnect()
    setAddress(undefined)
  }, [])



  return (
    <div
      className={`flex min-h-screen flex-col bg-orange-50 text-orange-950 ${inter.className}`}>
      <header className='flex items-center justify-between h-16 px-4'>
        <h1 className='text-2xl font-bold'>Message Dapp</h1>
        {isConnected ? (
          <button onClick={onClickDisconnect} className='h-10 px-5 text-lg font-semibold duration-200 bg-orange-500 rounded-full hover:bg-orange-600 active:bg-orange-600 hover:scale-95 active:scale-90 text-orange-50'>Disconnect</button>
        ) : (
          <button onClick={onClickConnect} className='h-10 px-5 text-lg font-semibold duration-200 bg-orange-500 rounded-full hover:bg-orange-600 active:bg-orange-600 hover:scale-95 active:scale-90 text-orange-50'>Connect</button>
        )}




      </header>
      <main
      >


      </main>
    </div>
  )
}
