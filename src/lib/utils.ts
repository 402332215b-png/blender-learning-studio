// Utility functions

export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function getProgressColor(status: string): string {
  const colors: Record<string, string> = {
    not_started: 'text-status-not-started',
    learning: 'text-status-learning',
    completed: 'text-status-completed',
    mastered: 'text-status-mastered',
    needs_review: 'text-status-needs-review',
  }
  return colors[status] || 'text-status-not-started'
}

export function getProgressBg(status: string): string {
  const colors: Record<string, string> = {
    not_started: 'bg-status-not-started',
    learning: 'bg-status-learning',
    completed: 'bg-status-completed',
    mastered: 'bg-status-mastered',
    needs_review: 'bg-status-needs-review',
  }
  return colors[status] || 'bg-status-not-started'
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    not_started: '未学习',
    learning: '学习中',
    completed: '已完成',
    mastered: '已掌握',
    needs_review: '需要复习',
  }
  return labels[status] || '未学习'
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}
