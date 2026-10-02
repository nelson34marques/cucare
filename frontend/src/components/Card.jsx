export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-white border border-line rounded-md ${className}`}>
      {children}
    </div>
  )
}
