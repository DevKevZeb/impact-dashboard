export function mapStrategicOutputs(items: any[]) {
  return items.map(item => ({
    id: item.id,
    name: item.name,
    measures_count: item.measures_count ?? 0,
  }));
}
