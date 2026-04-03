import { createContext, useContext, useState } from "react"

type CartItem = { id: string; name: string; price: number; quantity: number; image: string }
type CartCtx = { cart: CartItem[]; addItem: (item: CartItem) => void; removeItem: (id: string) => void; updateQty: (id: string, qty: number) => void; clearCart: () => void; total: number }

const CartContext = createContext<CartCtx | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
    let [cart, setCart] = useState<CartItem[]>([])

    function addItem(item: CartItem) {
        setCart(prev => {
            let existing = prev.find(c => c.id === item.id)
            if (existing) return prev.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c)
            return [...prev, item]
        })
    }

    function removeItem(id: string) {
        setCart(prev => prev.filter(c => c.id !== id))
    }

    function updateQty(id: string, qty: number) {
        if (qty <= 0) return removeItem(id)
        setCart(prev => prev.map(c => c.id === id ? { ...c, quantity: qty } : c))
    }

    function clearCart() { setCart([]) }

    let total = cart.reduce((acc, c) => acc + c.price * c.quantity, 0)

    return (
        <CartContext.Provider value={{ cart, addItem, removeItem, updateQty, clearCart, total }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() { return useContext(CartContext)! }