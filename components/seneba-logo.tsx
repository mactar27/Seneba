const LOGO_SRC = "/images/ChatGPT%20Image%2017%20janv.%202026,%2016_54_53.png"

export function SenebaLogo({ className = "h-10" }: { className?: string }) {
  return <img src={LOGO_SRC} alt="Sénéba" className={`object-contain ${className}`} />
}

export function SenebaLogoIcon({ className = "h-8 w-8" }: { className?: string }) {
  // Show just the swirl icon portion of the logo (left ~35% of image)
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio: "1/1" }}>
      <img
        src={LOGO_SRC}
        alt="Sénéba"
        className="absolute h-full"
        style={{
          width: "auto",
          maxWidth: "none",
          left: "0",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      />
    </div>
  )
}
