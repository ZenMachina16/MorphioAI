import { NextRequest, NextResponse } from 'next/server'

const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3"

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

  // Format the prompt using Mistral's instruction format: [INST] ... [/INST]
  const prompt = `[INST] ${platformConfig.systemPrompt}

${platformConfig.instruction}

Original content:
${content}

Please provide the transformed content for ${platform}: [/INST]`

  try {
    console.log(`Calling Hugging Face API for ${platform}...`)
    
    const response = await fetch(HUGGINGFACE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACEHUB_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
          do_sample: true,
          return_full_text: false,
          stop: ["[INST]", "[/INST]", "</s>"]
        },
        options: {
          wait_for_model: true,
          use_cache: false
        }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Hugging Face API error: ${response.status} - ${errorText}`)
      throw new Error(`Hugging Face API error: ${response.status} - ${errorText}`)
    }

    const result = await response.json()
    console.log(`Raw API response for ${platform}:`, JSON.stringify(result, null, 2))
    
    if (result.error) {
      console.error(`Hugging Face API error:`, result.error)
      throw new Error(`Hugging Face API error: ${result.error}`)
    }

    let generatedText = ''
    
    // Handle different response formats from Hugging Face
    if (Array.isArray(result)) {
      generatedText = result[0]?.generated_text || ''
    } else if (result.generated_text) {
      generatedText = result.generated_text
    } else if (typeof result === 'string') {
      generatedText = result
    } else {
      console.error('Unexpected response format:', result)
      throw new Error('Unexpected response format from Hugging Face API')
    }
    
    // Clean up the generated text
    generatedText = generatedText.trim()
    
    // Remove any instruction formatting that might remain
    generatedText = generatedText.replace(/\[INST\].*?\[\/INST\]/gs, '').trim()
    generatedText = generatedText.replace(/^(Generated content:|Transformed content:|Content for|Response:)/gm, '').trim()
    
    // If the text is empty, provide a fallback
    if (!generatedText) {
      throw new Error('Empty response from Mistral model')
    }

    console.log(`Generated content for ${platform}:`, generatedText)
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

    if (!process.env.HUGGINGFACEHUB_API_TOKEN) {
      console.error('Hugging Face API token not configured')
      return NextResponse.json(
        { error: 'Hugging Face API token not configured. Please add HUGGINGFACEHUB_API_TOKEN to your environment variables.' },
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
        results[platform] = `Error: ${errors[platform]}`
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