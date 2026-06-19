export type SupportedSourceBadge = "IG" | "TT" | "YT" | "G" | "W";

type SourceBadgeIconsProps = {
  badges: string[];
  isSelected: boolean;
};

type SourceBadgeIconConfig = {
  label: string;
  icon: React.ReactNode;
};

const sourceBadgeIconConfigs: Record<SupportedSourceBadge, SourceBadgeIconConfig> = {
  IG: {
    label: "Instagram",
    icon: (
      <span
        aria-hidden="true"
        className="grid h-4 w-4 place-items-center rounded-[0.35rem] border border-current text-[9px] font-bold"
        data-testid="source-icon-instagram"
      >
        IG
      </span>
    )
  },
  TT: {
    label: "TikTok",
    icon: (
      <span
        aria-hidden="true"
        className="grid h-4 w-4 place-items-center text-[13px] font-black"
        data-testid="source-icon-tiktok"
      >
        ♪
      </span>
    )
  },
  YT: {
    label: "YouTube",
    icon: (
      <span
        aria-hidden="true"
        className="grid h-4 w-4 place-items-center rounded-[0.25rem] border border-current text-[8px] font-black"
        data-testid="source-icon-youtube"
      >
        ▶
      </span>
    )
  },
  G: {
    label: "Google",
    icon: (
      <span aria-hidden="true" className="text-sm font-bold" data-testid="source-icon-google">
        G
      </span>
    )
  },
  W: {
    label: "Word",
    icon: (
      <span
        aria-hidden="true"
        className="grid h-4 w-3.5 place-items-center rounded-[0.2rem] border border-current text-[9px] font-bold"
        data-testid="source-icon-word"
      >
        W
      </span>
    )
  }
};

export function SourceBadgeIcons({ badges }: SourceBadgeIconsProps) {
  if (badges.length === 0) {
    return null;
  }

  const iconConfigs = badges.map((badge) => getSourceBadgeIconConfig(badge));
  const platformNames = iconConfigs.map((iconConfig) => iconConfig.label).join(", ");

  return (
    <div
      aria-label={`Recommended platforms: ${platformNames}`}
      className="absolute left-3 top-3 flex items-center gap-1.5 leading-none text-ink"
      role="img"
    >
      {iconConfigs.map((iconConfig) => (
        <span key={iconConfig.label}>{iconConfig.icon}</span>
      ))}
    </div>
  );
}

function getSourceBadgeIconConfig(badge: string): SourceBadgeIconConfig {
  const iconConfig = sourceBadgeIconConfigs[badge as SupportedSourceBadge];

  if (!iconConfig) {
    throw new Error(`Unsupported source badge icon: ${badge}`);
  }

  return iconConfig;
}
