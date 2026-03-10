interface RibbonBackgroundProps {
    animated?: boolean
    idPrefix?: string
}

export const RibbonBackground = ({ animated = false, idPrefix = 'r' }: RibbonBackgroundProps) => {
    const gradients = [
        { id: `${idPrefix}1`, from: '#a29bfe', to: '#6c5ce7' },
        { id: `${idPrefix}2`, from: '#74b9ff', to: '#0984e3' },
        { id: `${idPrefix}3`, from: '#ff6b6b', to: '#ee5a24' },
        { id: `${idPrefix}4`, from: '#fd9644', to: '#e17055' },
        { id: `${idPrefix}5`, from: '#00d4aa', to: '#00b894' },
    ]

    const paths = [
        { d: 'M-100,500 C200,650 400,200 720,350 S1100,100 1540,250', delay: '' },
        { d: 'M-100,550 C200,700 400,250 720,400 S1100,150 1540,300', delay: 'ribbon-delay-1' },
        { d: 'M-100,600 C200,750 400,300 720,450 S1100,200 1540,350', delay: 'ribbon-delay-2' },
        { d: 'M-100,650 C200,800 400,350 720,500 S1100,250 1540,400', delay: 'ribbon-delay-3' },
        { d: 'M-100,700 C200,850 400,400 720,550 S1100,300 1540,450', delay: 'ribbon-delay-4' },
    ]

    return (
        <svg className="ribbon-bg" viewBox="0 0 1440 900" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                {gradients.map((g) => (
                    <linearGradient key={g.id} id={g.id} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={g.from} />
                        <stop offset="100%" stopColor={g.to} />
                    </linearGradient>
                ))}
            </defs>
            {paths.map((p, i) => (
                <path
                    key={i}
                    d={p.d}
                    stroke={`url(#${gradients[i].id})`}
                    className={`ribbon-stroke${animated ? ` ribbon-animate ${p.delay}` : ''}`}
                />
            ))}
        </svg>
    )
}
