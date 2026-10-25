const calm = matchMedia('(prefers-reduced-motion: reduce)').matches
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches
const root = document.documentElement

// The misprint on the name separates as the pointer moves
if (finePointer && !calm) {
	let queued = false
	addEventListener('pointermove', (e) => {
		if (queued) return
		queued = true
		requestAnimationFrame(() => {
			root.style.setProperty('--ox', (e.clientX / innerWidth - 0.5).toFixed(3))
			root.style.setProperty('--oy', (e.clientY / innerHeight - 0.5).toFixed(3))
			queued = false
		})
	})
}

// Every click leaves a hand-stamped mark on the page
const layer = document.getElementById('stamps')
const INK = ['#ff3b5c', '#c8ff2e', '#6c5ce7', '#a29bfe', '#e8e8e0']
const SHAPES = [
	'<path d="M4 4l16 16M20 4 4 20" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="square"/>',
	'<path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7" fill="none" stroke="currentColor" stroke-width="3.6"/>',
	'<path d="M12 1l2.9 6.6 7.1.7-5.3 4.8 1.6 7L12 16.5 5.7 20.1l1.6-7L2 8.3l7.1-.7z" fill="currentColor"/>',
	'<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="4"/>',
	'<path d="M3 20 12 3l9 17z" fill="currentColor"/>',
]
const pick = (list) => list[(Math.random() * list.length) | 0]

const MAX_MARKS = 48
let marksMade = 0

function stamp(x, y) {
	if (calm) return
	const size = 22 + Math.random() * 30
	const el = document.createElement('span')
	el.className = 'stampmark'
	el.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px;color:${pick(INK)};rotate:${(Math.random() * 90 - 45) | 0}deg`
	el.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${pick(SHAPES)}</svg>`
	layer.append(el)
	if (layer.children.length > MAX_MARKS) layer.firstElementChild.remove()
	marksMade++
	refreshTape()
}
addEventListener('pointerdown', (e) => stamp(e.pageX, e.pageY))

// The tape: a different mix of lines on every visit, some of them live
const store = {
	get: (k) => {
		try {
			return localStorage.getItem(k)
		} catch {
			return null
		}
	},
	set: (k, v) => {
		try {
			localStorage.setItem(k, v)
		} catch {}
	},
}
const lastVisit = parseInt(store.get('cc:last'), 10)
store.set('cc:last', Date.now())

// A made-up visitor number, drawn fresh on every visit. Common scenarios are plain numbers
// of different scales; the odd ones are rare, and the "from your house" line is rarest.
const int = (a, b) => a + Math.floor(Math.random() * (b - a + 1))
const digits = (n) => String(int(1, 9)) + Array.from({ length: n - 1 }, () => int(0, 9)).join('')
const commas = (s) => s.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
const ordinal = (n) => n + (n % 100 >= 11 && n % 100 <= 13 ? 'TH' : { 1: 'ST', 2: 'ND', 3: 'RD' }[n % 10] || 'TH')
const weighted = (table) => {
	let roll = Math.random() * table.reduce((sum, [w]) => sum + w, 0)
	for (const [w, make] of table) if ((roll -= w) < 0) return make()
	return table[0][1]()
}
const number = (make) => () => `YOU ARE VISITOR NO. ${make()}`
const visitorLine = () =>
	weighted([
		[24, number(() => int(1, 120))],
		[24, number(() => commas(digits(int(4, 7))))],
		[14, number(() => commas(digits(int(9, 12))))],
		[12, number(() => `${int(1, 9)}.${int(10, 99)}e+${int(40, 308)}`)],
		[6, number(() => weighted([
			[1, () => `0.${int(1, 99)}`],
			[1, () => `-${int(1, 99)}`],
			[1, () => '0'.repeat(int(8, 24)) + int(1, 9)],
		]))],
		[5, number(() => weighted([
			[3, () => ['π', 'τ', 'φ', 'e', '√2'][int(0, 4)]],
			[1, () => `${int(2, 9)}π`],
		]))],
		[5, number(() => ['ERR_OVERFLOW', 'NaN', 'Infinity', 'undefined', 'ERR_VISITOR_NOT_FOUND', '0x' + digits(8)][int(0, 5)])],
		[6, () => `YOU ARE THE ${ordinal(int(1, 40))} MOST SUSPICIOUS VISITOR`],
		[
			0.7,
			() => {
				const n = weighted([[50, () => 2], [30, () => 3], [10, () => 4], [5, () => 5], [3, () => int(6, 9)], [2, () => int(10, 40)]])
				return `YOU ARE VISITOR NO. ${n} IN A ROW FROM YOUR HOUSE`
			},
		],
	])

const shuffle = (list) => list.map((v) => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map((p) => p[1])
const clock = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

const LIVE = {
	marks: () => (MAX_MARKS - marksMade > 0 ? `MARKS LEFT: ${MAX_MARKS - marksMade}` : 'NO MARKS LEFT. KEEP GOING'),
	time: () => `LOCAL TIME ${clock()}`,
}
const lines = [
	{ live: 'marks' },
	{ text: visitorLine() },
	{ text: '404 TEXTURE MISSING' },
]
if (Math.random() < 0.4) lines.push({ live: 'time' })
if (Math.random() < 0.4) {
	const when = lastVisit
		? new Date(lastVisit).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).replace(',', '')
		: null
	lines.push({ text: when ? `LAST VISITED ${when}` : 'FIRST VISIT. WELCOME' })
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
const cell = (l) => (l.live ? `<b data-live="${l.live}">${LIVE[l.live]()}</b>` : esc(l.text))
// Each kind of line appears exactly once per pass. The two identical copies exist only so the loop
// is seamless; each copy is at least as wide as the screen, so nothing is ever visible twice.
const track = document.querySelector('.tape__track')
const copy = `<div>${shuffle(lines).map((l) => `<span>${cell(l)}</span>`).join('')}</div>`
track.innerHTML = copy + copy

function refreshTape() {
	for (const el of track.querySelectorAll('[data-live]')) el.textContent = LIVE[el.dataset.live]()
}
setInterval(() => !document.hidden && refreshTape(), 5000)

// The badge ring has momentum. Taps give it a kick that stacks when they come fast. Holding winds
// it up (the ring creeps backwards and the badge squashes while energy builds) and it only launches
// when you let go. Drag then slows it back to its idle drift.
const badge = document.querySelector('.badge')
const ring = badge.querySelector('.badge__ring')
const IDLE = 360 / 16 // deg/s, the same as the CSS idle spin (16s per turn)
const MAX_SPEED = 1500
const FULL_CHARGE = 2.2 // seconds of holding for a full charge
const LAUNCH = 1250 // deg/s added by a full charge
const TAP_MS = 200 // anything shorter than this is a tap, not a hold
let angle = 0
let speed = IDLE
let held = null // timestamp of the press, while the pointer is down
let combo = 0
let lastTap = 0
let last = 0
let frame = 0

const charge = (now) => (held === null ? 0 : Math.min((now - held) / 1000 / FULL_CHARGE, 1))

function currentAngle() {
	const m = new DOMMatrix(getComputedStyle(ring).transform)
	return (Math.atan2(m.b, m.a) * 180) / Math.PI
}

function kick() {
	const now = performance.now()
	combo = now - lastTap < 650 ? Math.min(combo + 1, 6) : 0
	lastTap = now
	speed = Math.min(MAX_SPEED, speed + 300 * (1 + combo * 0.45))
}

function step(now) {
	const dt = Math.min((now - last) / 1000, 0.05)
	last = now
	const c = charge(now)
	const winding = held !== null && now - held > TAP_MS
	if (winding) {
		// wind-up: ease toward a slow backwards creep that grows with the charge
		speed += (-(25 + 110 * c) - speed) * Math.min(1, 5 * dt)
		badge.style.scale = 1 - 0.13 * c
	} else {
		// drag grows with speed, so fast spins bleed energy quickly and slow ones glide
		const excess = speed - IDLE
		speed -= excess * (0.45 + 0.0011 * Math.abs(excess)) * dt
	}
	angle += speed * dt
	ring.style.transform = `rotate(${angle}deg)`
	if (held === null && Math.abs(speed - IDLE) < 1.5) return settle()
	frame = requestAnimationFrame(step)
}

// Hand the ring back to the CSS idle animation, picking it up at the same angle
function settle() {
	frame = 0
	const turn = ((angle % 360) + 360) % 360
	ring.style.transform = ''
	ring.style.animation = ''
	ring.style.animationDelay = `${-(turn / 360) * 16}s`
}

function launch() {
	if (!frame) {
		angle = currentAngle()
		speed = IDLE
		ring.style.animation = 'none'
		ring.style.transform = `rotate(${angle}deg)`
		last = performance.now()
		frame = requestAnimationFrame(step)
	}
}

function release() {
	if (held === null) return
	const now = performance.now()
	const wasTap = now - held < TAP_MS
	const c = charge(now)
	held = null
	badge.style.scale = ''
	if (wasTap) kick()
	else speed = Math.min(MAX_SPEED, Math.max(speed, 0) + LAUNCH * c ** 1.2 + 120)
}

if (!calm) {
	badge.addEventListener('pointerdown', (e) => {
		launch()
		held = performance.now()
		try {
			badge.setPointerCapture(e.pointerId)
		} catch {}
	})
	badge.addEventListener('pointerup', release)
	badge.addEventListener('pointercancel', release)
	badge.addEventListener('lostpointercapture', release)
	// The ring is thrown as the badge slaps onto the page, then drags down to its idle drift
	setTimeout(() => {
		launch()
		speed = 1250
	}, 450)
	// Keyboard activation has no pointer events
	badge.addEventListener('click', (e) => {
		if (e.detail === 0) {
			launch()
			kick()
		}
	})
}
