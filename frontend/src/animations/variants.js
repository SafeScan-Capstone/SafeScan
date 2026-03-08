// Reusable Framer Motion variants for consistent premium animations

export const EASE_SPRING = [0.16, 1, 0.3, 1]
export const EASE_OUT = [0.25, 0, 0, 1]

// Page-level enter transition
export const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_SPRING } },
  exit:    { opacity: 0, y: -8,  transition: { duration: 0.25, ease: 'easeIn' } },
}

// Fade up (used for individual sections)
export const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE_SPRING, delay },
  }),
}

// Fade in (no movement)
export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut', delay },
  }),
}

// Slide in from left
export const slideLeft = {
  hidden:  { opacity: 0, x: -32 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: EASE_SPRING, delay },
  }),
}

// Slide in from right
export const slideRight = {
  hidden:  { opacity: 0, x: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: EASE_SPRING, delay },
  }),
}

// Staggered container – children animate in sequence
export const staggerContainer = {
  hidden:  {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
}

// Stagger child item (used inside staggerContainer)
export const staggerItem = {
  hidden:  { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_SPRING },
  },
}

// Scale pop (for buttons, badges)
export const scalePop = {
  rest:    { scale: 1 },
  hover:   { scale: 1.03, transition: { duration: 0.2, ease: EASE_OUT } },
  tap:     { scale: 0.97, transition: { duration: 0.1 } },
}

// Card hover lift
export const cardHover = {
  rest:    { y: 0,  boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  hover:   { y: -4, boxShadow: '0 12px 28px rgba(13,100,93,0.12)', transition: { duration: 0.25, ease: EASE_OUT } },
}

// Modal overlay
export const overlayVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit:    { opacity: 0, transition: { duration: 0.2 } },
}

// Modal panel
export const modalVariants = {
  hidden:  { opacity: 0, scale: 0.95, y: 16 },
  visible: { opacity: 1, scale: 1,    y: 0,  transition: { duration: 0.3, ease: EASE_SPRING } },
  exit:    { opacity: 0, scale: 0.95, y: 8,  transition: { duration: 0.2, ease: 'easeIn' } },
}

// Drawer (slide from right)
export const drawerVariants = {
  hidden:  { x: '100%' },
  visible: { x: 0,     transition: { duration: 0.35, ease: EASE_SPRING } },
  exit:    { x: '100%', transition: { duration: 0.28, ease: 'easeIn' } },
}
