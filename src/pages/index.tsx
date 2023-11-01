import { Inter } from 'next/font/google'
import { useCallback, useMemo, useState } from 'react'
import { connect, disconnect } from "@argent/get-starknet"
import { Contract, Provider, constants, encode, cairo } from 'starknet'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [address, setAddress] = useState<string>()
  const [contractState, setContractState] = useState<[string, string]>()

  const CONTRACT_ADDR = '0x040505b94c8a0dcb27ccf32c57c7fb5d07f00c6e86ee1a8a7920c17a6a603420'


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

  const fetchContractData = useCallback(async () => {
    const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } })
    const { abi } = await provider.getClassAt(CONTRACT_ADDR)
    if (abi === undefined) { throw new Error("NO ABI") }
    const contract = new Contract(abi, CONTRACT_ADDR, provider)
    const data = await contract.get_data();
    const messageAsBigint: BigInt = data[0]
    const messageSenderAsBigint: BigInt = data[1]
    console.log(messageAsBigint, messageSenderAsBigint)
  }, [])



  return (
    <div
      className={`flex min-h-screen flex-col items-center bg-orange-50 text-orange-950 ${inter.className}`}>
      <header className='flex items-center justify-between w-full h-16 max-w-2xl px-4'>
        <h1 className='text-2xl font-bold'>Message Dapp</h1>
        {isConnected ? (
          <button onClick={fetchContractData} className='h-10 px-5 text-lg font-semibold duration-200 bg-orange-500 rounded-full hover:bg-orange-600 active:bg-orange-600 hover:scale-95 active:scale-90 text-orange-50'>Disconnect</button>
        ) : (
          <button onClick={onClickConnect} className='h-10 px-5 text-lg font-semibold duration-200 bg-orange-500 rounded-full hover:bg-orange-600 active:bg-orange-600 hover:scale-95 active:scale-90 text-orange-50'>Connect</button>
        )}




      </header>
      <main className='w-full max-w-3xl px-4'>
        {contractState ? contractState[1] : 'not yet'}

      </main>
    </div>
  )
}
