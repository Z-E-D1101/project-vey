'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Box,
  NavList,
  Text,
  ActionMenu,
  ActionList,
  Avatar,
  IconButton,
} from '@primer/react'
import {
  HomeIcon,
  CommentDiscussionIcon,
  DatabaseIcon,
  PersonIcon,
  ZapIcon,
  ClockIcon,
  GearIcon,
  SignOutIcon,
  ThreeBarsIcon,
  XIcon,
} from '@primer/octicons-react'
import { authClient } from '@/lib/auth-client'
import { BrandMark } from '@/components/brand-mark'

type NavItem = {
  href: string
  label: string
  icon: React.ComponentType
  description: string
}

const NAV: NavItem[] = [
  { href: '/', label: 'Overview', icon: HomeIcon, description: 'Dashboard' },
  {
    href: '/chat',
    label: 'Chat',
    icon: CommentDiscussionIcon,
    description: 'Talk to your assistant',
  },
  {
    href: '/memory',
    label: 'Memory',
    icon: DatabaseIcon,
    description: 'What it remembers',
  },
  {
    href: '/identity',
    label: 'Identity model',
    icon: PersonIcon,
    description: 'Who it thinks you are',
  },
  {
    href: '/skills',
    label: 'Skills',
    icon: ZapIcon,
    description: 'Self-authored procedures',
  },
  {
    href: '/schedules',
    label: 'Schedules',
    icon: ClockIcon,
    description: 'Automated tasks & inbox',
  },
  {
    href: '/settings',
    label: 'Settings',
    icon: GearIcon,
    description: 'Models & gateways',
  },
]

export function AppShell({
  children,
  user,
}: {
  children: React.ReactNode
  user: { name: string; email: string; image?: string | null }
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const signOut = async () => {
    await authClient.signOut()
    router.push('/sign-in')
    router.refresh()
  }

  const Sidebar = (
    <Box
      sx={{
        width: 264,
        flexShrink: 0,
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid var(--borderColor-default)',
        backgroundColor: 'var(--bgColor-inset)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          padding: 3,
          borderBottom: '1px solid var(--borderColor-muted)',
        }}
      >
        <BrandMark size={32} />
        <Box>
          <Text sx={{ fontWeight: 700, fontSize: 2, display: 'block', lineHeight: 1.1 }}>
            Mneme
          </Text>
          <Text sx={{ fontSize: 0, color: 'var(--fgColor-muted)' }}>
            self-improving assistant
          </Text>
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', paddingY: 2 }}>
        <NavList aria-label="Primary">
          {NAV.map((item) => {
            const Icon = item.icon
            return (
              <NavList.Item
                key={item.href}
                as={Link}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                onClick={() => setOpen(false)}
              >
                <NavList.LeadingVisual>
                  <Icon />
                </NavList.LeadingVisual>
                {item.label}
              </NavList.Item>
            )
          })}
        </NavList>
      </Box>

      <Box sx={{ padding: 2, borderTop: '1px solid var(--borderColor-muted)' }}>
        <ActionMenu>
          <ActionMenu.Anchor>
            <Box
              as="button"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                width: '100%',
                padding: 2,
                background: 'transparent',
                border: 'none',
                borderRadius: 'var(--borderRadius-medium)',
                cursor: 'pointer',
                color: 'var(--fgColor-default)',
                textAlign: 'left',
                '&:hover': { backgroundColor: 'var(--bgColor-muted)' },
              }}
            >
              <Avatar src={user.image || avatarFor(user.email)} size={28} />
              <Box sx={{ overflow: 'hidden' }}>
                <Text
                  sx={{
                    fontSize: 1,
                    fontWeight: 600,
                    display: 'block',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {user.name}
                </Text>
                <Text
                  sx={{
                    fontSize: 0,
                    color: 'var(--fgColor-muted)',
                    display: 'block',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {user.email}
                </Text>
              </Box>
            </Box>
          </ActionMenu.Anchor>
          <ActionMenu.Overlay align="start">
            <ActionList>
              <ActionList.Item onSelect={() => router.push('/settings')}>
                <ActionList.LeadingVisual>
                  <GearIcon />
                </ActionList.LeadingVisual>
                Settings
              </ActionList.Item>
              <ActionList.Divider />
              <ActionList.Item variant="danger" onSelect={signOut}>
                <ActionList.LeadingVisual>
                  <SignOutIcon />
                </ActionList.LeadingVisual>
                Sign out
              </ActionList.Item>
            </ActionList>
          </ActionMenu.Overlay>
        </ActionMenu>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Desktop sidebar */}
      <Box sx={{ display: ['none', 'none', 'block'] }}>{Sidebar}</Box>

      {/* Mobile drawer */}
      {open && (
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: ['block', 'block', 'none'],
          }}
        >
          <Box
            onClick={() => setOpen(false)}
            sx={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(1,4,9,0.6)' }}
          />
          <Box sx={{ position: 'absolute', top: 0, left: 0 }}>{Sidebar}</Box>
        </Box>
      )}

      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Mobile top bar */}
        <Box
          sx={{
            display: ['flex', 'flex', 'none'],
            alignItems: 'center',
            gap: 2,
            padding: 3,
            borderBottom: '1px solid var(--borderColor-default)',
            position: 'sticky',
            top: 0,
            zIndex: 10,
            backgroundColor: 'var(--bgColor-default)',
          }}
        >
          <IconButton
            aria-label="Toggle navigation"
            icon={open ? XIcon : ThreeBarsIcon}
            onClick={() => setOpen((v) => !v)}
            variant="invisible"
          />
          <BrandMark size={26} />
          <Text sx={{ fontWeight: 700 }}>Mneme</Text>
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>{children}</Box>
      </Box>
    </Box>
  )
}

function avatarFor(email: string) {
  // Deterministic neutral gradient avatar via DiceBear shapes (no external auth)
  return `https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(email)}`
}
