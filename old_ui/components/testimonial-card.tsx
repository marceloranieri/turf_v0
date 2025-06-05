import Image from "next/image"

interface TestimonialCardProps {
  quote: string
  author: string
  role: string
  avatar: string
}

export function TestimonialCard({ quote, author, role, avatar }: TestimonialCardProps) {
  return (
    <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all hover:shadow-lg hover:shadow-violet-500/5 hover:translate-y-[-4px]">
      <div className="mb-4">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9.33333 21.3333C7.86667 21.3333 6.66667 20.8 5.73333 19.7333C4.8 18.6667 4.33333 17.3333 4.33333 15.7333C4.33333 14.1333 4.8 12.6667 5.73333 11.3333C6.66667 10 7.86667 9.33333 9.33333 9.33333L10.6667 12C9.86667 12.2667 9.2 12.8 8.66667 13.6C8.13333 14.4 7.86667 15.2 7.86667 16C7.86667 16.2667 7.93333 16.4667 8.06667 16.6C8.2 16.7333 8.4 16.8 8.66667 16.8H10.6667C11.2 16.8 11.6667 17 12.0667 17.4C12.4667 17.8 12.6667 18.2667 12.6667 18.8V19.3333C12.6667 19.8667 12.4667 20.3333 12.0667 20.7333C11.6667 21.1333 11.2 21.3333 10.6667 21.3333H9.33333ZM20 21.3333C18.5333 21.3333 17.3333 20.8 16.4 19.7333C15.4667 18.6667 15 17.3333 15 15.7333C15 14.1333 15.4667 12.6667 16.4 11.3333C17.3333 10 18.5333 9.33333 20 9.33333L21.3333 12C20.5333 12.2667 19.8667 12.8 19.3333 13.6C18.8 14.4 18.5333 15.2 18.5333 16C18.5333 16.2667 18.6 16.4667 18.7333 16.6C18.8667 16.7333 19.0667 16.8 19.3333 16.8H21.3333C21.8667 16.8 22.3333 17 22.7333 17.4C23.1333 17.8 23.3333 18.2667 23.3333 18.8V19.3333C23.3333 19.8667 23.1333 20.3333 22.7333 20.7333C22.3333 21.1333 21.8667 21.3333 21.3333 21.3333H20Z"
            fill="#8B5CF6"
          />
        </svg>
      </div>

      <p className="text-lg mb-6">{quote}</p>

      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
          <Image src={avatar || "/placeholder.svg"} alt={author} width={40} height={40} className="object-cover" />
        </div>

        <div>
          <p className="font-medium">{author}</p>
          <p className="text-sm text-zinc-500">{role}</p>
        </div>
      </div>
    </div>
  )
}
