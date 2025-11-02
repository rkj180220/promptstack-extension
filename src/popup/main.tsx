import React from 'react'
import ReactDOM from 'react-dom/client'
import BrowseTab from './components/BrowseTab'
import AddTab from './components/AddTab'
import LeaderboardTab from './components/LeaderboardTab'
import SettingsTab from './components/SettingsTab'
import LoginTab from './components/LoginTab'
import RegisterTab from './components/RegisterTab'
import { usePromptStack } from './hooks/usePromptStack'

type Tab = 'browse' | 'add' | 'leaderboard' | 'settings'

function App() {
  const {
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
    devEmail,
    setDevEmail,
    devName,
    setDevName,
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
    handleAddComment,
    handleSaveSettings
  } = usePromptStack()

  // Show authentication screen if not logged in
  if (!isAuthenticated) {
    return (
      <div style={{
        width: 400,
        height: 600,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 16px 12px',
          borderBottom: '1px solid #e5e7eb',
          background: '#f9fafb'
        }}>
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#111827' }}>
            PromptStack
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#6b7280' }}>
            Internal Prompt Library Marketplace
          </p>
        </div>

        {/* Authentication Content */}
        {authMode === 'login' ? (
          <LoginTab
            onLogin={handleLogin}
            onSwitchToRegister={() => setAuthMode('register')}
            loading={authLoading}
            error={authError}
          />
        ) : (
          <RegisterTab
            onRegister={handleRegister}
            onSwitchToLogin={() => setAuthMode('login')}
            loading={authLoading}
            error={authError}
          />
        )}
      </div>
    )
  }

  // Main application interface for authenticated users
  return (
    <div style={{
      width: 400,
      height: 600,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 16px 12px',
        borderBottom: '1px solid #e5e7eb',
        background: '#f9fafb'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#111827' }}>
              PromptStack
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#6b7280' }}>
              Welcome, {currentUser?.name || 'User'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '6px 12px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div style={{
          padding: '8px 16px',
          background: '#dbeafe',
          color: '#1e40af',
          fontSize: '12px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          {message}
        </div>
      )}

      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #e5e7eb',
        background: '#f9fafb'
      }}>
        {[
          { key: 'browse', label: 'Browse' },
          { key: 'add', label: 'Add' },
          { key: 'leaderboard', label: 'Leaders' },
          { key: 'settings', label: 'Settings' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as Tab)}
            style={{
              flex: 1,
              padding: '12px 8px',
              border: 'none',
              background: activeTab === tab.key ? '#fff' : 'transparent',
              color: activeTab === tab.key ? '#3b82f6' : '#6b7280',
              fontSize: '12px',
              fontWeight: activeTab === tab.key ? 600 : 400,
              cursor: 'pointer',
              borderBottom: activeTab === tab.key ? '2px solid #3b82f6' : 'none'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'browse' && (
        <BrowseTab
          prompts={prompts}
          loading={loading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          tagFilter={tagFilter}
          setTagFilter={setTagFilter}
          selectedPrompt={selectedPrompt}
          selectPrompt={selectPrompt}
          comments={comments}
          newComment={newComment}
          setNewComment={setNewComment}
          userRating={userRating}
          onCopy={handleCopy}
          onInsert={handleInsert}
          onRate={handleRatePrompt}
          onAddComment={handleAddComment}
        />
      )}

      {activeTab === 'add' && (
        <AddTab
          newPrompt={newPrompt}
          setNewPrompt={setNewPrompt}
          teams={teams}
          domains={domains}
          onSubmit={handleAddPrompt}
        />
      )}

      {activeTab === 'leaderboard' && (
        <LeaderboardTab
          leaderboard={leaderboard}
          loading={loading}
        />
      )}

      {activeTab === 'settings' && (
        <SettingsTab
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
