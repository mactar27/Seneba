const LOGO_SRC = "/images/seneba.png"

export function SenebaLogo({ className = "h-10" }: { className?: string }) {
  return <img src={LOGO_SRC} alt="Sénéba" className={`object-contain ${className}`} />
}

export function SenebaLogoIcon({ className = "h-8 w-8" }: { className?: string }) {
  return <img src={LOGO_SRC} alt="Sénéba" className={`object-contain ${className}`} />
}
