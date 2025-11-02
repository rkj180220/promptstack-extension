import { useState, useEffect } from 'react'
import api from '../../api'
import { Prompt, Team, Domain, Comment, LeaderboardItem, VisibilityMode } from '../../types'

type Tab = 'browse' | 'add' | 'leaderboard' | 'settings'
type SortOption = 'top' | 'new' | 'used'
type AuthMode = 'login' | 'register'

export function usePromptStack() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)

  // ...existing state...
  const [activeTab, setActiveTab] = useState<Tab>('browse')
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('used')
  const [tagFilter, setTagFilter] = useState('')

  // Add prompt form state
  const [newPrompt, setNewPrompt] = useState({
    title: '',
    description: '',
    content: '',
    tags: '',
    domain_ids: [] as string[],
    visibility_mode: 'ORG' as VisibilityMode,
    shares: { team_ids: [] as string[], domain_ids: [] as string[], user_ids: [] as string[] }
  })

  // Comments and ratings
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [userRating, setUserRating] = useState<number>(0)

  // Taxonomy data
  const [teams, setTeams] = useState<Team[]>([])
  const [domains, setDomains] = useState<Domain[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([])

  // Feedback
  const [message, setMessage] = useState('')

  useEffect(() => {
    checkAuthStatus()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchTaxonomy()
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (isAuthenticated && activeTab === 'browse' && (searchQuery.length > 2 || searchQuery === '')) {
      fetchPrompts()
    }
  }, [searchQuery, sortBy, tagFilter, activeTab, isAuthenticated])

  useEffect(() => {
    if (isAuthenticated && activeTab === 'leaderboard') {
      fetchLeaderboard()
    }
  }, [activeTab, isAuthenticated])

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('access_token')
    if (token) {
      try {
        // Set the token in axios headers
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        const response = await api.get('/auth/me')
        setCurrentUser(response.data)
        setIsAuthenticated(true)
      } catch (error) {
        // Token is invalid, remove it
        localStorage.removeItem('access_token')
        delete api.defaults.headers.common['Authorization']
        setIsAuthenticated(false)
      }
    }
  }

  const handleLogin = async (email: string, password: string) => {
    setAuthLoading(true)
    setAuthError(null)

    try {
      const response = await api.post('/auth/login', { email, password })
      const { access_token, user } = response.data

      // Store token and set auth headers
      localStorage.setItem('access_token', access_token)
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

      setCurrentUser(user)
      setIsAuthenticated(true)
      showMessage('Successfully logged in!')
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Login failed. Please check your credentials.'
      setAuthError(errorMessage)
    } finally {
      setAuthLoading(false)
    }
  }

  const handleRegister = async (email: string, password: string, name: string) => {
    setAuthLoading(true)
    setAuthError(null)

    try {
      const response = await api.post('/auth/register', { email, password, name })
      const { access_token, user } = response.data

      // Store token and set auth headers
      localStorage.setItem('access_token', access_token)
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

      setCurrentUser(user)
      setIsAuthenticated(true)
      showMessage('Account created successfully!')
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Registration failed. Please try again.'
      setAuthError(errorMessage)
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      // Ignore logout errors
    } finally {
      // Clear local state
      localStorage.removeItem('access_token')
      delete api.defaults.headers.common['Authorization']
      setIsAuthenticated(false)
      setCurrentUser(null)
      setActiveTab('browse')
      showMessage('Logged out successfully')
    }
  }

  const fetchTaxonomy = async () => {
    try {
      const [teamsRes, domainsRes] = await Promise.all([
        api.get('/teams'),
        api.get('/domains')
      ])
      setTeams(teamsRes.data)
      setDomains(domainsRes.data)
    } catch (error) {
      console.error('Failed to fetch taxonomy:', error)
    }
  }

  const fetchPrompts = async () => {
    try {
      setLoading(true)
      const params: any = {
        sort: sortBy,
        per_page: 20
      }
      if (searchQuery) params.q = searchQuery
      if (tagFilter) params.tags = tagFilter

      const response = await api.get('/prompts', { params })
      setPrompts(response.data)
    } catch (error) {
      console.error('Failed to fetch prompts:', error)
      showMessage('Failed to load prompts')
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async (promptId: string) => {
    try {
      const response = await api.get(`/prompts/${promptId}/comments`)
      setComments(response.data)
    } catch (error) {
      console.error('Failed to fetch comments:', error)
    }
  }

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const response = await api.get('/leaderboard', {
        params: { period: 'all', limit: 20 }
      })
      setLeaderboard(response.data)
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
      showMessage('Failed to load leaderboard')
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (msg: string) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  const handleCopy = async (prompt: Prompt) => {
    try {
      await navigator.clipboard.writeText(prompt.content)
      await api.post(`/prompts/${prompt.id}/use`)
      showMessage('Copied to clipboard!')
      setPrompts(prev => prev.map(p =>
        p.id === prompt.id ? { ...p, use_count: p.use_count + 1 } : p
      ))
    } catch (error) {
      console.error('Failed to copy:', error)
      showMessage('Failed to copy')
    }
  }

  const handleInsert = async (prompt: Prompt) => {
    try {
      const res = await chrome.runtime.sendMessage({
        type: 'insertPrompt',
        text: prompt.content
      })

      if (res?.ok) {
        await api.post(`/prompts/${prompt.id}/use`)
        showMessage('Inserted successfully!')
        setPrompts(prev => prev.map(p =>
          p.id === prompt.id ? { ...p, use_count: p.use_count + 1 } : p
        ))
      } else {
        const errorMsg = res?.error || 'Failed to insert. Make sure you are on a supported site.'
        showMessage(errorMsg)
      }
    } catch (error) {
      console.error('Failed to insert:', error)
      showMessage('Failed to insert: ' + (error as Error).message)
    }
  }

  const handleAddPrompt = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPrompt.title.trim() || !newPrompt.content.trim()) {
      showMessage('Title and content are required')
      return
    }

    try {
      const payload = {
        ...newPrompt,
        tags: newPrompt.tags.split(',').map(t => t.trim()).filter(Boolean),
        domain_ids: newPrompt.domain_ids,
        visibility_mode: newPrompt.visibility_mode,
        ...(newPrompt.visibility_mode !== 'ORG' && newPrompt.visibility_mode !== 'PRIVATE' && {
          shares: newPrompt.shares
        })
      }

      await api.post('/prompts', payload)
      showMessage('Prompt added successfully!')
      setNewPrompt({
        title: '',
        description: '',
        content: '',
        tags: '',
        domain_ids: [],
        visibility_mode: 'ORG',
        shares: { team_ids: [], domain_ids: [], user_ids: [] }
      })
      setActiveTab('browse')
      fetchPrompts()
    } catch (error) {
      console.error('Failed to add prompt:', error)
      showMessage('Failed to add prompt')
    }
  }

  const handleRatePrompt = async (promptId: string, stars: number) => {
    try {
      await api.post(`/prompts/${promptId}/rate`, { stars })
      showMessage('Rating submitted!')
      setUserRating(stars)
      if (selectedPrompt?.id === promptId) {
        const response = await api.get(`/prompts/${promptId}`)
        setSelectedPrompt(response.data)
        setPrompts(prev => prev.map(p =>
          p.id === promptId ? response.data : p
        ))
      }
    } catch (error) {
      console.error('Failed to rate prompt:', error)
      showMessage('Failed to submit rating')
    }
  }

  const handleAddComment = async (promptId: string) => {
    if (!newComment.trim()) return

    try {
      await api.post(`/prompts/${promptId}/comments`, { text: newComment })
      setNewComment('')
      fetchComments(promptId)
      showMessage('Comment added!')
    } catch (error) {
      console.error('Failed to add comment:', error)
      showMessage('Failed to add comment')
    }
  }

  const selectPrompt = (prompt: Prompt) => {
    setSelectedPrompt(selectedPrompt?.id === prompt.id ? null : prompt)
    if (selectedPrompt?.id !== prompt.id) {
      fetchComments(prompt.id)
      setUserRating(0)
    }
  }

  return {
    // Authentication state
    isAuthenticated,
    authMode,
    setAuthMode,
    authLoading,
    authError,
    currentUser,

    // State
    activeTab,
    setActiveTab,
    prompts,
    loading,
    searchQuery,
    setSearchQuery,
    selectedPrompt,
    sortBy,
    setSortBy,
    tagFilter,
    setTagFilter,
    newPrompt,
    setNewPrompt,
    comments,
    newComment,
    setNewComment,
    userRating,
    teams,
    domains,
    leaderboard,
    message,

    // Actions
    handleLogin,
    handleRegister,
    handleLogout,
    selectPrompt,
    handleCopy,
    handleInsert,
    handleAddPrompt,
    handleRatePrompt,
    handleAddComment
  }
}
