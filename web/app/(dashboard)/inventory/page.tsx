'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Topbar } from '@/components/layout/Topbar';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct
} from '@/hooks/api/useProducts';
import {
  Package, AlertTriangle, IndianRupee, Tag, Search, Plus, Edit, Trash2, X, Loader2
} from 'lucide-react';
import { Product } from '@/types/api';

export default function InventoryPage() {
  const { data: productsData, isLoading } = useProducts(1, 100);
  const products = productsData?.data || [];

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');

  // Modals States
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields State
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [hsnCode, setHsnCode] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState('10');
  const [gstRate, setGstRate] = useState('18');
  const [unit, setUnit] = useState('pcs');

  const categories = ['All', 'Electronics', 'Apparel', 'Accessories', 'Food', 'Raw Materials'];

  const handleOpenAddModal = () => {
    setName('');
    setSku(`SKU-${Math.floor(100000 + Math.random() * 900000)}`);
    setHsnCode('HSN8471');
    setCategory('Electronics');
    setPrice('1200');
    setStock('50');
    setLowStockThreshold('15');
    setGstRate('18');
    setUnit('pcs');
    setAddModalOpen(true);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Product Name is required');
      return;
    }
    createProductMutation.mutate({
      name,
      sku: sku || `SKU-${Math.floor(100000 + Math.random() * 900000)}`,
      description: '',
      category,
      price: Number(price) || 0,
      stock: Number(stock) || 0,
      lowStockThreshold: Number(lowStockThreshold) || 10,
      gstRate: Number(gstRate) || 18,
      unit,
      images: [],
      tags: [],
      isActive: true,
    }, {
      onSuccess: () => {
        setAddModalOpen(false);
      }
    });
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setSku(p.sku);
    setHsnCode(p.hsnCode || 'HSN8471');
    setCategory(p.category || 'Electronics');
    setPrice(String(p.price));
    setStock(String(p.stock));
    setLowStockThreshold(String(p.lowStockThreshold || 10));
    setGstRate(String(p.gstRate || 18));
    setUnit(p.unit || 'pcs');
    setEditModalOpen(true);
  };

  const handleEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProductMutation.mutate({
      id: editingProduct.id,
      name,
      sku,
      category,
      price: Number(price) || 0,
      stock: Number(stock) || 0,
      lowStockThreshold: Number(lowStockThreshold) || 10,
      gstRate: Number(gstRate) || 18,
      unit,
    }, {
      onSuccess: () => {
        setEditModalOpen(false);
      }
    });
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation.mutate(id);
    }
  };

  const filtered = products.filter(p =>
    (catFilter === 'All' || p.category === catFilter) &&
    (!search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()))
  );

  const lowStockCount = products.filter(p => p.stock <= (p.lowStockThreshold || 10)).length;
  const inventoryValue = products.reduce((acc, curr) => acc + (curr.price * curr.stock), 0);

  return (
    <>
      <Topbar title="Inventory & Catalog" subtitle="Track product depletions, HSN categories, and state-compliant GST tax assignments." action={{ label: 'Add Product', onClick: handleOpenAddModal }} />
      
      <main className="flex-1 overflow-y-auto p-6 space-y-6 text-left">

        {/* KPI METRICS */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard label="Total Products" value={isLoading ? "..." : String(products.length)} trend="neutral" icon={Package} iconBg="bg-violet-500/10" iconColor="text-violet-500" index={0} />
          <KpiCard label="Low Stock Items" value={isLoading ? "..." : String(lowStockCount)} trend={lowStockCount > 0 ? "down" : "neutral"} icon={AlertTriangle} iconBg="bg-rose-500/10" iconColor="text-rose-500" index={1} />
          <KpiCard label="Inventory Gross Value" value={isLoading ? "..." : `₹${inventoryValue.toLocaleString('en-IN')}`} trend="neutral" icon={IndianRupee} iconBg="bg-emerald-500/10" iconColor="text-emerald-500" index={2} />
          <KpiCard label="Item Categories" value={isLoading ? "..." : "5"} trend="neutral" icon={Tag} iconBg="bg-amber-500/10" iconColor="text-amber-500" index={3} />
        </div>

        {lowStockCount > 0 && !isLoading && (
          <div className="flex items-center gap-3 rounded-lg border border-rose-500/20 bg-rose-500/5 px-4 py-3">
            <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0" />
            <p className="text-xs text-muted-foreground flex-1">
              <span className="font-semibold text-rose-500">{lowStockCount} items</span> are below reorder thresholds. Recommend dispatching supplier bills.
            </p>
          </div>
        )}

        {/* MAIN LEDGER PORTFOLIO */}
        <Card className="bg-card border-border shadow-sm overflow-hidden">
          <CardHeader className="pb-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-sm font-bold text-foreground uppercase tracking-wider">Product Catalog Ledger</CardTitle>
              <CardDescription>Comprehensive catalog records showing GST coefficients, HSN short-codes, and warehouse quantities.</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search catalog..." className="pl-8 h-8.5 w-44 text-xs" />
              </div>
              <Button onClick={handleOpenAddModal} size="sm" className="h-8.5 text-xs brand-gradient text-white flex items-center gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Add Product
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <Package className="h-12 w-12 mx-auto text-border stroke-1" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">No products added yet</h4>
                  <p className="text-[11px] text-muted-foreground">Start populating your catalog to enable sales invoice creations.</p>
                </div>
                <Button onClick={handleOpenAddModal} size="sm" className="brand-gradient text-white text-xs h-8">
                  Add First Product
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/30 border-b border-border">
                      <th className="p-3 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Product Details</th>
                      <th className="p-3 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">SKU Code</th>
                      <th className="p-3 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">HSN Code</th>
                      <th className="p-3 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Category</th>
                      <th className="p-3 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">GST Rate</th>
                      <th className="p-3 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Sale Price</th>
                      <th className="p-3 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Stock Level</th>
                      <th className="p-3 text-[10px] font-bold uppercase text-muted-foreground tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filtered.map(p => {
                      const isLow = p.stock <= (p.lowStockThreshold || 10);
                      return (
                        <tr key={p.id} className="hover:bg-muted/10 transition-colors">
                          <td className="p-3 text-xs font-semibold text-foreground flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                              <Package className="h-4.5 w-4.5 text-primary" />
                            </div>
                            <span>{p.name}</span>
                          </td>
                          <td className="p-3 font-mono text-xs text-muted-foreground">{p.sku}</td>
                          <td className="p-3 font-mono text-xs text-muted-foreground">{p.hsnCode || 'HSN8471'}</td>
                          <td className="p-3">
                            <Badge variant="secondary" className="text-[9px] font-bold uppercase tracking-wider">{p.category || 'General'}</Badge>
                          </td>
                          <td className="p-3 text-xs text-slate-300 font-bold">{p.gstRate || 18}% GST</td>
                          <td className="p-3 text-xs font-bold text-white">₹{p.price.toLocaleString('en-IN')} / {p.unit || 'pcs'}</td>
                          <td className="p-3">
                            <div className="space-y-1 w-24">
                              <div className="flex items-center gap-1.5">
                                {isLow && <AlertTriangle className="h-3 w-3 text-rose-500 shrink-0 animate-bounce" />}
                                <span className={`text-xs font-bold ${isLow ? 'text-rose-400' : 'text-slate-300'}`}>{p.stock} {p.unit || 'pcs'}</span>
                              </div>
                              <Progress value={(p.stock / Math.max(p.stock, (p.lowStockThreshold || 10) * 3)) * 100} className="h-1 [&>div]:bg-primary" />
                            </div>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex gap-1 justify-end">
                              <Button onClick={() => handleOpenEditModal(p)} variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-white"><Edit className="h-3.5 w-3.5" /></Button>
                              <Button onClick={() => handleDeleteProduct(p.id)} variant="ghost" size="icon" className="h-7 w-7 text-rose-500 hover:text-rose-400"><Trash2 className="h-3.5 w-3.5" /></Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* MODALS: ADD PRODUCT */}
        {addModalOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <Card className="bg-card border-border w-full max-w-lg shadow-xl relative text-left">
              <button onClick={() => setAddModalOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-white">
                <X className="h-4 w-4" />
              </button>
              <CardHeader>
                <CardTitle className="text-sm font-bold text-white uppercase tracking-wider">Catalog New Item</CardTitle>
                <CardDescription>Fill categories, custom HSN codes, and compliance GST parameters.</CardDescription>
              </CardHeader>
              <form onSubmit={handleAddProduct}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Product Name</label>
                      <Input value={name} onChange={e => setName(e.target.value)} placeholder="E.g., LED Smart TV" className="h-9 text-xs" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">SKU Code (Auto)</label>
                      <Input value={sku} onChange={e => setSku(e.target.value)} className="h-9 text-xs" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">HSN Code</label>
                      <Input value={hsnCode} onChange={e => setHsnCode(e.target.value)} className="h-9 text-xs" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Category</label>
                      <select value={category} onChange={e => setCategory(e.target.value)} className="w-full h-9 bg-card border border-border text-xs rounded-lg px-2 text-foreground focus:outline-none">
                        <option value="Electronics">Electronics</option>
                        <option value="Apparel">Apparel</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Food">Food</option>
                        <option value="Raw Materials">Raw Materials</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Unit type</label>
                      <select value={unit} onChange={e => setUnit(e.target.value)} className="w-full h-9 bg-card border border-border text-xs rounded-lg px-2 text-foreground focus:outline-none">
                        <option value="pcs">pcs</option>
                        <option value="kg">kg</option>
                        <option value="box">box</option>
                        <option value="litre">litre</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Sale Price (INR)</label>
                      <Input type="number" value={price} onChange={e => setPrice(e.target.value)} className="h-9 text-xs" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">GST Rate (%)</label>
                      <select value={gstRate} onChange={e => setGstRate(e.target.value)} className="w-full h-9 bg-card border border-border text-xs rounded-lg px-2 text-foreground focus:outline-none">
                        <option value="5">5%</option>
                        <option value="12">12%</option>
                        <option value="18">18%</option>
                        <option value="28">28%</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Initial Stock</label>
                      <Input type="number" value={stock} onChange={e => setStock(e.target.value)} className="h-9 text-xs" />
                    </div>
                  </div>
                </CardContent>
                <div className="p-4 border-t border-border flex justify-end gap-2.5">
                  <Button type="button" onClick={() => setAddModalOpen(false)} variant="outline" className="h-9 text-xs">Cancel</Button>
                  <Button type="submit" disabled={createProductMutation.isPending} className="brand-gradient text-white text-xs h-9 font-semibold">
                    {createProductMutation.isPending ? 'Publishing...' : 'Publish Item'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* MODALS: EDIT PRODUCT */}
        {editModalOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <Card className="bg-card border-border w-full max-w-lg shadow-xl relative text-left">
              <button onClick={() => setEditModalOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-white">
                <X className="h-4 w-4" />
              </button>
              <CardHeader>
                <CardTitle className="text-sm font-bold text-white uppercase tracking-wider">Modify Catalog Specs</CardTitle>
              </CardHeader>
              <form onSubmit={handleEditProduct}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Product Name</label>
                      <Input value={name} onChange={e => setName(e.target.value)} className="h-9 text-xs" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">SKU Code</label>
                      <Input value={sku} onChange={e => setSku(e.target.value)} className="h-9 text-xs" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">HSN Code</label>
                      <Input value={hsnCode} onChange={e => setHsnCode(e.target.value)} className="h-9 text-xs" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Category</label>
                      <select value={category} onChange={e => setCategory(e.target.value)} className="w-full h-9 bg-card border border-border text-xs rounded-lg px-2 text-foreground focus:outline-none">
                        <option value="Electronics">Electronics</option>
                        <option value="Apparel">Apparel</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Food">Food</option>
                        <option value="Raw Materials">Raw Materials</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Unit type</label>
                      <select value={unit} onChange={e => setUnit(e.target.value)} className="w-full h-9 bg-card border border-border text-xs rounded-lg px-2 text-foreground focus:outline-none">
                        <option value="pcs">pcs</option>
                        <option value="kg">kg</option>
                        <option value="box">box</option>
                        <option value="litre">litre</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Sale Price (INR)</label>
                      <Input type="number" value={price} onChange={e => setPrice(e.target.value)} className="h-9 text-xs" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">GST Rate (%)</label>
                      <select value={gstRate} onChange={e => setGstRate(e.target.value)} className="w-full h-9 bg-card border border-border text-xs rounded-lg px-2 text-foreground focus:outline-none">
                        <option value="5">5%</option>
                        <option value="12">12%</option>
                        <option value="18">18%</option>
                        <option value="28">28%</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Warehouse Stock</label>
                      <Input type="number" value={stock} onChange={e => setStock(e.target.value)} className="h-9 text-xs" />
                    </div>
                  </div>
                </CardContent>
                <div className="p-4 border-t border-border flex justify-end gap-2.5">
                  <Button type="button" onClick={() => setEditModalOpen(false)} variant="outline" className="h-9 text-xs">Cancel</Button>
                  <Button type="submit" disabled={updateProductMutation.isPending} className="brand-gradient text-white text-xs h-9 font-semibold">
                    {updateProductMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

      </main>
    </>
  );
}
