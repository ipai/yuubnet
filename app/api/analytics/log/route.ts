import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    let visitor;
    try {
      visitor = await request.json()
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError)
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      )
    }

    // Validate required fields
    const requiredFields = ['timestamp', 'path']
    for (const field of requiredFields) {
      if (!visitor[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Store in database
    await prisma.visitor.create({
      data: {
        timestamp: new Date(visitor.timestamp),
        ip: visitor.ip || null,
        userAgent: visitor.userAgent || null,
        path: visitor.path,
        referer: visitor.referer || null,
        country: visitor.country || null,
        city: visitor.city || null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to log visit:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to log visit', details: errorMessage },
      { status: 500 }
    )
  }
}
