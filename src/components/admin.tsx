'use client'
import { useState, useEffect } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

type AdminItem = {
  id: number
  name: string
  min_price: number
  max_price: number
  weekly_count: number
  monthly_count: number
  image_url: string
  rarity: string
  created_at: string
  selected?: boolean
}

export default function AdminPage() {
  const [items, setItems] = useState<AdminItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedItems, setSelectedItems] = useState<number[]>([])

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true)
      try {
        const response = await fetch('https://zhfre6aytc.execute-api.ap-southeast-2.amazonaws.com/prod/getitem')
        const rawData = await response.json()
        const data = JSON.parse(rawData.body)
        setItems(data.items)
      } catch (err) {
        setError('データの取得に失敗しました')
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  const handleSelectItem = (itemId: number) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, selected: !item.selected } : item
      )
    )
    setSelectedItems(prev =>
      items.find(item => item.id === itemId)?.selected
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const handleSelectAll = () => {
    const allSelected = items.every(item => item.selected)
    setItems(prevItems =>
      prevItems.map(item => ({ ...item, selected: !allSelected }))
    )
    setSelectedItems(!allSelected ? items.map(item => item.id) : [])
  }

  const handleDelete = async () => {
    try {
      const response = await fetch('https://your-delete-api-endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedItems }),
      })

      if (!response.ok) throw new Error('削除に失敗しました')

      setItems(prevItems =>
        prevItems.filter(item => !selectedItems.includes(item.id))
      )
      setSelectedItems([])
      toast.success('選択したアイテムを削除しました')
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('削除に失敗しました')
    }
    setShowDeleteDialog(false)
  }

  if (loading) return <div className="p-4 text-center">読み込み中...</div>
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">商品管理</h1>
        <div className="flex gap-4">
          <button
            onClick={handleSelectAll}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
          >
            {items.every(item => item.selected) ? '全て解除' : '全て選択'}
          </button>
          <button
            onClick={() => setShowDeleteDialog(true)}
            disabled={selectedItems.length === 0}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            選択したアイテムを削除 ({selectedItems.length})
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {items.map((item) => (
          <div 
            key={item.id}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex h-48"
          >
            <div className="flex items-center px-4">
              <input
                type="checkbox"
                checked={item.selected || false}
                onChange={() => handleSelectItem(item.id)}
                className="w-5 h-5"
              />
            </div>
            
            <div className="w-1/3 h-full bg-gray-100">
              <img 
                src={item.image_url} 
                alt={item.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.png'
                }}
              />
            </div>

            <div className="flex-1 p-4">
              <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">取得日:</span>
                  <span>{new Date(item.created_at).toLocaleString('ja-JP')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">価格:</span>
                  <span>
                    {item.min_price === item.max_price 
                      ? `${item.min_price.toLocaleString()}円`
                      : `${item.min_price.toLocaleString()}〜${item.max_price.toLocaleString()}円`
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">出品数:</span>
                  <span>週間: {item.weekly_count}件 / 月間: {item.monthly_count}件</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>商品の削除</AlertDialogTitle>
            <AlertDialogDescription>
              選択した{selectedItems.length}件の商品を削除します。
              この操作は取り消せません。本当に削除しますか？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              削除する
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ToastContainer position="bottom-right" />
    </div>
  )
}
