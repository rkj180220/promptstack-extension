import React from 'react'
import { LeaderboardItem } from '../../types'

interface LeaderboardTabProps {
  leaderboard: LeaderboardItem[]
  loading: boolean
}

function LeaderboardTab({
  leaderboard,
  loading
}: LeaderboardTabProps) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600 }}>Top Contributors</h3>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
          Loading...
        </div>
      ) : leaderboard.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
          No data available
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {leaderboard.map((item, index) => (
            <div
              key={item.user_id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                background: '#f9fafb',
                borderRadius: '6px',
                border: '1px solid #e5e7eb'
              }}
            >
              <div style={{ 
                width: '24px', 
                height: '24px', 
                borderRadius: '50%', 
                background: index < 3 ? '#f59e0b' : '#6b7280',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 600,
                marginRight: '12px'
              }}>
                {index + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>{item.name}</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  {item.prompt_count} prompts • {item.total_use_count} uses • {item.avg_rating?.toFixed(1) || 'No'} avg rating
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default LeaderboardTab
