import { NextRequest, NextResponse } from 'next/server'

const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3"

interface RepurposeRequest {
  content: string
  platforms: string[]
}

interface PlatformPrompts {
  [key: string]: {
    prompt: string
    maxLength: number
  }
}

const platformPrompts: PlatformPrompts = {
  twitter: {
    prompt: "Convert this content into an engaging Twitter/X post. Keep it concise, use relevant hashtags, and make it shareable. Maximum 280 characters:",
    maxLength: 280
  },
  linkedin: {
    prompt: "Transform this content into a professional LinkedIn post. Use a professional tone, include insights, and encourage engagement. Make it informative and business-focused:",
    maxLength: 1300
  },
  instagram: {
    prompt: "Create an Instagram caption from this content. Make it engaging, use emojis appropriately, include relevant hashtags, and encourage interaction:",
    maxLength: 2200
  }
}

async function generateContent(content: string, platform: string): Promise<string> {
  const platformConfig = platformPrompts[platform]
  if (!platformConfig) {
    throw new Error(`Unsupported platform: ${platform}`)
  }

  const prompt = `${platformConfig.prompt}\n\nOriginal content:\n${content}\n\nRepurposed content:`

  try {
    const response = await fetch(HUGGINGFACE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACEHUB_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 300,
          temperature: 0.7,
          do_sample: true,
          return_full_text: false
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status}`)
    }

    const result = await response.json()
    
    if (result.error) {
      throw new Error(`Hugging Face API error: ${result.error}`)
    }

    let generatedText = result[0]?.generated_text || result.generated_text || ''
    
    // Clean up the generated text
    generatedText = generatedText.replace(prompt, '').trim()
    
    // Ensure it doesn't exceed platform limits
    if (generatedText.length > platformConfig.maxLength) {
      generatedText = generatedText.substring(0, platformConfig.maxLength - 3) + '...'
    }

    return generatedText

  } catch (error) {
    console.error(`Error generating content for ${platform}:`, error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: RepurposeRequest = await request.json()
    const { content, platforms } = body

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    if (!platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: 'At least one platform must be selected' },
        { status: 400 }
      )
    }

    if (!process.env.HUGGINGFACEHUB_API_TOKEN) {
      return NextResponse.json(
        { error: 'Hugging Face API token not configured' },
        { status: 500 }
      )
    }

    const results: { [key: string]: string } = {}

    // Generate content for each selected platform
    for (const platform of platforms) {
      try {
        results[platform] = await generateContent(content, platform)
      } catch (error) {
        console.error(`Failed to generate content for ${platform}:`, error)
        results[platform] = `Error generating content for ${platform}. Please try again.`
      }
    }

    return NextResponse.json({ results })

  } catch (error) {
    console.error('Error in repurpose API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 