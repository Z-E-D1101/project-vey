'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Box,
  Button,
  FormControl,
  TextInput,
  Heading,
  Text,
  Stack,
  Flash,
} from '@primer/react'
import { PersonIcon, MailIcon, LockIcon } from '@primer/octicons-react'
import { authClient } from '@/lib/auth-client'
import { BrandMark } from '@/components/brand-mark'

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isSignUp = mode === 'sign-up'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = isSignUp
      ? await authClient.signUp.email({ email, password, name })
      : await authClient.signIn.email({ email, password })

    setLoading(false)

    if (error) {
      setError(error.message ?? 'Something went wrong')
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
        background:
          'radial-gradient(1200px 600px at 50% -10%, var(--bgColor-accent-muted), transparent), var(--bgColor-default)',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 400,
          backgroundColor: 'var(--bgColor-default)',
          border: '1px solid var(--borderColor-default)',
          borderRadius: 'var(--borderRadius-large)',
          boxShadow: 'var(--shadow-floating-large)',
          padding: 5,
        }}
      >
        <Stack direction="vertical" gap="spacious">
          <Stack direction="vertical" gap="condensed" align="center">
            <BrandMark size={40} />
            <Heading as="h1" sx={{ fontSize: 4, textAlign: 'center' }}>
              {isSignUp ? 'Create your assistant' : 'Welcome back'}
            </Heading>
            <Text sx={{ color: 'var(--fgColor-muted)', textAlign: 'center' }}>
              {isSignUp
                ? 'Mneme learns who you are and grows with every conversation.'
                : 'Sign in to pick up where you and your assistant left off.'}
            </Text>
          </Stack>

          <form onSubmit={handleSubmit}>
            <Stack direction="vertical" gap="normal">
              {isSignUp && (
                <FormControl required>
                  <FormControl.Label>Name</FormControl.Label>
                  <TextInput
                    block
                    leadingVisual={PersonIcon}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    placeholder="Ada Lovelace"
                  />
                </FormControl>
              )}
              <FormControl required>
                <FormControl.Label>Email</FormControl.Label>
                <TextInput
                  block
                  type="email"
                  leadingVisual={MailIcon}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="you@example.com"
                />
              </FormControl>
              <FormControl required>
                <FormControl.Label>Password</FormControl.Label>
                <TextInput
                  block
                  type="password"
                  leadingVisual={LockIcon}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  placeholder="At least 8 characters"
                />
                <FormControl.Caption>
                  {isSignUp ? 'Use 8 or more characters.' : ''}
                </FormControl.Caption>
              </FormControl>

              {error && (
                <Flash variant="danger" role="alert">
                  {error}
                </Flash>
              )}

              <Button
                type="submit"
                variant="primary"
                block
                disabled={loading}
                size="large"
              >
                {loading
                  ? 'Please wait…'
                  : isSignUp
                    ? 'Create account'
                    : 'Sign in'}
              </Button>
            </Stack>
          </form>

          <Text sx={{ textAlign: 'center', color: 'var(--fgColor-muted)' }}>
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <Link
              href={isSignUp ? '/sign-in' : '/sign-up'}
              style={{ color: 'var(--fgColor-accent)', fontWeight: 600 }}
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </Link>
          </Text>
        </Stack>
      </Box>
    </Box>
  )
}
