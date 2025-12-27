export default function AppLayout({ children }) {
  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50">
      <header className="h-12 bg-white border-b border-gray-200 flex items-center px-4">
        <h1 className="text-lg font-semibold text-gray-800">
          Visual JSON Schema Builder
        </h1>
      </header>
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  )
}
