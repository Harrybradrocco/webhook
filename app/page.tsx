'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { sendWebhook } from './actions/sendWebhook'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useToast } from '@/components/ui/use-toast'
import { ToastProvider } from "@/components/ui/toast"
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600'],
})

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Sending...' : 'Send to Discord'}
    </Button>
  )
}

export default function Home() {
  const [message, setMessage] = useState('')
  const [webhookUrl, setWebhookUrl] = useState('')
  const [showWebhookInput, setShowWebhookInput] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(formData: FormData) {
    const result = await sendWebhook(formData)
    if (result.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      })
    } else {
      toast({
        title: "Success",
        description: "Message sent to Discord",
      })
      setMessage('')
    }
  }

  return (
    <ToastProvider>
      <main className={`flex min-h-screen flex-col items-center justify-center p-24 ${poppins.className}`}>
        <div className="w-full max-w-md space-y-4">
          <h1 className="text-2xl font-bold text-center">Discord Webhook Sender</h1>
          <form action={handleSubmit} className="space-y-4">
            <Textarea
              name="message"
              placeholder="Paste your message here..."
              value={message}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
              className="min-h-[200px]"
            />
            {showWebhookInput && (
              <Input
                name="webhookUrl"
                type="url"
                placeholder="Enter Discord webhook URL"
                value={webhookUrl}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWebhookUrl(e.target.value)}
                required
              />
            )}
            <div className="flex justify-between items-center">
              <SubmitButton />
              <button
                type="button"
                onClick={() => setShowWebhookInput(!showWebhookInput)}
                className="text-sm text-blue-500 hover:underline"
              >
                {showWebhookInput ? 'Hide webhook URL' : 'Enter webhook URL'}
              </button>
            </div>
          </form>
        </div>
        <footer className="absolute bottom-4 right-4 text-sm text-gray-500">
          hbradroc@uwo.ca
        </footer>
      </main>
    </ToastProvider>
  )
}

