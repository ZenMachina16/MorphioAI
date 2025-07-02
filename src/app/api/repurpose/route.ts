import { NextRequest, NextResponse } from 'next/server'
import { InferenceClient } from "@huggingface/inference"

interface RepurposeRequest {
  content: string
  platforms: string[]
}

interface PlatformPrompts {
  [key: string]: {
    systemPrompt: string
    instruction: string
  }
}

const platformPrompts: PlatformPrompts = {
  twitter: {
    systemPrompt: "You are an expert social media manager specializing in Twitter/X content creation.",
    instruction: "Transform the following content into an engaging Twitter/X post. Keep it concise (under 280 characters), use relevant hashtags, and make it shareable and engaging. Focus on the key message:"
  },
  linkedin: {
    systemPrompt: "You are a professional LinkedIn content strategist who creates business-focused content.",
    instruction: "Transform the following content into a professional LinkedIn post. Use a professional tone, provide insights, encourage professional engagement, and make it valuable for business professionals:"
  },
  instagram: {
    systemPrompt: "You are an Instagram content creator expert who creates engaging, visual-friendly content.",
    instruction: "Transform the following content into an engaging Instagram caption. Make it engaging, use emojis appropriately, include relevant hashtags, and encourage interaction:"
  }
}

async function generateContent(content: string, platform: string): Promise<string> {
  const platformConfig = platformPrompts[platform]
  if (!platformConfig) {
    throw new Error(`Unsupported platform: ${platform}`)
  }

  // Initialize the Hugging Face client
  const client = new InferenceClient(process.env.HF_TOKEN)

  try {
    console.log(`Calling Hugging Face API for ${platform}...`)
    
    const chatCompletion = await client.chatCompletion({
      provider: "featherless-ai",
      model: "microsoft/DialoGPT-medium",
      messages: [
        {
          role: "system",
          content: platformConfig.systemPrompt
        },
        {
          role: "user",
          content: `${platformConfig.instruction}

Original content:
${content}

Please provide the transformed content for ${platform}:`
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    })

    const generatedText = chatCompletion.choices[0]?.message?.content || ''
    
    if (!generatedText.trim()) {
      throw new Error('Empty response from model')
    }

    console.log(`Generated content for ${platform}:`, generatedText)
    return generatedText.trim()

  } catch (error) {
    console.error(`Error generating content for ${platform}:`, error)
    
    // Fallback to a simpler approach if the API fails
    if (error instanceof Error && (error.message.includes('paused') || error.message.includes('400') || error.message.includes('503'))) {
      console.log(`Falling back to simple transformation for ${platform}`)
      return generateFallbackContent(content, platform)
    }
    
    throw error
  }
}

function generateFallbackContent(content: string, platform: string): string {
  // Simple fallback transformations
  switch (platform) {
    case 'twitter':
      const twitterContent = content.length > 240 ? content.substring(0, 240) + '...' : content
      return `${twitterContent} #AI #ContentCreation #SocialMedia`
    
    case 'linkedin':
      return `🚀 ${content}

What are your thoughts on this? Share your experience in the comments below!

#LinkedIn #ProfessionalGrowth #ContentStrategy`
    
    case 'instagram':
      return `✨ ${content}

What do you think? Let me know in the comments! 👇

#Instagram #Content #Inspiration #CreativeContent`
    
    default:
      return content
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: RepurposeRequest = await request.json()
    const { content, platforms } = body

    console.log('Received request:', { contentLength: content?.length, platforms })

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

    if (!process.env.HF_TOKEN) {
      console.error('Hugging Face API token not configured')
      return NextResponse.json(
        { error: 'Hugging Face API token not configured. Please add HF_TOKEN to your environment variables.' },
        { status: 500 }
      )
    }

    const results: { [key: string]: string } = {}
    const errors: { [key: string]: string } = {}

    // Generate content for each selected platform
    for (const platform of platforms) {
      try {
        console.log(`Starting generation for platform: ${platform}`)
        results[platform] = await generateContent(content, platform)
        console.log(`Successfully generated content for ${platform}`)
      } catch (error) {
        console.error(`Failed to generate content for ${platform}:`, error)
        errors[platform] = error instanceof Error ? error.message : 'Unknown error occurred'
        
        // Use fallback content if API fails
        try {
          results[platform] = generateFallbackContent(content, platform)
          console.log(`Used fallback content for ${platform}`)
        } catch (fallbackError) {
          results[platform] = `Error: ${errors[platform]}`
        }
      }
    }

    console.log('Final results:', results)
    console.log('Errors encountered:', errors)

    return NextResponse.json({ 
      results,
      ...(Object.keys(errors).length > 0 && { errors })
    })

  } catch (error) {
    console.error('Error in repurpose API:', error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
} 