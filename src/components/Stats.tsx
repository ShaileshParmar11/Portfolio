interface Stat {
  value: string;
  label: string;
}

const stats: Stat[] = [
  { value: '15k+', label: 'OpenMetadata stars I help build' },
  { value: '1,100+', label: 'Merged pull requests' },
  { value: '5+', label: 'Years of frontend engineering' },
  { value: '600+', label: 'E2E tests migrated to Playwright' },
];

export function Stats() {
  return (
    <div className="stats">
      <div className="stats-in">
        {stats.map((stat) => (
          <div className="stat" key={stat.label}>
            <h3 className="grad">{stat.value}</h3>
            <p>{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
