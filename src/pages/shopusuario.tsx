import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

type Product = {
  id: number
  name: string
  price: number
  image: string
  description: string
}

export default function ShopUsuario() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<Product[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [showCartList, setShowCartList] = useState(true)

  useEffect(() => {
    // 1. Obtener usuario logueado
    const saved = localStorage.getItem('currentUser')
    let userObj: any = null
    if (saved) {
      userObj = JSON.parse(saved)
      setCurrentUser(userObj)
    }

    // 2. Obtener productos de la tienda
    fetch(`${API_URL}/shop`)
      .then((res) => {
        if (!res.ok) throw new Error('Error al obtener productos')
        return res.json()
      })
      .then((data) => {
        setProducts(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })

    // 3. Obtener el carrito del usuario si está autenticado
    if (userObj) {
      fetch(`${API_URL}/users/${userObj.id}/cart`)
        .then((res) => {
          if (!res.ok) throw new Error('Error al obtener carrito')
          return res.json()
        })
        .then((data) => {
          if (data && data.items) {
            setCart(data.items)
          }
        })
        .catch((err) => console.error(err))
    }
  }, [])

  const handleAddToCart = async (product: Product) => {
    if (!currentUser) {
      Swal.fire({
        icon: 'info',
        title: 'Inicia sesión',
        text: 'Debes iniciar sesión en tu Perfil para agregar productos al carrito.',
        confirmButtonColor: '#1e3c72',
        background: '#fff',
      })
      return
    }

    try {
      const response = await fetch(`${API_URL}/users/${currentUser.id}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      })

      if (!response.ok) {
        throw new Error('Error al agregar al carrito')
      }

      const updatedCart = await response.json()
      if (updatedCart && updatedCart.items) {
        setCart(updatedCart.items)
      }

      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      })
      Toast.fire({
        icon: 'success',
        title: `¡"${product.name}" agregado al carrito!`,
      })
    } catch (error) {
      console.error(error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo agregar el producto al carrito.',
        confirmButtonColor: '#ef4444',
        background: '#fff',
      })
    }
  }

  const handleClearCart = async () => {
    if (!currentUser) return
    const result = await Swal.fire({
      icon: 'question',
      title: '¿Vaciar carrito?',
      text: '¿Deseas vaciar tu carrito? Esta acción no se puede deshacer.',
      showCancelButton: true,
      confirmButtonText: 'Sí, vaciar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      background: '#fff',
    })
    if (!result.isConfirmed) return

    try {
      const response = await fetch(`${API_URL}/users/${currentUser.id}/cart`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Error al vaciar el carrito')
      }

      setCart([])
      Swal.fire({
        icon: 'success',
        title: '¡Carrito vaciado!',
        text: 'Tu carrito ha sido vaciado correctamente.',
        confirmButtonColor: '#10b981',
        background: '#fff',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      })
    } catch (error) {
      console.error(error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo vaciar el carrito.',
        confirmButtonColor: '#ef4444',
        background: '#fff',
      })
    }
  }

  const handleCheckout = async () => {
    if (!currentUser) return
    if (cart.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Carrito vacío',
        text: 'Tu carrito está vacío. Agrega productos antes de finalizar la compra.',
        confirmButtonColor: '#0f172a',
        background: '#fff',
      })
      return
    }

    try {
      const response = await fetch(`${API_URL}/users/${currentUser.id}/cart/checkout`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Error al finalizar la compra')
      }

      setCart([])
      Swal.fire({
        icon: 'success',
        title: '¡Compra exitosa! 🎉',
        text: '¡Las figuritas se han añadido a tu álbum correctamente!',
        confirmButtonColor: '#10b981',
        background: '#fff',
        timer: 3500,
        timerProgressBar: true,
        showConfirmButton: false,
      })
    } catch (error) {
      console.error(error)
      Swal.fire({
        icon: 'error',
        title: 'Error al comprar',
        text: 'No se pudo finalizar la compra. Intenta nuevamente.',
        confirmButtonColor: '#ef4444',
        background: '#fff',
      })
    }
  }

  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0)

  // Agrupar productos repetidos
  const groupedCart = cart.reduce((acc: any[], item) => {
    const existing = acc.find(x => x.id === item.id)
    if (existing) {
      existing.quantity += 1
    } else {
      acc.push({ ...item, quantity: 1 })
    }
    return acc
  }, [])

  return (
    <main
      style={{
        padding: '40px 20px',
        background: '#ffffffff',
        minHeight: '100vh',
        fontFamily: 'sans-serif',
        position: 'relative', 
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          background: '#ffffff', 
          padding: '16px',
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          zIndex: 10,
          minWidth: '240px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span 
            onClick={() => setShowCartList(!showCartList)}
            style={{ color: '#333333', fontSize: 14, fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', userSelect: 'none' }}
            title={showCartList ? 'Ocultar lista' : 'Mostrar lista'}
          >
            🛒 Mi Carrito ({cart.length}) {showCartList ? '▼' : '▶'}
          </span>
          {cart.length > 0 && (
            <button
              onClick={handleClearCart}
              style={{
                background: 'none',
                border: 'none',
                color: '#dc3545',
                cursor: 'pointer',
                fontSize: 12,
                textDecoration: 'underline',
                padding: 0
              }}
            >
              Vaciar
            </button>
          )}
        </div>
        
        {showCartList && cart.length > 0 && (
          <div style={{ 
            maxHeight: '120px', 
            overflowY: 'auto', 
            borderTop: '1px solid #f1f5f9', 
            paddingTop: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            {groupedCart.map((item, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#475569' }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px' }} title={`${item.name} (${item.quantity} unidades)`}>
                  {item.name} {item.quantity > 1 ? `x${item.quantity}` : ''}
                </span>
                <span style={{ fontWeight: '500' }}>${item.price * item.quantity}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, color: '#64748b' }}>Total:</span>
          <span style={{ fontSize: 16, fontWeight: 'bold', color: '#1e293b' }}>
            ${totalAmount}
          </span>
        </div>

        {cart.length > 0 && (
          <button
            onClick={handleCheckout}
            style={{
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              padding: '8px 12px',
              fontSize: 13,
              fontWeight: 'bold',
              cursor: 'pointer',
              width: '100%',
              transition: 'background 0.2s',
            }}
          >
            Finalizar Compra
          </button>
        )}
      </div>

      {loading ? (
        <h2 style={{ color: '#333', textAlign: 'center', marginTop: 60 }}>Cargando productos...</h2>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 30,
            maxWidth: 1000, 
            margin: '80px auto 0' 
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                background: 'linear-gradient(to bottom, #a3a3a3, #8c8c8c)', 
                borderRadius: 20,
                boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center', 
                padding: '30px 20px 20px 20px', 
              }}
            >
              {/* Imagen del producto */}
              <img
                src={product.image || '/assets/sobre de figuritas.png'}
                alt={product.name}
                style={{
                  width: '80%',        
                  height: 200,          
                  objectFit: 'contain', 
                  marginBottom: 20,
                  filter: 'drop-shadow(0px 10px 10px rgba(0,0,0,0.2))' 
                }}
              />

              <div style={{ width: '100%', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <h2 style={{ margin: 0, fontSize: 18, color: 'white', fontWeight: 'normal' }}>
                    {product.name}
                  </h2>
                  <span style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>
                    ${product.price}
                  </span>
                </div>

                {/* Descripción */}
                <p
                  style={{
                    color: '#e0e0e0',
                    fontSize: 13,
                    lineHeight: '1.4',
                    marginBottom: 25,
                    textAlign: 'left',
                  }}
                >
                  {product.description || `${product.stickersCount} figuritas.`}
                </p>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <button
                    onClick={() => handleAddToCart(product)}
                    style={{
                      padding: '10px 20px',
                      background: '#549bf2ff', 
                      border: 'none',
                      borderRadius: 8,
                      color: 'white',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: 14,
                      transition: 'background 0.2s',
                      width: '100%',
                    }}
                  >
                    Agregar a carrito
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}