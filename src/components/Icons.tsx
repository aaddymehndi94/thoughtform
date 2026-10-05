export function Icon({ name, size = 20 }: { name: 'arrow-left'|'arrow-right'|'bookmark'|'index'|'close'|'pause'|'play'|'expand'; size?: number }) {
 const paths = { 'arrow-left': 'M19 12H5m6-6-6 6 6 6', 'arrow-right': 'M5 12h14m-6-6 6 6-6 6', bookmark: 'M6 4h12v17l-6-4-6 4V4Z', index: 'M4 6h16M4 12h16M4 18h10', close: 'm6 6 12 12M6 18 18 6', pause: 'M8 5v14m8-14v14', play: 'm9 5 10 7-10 7V5Z', expand: 'm8 5 7 7-7 7' };
 return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]}/></svg>;
}
