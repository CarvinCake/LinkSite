const calm = matchMedia('(prefers-reduced-motion: reduce)').matches
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches
const name = document.querySelector('.name')

// The misprint on the name separates as the pointer moves
if (finePointer && !calm) {
	let queued = false
	addEventListener('pointermove', (e) => {
		if (queued) return
		queued = true
		requestAnimationFrame(() => {
			name.style.setProperty('--ox', (e.clientX / innerWidth - 0.5).toFixed(3))
			name.style.setProperty('--oy', (e.clientY / innerHeight - 0.5).toFixed(3))
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

const MAX_MARKS = 13
const CURSOR_BLAST = { speed: 1.25, flashScale: 1.15 } // the small explosions: quicker, with a bigger flash
let marksMade = 0

function stamp(x, y) {
	if (marksMade >= MAX_MARKS) {
		// Out of marks: each further click blows up the oldest mark, and once none are left, the click itself
		const oldest = layer.firstElementChild
		if (oldest) {
			const at = [parseFloat(oldest.style.left), parseFloat(oldest.style.top)]
			oldest.remove()
			explode(at[0], at[1], 96, 3, CURSOR_BLAST)
		} else explode(x, y, 96, 3, CURSOR_BLAST)
		return
	}
	const size = 22 + Math.random() * 30
	const el = document.createElement('span')
	el.className = 'stampmark'
	el.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px;color:${pick(INK)};rotate:${(Math.random() * 90 - 45) | 0}deg`
	el.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${pick(SHAPES)}</svg>`
	layer.append(el)
	marksMade++
	refreshTape()
}
// A mouse stamps the moment it presses. A finger only stamps on a clean tap, so scrolling the page
// (which cancels the pointer) or dragging doesn't litter it with marks.
const TAP_SLOP = 10
let touchStart = null
addEventListener('pointerdown', (e) => {
	if (!e.isPrimary || e.button !== 0 || e.target.closest('a, button')) return
	if (e.pointerType === 'mouse') stamp(e.pageX, e.pageY)
	else touchStart = { id: e.pointerId, x: e.clientX, y: e.clientY }
})
addEventListener('pointerup', (e) => {
	if (touchStart?.id !== e.pointerId) return
	if (Math.hypot(e.clientX - touchStart.x, e.clientY - touchStart.y) < TAP_SLOP) stamp(e.pageX, e.pageY)
	touchStart = null
})
addEventListener('pointercancel', () => (touchStart = null))

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
// Small numbers (under 12) get 24%; the other nine kinds share the remaining 76% equally
const OTHER = 76 / 9
const number = (make) => () => `YOU ARE VISITOR NO. ${make()}`
const visitorLine = () =>
	weighted([
		[24, number(() => int(1, 11))],
		[OTHER, number(() => int(12, 120))],
		[OTHER, number(() => commas(digits(int(4, 7))))],
		[OTHER, number(() => commas(digits(int(9, 12))))],
		[OTHER, number(() => `${int(1, 9)}.${int(10, 99)}e+${int(40, 308)}`)],
		[OTHER, number(() => weighted([
			[1, () => `0.${int(1, 99)}`],
			[1, () => `-${int(1, 99)}`],
			[1, () => '0'.repeat(int(8, 24)) + int(1, 9)],
		]))],
		[OTHER, number(() => weighted([
			[3, () => ['π', 'τ', 'φ', 'e', '√2'][int(0, 4)]],
			[1, () => `${int(2, 9)}π`],
		]))],
		[OTHER, number(() => ['ERR_OVERFLOW', 'NaN', 'Infinity', 'undefined', 'ERR_VISITOR_NOT_FOUND', '0x' + digits(8)][int(0, 5)])],
		[OTHER, () => `YOU ARE THE ${ordinal(int(1, 40))} MOST SUSPICIOUS VISITOR`],
		[
			OTHER,
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
const cell = (l) => esc(l.live ? LIVE[l.live]() : l.text)
// Each kind of line appears exactly once per pass. The two identical copies exist only so the loop
// is seamless; each copy is at least as wide as the screen, so nothing is ever visible twice.
const track = document.querySelector('.tape__track')
const order = shuffle(lines)
let shown = ''
function refreshTape() {
	const copy = `<div>${order.map((l) => `<span>${cell(l)}</span>`).join('')}</div>`
	if (copy === shown) return
	// A changed line rebuilds the whole tape from fresh elements rather than editing text in place: phone
	// browsers could leave an edited slot blank for good if it changed while the page was being scrolled.
	shown = copy
	track.innerHTML = copy + copy
}
refreshTape()
setInterval(() => !document.hidden && refreshTape(), 5000)

// Floating stickers (the badges at the top right) have momentum. Taps give a ring a kick that stacks
// when they come fast. Holding winds it up (the ring creeps backwards and the sticker squashes while
// energy builds) and it only launches when you let go. Drag then slows it back to its idle drift.
// Spin it too far and it flickers red and blows up. Every `.sticker` gets its own copy of this.
const MAX_SPEED = 1500
const FULL_CHARGE = 2.2 // seconds of holding for a full charge
const LAUNCH = 1250 // deg/s added by a full charge
const TAP_MS = 200 // anything shorter than this is a tap, not a hold
const BLOW_AT = 5400 // degrees of spin since the last quiet spell that make a sticker explode
const FUSE = 0.44 // seconds a sticker flickers red after hitting the limit, before it goes up
const NAV_DELAY = 550 // ms a tapped link sticker waits before opening, so a second tap can cancel it
let pendingNav = 0

const BALL = ['#ffffff', '#fff2a8', '#ffd23a', '#ff9d1a', '#ff5a0a', '#c8250a', '#7a1408', '#3a0f0a']
const SMOKE = ['#7a7782', '#5c5a63', '#45434b', '#2e2d33']
const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]
const noise = (x, y, seed) => {
	let h = (x * 374761393 + y * 668265263 + seed * 1442695041) | 0
	h = Math.imul(h ^ (h >>> 13), 1274126177)
	return ((h ^ (h >>> 16)) >>> 0) / 4294967295
}

// One dithered, palette-limited fireball frame, drawn in chunky 2x2 blocks
function fireball(g, cx, cy, f, size, frames) {
	const u = f / (frames - 1)
	const r = size * Math.min(1, u * 1.7) ** 0.55 * (u > 0.7 ? 1 - (u - 0.7) * 0.45 : 1)
	// 2x2 blocks laid out symmetrically around (cx, cy), each block centred on its own offset
	const k = Math.floor(r / 2)
	for (let by = -2 * k; by <= 2 * k; by += 2) {
		for (let bx = -2 * k; bx <= 2 * k; bx += 2) {
			const d = Math.hypot(bx, by) / r
			if (d > 1.05) continue
			const n = noise(bx, by, 9)
			const edge = d + (n - 0.5) * 0.4
			const heat = (1 - edge) * (1.3 - u * 1.2) + (BAYER[(bx >> 1) & 3][(by >> 1) & 3] / 16 - 0.5) * 0.12
			if (heat <= 0.05) {
				if (u > 0.4 && edge < 1.05 && n > 0.45) {
					g.fillStyle = SMOKE[Math.min(3, Math.floor((u - 0.4) * 6 + n * 1.5))]
					g.fillRect(cx + bx - 1, Math.round(cy + by - 1 - (u - 0.4) * 9), 2, 2)
				}
				continue
			}
			g.fillStyle = BALL[Math.min(7, Math.floor((1 - Math.min(1, heat)) * 8))]
			g.fillRect(cx + bx - 1, cy + by - 1, 2, 2)
		}
	}
}

// The flash: a solid disc with spikes, like a comic-book burst. Spike lengths vary a little and the
// whole thing turns between frames. `r` is the tip radius; the core disc is about 60% of it.
function flashBurst(g, cx, cy, r, color, seed) {
	const spikes = 12
	const core = r * 0.6
	const k = Math.ceil(r / 2)
	g.fillStyle = color
	for (let by = -2 * k; by <= 2 * k; by += 2) {
		for (let bx = -2 * k; bx <= 2 * k; bx += 2) {
			const d = Math.hypot(bx, by)
			if (d > r) continue
			const turns = (Math.atan2(by, bx) / (Math.PI * 2) + 1) * spikes + seed * 0.37
			const t = turns % 1
			const tip = 1 - Math.abs(2 * t - 1) // 0 between spikes, 1 at a tip
			const len = 0.65 + 0.35 * noise(Math.floor(turns), 5, seed)
			if (d <= core + (r - core) * tip ** 1.4 * len) g.fillRect(cx + bx - 1, cy + by - 1, 2, 2)
		}
	}
}

// The pixel-art explosion: a low-res canvas centred on (cx, cy) in page coordinates, scaled up with
// hard pixels. It sits under the grain and scanline layers, so it gets the same CRT treatment as the
// rest of the page. `delay` is a fuse before the blast, and `onBoom` runs as the flash hits.
function explode(cx, cy, span, px, { delay = 0, onBoom, speed = 1, flashScale = 1 } = {}) {
	if (calm) return
	const size = 2 * Math.ceil(span / px / 2) // even, so the centre falls on a pixel boundary
	const c = size / 2
	const cv = document.createElement('canvas')
	cv.width = cv.height = size
	cv.className = 'blast'
	cv.style.cssText = `left:${cx - (size * px) / 2}px;top:${cy - (size * px) / 2}px;width:${size * px}px;height:${size * px}px`
	document.body.append(cv)
	const g = cv.getContext('2d')
	const ballSize = Math.round(size * 0.35)
	const start = performance.now()
	let boomAt = 0

	function burn(now) {
		if (!boomAt && (now - start) / 1000 >= delay) {
			boomAt = now
			onBoom?.()
		}
		if (boomAt) {
			const f = Math.floor((now - boomAt) / (80 / speed))
			if (f >= 12) return cv.remove()
			g.clearRect(0, 0, size, size)
			if (f < 2) flashBurst(g, c, c, Math.round(size * (f ? 0.161 : 0.2415) * flashScale), f ? '#fff2a8' : '#ffffff', f + 3)
			fireball(g, c, c, f, ballSize, 12)
		}
		requestAnimationFrame(burn)
	}
	requestAnimationFrame(burn)
}

function createSticker(el, index) {
	const ring = el.querySelector('.sticker__ring')
	const period = parseFloat(el.dataset.period) || 16 // seconds per idle turn, matching the CSS animation
	const IDLE = 360 / period // deg/s
	let spun = 0
	let exploding = false
	let angle = 0
	let speed = IDLE
	let held = null // timestamp of the press, while the pointer is down
	let justHeld = false // a hold-and-release should not also follow the link
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
		if (exploding) {
			speed = Math.max(speed, 1100)
		} else if (winding) {
			// wind-up: ease toward a slow backwards creep that grows with the charge
			speed += (-(25 + 110 * c) - speed) * Math.min(1, 5 * dt)
			el.style.scale = 1 - 0.13 * c
		} else {
			// drag grows with speed, so fast spins bleed energy quickly and slow ones glide
			const excess = speed - IDLE
			speed -= excess * (0.45 + 0.0011 * Math.abs(excess)) * dt
		}
		angle += speed * dt
		if (speed > IDLE) spun += (speed - IDLE) * dt
		ring.style.transform = `rotate(${angle}deg)`
		if (!exploding) warn(now)
		if (!exploding && held === null && Math.abs(speed - IDLE) < 1.5) return settle()
		frame = requestAnimationFrame(step)
	}

	// Hand the ring back to the CSS idle animation, picking it up at the same angle
	function settle() {
		frame = 0
		spun = 0
		el.style.translate = ''
		el.classList.remove('is-hot')
		const turn = ((angle % 360) + 360) % 360
		ring.style.transform = ''
		ring.style.animation = ''
		ring.style.animationDelay = `${-(turn / 360) * period}s`
	}

	// Too much spinning: it shakes, flickers red, then goes up
	const explodes = el.dataset.explode !== 'false' // the ticket survives any amount of spinning
	function warn(now) {
		if (!explodes) return
		const p = spun / BLOW_AT
		if (p >= 0.6) {
			const amp = (p - 0.6) * 10
			el.style.translate = `${((Math.random() - 0.5) * amp).toFixed(1)}px ${((Math.random() - 0.5) * amp).toFixed(1)}px`
		}
		el.classList.toggle('is-hot', p >= 0.85 && Math.floor(now / 80) % 2 === 0)
		if (p >= 1) detonate()
	}

	// Redeeming: the stub tears off along the perforation in a handful of hard frames, a stamp lands on
	// what's left, and the link opens right after.
	const stub = el.querySelector('.ticket__stub')
	const body = el.querySelector('.ticket__body')
	const stamp = el.querySelector('.ticket__stamp')
	const bits = [...el.querySelectorAll('.ticket__bit')]
	const hinge = (a, sx, tx, ty) => `translate(${tx} ${ty}) translate(130 106) rotate(${a}) scale(${sx} 1) translate(-130 -106)`
	// [stub transform, body shake, stub opacity]: the stub keeps flying well past the ticket and fades out
	const FRAMES = [
		[hinge(0, 1, 0, 0), -1, 1],
		[hinge(3, 1, 0, 0), 1, 1],
		[hinge(8, 0.97, 1, 0), 0, 1],
		[hinge(15, 0.9, 3, -2), 0, 1],
		[hinge(26, 0.8, 8, -5), 0, 1],
		[hinge(40, 0.7, 18, -9), 0, 1],
		[hinge(58, 0.6, 34, -6), 0, 0.9],
		[hinge(78, 0.5, 58, 6), 0, 0.8],
		[hinge(100, 0.45, 86, 24), 0, 0.68],
		[hinge(124, 0.4, 116, 48), 0, 0.55],
		[hinge(150, 0.35, 150, 78), 0, 0.42],
		[hinge(176, 0.3, 186, 112), 0, 0.3],
		[hinge(204, 0.25, 226, 150), 0, 0.18],
		[hinge(232, 0.2, 270, 196), 0, 0.08],
		[hinge(260, 0.2, 320, 250), 0, 0],
	]
	const TORN_AT = 6 // from this frame on the stub is clearly off the ticket, so the link starts loading
	let peeling = false
	let peelTimer = 0
	function unpeel() {
		clearTimeout(peelTimer)
		peeling = false
		stub.removeAttribute('transform')
		stub.style.opacity = ''
		body.removeAttribute('transform')
		stamp.style.visibility = 'hidden'
		bits.forEach((b) => (b.style.visibility = 'hidden'))
	}
	function peel() {
		if (peeling) return
		peeling = true
		let i = 0
		const tick = () => {
			const [t, shake, opacity] = FRAMES[i]
			stub.setAttribute('transform', t)
			stub.style.opacity = opacity
			body.setAttribute('transform', `translate(${shake} 0)`)
			stamp.style.visibility = i >= 5 ? 'visible' : 'hidden'
			bits.forEach((b, k) => {
				const n = i - 3
				b.style.visibility = n > 0 && n < 6 ? 'visible' : 'hidden'
				b.setAttribute('transform', `translate(${n * (4 + k)} ${n * (k % 2 ? 5 : -4) + n * n})`)
			})
			if (i === TORN_AT) location.href = el.href // keeps animating until the new page takes over
			// if the navigation never happens (offline, blocked), the ticket heals after a while
			peelTimer = ++i < FRAMES.length ? setTimeout(tick, 70) : setTimeout(unpeel, 3000)
		}
		tick()
	}
	// coming back through the browser's back button should find an unredeemed ticket
	addEventListener('pagehide', () => peeling && unpeel())
	addEventListener('pageshow', (e) => e.persisted && peeling && unpeel())

	function detonate() {
		exploding = true
		held = null
		el.style.scale = ''
		el.classList.add('is-hot')
		const box = el.getBoundingClientRect()
		explode(box.left + scrollX + box.width / 2, box.top + scrollY + box.height / 2, box.width * 2.5, box.width < 120 ? 3 : 4, {
			delay: FUSE,
			onBoom() {
				// the real sticker is gone under the flash; hide it so the others keep their places
				cancelAnimationFrame(frame)
				el.style.visibility = 'hidden'
				el.inert = true
			},
		})
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

	function release(e) {
		if (held === null) return
		if (e?.type === 'pointercancel' || e?.type === 'blur') {
			held = null
			el.style.scale = ''
			return
		}
		const now = performance.now()
		const wasTap = now - held < TAP_MS
		const c = charge(now)
		held = null
		el.style.scale = ''
		if (wasTap) kick()
		else {
			justHeld = true
			speed = Math.min(MAX_SPEED, Math.max(speed, 0) + LAUNCH * c ** 1.2 + 120)
		}
	}

	el.addEventListener('pointerdown', (e) => {
		if (e.button !== 0) return // a right click keeps its menu and doesn't spin anything
		clearTimeout(pendingNav)
		justHeld = false
		launch()
		held = performance.now()
		try {
			el.setPointerCapture(e.pointerId)
		} catch {}
	})
	el.addEventListener('pointerup', release)
	el.addEventListener('pointercancel', release)
	el.addEventListener('lostpointercapture', release)
	addEventListener('blur', release)
	// a long press on touch is a wind-up, not a request for the link's context menu
	el.addEventListener('contextmenu', (e) => held !== null && e.preventDefault())
	el.addEventListener('click', (e) => {
		if (e.detail === 0) {
			// keyboard: a link follows normally, a button just gets a kick
			if (el.tagName !== 'A') {
				launch()
				kick()
			}
			return
		}
		if (el.tagName !== 'A' || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
		// A tap on a link sticker gives it a kick, then opens the link unless another press comes first
		e.preventDefault()
		if (justHeld) return
		if ('peel' in el.dataset) return peel()
		clearTimeout(pendingNav)
		pendingNav = setTimeout(() => (location.href = el.href), NAV_DELAY)
	})
	// Radar blip: it lights up white as the sweep reaches it, then cools back to red while the sweep
	// moves on. The sweep's angle comes from the JS spin when it's running, else from the CSS idle turn.
	const blip = el.querySelector('.radar__blip')
	if (blip) {
		const [ox, oy] = ring.style.transformOrigin.split(' ').map(parseFloat)
		const hit = (((Math.atan2(blip.getAttribute('cy') - oy, blip.getAttribute('cx') - ox) * 180) / Math.PI) + 360) % 360
		const WEDGE = 45 // degrees the sweep wedge covers, trailing its leading edge
		let shown = -1
		const glow = () => {
			let a = angle
			if (!frame) {
				const idle = ring.getAnimations()[0]
				a = idle ? (idle.effect.getComputedTiming().progress ?? 0) * 360 : 0
			}
			const since = ((((a % 360) + 360) % 360) - hit + 360) % 360
			const lit = since <= WEDGE ? 1 : Math.max(0, 1 - (since - WEDGE) / 70)
			if (Math.abs(lit - shown) > 0.02) {
				shown = lit
				blip.style.fill = `rgb(255 ${Math.round(59 + 196 * lit)} ${Math.round(92 + 163 * lit)})`
			}
			requestAnimationFrame(glow)
		}
		requestAnimationFrame(glow)
	}

	// The ring is thrown as the sticker slaps onto the page, then drags down to its idle drift
	setTimeout(() => {
		launch()
		speed = 1250
	}, 450 + index * 160)
}

document.querySelector('.stickers').style.setProperty('--count', document.querySelectorAll('.sticker').length)
if (!calm) document.querySelectorAll('.sticker').forEach(createSticker)
