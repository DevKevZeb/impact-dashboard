import type { StrategicOutput } from "../types/strategic.output.type";

export function mapStrategicOutput(raw: any): StrategicOutput {
    return {
        id: raw.id,
        name: raw.name
    }
}

export function mapStrategicOutputs(rawList: any[]): StrategicOutput[]{
    return rawList.map(mapStrategicOutput);
}