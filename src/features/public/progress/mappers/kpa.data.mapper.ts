export function mapKpaResourcePercent(raw: Record<string, unknown>, total: number): { id: number; name: string; implementation: number }{
    return {
        id: raw.id as number,
        name: raw.name as string,
        implementation: ((raw.resource as number) / total) * 100
    }
}

export function mapKpasResourcePercent(rawList: unknown[], total: number): { id: number; name: string; implementation: number }[] {
    return rawList.map(raw => mapKpaResourcePercent(raw as Record<string, unknown>, total));
}
