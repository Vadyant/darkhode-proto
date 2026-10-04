export type Rank = 'Newbie' | 'Member' | 'Trusted' | 'Veteran' | 'Elite' | 'Moderator' | 'Administrator'
export type Presence = 'online' | 'away' | 'offline'

export type User = {
  username: string
  rank: Rank
  reputation: number
  posts: number
  threads: number
  joined: string
  status: string
  bio: string
  interests: string[]
  badges: string[]
  presence: Presence
  accent: string
}

export type Category = {
  slug: string
  name: string
  description: string
  icon: string
  threads: number
  posts: number
  lastBy: string
  lastWhen: string
}

export type Thread = {
  id: string
  title: string
  prefix: 'DISCUSSION' | 'GUIDE' | 'QUESTION' | 'ANNOUNCEMENT'
  category: string
  author: string
  replies: number
  views: number
  lastBy: string
  lastWhen: string
  created: string
  tags: string[]
  pinned?: boolean
  locked?: boolean
  unread?: boolean
}

export type Post = {
  id: string
  threadId: string
  author: string
  timestamp: string
  body: string
  code?: string
  likes: number
}

export type Message = {
  id: string
  from: string
  subject: string
  preview: string
  timestamp: string
  unread: boolean
  messages: { from: string; body: string; timestamp: string }[]
}

export const users: User[] = [
  { username: 'x3r0', rank: 'Trusted', reputation: 981, posts: 1284, threads: 74, joined: 'May 2023', status: 'Reading the signal between the lines.', bio: 'Systems thinker. Prefers small tools, clear notes, and reproducible experiments.', interests: ['ELF internals', 'Linux', 'tooling'], badges: ['TOP CONTRIBUTOR', 'RESEARCHER', 'TRUSTED MEMBER'], presence: 'online', accent: '#75f59a' },
  { username: 'ghostroot', rank: 'Veteran', reputation: 744, posts: 812, threads: 51, joined: 'Feb 2024', status: 'Debugging the quiet parts.', bio: 'Reverse engineering and debugging workflows, with a soft spot for old manuals.', interests: ['Debuggers', 'binary analysis', 'documentation'], badges: ['VETERAN', 'HELPFUL', 'RESEARCHER'], presence: 'online', accent: '#a8b5ff' },
  { username: 'nullbyte', rank: 'Trusted', reputation: 612, posts: 967, threads: 43, joined: 'Aug 2023', status: 'Compiling thoughts.', bio: 'Build systems, systems languages, and making complex projects boring again.', interests: ['C++', 'Rust', 'build systems'], badges: ['CODE CONTRIBUTOR', '100 POSTS', 'HELPFUL'], presence: 'away', accent: '#f5c46b' },
  { username: 'cipher', rank: 'Elite', reputation: 1340, posts: 1456, threads: 88, joined: 'Nov 2022', status: 'Available for protocol discussions.', bio: 'Cryptography student and protocol reviewer. Precision beats mystique.', interests: ['Protocols', 'cryptography', 'privacy'], badges: ['CRYPTO ENTHUSIAST', 'ELITE', 'TOP CONTRIBUTOR'], presence: 'online', accent: '#e38cff' },
  { username: 'rook', rank: 'Member', reputation: 221, posts: 183, threads: 16, joined: 'Jan 2026', status: 'Learning in public.', bio: 'Newer member working through Linux internals one subsystem at a time.', interests: ['Linux', 'operating systems', 'notes'], badges: ['FIRST POST', 'HELPFUL'], presence: 'online', accent: '#63b7ff' },
  { username: 'hexbyte', rank: 'Member', reputation: 309, posts: 278, threads: 22, joined: 'Oct 2025', status: 'Sketching an architecture.', bio: 'Developer interested in secure defaults and approachable engineering.', interests: ['Python', 'security tools', 'UX'], badges: ['CODE CONTRIBUTOR', '100 POSTS'], presence: 'offline', accent: '#ff8f70' },
  { username: 'specter', rank: 'Trusted', reputation: 507, posts: 633, threads: 35, joined: 'Jun 2024', status: 'On a low-noise schedule.', bio: 'Networking and privacy enthusiast. Likes diagrams more than slogans.', interests: ['Networking', 'privacy', 'protocols'], badges: ['RESEARCHER', 'TRUSTED MEMBER'], presence: 'away', accent: '#65e0c1' },
  { username: 'moderator_0', rank: 'Moderator', reputation: 1884, posts: 930, threads: 29, joined: 'Jan 2022', status: 'Keeping the room readable.', bio: 'Moderator and long-time member. Here to keep discussions useful and civil.', interests: ['Community', 'research', 'moderation'], badges: ['VETERAN', 'TRUSTED MEMBER', 'TOP CONTRIBUTOR'], presence: 'online', accent: '#ff636d' },
  { username: 'user_4831', rank: 'Newbie', reputation: 128, posts: 47, threads: 12, joined: '214 days ago', status: 'Tracking the latest discussions.', bio: 'Curious builder collecting better questions and cleaner explanations.', interests: ['Reverse engineering', 'Linux', 'privacy'], badges: ['FIRST POST', 'HELPFUL'], presence: 'online', accent: '#75f59a' },
]

export const categories: Category[] = [
  { slug: 'general', name: 'General', description: 'Community discussion and forum announcements.', icon: '◈', threads: 138, posts: 906, lastBy: 'moderator_0', lastWhen: '4 min ago' },
  { slug: 'programming', name: 'Programming', description: 'C, C++, Rust, Python, JavaScript and software engineering.', icon: '⌘', threads: 326, posts: 2844, lastBy: 'nullbyte', lastWhen: '8 min ago' },
  { slug: 'cybersecurity', name: 'Cybersecurity', description: 'Security concepts, defensive research and technical discussion.', icon: '◒', threads: 482, posts: 3218, lastBy: 'x3r0', lastWhen: '12 min ago' },
  { slug: 'cryptography', name: 'Cryptography', description: 'Cryptographic algorithms, protocols and mathematical concepts.', icon: '⌁', threads: 214, posts: 1690, lastBy: 'cipher', lastWhen: '18 min ago' },
  { slug: 'reverse-engineering', name: 'Reverse Engineering', description: 'Binary analysis, debugging and software internals.', icon: '⌬', threads: 293, posts: 2764, lastBy: 'ghostroot', lastWhen: '22 min ago' },
  { slug: 'networking', name: 'Networking', description: 'Protocols, infrastructure and network engineering.', icon: '⌘', threads: 177, posts: 1438, lastBy: 'specter', lastWhen: '34 min ago' },
  { slug: 'linux', name: 'Linux', description: 'Linux administration, internals and tooling.', icon: '▣', threads: 204, posts: 2278, lastBy: 'rook', lastWhen: '41 min ago' },
  { slug: 'development', name: 'Development', description: 'Projects, tools, libraries and development workflows.', icon: '⌘', threads: 241, posts: 2197, lastBy: 'hexbyte', lastWhen: '1 hr ago' },
  { slug: 'research', name: 'Research', description: 'Academic and technical security research.', icon: '⌖', threads: 98, posts: 824, lastBy: 'cipher', lastWhen: '2 hrs ago' },
  { slug: 'off-topic', name: 'Off Topic', description: 'Everything else.', icon: '·', threads: 69, posts: 272, lastBy: 'rook', lastWhen: '3 hrs ago' },
]

export const threads: Thread[] = [
  { id: 'binary-analysis', title: 'Understanding modern binary analysis', prefix: 'DISCUSSION', category: 'reverse-engineering', author: 'ghostroot', replies: 17, views: 291, lastBy: 'x3r0', lastWhen: '41 min ago', created: 'October 4, 2026', tags: ['ELF', 'debugging', 'workflow'], unread: true },
  { id: 'cpp-projects', title: 'How do you organize large C++ projects?', prefix: 'DISCUSSION', category: 'programming', author: 'nullbyte', replies: 31, views: 482, lastBy: 'ghostroot', lastWhen: '22 min ago', created: 'October 3, 2026', tags: ['C++', 'architecture'], unread: true },
  { id: 'elf-binaries', title: 'Understanding ELF binaries', prefix: 'QUESTION', category: 'linux', author: 'rook', replies: 17, views: 291, lastBy: 'x3r0', lastWhen: '41 min ago', created: 'October 3, 2026', tags: ['ELF', 'Linux'], unread: true },
  { id: 'privacy-os', title: 'Privacy-focused operating systems', prefix: 'DISCUSSION', category: 'privacy', author: 'specter', replies: 24, views: 639, lastBy: 'cipher', lastWhen: '1 hr ago', created: 'October 2, 2026', tags: ['privacy', 'operating systems'] },
  { id: 'crypto-references', title: 'Practical cryptography references', prefix: 'GUIDE', category: 'cryptography', author: 'cipher', replies: 12, views: 1204, lastBy: 'rook', lastWhen: '2 hrs ago', created: 'October 1, 2026', tags: ['cryptography', 'reading list'], pinned: true },
  { id: 'forum-rules', title: 'Forum rules and etiquette', prefix: 'ANNOUNCEMENT', category: 'general', author: 'moderator_0', replies: 124, views: 2483, lastBy: 'cipher', lastWhen: '14 min ago', created: 'September 1, 2026', tags: ['rules', 'announcement'], pinned: true, locked: true },
  { id: 'elf-linking', title: 'ELF loading and linking', prefix: 'GUIDE', category: 'linux', author: 'x3r0', replies: 28, views: 812, lastBy: 'ghostroot', lastWhen: '2 hrs ago', created: 'September 28, 2026', tags: ['ELF', 'linking'], unread: true },
  { id: 'protocol-notes', title: 'Notes on protocol review checklists', prefix: 'GUIDE', category: 'cybersecurity', author: 'cipher', replies: 9, views: 442, lastBy: 'specter', lastWhen: '3 hrs ago', created: 'September 27, 2026', tags: ['protocols', 'review'] },
  { id: 'debugger-workflow', title: 'Modern reverse engineering workflows', prefix: 'DISCUSSION', category: 'reverse-engineering', author: 'ghostroot', replies: 42, views: 1420, lastBy: 'x3r0', lastWhen: '3 hrs ago', created: 'September 25, 2026', tags: ['debugging', 'tooling'], unread: true },
  { id: 'linux-permissions', title: 'Understanding Linux permissions', prefix: 'GUIDE', category: 'linux', author: 'rook', replies: 19, views: 378, lastBy: 'nullbyte', lastWhen: '4 hrs ago', created: 'September 24, 2026', tags: ['Linux', 'permissions'] },
]

export const posts: Post[] = [
  { id: 'p1', threadId: 'binary-analysis', author: 'ghostroot', timestamp: 'October 4, 2026 · 09:31', body: 'Has anyone compared the debugging workflow between GDB and modern reverse-engineering suites? I am less interested in feature checklists and more interested in how people move from a first hypothesis to a small, testable observation.', likes: 12 },
  { id: 'p2', threadId: 'binary-analysis', author: 'x3r0', timestamp: 'October 4, 2026 · 09:42', body: 'For ELF work I still prefer starting from the command line. Once I understand the binary layout, I move into the GUI. The transition point is usually when I have a question about state rather than structure.', code: `readelf -h ./sample\nobjdump -d -M intel ./sample | less\ngdb -q ./sample`, likes: 8 },
  { id: 'p3', threadId: 'binary-analysis', author: 'cipher', timestamp: 'October 4, 2026 · 09:58', body: 'The important part is understanding what the loader is doing, not which tool you use. A short notebook with assumptions, offsets, and observations has saved me more time than any plugin.', likes: 16 },
  { id: 'p4', threadId: 'binary-analysis', author: 'user_4831', timestamp: 'October 4, 2026 · 10:04', body: 'This is helpful. I have been jumping between views too early, so I am going to try writing the initial model down first and only then open the richer UI.', likes: 5 },
  { id: 'p5', threadId: 'elf-binaries', author: 'rook', timestamp: 'October 3, 2026 · 16:20', body: 'I understand the sections at a high level, but I am still fuzzy on how the loader decides what becomes a mapped segment. Is there a good way to observe that without turning the first pass into a huge project?', likes: 9 },
  { id: 'p6', threadId: 'elf-binaries', author: 'x3r0', timestamp: 'October 3, 2026 · 16:44', body: 'Start with the program headers rather than the section names. Compare what the file says with the memory map of a running process, then write down the mismatches. The exercise is small and usually clarifies the model quickly.', likes: 14 },
]

export const messages: Message[] = [
  { id: 'm1', from: 'x3r0', subject: 'Your ELF notes', preview: 'The short version is in the thread now. The map comparison…', timestamp: '12 min ago', unread: true, messages: [{ from: 'x3r0', body: 'The short version is in the thread now. The map comparison tends to make the loader model click.', timestamp: '12 min ago' }, { from: 'user_4831', body: 'Thanks — I will read it before I ask another question.', timestamp: '8 min ago' }] },
  { id: 'm2', from: 'ghostroot', subject: 'RE workflow discussion', preview: 'Added a note about keeping hypotheses separate from observations.', timestamp: '1 hr ago', unread: true, messages: [{ from: 'ghostroot', body: 'Added a note about keeping hypotheses separate from observations. That distinction helps when a session gets noisy.', timestamp: '1 hr ago' }] },
  { id: 'm3', from: 'nullbyte', subject: 'Build systems thread', preview: 'Would be curious to hear how you structure the docs folder.', timestamp: 'Yesterday', unread: false, messages: [{ from: 'nullbyte', body: 'Would be curious to hear how you structure the docs folder for small tools.', timestamp: 'Yesterday' }, { from: 'user_4831', body: 'I am still experimenting, but I want the design notes to live close to the code.', timestamp: 'Yesterday' }] },
  { id: 'm4', from: 'moderator_0', subject: 'Welcome to DARKODE', preview: 'Keep discussions technical and make use of the report link if needed.', timestamp: '3 days ago', unread: false, messages: [{ from: 'moderator_0', body: 'Keep discussions technical and make use of the report link if needed. Enjoy the forum.', timestamp: '3 days ago' }] },
]

export const notifications = [
  { id: 'n1', kind: 'reply', title: 'ghostroot replied to your thread', detail: 'Modern reverse engineering workflows', time: '4 min ago', unread: true },
  { id: 'n2', kind: 'mention', title: 'x3r0 mentioned you', detail: 'Understanding ELF binaries', time: '17 min ago', unread: true },
  { id: 'n3', kind: 'rep', title: 'You received +5 reputation', detail: 'Helpful answer in Reverse Engineering', time: '42 min ago', unread: true },
  { id: 'n4', kind: 'milestone', title: 'Your thread reached 100 views', detail: 'Privacy-focused operating systems', time: '1 hr ago', unread: false },
  { id: 'n5', kind: 'badge', title: 'You earned the HELPFUL badge', detail: 'Keep the signal clean.', time: 'Yesterday', unread: false },
  { id: 'n6', kind: 'announcement', title: 'New forum announcement', detail: 'October maintenance window notes', time: '2 days ago', unread: false },
]

export const activity = [
  { user: 'x3r0', action: 'created a thread in', target: 'Reverse Engineering', time: '2 min ago' },
  { user: 'ghostroot', action: 'replied to', target: 'Understanding ELF binaries', time: '8 min ago' },
  { user: 'cipher', action: 'earned the', target: 'Trusted Member badge', time: '21 min ago' },
  { user: 'nullbyte', action: 'received', target: '+5 reputation', time: '1 hr ago' },
  { user: 'rook', action: 'joined the', target: 'Linux forum', time: '2 hrs ago' },
]

export const reputationHistory = [
  { amount: 5, label: 'Helpful answer in Reverse Engineering', meta: 'ghostroot · 4 min ago' },
  { amount: 3, label: 'Good explanation of ELF internals', meta: 'x3r0 · Yesterday' },
  { amount: -1, label: 'Low-quality post', meta: 'moderator_0 · Sep 28' },
  { amount: 8, label: 'Community contribution', meta: 'cipher · Sep 14' },
]

export const rules = [
  'Respect other members.',
  'No spam.',
  'No harassment.',
  'Keep discussions technical.',
  'Do not post personal information.',
  'Do not upload illegal material.',
  'Follow moderator instructions.',
  'Use descriptive thread titles.',
]

export const stats = {
  members: 287,
  threads: 1942,
  posts: 18431,
  online: 17,
  newToday: 4,
  active: ['cipher', 'x3r0', 'ghostroot', 'nullbyte', 'specter'],
  categories: ['Cybersecurity', 'Programming', 'Reverse Engineering', 'Linux', 'Cryptography'],
  registrations: ['rook · 2 hrs ago', 'haze · 4 hrs ago', 'vectorial · 6 hrs ago', 'mintline · Yesterday'],
}

export const getUser = (username: string) => users.find((user) => user.username === username)
export const getThread = (id: string) => threads.find((thread) => thread.id === id)
export const getCategory = (slug: string) => categories.find((category) => category.slug === slug)
export const getPosts = (threadId: string) => posts.filter((post) => post.threadId === threadId)
