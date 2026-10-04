import { useEffect, useState } from 'react'
import type { Dispatch, FormEvent, ReactNode, SetStateAction } from 'react'
import {
  Activity,
  ArrowLeft,
  AtSign,
  BarChart3,
  Bell,
  BookOpen,
  Bookmark,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  Eye,
  FileText,
  Hash,
  LayoutDashboard,
  Lock,
  LogOut,
  Mail,
  Menu,
  MessageCircle,
  MessagesSquare,
  MoreHorizontal,
  Pin,
  Plus,
  Search,
  Send,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Terminal,
  Trash2,
  Trophy,
  UserRound,
  Users,
  X,
} from 'lucide-react'
import {
  activity,
  categories,
  getCategory,
  getPosts,
  getThread,
  getUser,
  messages as seedMessages,
  notifications as seedNotifications,
  posts,
  reputationHistory,
  rules,
  stats,
  threads,
  users,
  type Category,
  type Message,
  type Post,
  type Thread,
  type User,
} from './data'
import { Link, NavLink, Outlet, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'

type NotificationItem = (typeof seedNotifications)[number]
type SettingsState = {
  compact: boolean
  reducedMotion: boolean
  online: boolean
  profileVisible: boolean
  activityVisible: boolean
  messages: boolean
  mentions: boolean
  reputation: boolean
  replies: boolean
}
type ForumState = {
  bookmarks: string[]
  readThreads: string[]
  notifications: NotificationItem[]
  messages: Message[]
  settings: SettingsState
}

const defaultState: ForumState = {
  bookmarks: ['crypto-references', 'linux-permissions', 'debugger-workflow'],
  readThreads: ['privacy-os', 'crypto-references'],
  notifications: seedNotifications.map((item) => ({ ...item })),
  messages: seedMessages.map((item) => ({ ...item, messages: item.messages.map((message) => ({ ...message })) })),
  settings: { compact: false, reducedMotion: false, online: true, profileVisible: true, activityVisible: true, messages: true, mentions: true, reputation: true, replies: true },
}

function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) as T : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])
  return [value, setValue] as const
}

function App() {
  const [state, setState] = usePersistentState<ForumState>('darkode-forum-state', defaultState)
  const [toast, setToast] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }
  const toggleBookmark = (id: string) => {
    setState((current) => ({ ...current, bookmarks: current.bookmarks.includes(id) ? current.bookmarks.filter((item) => item !== id) : [...current.bookmarks, id] }))
    showToast(state.bookmarks.includes(id) ? 'Bookmark removed' : 'Thread bookmarked')
  }
  const markThreadRead = (id: string) => setState((current) => ({ ...current, readThreads: current.readThreads.includes(id) ? current.readThreads : [...current.readThreads, id] }))
  const markNotification = (id: string) => setState((current) => ({ ...current, notifications: current.notifications.map((item) => item.id === id ? { ...item, unread: false } : item) }))
  const markAllNotifications = () => { setState((current) => ({ ...current, notifications: current.notifications.map((item) => ({ ...item, unread: false })) })); showToast('All alerts marked as read') }
  const updateSettings = (patch: Partial<SettingsState>) => setState((current) => ({ ...current, settings: { ...current.settings, ...patch } }))
  const unreadMessages = state.messages.filter((message) => message.unread).length
  const unreadAlerts = state.notifications.filter((item) => item.unread).length

  return (
    <div className={`app-shell${state.settings.compact ? ' compact-mode' : ''}${state.settings.reducedMotion ? ' reduced-motion' : ''}`}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<AppShell sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} unreadMessages={unreadMessages} unreadAlerts={unreadAlerts} settings={state.settings} />}>
          <Route path="/" element={<DashboardPage state={state} toggleBookmark={toggleBookmark} />} />
          <Route path="/dashboard" element={<DashboardPage state={state} toggleBookmark={toggleBookmark} />} />
          <Route path="/forums" element={<ForumIndexPage state={state} toggleBookmark={toggleBookmark} />} />
          <Route path="/forums/:category" element={<ForumCategoryPage state={state} toggleBookmark={toggleBookmark} markThreadRead={markThreadRead} />} />
          <Route path="/thread/:id" element={<ThreadPage state={state} toggleBookmark={toggleBookmark} markThreadRead={markThreadRead} showToast={showToast} />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/members/:username" element={<MemberProfilePage state={state} toggleBookmark={toggleBookmark} />} />
          <Route path="/messages" element={<MessagesPage state={state} setState={setState} showToast={showToast} />} />
          <Route path="/notifications" element={<NotificationsPage state={state} markNotification={markNotification} markAll={markAllNotifications} />} />
          <Route path="/bookmarks" element={<BookmarksPage state={state} toggleBookmark={toggleBookmark} />} />
          <Route path="/reputation" element={<ReputationPage />} />
          <Route path="/settings" element={<SettingsPage state={state} updateSettings={updateSettings} showToast={showToast} />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/rules" element={<RulesPage />} />
          <Route path="/moderation" element={<ModerationPage showToast={showToast} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  )
}

function AppShell({ sidebarOpen, setSidebarOpen, unreadMessages, unreadAlerts, settings }: { sidebarOpen: boolean; setSidebarOpen: (open: boolean) => void; unreadMessages: number; unreadAlerts: number; settings: SettingsState }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register'
  if (isAuthRoute) return null
  const submitSearch = (event: FormEvent) => {
    event.preventDefault()
    if (search.trim()) navigate(`/forums?search=${encodeURIComponent(search.trim())}`)
  }
  return (
    <>
      <header className="topbar">
        <button className="icon-button mobile-menu-button" aria-label="Open navigation" aria-expanded={sidebarOpen} onClick={() => setSidebarOpen(!sidebarOpen)}><Menu size={18} /></button>
        <Link to="/" className="brand" aria-label="DARKODE home">
          <span className="brand-mark">&gt;_</span>
          <span><span className="brand-wordmark">DARKODE</span><span className="brand-subtitle">PRIVATE // MEMBERS ONLY</span></span>
        </Link>
        <span className="topbar-spacer" />
        <form className="header-search" onSubmit={submitSearch} role="search">
          <Search size={15} />
          <input aria-label="Search forum" placeholder="Search forum..." value={search} onChange={(event) => setSearch(event.target.value)} />
        </form>
        <div className="header-actions">
          <Link className="icon-button" to="/messages" aria-label={`Messages, ${unreadMessages} unread`}><Mail size={16} /><span className="counter">{unreadMessages}</span></Link>
          <Link className="icon-button" to="/notifications" aria-label={`Alerts, ${unreadAlerts} unread`}><Bell size={16} /><span className="counter">{unreadAlerts}</span></Link>
          <div className="user-menu" onClick={() => navigate('/members/user_4831')} role="button" tabIndex={0} onKeyDown={(event) => event.key === 'Enter' && navigate('/members/user_4831')}>
            <Avatar user={getUser('user_4831')!} />
            <div className="user-meta"><div className="user-name">user_4831</div><div className="user-rank">NEWBIE</div></div>
            <span className="online-pill">{settings.online ? '● ONLINE' : '○ OFFLINE'}</span>
          </div>
        </div>
      </header>
      <div className="layout">
        <Sidebar open={sidebarOpen} unreadMessages={unreadMessages} unreadAlerts={unreadAlerts} />
        <main className="main-content"><Outlet /></main>
        <RightSidebar />
      </div>
    </>
  )
}

function Sidebar({ open, unreadMessages, unreadAlerts }: { open: boolean; unreadMessages: number; unreadAlerts: number }) {
  const mainNav = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/forums', label: 'Forums', icon: MessagesSquare },
    { to: '/members', label: 'Members', icon: Users },
    { to: '/messages', label: 'Private Messages', icon: Mail, count: unreadMessages },
    { to: '/notifications', label: 'Notifications', icon: Bell, count: unreadAlerts },
    { to: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
    { to: '/reputation', label: 'Reputation', icon: Trophy },
    { to: '/settings', label: 'Settings', icon: Settings },
  ]
  return (
    <aside className={open ? 'sidebar open' : 'sidebar'}>
      <div className="sidebar-section"><div className="section-label">Workspace</div>{mainNav.map(({ to, label, icon: Icon, count }) => <NavLink key={to} to={to} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}><Icon />{label}{count ? <span className="nav-count">{count}</span> : null}</NavLink>)}</div>
      <div className="sidebar-section category-nav"><div className="section-label">Forums</div>{[...categories, { slug: 'privacy', name: 'Privacy' } as Category].map((category) => <NavLink key={category.slug} to={`/forums/${category.slug}`} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}><span className="category-dot" />{category.name}</NavLink>)}</div>
      <div className="sidebar-section"><div className="section-label">Reference</div><NavLink to="/rules" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}><BookOpen />Community rules</NavLink><NavLink to="/stats" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}><BarChart3 />Forum statistics</NavLink><NavLink to="/moderation" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}><ShieldCheck />Moderation</NavLink></div>
      <div className="mono" style={{ color: 'var(--muted-2)', fontSize: 9, lineHeight: 1.6, padding: '14px 10px', borderTop: '1px solid var(--border-soft)' }}>SESSION // 8F4A:2B91<br />ACCESS // VERIFIED MEMBER</div>
    </aside>
  )
}

function RightSidebar() {
  const online = ['x3r0', 'ghostroot', 'nullbyte', 'cipher', 'rook', 'user_4831'].map((name) => getUser(name)!).filter(Boolean)
  return <aside className="rightbar"><div className="side-widget"><div className="side-widget-title">Online members <span style={{ color: 'var(--green)' }}>// 17</span></div>{online.map((user) => <Link to={`/members/${user.username}`} className="online-row" key={user.username}><span className={`online-dot ${user.presence}`} /><span className="online-name">{user.username}</span><span className="online-rank">{user.rank}</span></Link>)}</div><div className="side-widget"><div className="side-widget-title">Recent activity</div>{activity.slice(0, 4).map((item) => <div className="activity-row" key={`${item.user}-${item.time}`}><Link to={`/members/${item.user}`}>{item.user}</Link> {item.action} <strong>{item.target}</strong><span className="activity-time">{item.time}</span></div>)}</div><div className="side-widget"><div className="side-widget-title">Trending threads</div>{threads.slice(0, 4).map((thread, index) => <Link className="side-thread" to={`/thread/${thread.id}`} key={thread.id}><span className="side-thread-index">0{index + 1}</span><span><span className="side-thread-title">{thread.title}</span><span className="side-thread-meta">{thread.views.toLocaleString()} views · {thread.replies} replies</span></span></Link>)}</div><div className="side-widget"><div className="side-widget-title">Your reputation</div><div className="stat-value" style={{ fontSize: 28 }}>128</div><div className="panel-meta">NEWBIE // 72 points to MEMBER</div><div style={{ height: 5, background: 'var(--border)', borderRadius: 4, marginTop: 12 }}><div style={{ height: '100%', width: '64%', background: 'var(--green)', borderRadius: 4 }} /></div></div></aside>
}

function Avatar({ user, small = false }: { user: User; small?: boolean }) {
  return <span className="avatar" style={{ borderColor: user.accent, color: user.accent, width: small ? 28 : undefined, height: small ? 28 : undefined }}>{user.username.slice(0, 2).toUpperCase()}</span>
}

function PageHeader({ eyebrow, title, subtitle, actions }: { eyebrow: string; title: string; subtitle?: string; actions?: React.ReactNode }) {
  return <div className="page-header"><div><div className="eyebrow">{eyebrow}</div><h1 className="page-title">{title}</h1>{subtitle && <p className="page-subtitle">{subtitle}</p>}</div>{actions && <div className="header-actions-row">{actions}</div>}</div>
}

function Panel({ title, eyebrow, meta, children, className = '' }: { title?: string; eyebrow?: string; meta?: string; children: ReactNode; className?: string }) {
  return <section className={`panel ${className}`}>{title && <div className="panel-header"><h2 className="panel-title"><span className="slash">//</span>{title}</h2>{meta && <span className="panel-meta">{meta}</span>}</div>}{eyebrow && !title && <div className="panel-header"><span className="eyebrow" style={{ margin: 0 }}>{eyebrow}</span></div>}<div className="panel-body">{children}</div></section>
}

function StatCard({ label, value, note }: { label: string; value: string; note?: string }) { return <div className="stat-card"><div className="stat-label">{label}</div><div className="stat-value">{value}</div>{note && <div className="stat-note">{note}</div>}</div> }

function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) { return <div className="breadcrumbs"><Link to="/">DARKODE</Link>{items.map((item, index) => <span key={`${item.label}-${index}`}>/ {item.to ? <Link to={item.to}>{item.label}</Link> : item.label}</span>)}</div> }

function DashboardPage({ state, toggleBookmark }: { state: ForumState; toggleBookmark: (id: string) => void }) {
  return <><PageHeader eyebrow="DARKODE // TERMINAL" title="Welcome back, user_4831." subtitle="Private technical community for verified members." actions={<><Link className="btn primary" to="/forums"><MessagesSquare size={14} />Browse discussions</Link><Link className="btn" to="/members/user_4831"><UserRound size={14} />View profile</Link></>} /><div className="stat-grid"><StatCard label="Reputation" value="128" note="+16 this month" /><StatCard label="Posts" value="47" note="3 unread replies" /><StatCard label="Threads" value="12" note="2 bookmarked" /><StatCard label="Joined" value="214d" note="since Mar 04, 2026" /></div><div className="content-grid dashboard-grid"><div><Panel title="Recent discussions" meta="5 active threads"><ThreadTable items={threads.slice(0, 5)} state={state} toggleBookmark={toggleBookmark} /></Panel><Panel title="Member signal" meta="live activity"><div className="activity-row" style={{ paddingTop: 0 }}><strong>ACCESS LOG</strong> // session active for <strong>user_4831</strong><span className="activity-time">Last sync 2 min ago · Local demo state</span></div><div className="tag-list" style={{ marginTop: 15 }}><span className="badge">HELPFUL</span><span className="badge">FIRST POST</span><span className="badge amber">NEWBIE</span></div></Panel></div><div><Panel title="Unread messages" meta={`${state.messages.filter((item) => item.unread).length} unread`}><div style={{ display: 'grid', gap: 11 }}>{state.messages.filter((item) => item.unread).map((item) => <Link to="/messages" className="side-thread" key={item.id}><Avatar user={getUser(item.from)!} small /><span><span className="side-thread-title">{item.subject}</span><span className="side-thread-meta">{item.from} · {item.timestamp}</span></span></Link>)}</div></Panel><Panel title="Activity feed" meta="last 2 hours"><div>{activity.slice(0, 4).map((item) => <div className="activity-row" key={`${item.user}-${item.target}`}><Link to={`/members/${item.user}`}>{item.user}</Link> {item.action} <strong>{item.target}</strong><span className="activity-time">{item.time}</span></div>)}</div></Panel></div></div></>
}

function ThreadTable({ items, state, toggleBookmark, onMarkRead }: { items: Thread[]; state: ForumState; toggleBookmark: (id: string) => void; onMarkRead?: (id: string) => void }) {
  return <><div className="table-head"><span>Thread</span><span>Replies</span><span>Views</span><span>Last post</span></div>{items.map((thread) => <ThreadRow key={thread.id} thread={thread} state={state} toggleBookmark={toggleBookmark} onMarkRead={onMarkRead} />)}</>
}

function ThreadRow({ thread, state, toggleBookmark, onMarkRead }: { thread: Thread; state: ForumState; toggleBookmark: (id: string) => void; onMarkRead?: (id: string) => void }) {
  const author = getUser(thread.author)!
  const isRead = state.readThreads.includes(thread.id) || thread.unread === false
  return <div className="thread-row"><div className="thread-main"><span className={`thread-prefix ${thread.prefix === 'GUIDE' ? 'amber' : thread.prefix === 'ANNOUNCEMENT' ? 'red' : ''}`}>{thread.pinned && <Pin size={10} style={{ marginRight: 4, verticalAlign: '-1px' }} />}{thread.locked && <Lock size={10} style={{ marginRight: 4, verticalAlign: '-1px' }} />}{thread.prefix}</span><Link className="thread-title" to={`/thread/${thread.id}`} onClick={() => { if (!isRead) onMarkRead?.(thread.id) }}>{thread.title}</Link><div className="thread-detail">by <Link to={`/members/${author.username}`}>{author.username}</Link> · <Link to={`/forums/${thread.category}`}>{getCategory(thread.category)?.name ?? 'Privacy'}</Link> · {thread.created}</div></div><div className="thread-metric"><span>replies</span>{thread.replies}</div><div className="thread-metric"><span>views</span>{thread.views.toLocaleString()}</div><div className="last-post">Last: <Link to={`/members/${thread.lastBy}`}><strong>{thread.lastBy}</strong></Link><br />{thread.lastWhen}<button className="action-link" aria-label={state.bookmarks.includes(thread.id) ? 'Remove bookmark' : 'Bookmark thread'} onClick={() => toggleBookmark(thread.id)} style={{ float: 'right' }}>{state.bookmarks.includes(thread.id) ? '★' : '☆'}</button></div></div>
}

function ForumIndexPage({ state, toggleBookmark }: { state: ForumState; toggleBookmark: (id: string) => void }) {
  const [params] = useSearchParams()
  const search = params.get('search') || ''
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [authorFilter, setAuthorFilter] = useState('all')
  const results = search ? threads.filter((thread) => {
    const postBody = posts.filter((post) => post.threadId === thread.id).map((post) => post.body).join(' ')
    const corpus = `${thread.title} ${thread.category} ${thread.author} ${thread.tags.join(' ')} ${postBody}`.toLowerCase()
    return corpus.includes(search.toLowerCase()) && (categoryFilter === 'all' || thread.category === categoryFilter) && (authorFilter === 'all' || thread.author === authorFilter)
  }) : []
  return <><PageHeader eyebrow={search ? 'SEARCH RESULTS' : 'FORUM INDEX'} title={search ? `Results for “${search}”` : 'Browse the forums.'} subtitle={search ? `${results.length} results across titles, posts, authors, categories, and tags.` : 'Signal-rich discussions across the DARKODE technical community.'} actions={<>{search && <><select className="field" aria-label="Filter by category" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} style={{ width: 145, padding: '8px 9px' }}><option value="all">All categories</option>{categories.map((category) => <option value={category.slug} key={category.slug}>{category.name}</option>)}</select><select className="field" aria-label="Filter by author" value={authorFilter} onChange={(event) => setAuthorFilter(event.target.value)} style={{ width: 130, padding: '8px 9px' }}><option value="all">All authors</option>{users.map((user) => <option value={user.username} key={user.username}>{user.username}</option>)}</select></>}<button className="btn"><SlidersHorizontal size={14} />Filters</button><button className="btn primary"><Plus size={14} />New thread</button></>} />{search ? <Panel title="Search results" meta={`${results.length} matches`}>{results.length ? <ThreadTable items={results} state={state} toggleBookmark={toggleBookmark} /> : <EmptyState title="No matching threads" copy="Try a broader search or browse a category." action={<Link className="btn" to="/forums">Clear search</Link>} />}</Panel> : <Panel title="Categories" meta="10 forums"><div>{categories.map((category) => <CategoryRow key={category.slug} category={category} />)}</div></Panel>}</>
}

function CategoryRow({ category }: { category: Category }) { return <div className="category-card"><div className="category-icon">{category.icon}</div><div><Link className="category-name" to={`/forums/${category.slug}`}>{category.name}</Link><div className="category-description">{category.description}</div></div><div className="category-stat">{category.threads}<span>threads</span></div><div className="category-stat">{category.posts.toLocaleString()}<span>posts</span></div><div className="last-post">Last: <Link to={`/members/${category.lastBy}`}><strong>{category.lastBy}</strong></Link><br />{category.lastWhen}</div></div> }

function ForumCategoryPage({ state, toggleBookmark, markThreadRead }: { state: ForumState; toggleBookmark: (id: string) => void; markThreadRead: (id: string) => void }) {
  const { category: slug = '' } = useParams()
  const category = getCategory(slug) ?? (slug === 'privacy' ? { slug: 'privacy', name: 'Privacy', description: 'Privacy tools, habits, and operating systems.', icon: '◌', threads: 116, posts: 1132, lastBy: 'specter', lastWhen: '28 min ago' } : undefined)
  const [filter, setFilter] = useState('')
  const items = threads.filter((thread) => thread.category === slug && thread.title.toLowerCase().includes(filter.toLowerCase()))
  if (!category) return <NotFoundPage />
  return <><Breadcrumbs items={[{ label: 'Forums', to: '/forums' }, { label: category.name }]} /><PageHeader eyebrow={`FORUM // ${category.name.toUpperCase()}`} title={category.name} subtitle={category.description} actions={<><div className="header-search" style={{ width: 205, margin: 0 }}><Search size={14} /><input aria-label="Filter threads" placeholder="Filter threads..." value={filter} onChange={(event) => setFilter(event.target.value)} /></div><button className="btn primary"><Plus size={14} />New thread</button></>} /><Panel title="Threads" meta={`${items.length} visible`}><ThreadTable items={items} state={state} toggleBookmark={toggleBookmark} onMarkRead={markThreadRead} /></Panel><div className="panel-meta mono" style={{ marginTop: 13 }}>Showing 1–{items.length} of {category.threads} threads · <button className="action-link">Previous</button> <button className="action-link">Next</button></div></>
}

function ThreadPage({ state, toggleBookmark, markThreadRead, showToast }: { state: ForumState; toggleBookmark: (id: string) => void; markThreadRead: (id: string) => void; showToast: (message: string) => void }) {
  const { id = '' } = useParams()
  const thread = getThread(id)
  const [reply, setReply] = useState('')
  useEffect(() => { if (thread) markThreadRead(thread.id) }, [thread?.id])
  if (!thread) return <NotFoundPage />
  const threadPosts = getPosts(thread.id)
  return <><Breadcrumbs items={[{ label: getCategory(thread.category)?.name ?? 'Privacy', to: `/forums/${thread.category}` }, { label: thread.prefix }]} /><PageHeader eyebrow={`${(getCategory(thread.category)?.name ?? 'Privacy').toUpperCase()} > ${thread.prefix}`} title={thread.title} subtitle={`Started by ${thread.author} · ${thread.created}`} actions={<><button className={`btn ${state.bookmarks.includes(thread.id) ? 'primary' : ''}`} onClick={() => toggleBookmark(thread.id)}><Bookmark size={14} />{state.bookmarks.includes(thread.id) ? 'Bookmarked' : 'Bookmark'}</button><button className="btn"><MoreHorizontal size={14} />Thread actions</button></>} /><div className="panel"><div className="panel-header"><div className="tag-list"><span className="badge">{thread.prefix}</span>{thread.tags.map((tag) => <span className="badge amber" key={tag}>#{tag}</span>)}</div><span className="panel-meta">{thread.replies} replies · {thread.views.toLocaleString()} views</span></div>{threadPosts.length ? threadPosts.map((post) => <PostCard post={post} key={post.id} showToast={showToast} />) : <EmptyState title="Thread contents are loading" copy="Demo posts will appear here when the local state is ready." />}</div><Panel title="Reply to thread" meta={thread.locked ? 'locked by moderator_0' : 'Markdown supported'}>{thread.locked ? <div className="empty-state"><Lock size={18} /><strong>This thread is locked.</strong><span>Only moderators can add new replies.</span></div> : <form onSubmit={(event) => { event.preventDefault(); if (reply.trim()) { showToast('Reply staged in local demo state'); setReply('') } }}><textarea className="field" aria-label="Write a reply" placeholder="Write a considered reply..." value={reply} onChange={(event) => setReply(event.target.value)} style={{ width: '100%', minHeight: 110, background: '#080a0d', border: '1px solid var(--border)', color: 'var(--text)', padding: 12, borderRadius: 4 }} /><div className="header-actions-row" style={{ marginTop: 12 }}><button className="btn" type="button">Preview</button><button className="btn primary" type="submit"><Send size={14} />Post reply</button></div></form>}</Panel></>
}

function PostCard({ post, showToast }: { post: Post; showToast: (message: string) => void }) {
  const user = getUser(post.author)!
  return <article className="post"><div className="post-author"><Avatar user={user} /><div><Link className="post-author-name" to={`/members/${user.username}`}>{user.username}</Link><div className="post-author-rank">{user.rank}</div></div><div className="post-author-stats"><span><strong>{user.reputation}</strong> REP</span><span><strong>{user.posts}</strong> posts</span><span>Joined <strong>{user.joined}</strong></span>{user.badges.slice(0, 2).map((badge) => <span className="badge" key={badge}>{badge}</span>)}</div></div><div className="post-content"><div className="post-meta"><span>#{post.id.slice(1)}</span><span>{post.timestamp}</span></div><div className="post-body">{post.body}{post.code && <div className="code-block"><div className="code-header">terminal · read-only example</div><pre>{post.code}</pre></div>}</div><div className="post-actions"><button className="action-link" onClick={() => showToast('Quote copied to reply composer')}><MessageCircle size={12} style={{ verticalAlign: '-2px' }} /> Quote</button><button className="action-link" onClick={() => showToast('Reply composer opened')}><Send size={12} style={{ verticalAlign: '-2px' }} /> Reply</button><button className="action-link" onClick={() => showToast(`+1 reputation sent to ${user.username}`)}><Trophy size={12} style={{ verticalAlign: '-2px' }} /> +{post.likes}</button><button className="action-link" onClick={() => showToast('Report form opened')}><CircleAlert size={12} style={{ verticalAlign: '-2px' }} /> Report</button></div></div></article>
}

function MembersPage() {
  const [query, setQuery] = useState('')
  const visible = users.filter((user) => `${user.username} ${user.rank} ${user.interests.join(' ')}`.toLowerCase().includes(query.toLowerCase()))
  return <><PageHeader eyebrow="MEMBER DIRECTORY" title="The people behind the signal." subtitle={`${users.length} fictional members · ${stats.online} online now`} actions={<div className="header-search" style={{ width: 220, margin: 0 }}><Search size={14} /><input aria-label="Search members" placeholder="Search members..." value={query} onChange={(event) => setQuery(event.target.value)} /></div>} /><div className="member-grid">{visible.map((user) => <Link to={`/members/${user.username}`} className="member-card" key={user.username}><div className="member-card-top"><Avatar user={user} /><div><div className="member-name">{user.username}</div><div className="member-card-rank">{user.rank} · {user.reputation} rep</div></div></div><div className="member-card-status">{user.status}</div><div className="member-card-footer"><span>{user.posts} posts</span><span><span className={`online-dot ${user.presence}`} style={{ display: 'inline-block', marginRight: 5 }} />{user.presence}</span></div></Link>)}</div></>
}

function MemberProfilePage({ state, toggleBookmark }: { state: ForumState; toggleBookmark: (id: string) => void }) {
  const { username = '' } = useParams()
  const user = getUser(username)
  if (!user) return <NotFoundPage />
  const userThreads = threads.filter((thread) => thread.author === user.username)
  return <><Breadcrumbs items={[{ label: 'Members', to: '/members' }, { label: user.username }]} /><section className="panel"><div className="profile-hero"><Avatar user={user} /><div><div className="profile-name">{user.username}</div><div className="profile-status">{user.status}</div><div className="tag-list" style={{ marginTop: 10 }}><span className="badge">{user.rank.toUpperCase()}</span><span className="badge amber"><span className={`online-dot ${user.presence}`} style={{ display: 'inline-block', marginRight: 5 }} />{user.presence}</span></div></div><div className="profile-stats"><div><strong>{user.reputation}</strong>reputation</div><div><strong>{user.posts}</strong>posts</div><div><strong>{user.threads}</strong>threads</div></div><div className="header-actions-row"><button className="btn primary"><Mail size={14} />Message</button><button className="btn"><MoreHorizontal size={14} />More</button></div></div></section><div className="profile-grid"><div><Panel title="About this member"><p className="bio">{user.bio}</p><div style={{ marginTop: 17 }}><div className="section-label" style={{ margin: '0 0 6px' }}>Interests</div>{user.interests.map((interest) => <span className="interest" key={interest}>{interest}</span>)}</div></Panel><Panel title="Recent threads" meta={`${userThreads.length} shown`}>{userThreads.length ? <ThreadTable items={userThreads} state={state} toggleBookmark={toggleBookmark} /> : <EmptyState title="No public threads yet" copy="This member has not started a thread in the visible demo data." />}</Panel></div><div><Panel title="Badges" meta={`${user.badges.length} earned`}><div className="tag-list">{user.badges.map((badge) => <span className="badge" key={badge}>{badge}</span>)}</div></Panel><Panel title="Member record"><div className="activity-row"><strong>JOINED</strong><span className="activity-time">{user.joined}</span></div><div className="activity-row"><strong>STATUS</strong><span className="activity-time">{user.status}</span></div><div className="activity-row"><strong>ACCESS</strong><span className="activity-time">Verified member</span></div></Panel></div></div></>
}

function MessagesPage({ state, setState, showToast }: { state: ForumState; setState: Dispatch<SetStateAction<ForumState>>; showToast: (message: string) => void }) {
  const [selectedId, setSelectedId] = useState(state.messages[0]?.id ?? '')
  const [search, setSearch] = useState('')
  const [draft, setDraft] = useState('')
  const [compose, setCompose] = useState(false)
  const visible = state.messages.filter((message) => `${message.from} ${message.subject} ${message.preview}`.toLowerCase().includes(search.toLowerCase()))
  const selected = state.messages.find((message) => message.id === selectedId) ?? visible[0]
  const choose = (id: string) => { setSelectedId(id); setState((current) => ({ ...current, messages: current.messages.map((message) => message.id === id ? { ...message, unread: false } : message) })) }
  const send = (event: FormEvent) => { event.preventDefault(); if (!draft.trim()) return; showToast('Message sent in local demo state'); setDraft(''); setCompose(false) }
  return <><PageHeader eyebrow="PRIVATE MESSAGES" title="Keep the channel quiet." subtitle="Fictional member-to-member conversations. Nothing leaves this local demo." actions={<><div className="header-search" style={{ width: 200, margin: 0 }}><Search size={14} /><input aria-label="Search conversations" placeholder="Search conversations..." value={search} onChange={(event) => setSearch(event.target.value)} /></div><button className="btn primary" onClick={() => setCompose(true)}><Plus size={14} />Compose</button></>} /><section className="panel"><div className="message-layout"><div className="message-list">{visible.map((message) => <button className={`message-item ${selected?.id === message.id ? 'selected' : ''}`} key={message.id} onClick={() => choose(message.id)}><div className="message-item-top"><span className="message-from">{message.from}{message.unread && <span style={{ color: 'var(--green)', marginLeft: 6 }}>●</span>}</span><span className="message-time">{message.timestamp}</span></div><div className="message-subject">{message.subject}</div><div className="message-preview">{message.preview}</div></button>)}{!visible.length && <EmptyState title="No conversations" copy="Try a different search." />}</div><div className="message-pane">{selected ? <><div className="message-pane-header"><div className="message-pane-title">{selected.subject}</div><div className="panel-meta" style={{ marginTop: 6 }}>with {selected.from} · local channel</div></div><div className="message-bubble-list">{selected.messages.map((message, index) => <div className={`bubble ${message.from === 'user_4831' ? 'self' : ''}`} key={`${message.timestamp}-${index}`}><div className="bubble-meta"><span>{message.from}</span><span>{message.timestamp}</span></div><div className="bubble-body">{message.body}</div></div>)}</div><form className="composer" onSubmit={send}><input aria-label="Reply to conversation" placeholder="Write a reply..." value={draft} onChange={(event) => setDraft(event.target.value)} /><button className="btn primary" type="submit"><Send size={14} />Send</button><button type="button" className="icon-button" aria-label="Delete conversation" onClick={() => { showToast('Conversation removed from local inbox'); setState((current) => ({ ...current, messages: current.messages.filter((message) => message.id !== selected.id) })) }}><Trash2 size={15} /></button></form></> : <EmptyState title="Select a conversation" copy="Choose a thread from the inbox to read it." />}</div></div></section>{compose && <div className="auth-screen" style={{ position: 'fixed', inset: 0, zIndex: 30, background: 'rgba(8,10,13,.78)' }}><div className="auth-card"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><div className="eyebrow">NEW MESSAGE</div><h1>Compose private message</h1></div><button className="icon-button" onClick={() => setCompose(false)} aria-label="Close compose"><X size={16} /></button></div><div className="field"><label>Recipient</label><input defaultValue="x3r0" /></div><div className="field"><label>Message</label><textarea placeholder="Keep it technical..." /></div><button className="btn primary" onClick={() => { setCompose(false); showToast('Draft saved in local state') }}>Save draft</button></div></div>}</>
}

function NotificationsPage({ state, markNotification, markAll }: { state: ForumState; markNotification: (id: string) => void; markAll: () => void }) { return <><PageHeader eyebrow="ALERT STREAM" title="Notifications" subtitle="Mentions, replies, reputation changes, and community signals." actions={<button className="btn" onClick={markAll}><Check size={14} />Mark all as read</button>} /><Panel title="Recent alerts" meta={`${state.notifications.filter((item) => item.unread).length} unread`}>{state.notifications.map((item) => <div className={`notification-row ${item.unread ? 'unread' : ''}`} key={item.id}><div className="notification-icon">{item.kind === 'rep' ? <Trophy size={14} /> : item.kind === 'mention' ? <AtSign size={14} /> : item.kind === 'badge' ? <CheckCircle2 size={14} /> : <Bell size={14} />}</div><div><div className="notification-title">{item.title}</div><div className="notification-detail">{item.detail}</div>{item.unread && <button className="action-link" onClick={() => markNotification(item.id)} style={{ marginTop: 8 }}>Mark as read</button>}</div><div className="notification-time">{item.time}</div></div>)}</Panel></> }

function BookmarksPage({ state, toggleBookmark }: { state: ForumState; toggleBookmark: (id: string) => void }) { const saved = threads.filter((thread) => state.bookmarks.includes(thread.id)); return <><PageHeader eyebrow="SAVED SIGNAL" title="Bookmarks" subtitle="Threads you want to return to without losing the trail." /><Panel title="Your bookmarks" meta={`${saved.length} saved`}>{saved.length ? <ThreadTable items={saved} state={state} toggleBookmark={toggleBookmark} /> : <EmptyState title="Nothing saved yet" copy="Bookmark a thread from any forum page and it will appear here." action={<Link className="btn" to="/forums">Browse forums</Link>} />}</Panel></> }

function ReputationPage() { return <><PageHeader eyebrow="COMMUNITY SIGNAL" title="Reputation" subtitle="A lightweight record of useful contributions, not a scoreboard." actions={<Link className="btn" to="/members/user_4831"><UserRound size={14} />View profile</Link>} /><div className="stat-grid"><StatCard label="Current reputation" value="128" note="+16 this month" /><StatCard label="Current rank" value="NEWBIE" note="72 to Member" /><StatCard label="Badges" value="2" note="Helpful · First post" /><StatCard label="Next review" value="72 pts" note="Community activity" /></div><Panel title="Reputation history" meta="latest activity">{reputationHistory.map((item) => <div className="report-row" key={item.label}><div><div className="report-title" style={{ color: item.amount > 0 ? 'var(--green)' : 'var(--red)' }}>{item.amount > 0 ? '+' : ''}{item.amount} <span style={{ color: '#d7dce3' }}>{item.label}</span></div><div className="report-meta">{item.meta}</div></div><Trophy size={15} color={item.amount > 0 ? 'var(--green)' : 'var(--red)'} /></div>)}</Panel></> }

function SettingsPage({ state, updateSettings, showToast }: { state: ForumState; updateSettings: (patch: Partial<SettingsState>) => void; showToast: (message: string) => void }) { const [section, setSection] = useState('Account'); const sections = ['Account', 'Appearance', 'Notifications', 'Privacy']; return <><PageHeader eyebrow="MEMBER SETTINGS" title="Control the surface." subtitle="Preferences are stored in local application state for this demo." actions={<button className="btn primary" onClick={() => showToast('Settings saved locally')}><Check size={14} />Save changes</button>} /><div className="settings-layout"><div className="panel settings-nav">{sections.map((item) => <button key={item} className={section === item ? 'active' : ''} onClick={() => setSection(item)}>{item}</button>)}<Link to="/login" className="nav-item" style={{ marginTop: 8 }}><LogOut size={14} />Log out</Link></div><section className="panel"><div className="settings-section"><h3>{section}</h3><p>{section === 'Account' ? 'Your fictional member identity and session metadata.' : section === 'Appearance' ? 'Adjust density and motion for the forum surface.' : section === 'Notifications' ? 'Choose which community events reach your alert stream.' : 'Choose what other fictional members can see.'}</p>{section === 'Account' && <div className="field-grid"><div className="field"><label>Username</label><input value="user_4831" readOnly /></div><div className="field"><label>Email</label><input value="member@darkode.local" readOnly /></div><div className="field"><label>Password</label><input value="••••••••••" readOnly /></div><div className="field"><label>Timezone</label><select defaultValue="UTC+05:30"><option>UTC+05:30</option><option>UTC</option><option>UTC-05:00</option></select></div><div className="field"><label>Language</label><select defaultValue="English"><option>English</option><option>Deutsch</option><option>日本語</option></select></div></div>}{section === 'Appearance' && <><ToggleRow title="Compact mode" note="Tighter rows for higher information density." value={state.settings.compact} onChange={(value) => updateSettings({ compact: value })} /><ToggleRow title="Reduced animations" note="Prefer a calmer, mostly static interface." value={state.settings.reducedMotion} onChange={(value) => updateSettings({ reducedMotion: value })} /><ToggleRow title="Dark mode" note="DARKODE is always dark by design." value={true} onChange={() => undefined} disabled /></>}{section === 'Notifications' && <><ToggleRow title="Private messages" note="New direct messages and replies." value={state.settings.messages} onChange={(value) => updateSettings({ messages: value })} /><ToggleRow title="Mentions" note="When another member references your username." value={state.settings.mentions} onChange={(value) => updateSettings({ mentions: value })} /><ToggleRow title="Reputation" note="Positive and negative reputation events." value={state.settings.reputation} onChange={(value) => updateSettings({ reputation: value })} /><ToggleRow title="Thread replies" note="Replies to threads you follow." value={state.settings.replies} onChange={(value) => updateSettings({ replies: value })} /></>}{section === 'Privacy' && <><ToggleRow title="Profile visibility" note="Let verified members view your profile page." value={state.settings.profileVisible} onChange={(value) => updateSettings({ profileVisible: value })} /><ToggleRow title="Online status" note="Show the green presence dot next to your name." value={state.settings.online} onChange={(value) => updateSettings({ online: value })} /><ToggleRow title="Activity visibility" note="Show your recent actions in the community feed." value={state.settings.activityVisible} onChange={(value) => updateSettings({ activityVisible: value })} /></>}</div></section></div></> }

function ToggleRow({ title, note, value, onChange, disabled = false }: { title: string; note: string; value: boolean; onChange: (value: boolean) => void; disabled?: boolean }) { return <div className="toggle-row"><div><div className="toggle-title">{title}</div><div className="toggle-note">{note}</div></div><button className={`toggle ${value ? 'on' : ''}`} disabled={disabled} onClick={() => onChange(!value)} aria-label={`${title}: ${value ? 'on' : 'off'}`}><span /></button></div> }

function StatsPage() { return <><PageHeader eyebrow="FORUM TELEMETRY" title="Statistics" subtitle="Fictional community activity, kept deliberately low-noise." /><div className="stats-grid"><StatCard label="Members" value="287" /><StatCard label="Total threads" value="1,942" /><StatCard label="Total posts" value="18,431" /><StatCard label="Online now" value="17" /><StatCard label="New today" value="4" /></div><div className="content-grid" style={{ marginTop: 18 }}><Panel title="Weekly activity" meta="posts"><div className="bar-chart">{[48, 72, 54, 88, 67, 95, 79].map((height, index) => <div className="bar" style={{ height: `${height}%` }} key={index}><span className="bar-label">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</span></div>)}</div></Panel><Panel title="Most active members" meta="by posts">{stats.active.map((name, index) => <div className="report-row" key={name}><Link className="report-title" to={`/members/${name}`}>{String(index + 1).padStart(2, '0')} · {name}</Link><span className="report-meta">{[1456, 1284, 812, 967, 633][index]} posts</span></div>)}</Panel></div><div className="content-grid" style={{ marginTop: 18 }}><Panel title="Most discussed categories">{stats.categories.map((name, index) => <div className="report-row" key={name}><span className="report-title">{name}</span><span className="report-meta">{[482, 326, 293, 204, 214][index]} threads</span></div>)}</Panel><Panel title="Recent registrations">{stats.registrations.map((item) => <div className="activity-row" key={item}><UserRound size={13} style={{ verticalAlign: '-2px', marginRight: 7, color: 'var(--green)' }} />{item}</div>)}</Panel></div></> }

function RulesPage() { return <><Breadcrumbs items={[{ label: 'Reference' }, { label: 'Community rules' }]} /><PageHeader eyebrow="REFERENCE // 01" title="DARKODE community rules" subtitle="A small room works when everyone protects the signal." /><Panel><div className="rules-list">{rules.map((rule, index) => <div className="rule-row" key={rule}><div className="rule-number">{String(index + 1).padStart(2, '0')}</div><div className="rule-text">{rule}</div></div>)}</div><div className="panel-meta mono" style={{ marginTop: 20 }}>Last updated by moderator_0 · September 1, 2026</div></Panel></> }

function ModerationPage({ showToast }: { showToast: (message: string) => void }) { const reports = [{ id: '#421', title: 'Spam post', meta: 'programming · 6 min ago' }, { id: '#422', title: 'Offensive content', meta: 'off topic · 31 min ago' }, { id: '#423', title: 'Duplicate thread', meta: 'linux · 1 hr ago' }]; const action = (label: string) => { if (window.confirm(`${label} this fictional item?`)) showToast(`${label} action recorded locally`) }; return <><PageHeader eyebrow="MODERATOR CONSOLE" title="Keep the room readable." subtitle="Mock moderation controls for the fictional DARKODE community." actions={<span className="badge red"><ShieldCheck size={12} />MODERATOR ONLY</span>} /><div className="moderation-grid"><Panel title="Reports" meta="3 pending">{reports.map((report) => <div className="report-row" key={report.id}><div><div className="report-title"><span className="mono" style={{ color: 'var(--red)', marginRight: 8 }}>{report.id}</span>{report.title}</div><div className="report-meta">{report.meta}</div></div><button className="btn small" onClick={() => action('Review')}>Review</button></div>)}</Panel><Panel title="Moderation queue" meta="local demo"><div className="stat-value" style={{ fontSize: 34 }}>3</div><div className="panel-meta">pending reports</div><div className="tag-list" style={{ marginTop: 16 }}><button className="btn small" onClick={() => action('Pin')}>Pin thread</button><button className="btn small" onClick={() => action('Lock')}>Lock thread</button><button className="btn small danger" onClick={() => action('Hide')}>Hide content</button></div></Panel></div><Panel title="Recent moderator actions" meta="audit trail"><div className="activity-row"><strong>moderator_0</strong> locked <strong>Forum rules and etiquette</strong><span className="activity-time">14 min ago</span></div><div className="activity-row"><strong>moderator_0</strong> moved <strong>Protocol review notes</strong><span className="activity-time">Yesterday</span></div><div className="activity-row"><strong>moderator_0</strong> warned <strong>member_102</strong><span className="activity-time">Sep 28, 2026</span></div></Panel></> }

function LoginPage() { const navigate = useNavigate(); return <div className="auth-screen"><div className="auth-card"><Link to="/" className="brand auth-brand"><span className="brand-mark">&gt;_</span><span><span className="brand-wordmark">DARKODE</span><span className="brand-subtitle">PRIVATE // MEMBERS ONLY</span></span></Link><div className="eyebrow">MEMBER ACCESS</div><h1>Enter the quiet room.</h1><form onSubmit={(event) => { event.preventDefault(); navigate('/dashboard') }}><div className="field"><label>Username</label><input defaultValue="user_4831" autoComplete="off" /></div><div className="field"><label>Password</label><input type="password" defaultValue="darkode-demo" /></div><button className="btn primary" type="submit">LOGIN <ChevronRight size={14} /></button></form><div className="auth-foot"><button className="action-link">Forgot password?</button> · <Link className="link" to="/register">Request an invite</Link></div></div></div> }

function RegisterPage() { const navigate = useNavigate(); return <div className="auth-screen"><div className="auth-card"><Link to="/" className="brand auth-brand"><span className="brand-mark">&gt;_</span><span><span className="brand-wordmark">DARKODE</span><span className="brand-subtitle">PRIVATE // MEMBERS ONLY</span></span></Link><div className="eyebrow">CREATE ACCOUNT</div><h1>Request member access.</h1><form onSubmit={(event) => { event.preventDefault(); navigate('/dashboard') }}><div className="field"><label>Username</label><input placeholder="choose a handle" autoComplete="off" /></div><div className="field"><label>Email</label><input type="email" placeholder="member@local" /></div><div className="field"><label>Password</label><input type="password" placeholder="fictional demo only" /></div><div className="field"><label>Confirm password</label><input type="password" placeholder="repeat password" /></div><div className="field"><label>Invite code</label><input placeholder="DK-XXXX-XXXX" autoComplete="off" /></div><button className="btn primary" type="submit">REGISTER <ChevronRight size={14} /></button></form><div className="auth-foot">Already a member? <Link className="link" to="/login">Return to login</Link></div></div></div> }

function EmptyState({ title, copy, action }: { title: string; copy: string; action?: ReactNode }) { return <div className="empty-state"><FileText size={18} /><strong>{title}</strong><span>{copy}</span>{action && <div style={{ marginTop: 14 }}>{action}</div>}</div> }
function NotFoundPage() { return <div className="not-found"><Terminal size={26} color="var(--green)" /><h2>404 // signal not found</h2><p>The requested fictional record is not available in this local forum snapshot.</p><Link className="btn" to="/forums">Return to forums</Link></div> }

export default App
