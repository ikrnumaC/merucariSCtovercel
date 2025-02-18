'use client'
import { useState } from 'react'

type SortOption = {
  key: 'created_at' | 'price' | 'weekly_count' | 'monthly_count'
  order: 'asc' | 'desc'
}

type FilterOption = {
  created_at?: { min: string, max: string }
  price?: { min?: number, max?: number }
  weekly_count?: { min?: number, max?: number }
  monthly_count?: { min?: number, max?: number }
}

type Props = {
  onSortChange: (sort: SortOption) => void
  onFilterChange: (filter: FilterOption) => void
}

type SortLabelKey = `${SortOption['key']}-${SortOption['order']}`

const getSortLabel = (key: SortOption['key'], order: SortOption['order']): string => {
  const labels: Record<SortLabelKey, string> = {
    'created_at-desc': 'データ取得日 新しい順',
    'created_at-asc': 'データ取得日 古い順',
    'price-desc': '販売価格 高い順',
    'price-asc': '販売価格 安い順',
    'weekly_count-desc': '週間出品数 多い順',
    'weekly_count-asc': '週間出品数 少ない順',
    'monthly_count-desc': '月間出品数 多い順',
    'monthly_count-asc': '月間出品数 少ない順'
  }
  return labels[`${key}-${order}`] || 'デフォルト'
}

export default function FilterSort({ onSortChange, onFilterChange }: Props) {
  const [selectedSort, setSelectedSort] = useState<SortOption>({ key: 'created_at', order: 'desc' })
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>({})

  const handleApplyFilter = () => {
    onFilterChange(selectedFilter)
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="grid grid-cols-2 gap-4">
        {/* ソートオプション */}
        <div>
          <h3 className="font-bold mb-2">
            ソート（現在：{getSortLabel(selectedSort.key, selectedSort.order)}）
          </h3>
          <div className="flex gap-2">
            <select
              value={`${selectedSort.key}-${selectedSort.order}`}
              onChange={(e) => {
                const [key, order] = e.target.value.split('-') as [SortOption['key'], SortOption['order']]
                setSelectedSort({ key, order })
              }}
              className="border rounded px-2 py-1 flex-grow"
            >
              <option value="created_at-desc">データ取得日 新しい順</option>
              <option value="created_at-asc">データ取得日 古い順</option>
              <option value="price-desc">販売価格 高い順</option>
              <option value="price-asc">販売価格 安い順</option>
              <option value="weekly_count-desc">週間出品数 多い順</option>
              <option value="weekly_count-asc">週間出品数 少ない順</option>
              <option value="monthly_count-desc">月間出品数 多い順</option>
              <option value="monthly_count-asc">月間出品数 少ない順</option>
            </select>
            <button
              onClick={() => onSortChange(selectedSort)}
              className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              適用
            </button>
          </div>
        </div>

        {/* フィルターオプション */}
        <div>
          <h3 className="font-bold mb-2">絞り込み</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">価格</label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="最小"
                  className="border rounded px-2 py-1 w-24"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleApplyFilter()
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : undefined
                    setSelectedFilter({
                      ...selectedFilter,
                      price: { ...selectedFilter.price, min: value }
                    })
                  }}
                />
                <span>~</span>
                <input
                  type="number"
                  placeholder="最大"
                  className="border rounded px-2 py-1 w-24"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleApplyFilter()
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : undefined
                    setSelectedFilter({
                      ...selectedFilter,
                      price: { ...selectedFilter.price, max: value }
                    })
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">週間出品数</label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="最小"
                  className="border rounded px-2 py-1 w-24"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleApplyFilter()
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : undefined
                    setSelectedFilter({
                      ...selectedFilter,
                      weekly_count: { ...selectedFilter.weekly_count, min: value }
                    })
                  }}
                />
                <span>~</span>
                <input
                  type="number"
                  placeholder="最大"
                  className="border rounded px-2 py-1 w-24"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleApplyFilter()
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : undefined
                    setSelectedFilter({
                      ...selectedFilter,
                      weekly_count: { ...selectedFilter.weekly_count, max: value }
                    })
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">月間出品数</label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="最小"
                  className="border rounded px-2 py-1 w-24"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleApplyFilter()
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : undefined
                    setSelectedFilter({
                      ...selectedFilter,
                      monthly_count: { ...selectedFilter.monthly_count, min: value }
                    })
                  }}
                />
                <span>~</span>
                <input
                  type="number"
                  placeholder="最大"
                  className="border rounded px-2 py-1 w-24"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleApplyFilter()
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : undefined
                    setSelectedFilter({
                      ...selectedFilter,
                      monthly_count: { ...selectedFilter.monthly_count, max: value }
                    })
                  }}
                />
              </div>
            </div>
          </div>
          <button
            onClick={handleApplyFilter}
            className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mt-4 w-full"
          >
            絞り込みを適用
          </button>
        </div>
      </div>
    </div>
  )
}
