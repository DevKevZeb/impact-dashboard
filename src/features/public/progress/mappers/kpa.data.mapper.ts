export function mapKpaResourcePercent(raw: any, total: number): { id: number; name: string; implementation: number }{
    return {
        id: raw.id,
        name: raw.name,
        implementation: (raw.resource / total) * 100
    }
}

export function mapKpasResourcePercent(rawList: any[], total: number): { id: number; name: string; implementation: number }[] {
    return rawList.map(raw => mapKpaResourcePercent(raw, total));
}