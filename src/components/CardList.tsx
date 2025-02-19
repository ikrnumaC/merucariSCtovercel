'use client'
import { useState, useEffect } from 'react';
import FilterSort from './FilterSort';

type Item = {
  name: string;
  min_price: number;
  max_price: number;
  weekly_count: number;
  monthly_count: number;
  image_url: string;
  rarity: string;
  created_at: string;
};

type FilterOption = {
  created_at?: { min: string; max: string };
  price?: { min?: number, max?: number };
  weekly_count?: { min?: number, max?: number };
  monthly_count?: { min?: number, max?: number };
};

type SortOption = {
  key: 'created_at' | 'price' | 'weekly_count' | 'monthly_count';
  order: 'asc' | 'desc';
};

export default function CardList() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sort, setSort] = useState<SortOption>({ key: 'created_at', order: 'desc' });
  const [filter, setFilter] = useState<FilterOption>({});
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append('page', currentPage.toString());
        params.append('page_size', itemsPerPage.toString());
        params.append('sort', sort.key);
        params.append('order', sort.order);

        if (filter.price?.min) params.append('min_price', filter.price.min.toString());
        if (filter.price?.max) params.append('max_price', filter.price.max.toString());
        if (filter.weekly_count?.min) params.append('min_weekly', filter.weekly_count.min.toString());
        if (filter.weekly_count?.max) params.append('max_weekly', filter.weekly_count.max.toString());
        if (filter.monthly_count?.min) params.append('min_monthly', filter.monthly_count.min.toString());
        if (filter.monthly_count?.max) params.append('max_monthly', filter.monthly_count.max.toString());

        const url = `https://zhfre6aytc.execute-api.ap-southeast-2.amazonaws.com/prod/getitem?${params.toString()}`;
        const response = await fetch(url);
        const rawData = await response.json();
        const data = JSON.parse(rawData.body);
        setItems(data.items);
        setTotalItems(data.total);
      } catch (err) {
        setError('データの取得に失敗しました');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [currentPage, sort, filter]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (loading) return <div className="p-4 text-center">読み込み中...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <FilterSort
        onSortChange={setSort}
        onFilterChange={setFilter}
      />

      <div className="grid gap-4 max-w-5xl mx-auto">
        {items.map((item, index) => (
          <div
            key={`${currentPage}-${index}`}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex h-48 w-full"
          >
            {/* 左列：画像 */}
            <div className="w-1/3 h-full bg-gray-100">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.png';
                }}
              />
            </div>

            {/* 右列：情報 */}
            <div className="w-2/3 p-4">
              <h3 className="text-lg font-semibold mb-2">{item.name}</h3>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">取得日:</span>
                  <span>
                    {new Date(item.created_at).toLocaleString('ja-JP', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">販売価格:</span>
                  <span>
                    {item.min_price === item.max_price
                      ? `${item.min_price.toLocaleString()}円`
                      : `${item.min_price.toLocaleString()}〜${item.max_price.toLocaleString()}円`
                    }
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">平均価格:</span>
                  <span>
                    {Math.floor((item.min_price + item.max_price) / 2).toLocaleString()}円
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">出品数:</span>
                  <span>
                    週間: {item.weekly_count.toLocaleString()}件 / 月間: {item.monthly_count.toLocaleString()}件
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <div className="text-center mb-2">
          {totalItems}件
        </div>
        <div className="flex justify-center items-center gap-2 flex-wrap">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1 || loading}
            className={`px-6 py-4 rounded text-lg ${
              currentPage === 1 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            } disabled:opacity-50`}
          >
            1
          </button>

          {currentPage > 4 && (
            <span className="px-4">...</span>
          )}

          {[...Array(5)].map((_, i) => {
            const pageNum = currentPage - 2 + i;
            if (pageNum <= 1 || pageNum >= totalPages) return null;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                disabled={currentPage === pageNum || loading}
                className={`px-6 py-4 rounded text-lg ${
                  currentPage === pageNum 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'
                } disabled:opacity-50`}
              >
                {pageNum}
              </button>
            );
          })}

          {currentPage < totalPages - 3 && (
            <span className="px-4">...</span>
          )}

          {totalPages > 1 && (
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || loading}
              className={`px-6 py-4 rounded text-lg ${
                currentPage === totalPages 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              } disabled:opacity-50`}
            >
              {totalPages}
            </button>
          )}

          <div className="flex items-center gap-2 ml-4">
            <input
              type="number"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value >= 1 && value <= totalPages) {
                  setCurrentPage(value);
                }
              }}
              className="w-20 px-3 py-4 border rounded text-lg"
            />
            <span className="text-gray-600">/ {totalPages}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
