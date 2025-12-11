export function mapMeasures(items: any[]) {
  return items.map(item => ({
    id: item.id,
    name: item.name,
    indicatorsCount: item.indicators_count ?? 0,
  }));
}
