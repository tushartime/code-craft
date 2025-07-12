"use client"
import { ClerkProvider, useAuth } from '@clerk/nextjs'
import { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import React from 'react'
// we put ! at the end of the process.env.NEXT_PUBLIC_CONVEX_URL! to tell typescript that we know this is not null
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

function ConvexClientProvider({children}:{children: React.ReactNode})
 {
  return (
    // taken from docs of convex--clerk 
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
    
    </ClerkProvider>
  )
}

export default ConvexClientProvider
