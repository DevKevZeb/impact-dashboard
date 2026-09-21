import type { StrategicOutput } from "../types/strategic.output.type";

export function mapStrategicOutput(raw: Record<string, unknown>): StrategicOutput {
    return {
        id: raw.id as number,
        name: raw.name as string
    }
}

export function mapStrategicOutputs(rawList: unknown[]): StrategicOutput[]{
    return rawList.map((raw) => mapStrategicOutput(raw as Record<string, unknown>));
}
