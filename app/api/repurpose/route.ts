import { createServerSupabaseClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'
import * as cheerio from 'cheerio'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    // Verify user authentication
    const supabase = createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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

    // For now, we'll allow usage regardless of subscription status
    // In production, you'd check subscription_status and usage_count here

    const body = await request.json()
    const { text, url } = body

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

    // Create parallel OpenAI requests for different platforms
    const [xPostsResult, linkedinResult, instagramResult] = await Promise.all([
      // X (Twitter) Posts - Create multiple short posts
      openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a social media expert specializing in X (Twitter) content. Create 3-5 engaging Twitter posts from the given content. Each post should:
            - Be under 280 characters
            - Include relevant hashtags (2-3 max)
            - Be engaging and conversational
            - Extract key insights or quotes
            - Use emojis sparingly but effectively
            Return only the posts, separated by "---"`
          },
          {
            role: 'user',
            content: contentToRepurpose
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),

      // LinkedIn Post
      openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a LinkedIn content specialist. Transform the given content into a professional LinkedIn post that:
            - Is 1300-3000 characters long
            - Uses a professional but engaging tone
            - Includes 3-5 relevant hashtags at the end
            - Has a clear hook in the first line
            - Provides value and insights
            - Encourages engagement with a question or call-to-action
            - Uses line breaks for readability`
          },
          {
            role: 'user',
            content: contentToRepurpose
          }
        ],
        max_tokens: 1500,
        temperature: 0.7,
      }),

      // Instagram Caption
      openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an Instagram content creator. Transform the given content into an engaging Instagram caption that:
            - Is visually appealing with line breaks and spacing
            - Uses emojis throughout to break up text
            - Includes 5-10 relevant hashtags at the end
            - Has a conversational, authentic tone
            - Tells a story or shares insights
            - Encourages engagement with questions
            - Is around 300-1000 characters`
          },
          {
            role: 'user',
            content: contentToRepurpose
          }
        ],
        max_tokens: 1200,
        temperature: 0.7,
      }),
    ])

    // Process X posts (split by separator)
    const xPostsContent = xPostsResult.choices[0]?.message?.content || ''
    const xPosts = xPostsContent.split('---').map(post => post.trim()).filter(post => post.length > 0)

    // Get LinkedIn and Instagram content
    const linkedinPost = linkedinResult.choices[0]?.message?.content || ''
    const instagramCaption = instagramResult.choices[0]?.message?.content || ''

    // Update usage count (optional - for tracking)
    if (profile) {
      await supabase
        .from('profiles')
        .update({ usage_count: (profile.usage_count || 0) + 1 })
        .eq('id', user.id)
    }

    return NextResponse.json({
      xPosts,
      linkedinPost,
      instagramCaption,
    })

  } catch (error) {
    console.error('Error in repurpose API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 