import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'
import * as cheerio from 'cheerio'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

type Platform = 'twitter' | 'linkedin' | 'instagram'

interface RepurposeResponse {
  inputType: string
  targetPlatforms: string[]
  twitterPosts?: string[]
  linkedinPost?: string
  instagramCaption?: string
}

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user's session using createServerSupabaseClient
    const supabase = await createServerSupabaseClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    // If no user session, return 401 Unauthorized
    if (sessionError || !session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = session.user

    // Read JSON body from request
    const body = await request.json()
    const { text, url, inputType } = body

    if (!inputType) {
      return NextResponse.json({ error: 'Input type is required' }, { status: 400 })
    }

    // Get user profile and check subscription status
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      // If profile doesn't exist, create one
      await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          subscription_status: 'free',
          usage_count: 0,
        })
    }

    let contentToRepurpose = text

    // If URL is provided, scrape the content
    if (url) {
      try {
        const response = await fetch(url)
        const html = await response.text()
        const $ = cheerio.load(html)
        
        // Remove script, style, and other unwanted elements
        $('script, style, nav, header, footer, aside').remove()
        
        // Try to extract main content (common selectors)
        let extractedText = $('article').text() || 
                           $('[role="main"]').text() || 
                           $('.content').text() || 
                           $('#content').text() || 
                           $('main').text() || 
                           $('body').text()

        contentToRepurpose = extractedText.trim()
      } catch (error) {
        return NextResponse.json({ error: 'Failed to scrape URL content' }, { status: 400 })
      }
    }

    if (!contentToRepurpose) {
      return NextResponse.json({ error: 'No content provided' }, { status: 400 })
    }

    // Define conversion logic based on input type
    const conversionMap: Record<string, Platform[]> = {
      'youtube-transcript': ['twitter', 'linkedin', 'instagram'],
      'linkedin-post': ['twitter', 'instagram'],
      'twitter-post': ['linkedin', 'instagram'],
      'instagram-post': ['linkedin', 'twitter'],
      'blog-article': ['twitter', 'linkedin', 'instagram'],
      'general-content': ['twitter', 'linkedin', 'instagram']
    }

    const targetPlatforms = conversionMap[inputType] || ['twitter', 'linkedin', 'instagram']

    // Create platform-specific prompts
    const prompts: Promise<OpenAI.Chat.Completions.ChatCompletion>[] = []
    const platformNames: Platform[] = []

    if (targetPlatforms.includes('twitter')) {
      platformNames.push('twitter')
      prompts.push(
        openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `You are a social media expert specializing in X (Twitter) content. Transform the given ${inputType.replace('-', ' ')} into 3 engaging Twitter posts. Each post should:
              - Be under 280 characters
              - Include relevant hashtags (2-3 max)
              - Be engaging and conversational
              - Extract key insights or quotes from the original content
              - Use emojis sparingly but effectively
              - Maintain the core message while adapting to Twitter's format
              Return only the posts, separated by "---"`
            },
            {
              role: 'user',
              content: contentToRepurpose
            }
          ],
          max_tokens: 1000,
          temperature: 0.7,
        })
      )
    }

    if (targetPlatforms.includes('linkedin')) {
      platformNames.push('linkedin')
      prompts.push(
        openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `You are a LinkedIn content specialist. Transform the given ${inputType.replace('-', ' ')} into a professional LinkedIn post that:
              - Is 1300-3000 characters long
              - Uses a professional but engaging tone
              - Includes 3-5 relevant hashtags at the end
              - Has a clear hook in the first line
              - Provides value and professional insights
              - Encourages engagement with a thoughtful question or call-to-action
              - Uses line breaks for readability
              - Adapts the original content for a professional audience`
            },
            {
              role: 'user',
              content: contentToRepurpose
            }
          ],
          max_tokens: 1500,
          temperature: 0.7,
        })
      )
    }

    if (targetPlatforms.includes('instagram')) {
      platformNames.push('instagram')
      prompts.push(
        openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `You are an Instagram content creator. Transform the given ${inputType.replace('-', ' ')} into an engaging Instagram caption that:
              - Is visually appealing with line breaks and spacing
              - Uses emojis throughout to break up text and add visual interest
              - Includes 5-10 relevant hashtags at the end
              - Has a conversational, authentic tone
              - Tells a story or shares insights in an engaging way
              - Encourages engagement with questions
              - Is around 300-1000 characters
              - Adapts the content for Instagram's visual and community-focused platform`
            },
            {
              role: 'user',
              content: contentToRepurpose
            }
          ],
          max_tokens: 1200,
          temperature: 0.7,
        })
      )
    }

    // Run all prompts in parallel using Promise.all
    const results = await Promise.all(prompts)

    // Structure the response based on generated platforms
    const response: RepurposeResponse = { 
      inputType, 
      targetPlatforms: targetPlatforms as string[] 
    }

    results.forEach((result, index) => {
      const platform = platformNames[index]
      const content = result.choices[0]?.message?.content || ''

      if (platform === 'twitter') {
        // Split Twitter posts by separator
        response.twitterPosts = content.split('---').map(post => post.trim()).filter(post => post.length > 0)
      } else if (platform === 'linkedin') {
        response.linkedinPost = content
      } else if (platform === 'instagram') {
        response.instagramCaption = content
      }
    })

    // Update usage count
    if (profile) {
      await supabase
        .from('profiles')
        .update({ usage_count: (profile.usage_count || 0) + 1 })
        .eq('id', user.id)
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Error in repurpose API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 