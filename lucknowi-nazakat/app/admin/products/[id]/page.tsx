<img
  src={product.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800'}
  alt={product.name}
  className="w-full h-auto object-cover rounded-lg shadow-sm"
  onError={(e) => {
    // Agar image load na ho toh default elegant Chikankari image dikhayein
    e.currentTarget.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800';
  }}
/>