'use server'

import { z } from 'zod'

const schema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  webhookUrl: z.string().url("Invalid webhook URL"),
})

export async function sendWebhook(formData: FormData) {
  const validatedFields = schema.safeParse({
    message: formData.get('message'),
    webhookUrl: formData.get('webhookUrl'),
  })

  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message }
  }

  const { message, webhookUrl } = validatedFields.data

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: message }),
    })

    if (!response.ok) {
      throw new Error('Failed to send message')
    }

    return { success: true }
  } catch (error) {
    return { error: "Failed to send message" }
  }
}

