import CardList from '@/components/CardList'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold text-center py-4">メルカリSC</h1>
      <CardList />
    </main>
  )
}
