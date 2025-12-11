export function mapIndicators(items: any[]) {
  console.log(items)
  return items.map(item => ({
    id: item.id,
    name: item.name,
    type: item.type?.name,
    target: item.target,
  }));
}
